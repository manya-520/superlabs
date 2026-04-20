"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  /** Wipes all captured steps and starts the timer over. */
  reset: () => void;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Drives the recording screen. A polling interval advances the
 * visible-node set by wall-clock time. Pausing is implemented by passing
 * `enabled=false`: the effect tears down the interval and elapsedMs is
 * preserved so resume continues from where it left off. Resetting wipes
 * the captured state and restarts the timer via a nonce bump.
 */
export function useScriptedRecording(enabled: boolean): ScriptedRecordingState {
  const [elapsedMs, setElapsedMs] = useState<number>(() =>
    prefersReducedMotion() ? RECORDING_DURATION_MS : 0,
  );
  const [runKey, setRunKey] = useState(0);

  // Mirror the latest elapsedMs into a ref so the interval effect can
  // resume from the current value on pause/resume without re-subscribing
  // every tick.
  const elapsedRef = useRef(elapsedMs);
  useEffect(() => {
    elapsedRef.current = elapsedMs;
  });

  useEffect(() => {
    if (!enabled) return;
    if (prefersReducedMotion()) return;
    if (elapsedRef.current >= RECORDING_DURATION_MS) return;

    const startWall = performance.now();
    const startElapsed = elapsedRef.current;
    const interval = window.setInterval(() => {
      const now = performance.now();
      const next = Math.min(
        startElapsed + (now - startWall),
        RECORDING_DURATION_MS,
      );
      setElapsedMs(next);
      if (next >= RECORDING_DURATION_MS) {
        window.clearInterval(interval);
      }
    }, 100);

    return () => window.clearInterval(interval);
  }, [enabled, runKey]);

  const reset = useCallback(() => {
    // Intentional: reset() is a user-driven action, not a reactive update.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setElapsedMs(0);
    elapsedRef.current = 0;
    setRunKey((k) => k + 1);
  }, []);

  return useMemo<ScriptedRecordingState>(() => {
    const visibleNodeIds = new Set(
      RECORDING_NODES.filter((n) => elapsedMs >= n.appearAtMs).map((n) => n.id),
    );
    return {
      visibleNodeIds,
      elapsedMs,
      isComplete: elapsedMs >= RECORDING_DURATION_MS,
      progress: Math.min(1, elapsedMs / RECORDING_DURATION_MS),
      reset,
    };
  }, [elapsedMs, reset]);
}
