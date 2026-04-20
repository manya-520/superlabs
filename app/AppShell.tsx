"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { DesktopFrame } from "@/components/DesktopFrame";
import { FloatingWindow } from "@/components/FloatingWindow";
import { MenuBar } from "@/components/MenuBar";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { InputMethodScreen } from "@/components/screens/InputMethodScreen";
import { PreparationScreen } from "@/components/screens/PreparationScreen";
import { RecordingScreen } from "@/components/screens/RecordingScreen";
import { ReviewScreen } from "@/components/screens/ReviewScreen";
import { ToastProvider } from "@/components/ui/Toast";

/**
 * The shell owns screen-switching state. It renders nothing on the server
 * pass: the entire UI only mounts after hydration so that browser-injected
 * attributes (for example, Cursor's DOM automation markers) never trigger
 * hydration mismatches.
 */
export function AppShellClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Intentional: mark hydration complete so the fully interactive UI can
    // render. This is the canonical client-only mount gate and is not a
    // reaction to changing props.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <ToastProvider>
      <AppShell />
    </ToastProvider>
  );
}

type ScreenId =
  | "launcher"
  | "home"
  | "input"
  | "prep"
  | "recording"
  | "review";

const SCREEN_ORDER: ScreenId[] = [
  "launcher",
  "home",
  "input",
  "prep",
  "recording",
  "review",
];

interface WindowSize {
  width: number;
  height: number;
}

const WINDOW_SIZE_MAP: Record<ScreenId, WindowSize> = {
  launcher: { width: 480, height: 640 },
  home: { width: 480, height: 640 },
  input: { width: 480, height: 640 },
  prep: { width: 480, height: 640 },
  recording: { width: 800, height: 640 },
  review: { width: 900, height: 680 },
};

function AppShell() {
  const [screen, setScreen] = useState<ScreenId>("launcher");

  const goTo = useCallback((next: ScreenId) => setScreen(next), []);

  const handleLogoClick = () => {
    if (screen === "launcher") goTo("home");
  };

  const size = WINDOW_SIZE_MAP[screen];
  const windowHidden = screen === "launcher";

  const prevScreen =
    SCREEN_ORDER[Math.max(0, SCREEN_ORDER.indexOf(screen) - 1)];
  const nextScreen =
    SCREEN_ORDER[
      Math.min(SCREEN_ORDER.length - 1, SCREEN_ORDER.indexOf(screen) + 1)
    ];

  return (
    <DesktopFrame>
      {screen === "launcher" ? (
        <LauncherMenu onLogoClick={handleLogoClick} />
      ) : (
        <MenuBar onLogoClick={handleLogoClick} />
      )}

      <FloatingWindow width={size.width} height={size.height} hidden={windowHidden}>
        {screen === "home" && <HomeScreen onPick={() => goTo("input")} />}
        {screen === "input" && (
          <InputMethodScreen
            onPickRecording={() => goTo("prep")}
            onBack={() => goTo("home")}
          />
        )}
        {screen === "prep" && (
          <PreparationScreen
            onStart={() => goTo("recording")}
            onBack={() => goTo("input")}
          />
        )}
        {screen === "recording" && (
          <RecordingScreen
            onReview={() => goTo("review")}
            onBack={() => goTo("prep")}
          />
        )}
        {screen === "review" && (
          <ReviewScreen
            onBack={() => goTo("recording")}
            onSaved={() => goTo("home")}
          />
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

/**
 * Launcher wrapper for the menu bar. Mounted only while the launcher
 * screen is active. Owns the 2-second tooltip timer in local state so
 * remounting (on screen change) resets it without touching parent state.
 */
function LauncherMenu({ onLogoClick }: { onLogoClick: () => void }) {
  const [showTooltip, setShowTooltip] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setShowTooltip(true), 2000);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <MenuBar onLogoClick={onLogoClick} pulseLogo showTooltip={showTooltip} />
  );
}

function screenLabel(id: ScreenId): string {
  switch (id) {
    case "launcher":
      return "Launcher";
    case "home":
      return "Home";
    case "input":
      return "Input method";
    case "prep":
      return "Prep";
    case "recording":
      return "Recording";
    case "review":
      return "Review";
  }
}
