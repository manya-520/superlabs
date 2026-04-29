"use client";

import { AnimatePresence, motion } from "framer-motion";

import { SPEAKER_LABEL, type CaptionSegment } from "@/lib/pearl/script";

export interface CaptionsProps {
  current: CaptionSegment | null;
}

/**
 * Bottom-center caption overlay. Renders as a speech-bubble-style strip
 * with a pulsing speaker dot so the captions clearly read as the
 * participant's "voice" (the prototype has no real audio). The bubble
 * accent shifts color by speaker to make role switches obvious at a
 * glance.
 */
export function Captions({ current }: CaptionsProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[20px] z-[5] flex justify-center px-6">
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex max-w-[min(640px,92%)] items-start gap-2.5 rounded-2xl bg-black/78 px-4 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-md"
          >
            <span className="relative mt-1.5 flex h-2 w-2 flex-none">
              <motion.span
                className={`absolute inset-0 rounded-full ${
                  current.speaker === "pearl"
                    ? "bg-[color:var(--brand-soft)]"
                    : "bg-emerald-400"
                }`}
                animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.3, 1] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                aria-hidden
              />
            </span>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/55">
                {SPEAKER_LABEL[current.speaker]}
              </div>
              <div className="text-[14px] font-medium leading-snug text-white">
                {current.text}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
