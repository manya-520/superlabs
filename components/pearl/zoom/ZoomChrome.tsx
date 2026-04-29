"use client";

import type { DragControls } from "framer-motion";

export interface ZoomChromeProps {
  dragControls: DragControls;
  recording: boolean;
  /** Elapsed time on the meeting timer, in seconds. */
  elapsedSec: number;
}

/**
 * Zoom-faithful top bar rendered inside the FloatingWindow body. The
 * macOS traffic lights are kept (this is a "Zoom on macOS" feel — the OS
 * chrome doesn't disappear when an app is in a window). The whole bar is
 * the drag handle, like the chromeless renderChrome contract on
 * FloatingWindow expects.
 */
export function ZoomChrome({ dragControls, recording, elapsedSec }: ZoomChromeProps) {
  return (
    <div
      onPointerDown={(event) => {
        dragControls.start(event, { snapToCursor: false });
      }}
      className="flex h-9 flex-none cursor-grab items-center justify-between border-b border-white/5 bg-[#1a1a1d] px-3 text-white/90 select-none active:cursor-grabbing"
    >
      <div className="flex items-center gap-1.5">
        <span className="traffic-dot bg-[#ff5f57] border border-black/40" />
        <span className="traffic-dot bg-[#febc2e] border border-black/40" />
        <span className="traffic-dot bg-[#28c840] border border-black/40" />
      </div>

      <div className="pointer-events-none flex items-center gap-2">
        <span className="text-[11.5px] font-semibold tracking-tight">
          Workflow capture with Pearl
        </span>
        {recording && (
          <span className="flex items-center gap-1 rounded-md bg-[#3a1414] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#ff6b6b]">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#ef4444]"
              aria-hidden
            />
            Rec
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-[11px] tabular-nums text-white/65">
        {recording && <RecordingTimer elapsedSec={elapsedSec} />}
      </div>
    </div>
  );
}

function RecordingTimer({ elapsedSec }: { elapsedSec: number }) {
  const m = Math.floor(elapsedSec / 60)
    .toString()
    .padStart(2, "0");
  const s = (elapsedSec % 60).toString().padStart(2, "0");
  return <span>{`${m}:${s}`}</span>;
}
