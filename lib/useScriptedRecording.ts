"use client";

import { useEffect, useMemo, useState } from "react";

import {
  RECORDING_DURATION_MS,
  RECORDING_NODES,
} from "./scriptedRecording";

export interface ScriptedRecordingState {
  visibleNodeIds: Set<string>;
  elapsedMs: number;
  isComplete: boolean;
  /** 0 – 1 progress through the full recording timeline. */
  progress: number;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Drives the recording screen. A polling interval advances the
 * visible-node set by wall-clock time. The state is initialized from the
 * reduced-motion media query so those users skip directly to the end
 * without setting state inside an effect.
 */
export function useScriptedRecording(enabled: boolean): ScriptedRecordingState {
  const [elapsedMs, setElapsedMs] = useState<number>(() =>
    prefersReducedMotion() ? RECORDING_DURATION_MS : 0,
  );

  useEffect(() => {
    if (!enabled) return;
    if (prefersReducedMotion()) return;

    const start = performance.now();
    const interval = window.setInterval(() => {
      const now = performance.now();
      const next = Math.min(now - start, RECORDING_DURATION_MS);
      setElapsedMs(next);
      if (next >= RECORDING_DURATION_MS) {
        window.clearInterval(interval);
      }
    }, 100);

    return () => window.clearInterval(interval);
  }, [enabled]);

  return useMemo<ScriptedRecordingState>(() => {
    const visibleNodeIds = new Set(
      RECORDING_NODES.filter((n) => elapsedMs >= n.appearAtMs).map((n) => n.id),
    );
    return {
      visibleNodeIds,
      elapsedMs,
      isComplete: elapsedMs >= RECORDING_DURATION_MS,
      progress: Math.min(1, elapsedMs / RECORDING_DURATION_MS),
    };
  }, [elapsedMs]);
}
