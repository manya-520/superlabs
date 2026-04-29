"use client";

import { Check } from "lucide-react";

import { PHASE_SHORT_LABEL, type Phase } from "@/lib/pearl/script";

export interface PhaseStepperProps {
  order: Phase[];
  current: Phase;
  /** Jump to the given phase. Stepper enforces no rules — caller decides. */
  onJump: (target: Phase) => void;
}

/**
 * Compact horizontal stepper showing every phase of the call. Each pill
 * is clickable so the user is never trapped in a phase: they can move
 * forward, jump back, or skim the whole flow. The current pill is
 * brand-styled, past pills show a check, future pills are dimmed.
 * Overflows horizontally on very narrow windows.
 */
export function PhaseStepper({ order, current, onJump }: PhaseStepperProps) {
  const currentIdx = order.indexOf(current);

  return (
    <div className="flex flex-none items-center gap-0.5 overflow-x-auto rounded-lg bg-black/55 px-1.5 py-1 backdrop-blur-md">
      {order.map((p, i) => {
        const isCurrent = p === current;
        const isPast = currentIdx > i;
        return (
          <div key={p} className="flex flex-none items-center">
            <button
              type="button"
              onClick={() => onJump(p)}
              title={`Jump to ${PHASE_SHORT_LABEL[p]}`}
              className={`flex flex-none items-center gap-1 rounded-md px-1.5 py-1 text-[10.5px] font-medium transition-colors ${
                isCurrent
                  ? "bg-[rgba(133,57,255,0.28)] text-white shadow-[inset_0_0_0_1px_rgba(181,127,255,0.35)]"
                  : isPast
                    ? "text-white/65 hover:bg-white/8 hover:text-white"
                    : "text-white/40 hover:bg-white/8 hover:text-white/80"
              }`}
              aria-current={isCurrent ? "step" : undefined}
            >
              <span
                className={`flex h-4 w-4 flex-none items-center justify-center rounded-full text-[9px] font-semibold ${
                  isCurrent
                    ? "bg-[color:var(--brand-soft)] text-[#1a1a1d]"
                    : isPast
                      ? "bg-white/18 text-white/90"
                      : "border border-white/15 text-white/55"
                }`}
                aria-hidden
              >
                {isPast ? (
                  <Check size={8.5} strokeWidth={2.8} />
                ) : (
                  <span>{i + 1}</span>
                )}
              </span>
              <span className="whitespace-nowrap">
                {PHASE_SHORT_LABEL[p]}
              </span>
            </button>
            {i < order.length - 1 && (
              <span
                aria-hidden
                className={`mx-0.5 h-px w-1.5 flex-none ${
                  isPast ? "bg-white/30" : "bg-white/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
