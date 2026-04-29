"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { DesktopFrame } from "@/components/DesktopFrame";
import {
  FloatingWindow,
  type WindowDock,
} from "@/components/FloatingWindow";
import { MenuBar } from "@/components/MenuBar";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { ToastProvider } from "@/components/ui/Toast";

import { PearlDoneScreen } from "./screens/PearlDoneScreen";
import { PearlSelectScreen } from "./screens/PearlSelectScreen";
import { PearlSharedDesktop } from "./zoom/PearlSharedDesktop";
import { ZoomCall } from "./zoom/ZoomCall";
import { ZoomChrome } from "./zoom/ZoomChrome";

/**
 * Self-contained shell for the /pearl voice-prototype route. Mirrors the
 * structure of AppShellClient but lives independently so the existing /
 * flow stays untouched. Reuses DesktopFrame, MenuBar, FloatingWindow,
 * HomeScreen, and ToastProvider verbatim.
 */
export function PearlShellClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <ToastProvider>
      <PearlShell />
    </ToastProvider>
  );
}

type PearlScreenId = "home" | "select" | "call" | "done";

const SCREEN_ORDER: PearlScreenId[] = ["home", "select", "call", "done"];

interface WindowLayout {
  width: number;
  height: number;
  dock: WindowDock;
  chrome: boolean;
}

/**
 * Default per-screen layout. The "call" screen has a second variant —
 * `CALL_COMPACT_LAYOUT` — used when the user is screen-sharing so the
 * window shrinks Zoom-style. We keep `dock: "center"` in both call
 * variants so width/height changes don't remount FloatingWindow (the
 * floating window remounts on dock change to reset drag state).
 */
const WINDOW_LAYOUT: Record<PearlScreenId, WindowLayout> = {
  home: { width: 720, height: 520, dock: "center", chrome: true },
  select: { width: 680, height: 520, dock: "center", chrome: true },
  call: { width: 920, height: 620, dock: "center", chrome: false },
  done: { width: 520, height: 360, dock: "center", chrome: true },
};

const CALL_COMPACT_LAYOUT: WindowLayout = {
  width: 300,
  height: 360,
  dock: "mini",
  chrome: false,
};

function PearlShell() {
  const [screen, setScreen] = useState<PearlScreenId>("home");
  /**
   * Recording state on the Zoom window's chrome timer. Driven by ZoomCall
   * via callback so the chrome can show the live counter even though the
   * ZoomCall itself owns the call's phase machine. The start timestamp
   * lives in a ref so toggling recording doesn't cascade through render.
   */
  const [recording, setRecording] = useState(false);
  const startedAtRef = useRef<number | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  /**
   * Whether the user is currently sharing their screen. Drives the
   * "compact" Zoom mini-dock layout — when true, the FloatingWindow
   * shrinks to a tiny Pearl-only dock so the desktop wallpaper acts as
   * the user's shared screen.
   */
  const [callSharing, setCallSharing] = useState(false);

  const goTo = useCallback((next: PearlScreenId) => setScreen(next), []);

  const handleRecordingChange = useCallback((next: boolean) => {
    setRecording(next);
    if (next) {
      startedAtRef.current = Date.now();
      setElapsedSec(0);
    } else {
      startedAtRef.current = null;
      setElapsedSec(0);
    }
  }, []);

  // Tick the meeting timer while recording. Pure subscription — the only
  // setState here is in the interval callback, not the effect body.
  useEffect(() => {
    if (!recording) return;
    const interval = window.setInterval(() => {
      const startedAt = startedAtRef.current;
      if (startedAt !== null) {
        setElapsedSec(Math.floor((Date.now() - startedAt) / 1000));
      }
    }, 1000);
    return () => window.clearInterval(interval);
  }, [recording]);

  const layout =
    screen === "call" && callSharing
      ? CALL_COMPACT_LAYOUT
      : WINDOW_LAYOUT[screen];

  const prevScreen =
    SCREEN_ORDER[Math.max(0, SCREEN_ORDER.indexOf(screen) - 1)];
  const nextScreen =
    SCREEN_ORDER[
      Math.min(SCREEN_ORDER.length - 1, SCREEN_ORDER.indexOf(screen) + 1)
    ];

  const handleEndCall = () => {
    handleRecordingChange(false);
    setCallSharing(false);
    goTo("done");
  };

  return (
    <DesktopFrame>
      <MenuBar onLogoClick={() => goTo("home")} />

      {/* Workflow visible on the desktop while the user shares. Reuses the
          existing Slack + QuickBooks mocks so reviewers actually see the
          invoice arrive and get entered into accounting. */}
      {screen === "call" && (
        <PearlSharedDesktop visible={callSharing} />
      )}

      <FloatingWindow
        width={layout.width}
        height={layout.height}
        dock={layout.dock}
        chrome={layout.chrome}
        bodyClassName={screen === "call" ? "bg-[#1c1c1e]" : undefined}
        keyOverride={screen === "call" ? "pearl-call" : undefined}
        renderChrome={
          screen === "call"
            ? (controls) => (
                <ZoomChrome
                  dragControls={controls}
                  recording={recording}
                  elapsedSec={elapsedSec}
                />
              )
            : undefined
        }
      >
        {screen === "home" && <HomeScreen onPick={() => goTo("select")} />}
        {screen === "select" && (
          <PearlSelectScreen
            onJoinZoom={() => goTo("call")}
            onBack={() => goTo("home")}
          />
        )}
        {screen === "call" && (
          <ZoomCall
            onRecordingChange={handleRecordingChange}
            onSharingChange={setCallSharing}
            onEndCall={handleEndCall}
          />
        )}
        {screen === "done" && (
          <PearlDoneScreen onBackHome={() => goTo("home")} />
        )}
      </FloatingWindow>

      <nav
        aria-label="Prototype navigation"
        className="fixed bottom-4 left-1/2 z-[var(--z-sticky)] flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/60 bg-white/70 px-2 py-1 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-xl"
      >
        <button
          type="button"
          onClick={() => goTo(prevScreen)}
          disabled={screen === SCREEN_ORDER[0]}
          aria-label="Previous screen"
          className="flex h-7 w-7 items-center justify-center rounded-full text-[color:var(--text-2)] transition-colors hover:bg-black/5 disabled:opacity-40 disabled:pointer-events-none"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="px-2 text-[11px] font-medium tabular-nums text-[color:var(--text-2)]">
          {SCREEN_ORDER.indexOf(screen) + 1} / {SCREEN_ORDER.length} ·{" "}
          <span className="text-[color:var(--text-1)]">
            {screenLabel(screen)}
          </span>
        </span>
        <button
          type="button"
          onClick={() => goTo(nextScreen)}
          disabled={screen === SCREEN_ORDER[SCREEN_ORDER.length - 1]}
          aria-label="Next screen"
          className="flex h-7 w-7 items-center justify-center rounded-full text-[color:var(--text-2)] transition-colors hover:bg-black/5 disabled:opacity-40 disabled:pointer-events-none"
        >
          <ChevronRight size={14} />
        </button>
      </nav>
    </DesktopFrame>
  );
}

function screenLabel(id: PearlScreenId): string {
  switch (id) {
    case "home":
      return "Home";
    case "select":
      return "Pick a path";
    case "call":
      return "Zoom with Pearl";
    case "done":
      return "Wrap-up";
  }
}
