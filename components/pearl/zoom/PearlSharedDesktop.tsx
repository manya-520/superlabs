"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { MockQuickBooksWindow } from "@/components/recording/MockQuickBooksWindow";
import { MockSlackWindow } from "@/components/recording/MockSlackWindow";

export interface PearlSharedDesktopProps {
  visible: boolean;
}

/**
 * Renders the user's "shared workflow" on the desktop wallpaper while
 * the Zoom call is in mini-dock mode. Reuses the existing
 * MockSlackWindow and MockQuickBooksWindow so the user sees the actual
 * workflow they're supposedly demoing — invoice arrives in Slack and
 * gets entered into QuickBooks. Mounted only when sharing so the
 * scripted clock inside Contents resets cleanly on each share.
 */
export function PearlSharedDesktop({ visible }: PearlSharedDesktopProps) {
  return (
    <AnimatePresence>
      {visible && <Contents key="contents" />}
    </AnimatePresence>
  );
}

function Contents() {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      setElapsedMs(Date.now() - startedAt);
    }, 200);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="pointer-events-none absolute inset-0 top-7 z-[1]"
      aria-hidden
    >
      {/* Subtle vignette so the wallpaper feels like it's being captured. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.18)_100%)]" />

      {/* Red recording border around the whole desktop, Zoom-faithful. */}
      <div className="absolute inset-2 rounded-2xl border-[2px] border-red-500/65 shadow-[inset_0_0_42px_rgba(239,68,68,0.18)]" />

      {/* "Auto-demo" tag — makes it obvious that the highlights / glows
          inside the mock app windows are scripted playback, not
          something the user is supposed to click. */}
      <div className="absolute left-1/2 top-3 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-md bg-black/65 px-2 py-1 text-[10px] font-semibold text-white/85 backdrop-blur-sm">
        <span
          className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-soft)]"
          aria-hidden
        />
        Auto-demo · just for show, not interactive
      </div>

      {/* Slack window — top-left. */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-[6%] top-16 h-[300px] w-[400px]"
      >
        <MockSlackWindow elapsedMs={elapsedMs} />
      </motion.div>

      {/* QuickBooks window — center-ish, larger. The +11500ms offset jumps
          the scripted form into the field-fill stage so the visible
          content is already meaningful when the user shares. */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.34,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.08,
        }}
        className="absolute right-[28%] top-[34%] h-[340px] w-[460px]"
      >
        <MockQuickBooksWindow elapsedMs={elapsedMs + 11500} />
      </motion.div>
    </motion.div>
  );
}
