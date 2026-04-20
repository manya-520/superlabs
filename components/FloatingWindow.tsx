"use client";

import { motion, useDragControls } from "framer-motion";
import Image from "next/image";
import { useRef, type ReactNode } from "react";

export interface FloatingWindowProps {
  width: number;
  height: number;
  hidden?: boolean;
  children: ReactNode;
}

export function FloatingWindow({
  width,
  height,
  hidden,
  children,
}: FloatingWindowProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  return (
    <>
      <div
        ref={constraintsRef}
        className="pointer-events-none absolute inset-0 top-7"
        aria-hidden
      />
      <motion.div
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
            ? { opacity: 0, scale: 0.82, pointerEvents: "none", width, height }
            : { opacity: 1, scale: 1, pointerEvents: "auto", width, height }
        }
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
        className="glass absolute overflow-hidden rounded-2xl text-[color:var(--text-1)]"
        style={{
          top: `calc(50% - ${height / 2}px + 14px)`,
          left: `calc(62% - ${width / 2}px)`,
        }}
      >
        <div className="flex h-full flex-col">
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
              <Image
                src="/superlabs-mark.svg"
                alt=""
                width={14}
                height={12}
                style={{ width: "auto", height: 12 }}
                aria-hidden
              />
              <span className="text-[11.5px] font-semibold tracking-tight text-[color:var(--text-1)]">
                Superlabs
              </span>
            </div>
            <span className="w-14" aria-hidden />
          </div>
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </div>
      </motion.div>
    </>
  );
}
