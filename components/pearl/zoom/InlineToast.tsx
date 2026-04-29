"use client";

import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

export interface InlineToastProps {
  visible: boolean;
  message: string;
}

/**
 * Tiny inline toast positioned above the Zoom toolbar. Used for the
 * "Re-recording the last step…" confirmation when the persistent toolbar
 * Re-record button is pressed (Phase 5). Auto-dismiss is owned by the
 * parent — this component is purely a presentation layer.
 */
export function InlineToast({ visible, message }: InlineToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="pointer-events-none absolute inset-x-0 bottom-[88px] z-[15] flex justify-center px-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(133,57,255,0.92)] px-3 py-1.5 text-[12px] font-medium text-white shadow-[0_8px_22px_rgba(133,57,255,0.35)] backdrop-blur-md">
            <RotateCcw size={12} strokeWidth={2.4} />
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
