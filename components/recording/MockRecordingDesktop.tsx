"use client";

import { AnimatePresence, motion } from "framer-motion";

import { useScriptedRecording } from "@/lib/useScriptedRecording";

import { MockSlackWindow } from "./MockSlackWindow";
import { MockExcelWindow } from "./MockExcelWindow";
import { MockQuickBooksWindow } from "./MockQuickBooksWindow";

/**
 * Renders the simulated desktop behind the tucked Superlabs window during
 * the recording screen. A dim "REC" overlay makes it obvious that the
 * user&rsquo;s screen is being captured.
 */
export function MockRecordingDesktop() {
  const { elapsedMs } = useScriptedRecording(true);

  // Which app is in the foreground at a given time.
  const showSlack = elapsedMs >= 0 && elapsedMs < 4500;
  const showExcel = elapsedMs >= 4500 && elapsedMs < 11500;
  const showQuickBooks = elapsedMs >= 11500;

  return (
    <div
      className="pointer-events-none absolute inset-0 top-7 z-[1]"
      aria-hidden
    >
      {/* Recording-mode vignette so the wallpaper looks like it&rsquo;s being captured. */}
      <div className="absolute inset-0 bg-[radial-gradient(100%_60%_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.08)_100%)]" />

      {/* Red recording border */}
      <div className="absolute inset-2 rounded-2xl border-[2px] border-red-500/70 shadow-[inset_0_0_40px_rgba(239,68,68,0.15)]" />

      {/* Recording chip on the wallpaper */}
      <div className="absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/75 px-3 py-1 text-white shadow-lg">
        <span className="pulse-dot" aria-hidden />
        <span className="text-[11px] font-semibold tracking-wide uppercase">
          Recording
        </span>
        <span className="text-[11px] tabular-nums text-white/75">
          {formatClock(elapsedMs)}
        </span>
      </div>

      {/* The simulated app windows — stacked left-of-center so the Superlabs
          window docked right still has breathing room. */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative mr-[360px] h-[460px] w-[520px]">
          <AnimatePresence>
            {showSlack && (
              <MockWindowWrapper key="slack">
                <MockSlackWindow elapsedMs={elapsedMs} />
              </MockWindowWrapper>
            )}
            {showExcel && (
              <MockWindowWrapper key="excel">
                <MockExcelWindow elapsedMs={elapsedMs} />
              </MockWindowWrapper>
            )}
            {showQuickBooks && (
              <MockWindowWrapper key="quickbooks">
                <MockQuickBooksWindow elapsedMs={elapsedMs} />
              </MockWindowWrapper>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function MockWindowWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.99 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0"
    >
      {children}
    </motion.div>
  );
}

function formatClock(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
