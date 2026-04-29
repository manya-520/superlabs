"use client";

import { motion, useDragControls, type DragControls } from "framer-motion";
import Image from "next/image";
import { useRef, type ReactNode } from "react";

export type WindowDock = "center" | "right" | "mini";

export interface FloatingWindowProps {
  width: number;
  height: number;
  hidden?: boolean;
  /** Where the window should animate to. Default: "center" (slightly right of center). */
  dock?: WindowDock;
  /** Hide the traffic-light + title chrome. Useful for the recording dock. */
  chrome?: boolean;
  /** Recording state shown in the window title bar. */
  recording?: boolean;
  /** Custom title shown in the chrome. Defaults to "Superlabs". */
  title?: string;
  /**
   * Override the body surface class. Defaults preserve the existing
   * `glass`/`glass-strong` behavior. Pass a custom class (e.g. a dark fill)
   * for non-glass surfaces like the Zoom call.
   */
  bodyClassName?: string;
  /**
   * Render a custom chrome instead of the built-in macOS title bar. Receives
   * the window's `dragControls` so the custom chrome can wire its own
   * pointer-down handler to start the drag. When provided, `chrome` and
   * `title`/`recording` are ignored.
   */
  renderChrome?: (dragControls: DragControls) => ReactNode;
  /**
   * Optional stable key override. When provided, the window does NOT remount
   * on dock changes — useful for keeping internal call state when the user
   * toggles a Zoom-style "minimize to corner" mode (center → mini). The
   * caller is responsible for ensuring the dock change is visually safe
   * (drag transform may not perfectly track the new anchor).
   */
  keyOverride?: string;
  children: ReactNode;
}

export function FloatingWindow({
  width,
  height,
  hidden,
  dock = "center",
  chrome = true,
  recording = false,
  title = "Superlabs",
  bodyClassName,
  renderChrome,
  keyOverride,
  children,
}: FloatingWindowProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  // Center dock keeps the window horizontally centered and stays within the
  // viewport on narrower windows. Right dock pins the window to the right
  // edge for the "tucked" recording state. Mini dock pins to the
  // bottom-right corner for Zoom-style minimize-to-corner.
  let positionStyle: Record<string, string | number>;
  if (dock === "right") {
    positionStyle = {
      top: `calc(50% - ${height / 2}px + 14px)`,
      right: 24,
    };
  } else if (dock === "mini") {
    positionStyle = {
      bottom: 24,
      right: 24,
    };
  } else {
    positionStyle = {
      top: `calc(50% - ${height / 2}px + 14px)`,
      left: `clamp(16px, calc(50% - ${width / 2}px), calc(100% - ${width}px - 16px))`,
    };
  }

  return (
    <>
      <div
        ref={constraintsRef}
        className="pointer-events-none absolute inset-0 top-7"
        aria-hidden
      />
      <motion.div
        // Keying by dock force-remounts the window when we switch between
        // center and right docks. Without this, framer-motion keeps its
        // internal drag transform around from the previous position and the
        // element never actually moves to the new anchor.
        // Callers that need to preserve internal state across dock changes
        // (e.g. the Pearl call switching to a mini-dock when sharing) pass
        // a keyOverride so we use a stable key instead.
        key={keyOverride ?? dock}
        role="application"
        aria-label="Superlabs window"
        aria-hidden={hidden}
        drag
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={constraintsRef}
        dragElastic={0.06}
        dragMomentum={false}
        initial={false}
        animate={
          hidden
            ? { opacity: 0, scale: 0.82, pointerEvents: "none" }
            : { opacity: 1, scale: 1, pointerEvents: "auto" }
        }
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
        className={`${
          bodyClassName ?? (recording ? "glass-strong" : "glass")
        } absolute z-[10] overflow-hidden rounded-2xl text-[color:var(--text-1)]`}
        style={{ ...positionStyle, width, height }}
      >
        <div className="flex h-full flex-col">
          {renderChrome
            ? renderChrome(dragControls)
            : chrome && (
            <div
              onPointerDown={(event) => {
                dragControls.start(event, { snapToCursor: false });
              }}
              className="flex h-9 flex-none cursor-grab items-center justify-between border-b border-white/40 bg-white/40 px-3 active:cursor-grabbing select-none"
            >
              <div className="flex items-center gap-1.5">
                <span className="traffic-dot bg-[#ff5f57] border border-black/5" />
                <span className="traffic-dot bg-[#febc2e] border border-black/5" />
                <span className="traffic-dot bg-[#28c840] border border-black/5" />
              </div>
              <div className="pointer-events-none flex items-center gap-1.5">
                {recording ? (
                  <>
                    <span className="pulse-dot" aria-hidden />
                    <span className="text-[11.5px] font-semibold tracking-tight text-[color:var(--text-1)]">
                      Recording
                    </span>
                  </>
                ) : (
                  <>
                    <Image
                      src="/superlabs-mark.svg"
                      alt=""
                      width={14}
                      height={12}
                      style={{ width: "auto", height: 12 }}
                      aria-hidden
                    />
                    <span className="text-[11.5px] font-semibold tracking-tight text-[color:var(--text-1)]">
                      {title}
                    </span>
                  </>
                )}
              </div>
              <span className="w-14" aria-hidden />
            </div>
          )}
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </div>
      </motion.div>
    </>
  );
}
