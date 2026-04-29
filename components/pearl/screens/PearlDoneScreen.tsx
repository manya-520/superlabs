"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

import { GradientButton } from "@/components/ui/GradientButton";

export interface PearlDoneScreenProps {
  onBackHome: () => void;
}

export function PearlDoneScreen({ onBackHome }: PearlDoneScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#34d399,#10b981)] text-white shadow-[0_10px_28px_rgba(16,185,129,0.32)]"
        aria-hidden
      >
        <Check size={26} strokeWidth={2.6} />
      </motion.span>

      <div className="flex flex-col items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--brand-border)] bg-[rgba(133,57,255,0.08)] px-2 py-[2px] text-[10px] font-semibold uppercase tracking-[0.06em] text-[color:var(--brand)]">
          <Sparkles size={9} strokeWidth={2.2} aria-hidden />
          Captured
        </span>
        <h1 className="text-[20px] font-semibold tracking-tight text-[color:var(--text-1)]">
          Pearl&rsquo;s on it
        </h1>
        <p className="max-w-[360px] text-[13px] leading-snug text-[color:var(--text-2)]">
          I&rsquo;ll turn what you walked through into an automation and
          ping you when it&rsquo;s ready to test.
        </p>
      </div>

      <GradientButton size="lg" onClick={onBackHome}>
        Back to home
      </GradientButton>
    </div>
  );
}
