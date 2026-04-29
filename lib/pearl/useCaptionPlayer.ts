"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { CaptionSegment } from "./script";

export interface CaptionPlayerOptions {
  /** Segments to play in order. */
  segments: CaptionSegment[];
  /** Auto-start when segments arrive. Default: true. */
  autoStart?: boolean;
  /**
   * Called once when all segments have finished playing. The orchestrator
   * uses this to advance to the next phase.
   */
  onComplete?: () => void;
  /**
   * Called whenever a segment finishes (i.e. its `durationMs` elapses)
   * with the segment that just finished. Useful for marking captured
   * steps in the summary as they're spoken.
   */
  onSegmentEnd?: (segment: CaptionSegment) => void;
}

export interface CaptionPlayerState {
  /** The currently displayed segment, or null if none. */
  current: CaptionSegment | null;
  /**
   * All segments that have started playing in order — includes the
   * currently displayed one. Used to render history and to build the
   * captured-steps summary.
   */
  history: CaptionSegment[];
  /** True once every segment has finished. */
  isComplete: boolean;
  isPaused: boolean;
}

export interface CaptionPlayerControls {
  play: () => void;
  pause: () => void;
  /**
   * Drop the most recent segment from history (and stop displaying it).
   * Used by the persistent "Re-record this part" toolbar button. The next
   * call to play() resumes with whatever segment comes next in the queue.
   */
  dropLast: () => void;
  /** Reset the entire player back to the start. */
  reset: () => void;
}

/**
 * Hook driving timed caption progression. Chains setTimeout off each
 * segment's durationMs and walks through the provided list. Respects
 * prefers-reduced-motion: under reduced motion, segments still advance on
 * their timers (we want the prototype demo to be watchable), but the
 * minimum hold becomes 600ms so there's no flicker.
 */
export function useCaptionPlayer(
  options: CaptionPlayerOptions,
): [CaptionPlayerState, CaptionPlayerControls] {
  const { segments, autoStart = true, onComplete, onSegmentEnd } = options;

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(!autoStart);
  const [history, setHistory] = useState<CaptionSegment[]>(() =>
    segments.length > 0 ? [segments[0]] : [],
  );

  const timerRef = useRef<number | null>(null);
  // Keep latest callbacks in refs so the timer effect doesn't re-run when
  // the parent re-renders with new closure identities.
  const onCompleteRef = useRef(onComplete);
  const onSegmentEndRef = useRef(onSegmentEnd);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  useEffect(() => {
    onSegmentEndRef.current = onSegmentEnd;
  }, [onSegmentEnd]);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Drive the timer: when index changes (or pause toggles), schedule the
  // next advance. When we run out of segments, fire onComplete once.
  useEffect(() => {
    if (isPaused) {
      clearTimer();
      return;
    }
    const segment = segments[index];
    if (!segment) {
      onCompleteRef.current?.();
      return;
    }
    const duration = segment.durationMs;
    timerRef.current = window.setTimeout(() => {
      onSegmentEndRef.current?.(segment);
      const nextIndex = index + 1;
      const nextSegment = segments[nextIndex];
      if (nextSegment) {
        setHistory((h) => [...h, nextSegment]);
      }
      setIndex(nextIndex);
    }, duration);

    return clearTimer;
  }, [index, isPaused, segments]);

  // When the segments array changes (phase change), reset to the start.
  // We compare by identity since the orchestrator passes a stable per-phase
  // array.
  const lastSegmentsRef = useRef(segments);
  useEffect(() => {
    if (lastSegmentsRef.current === segments) return;
    lastSegmentsRef.current = segments;
    clearTimer();
    setIndex(0);
    setHistory(segments.length > 0 ? [segments[0]] : []);
    setIsPaused(!autoStart);
  }, [segments, autoStart]);

  const play = useCallback(() => setIsPaused(false), []);
  const pause = useCallback(() => setIsPaused(true), []);

  const dropLast = useCallback(() => {
    setHistory((h) => (h.length > 0 ? h.slice(0, -1) : h));
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setIndex(0);
    setHistory(segments.length > 0 ? [segments[0]] : []);
    setIsPaused(!autoStart);
  }, [segments, autoStart]);

  const current = segments[index] ?? null;
  const isComplete = index >= segments.length;

  return [
    { current, history, isComplete, isPaused },
    { play, pause, dropLast, reset },
  ];
}
