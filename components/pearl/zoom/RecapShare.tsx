"use client";

import { motion } from "framer-motion";
import { Check, Pencil, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import type { CaptionSegment } from "@/lib/pearl/script";

export interface RecapShareProps {
  /**
   * Captured-step segments collected through Phases 2-4. Filtered to
   * those with stepLabel set; rendered in order with per-row Looks-good
   * / Edit controls.
   */
  steps: CaptionSegment[];
  onEndCall: () => void;
}

type RowState = "pending" | "approved" | "editing";

/**
 * Phase 6 — Pearl shares her own screen with a recap of everything she
 * captured. Visually mirrors the PrecallChecklist pattern (Pearl name
 * plate top-left, "Pearl is sharing" framing) so the wrap-up is the
 * same kind of moment as the pre-call briefing — bookending the call.
 *
 * Each captured step is reviewable: "Looks good" approves it, "Edit"
 * marks it for follow-up. The End call button at the bottom hands
 * control back to the parent shell.
 */
export function RecapShare({ steps, onEndCall }: RecapShareProps) {
  const [statuses, setStatuses] = useState<Record<string, RowState>>({});

  const setStatus = (id: string, next: RowState) =>
    setStatuses((s) => ({ ...s, [id]: next }));

  const approvedCount = Object.values(statuses).filter(
    (s) => s === "approved",
  ).length;

  return (
    <div className="flex h-full w-full flex-col bg-[linear-gradient(180deg,#f6f4fb,#ffffff_55%,#eef1fa)] text-[color:var(--text-1)]">
      <header className="flex items-center justify-between gap-3 border-b border-black/5 px-5 pb-3 pt-4">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-[0_3px_10px_rgba(15,23,42,0.08)] border border-white/70"
            aria-hidden
          >
            <Image
              src="/superlabs-mark.svg"
              alt=""
              width={18}
              height={16}
              style={{ width: "auto", height: 14 }}
            />
          </span>
          <div>
            <div className="text-[13px] font-semibold leading-tight text-[color:var(--text-1)]">
              Pearl
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[color:var(--text-2)]">
              <span
                className="h-1 w-1 rounded-full bg-[color:var(--success)]"
                aria-hidden
              />
              Here&rsquo;s what I caught
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/70 bg-emerald-50/80 px-2 py-[2px] text-[10.5px] font-semibold text-emerald-700">
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              aria-hidden
            />
            {approvedCount}/{steps.length} confirmed
          </span>
          <span className="rounded-md bg-[rgba(133,57,255,0.08)] px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.06em] text-[color:var(--brand)]">
            <Sparkles size={9} strokeWidth={2.4} className="mr-0.5 inline" />
            Pearl is sharing
          </span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-5 py-4">
        {steps.length === 0 ? (
          <div className="rounded-md border border-dashed border-black/10 bg-white/65 p-4 text-center text-[12px] text-[color:var(--text-2)]">
            No steps captured yet. Skip ahead through the call to populate
            the recap.
          </div>
        ) : (
          steps.map((s, i) => (
            <SummaryRow
              key={s.id}
              index={i + 1}
              segment={s}
              status={statuses[s.id] ?? "pending"}
              onApprove={() => setStatus(s.id, "approved")}
              onEdit={() => setStatus(s.id, "editing")}
            />
          ))
        )}
      </div>

      <footer className="flex flex-none items-center justify-between gap-3 border-t border-black/5 bg-white/60 px-5 py-3 backdrop-blur-md">
        <p className="text-[11px] leading-snug text-[color:var(--text-2)]">
          I&rsquo;ll turn this into an automation right after the call.
        </p>
        <button
          type="button"
          onClick={onEndCall}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[linear-gradient(135deg,#8539FF,#B57FFF)] px-3.5 text-[12.5px] font-semibold text-white shadow-[0_6px_16px_rgba(133,57,255,0.28)] transition-shadow hover:shadow-[0_8px_22px_rgba(133,57,255,0.36)] active:translate-y-px"
        >
          End call
        </button>
      </footer>
    </div>
  );
}

function SummaryRow({
  index,
  segment,
  status,
  onApprove,
  onEdit,
}: {
  index: number;
  segment: CaptionSegment;
  status: RowState;
  onApprove: () => void;
  onEdit: () => void;
}) {
  const isApproved = status === "approved";
  const isEditing = status === "editing";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`group flex items-start gap-3 rounded-xl border p-3 transition-colors ${
        isApproved
          ? "border-emerald-300/70 bg-emerald-50/60"
          : isEditing
            ? "border-amber-300/70 bg-amber-50/70"
            : "border-white/70 bg-white/85"
      }`}
    >
      <span
        className={`flex h-6 w-6 flex-none items-center justify-center rounded-full text-[11px] font-semibold ${
          isApproved
            ? "bg-emerald-500 text-white"
            : isEditing
              ? "bg-amber-500 text-white"
              : "bg-[rgba(133,57,255,0.1)] text-[color:var(--brand)]"
        }`}
      >
        {index}
      </span>

      <div className="min-w-0 flex-1">
        <div className="text-[12.5px] font-semibold leading-snug text-[color:var(--text-1)]">
          {segment.stepLabel ?? segment.text}
        </div>
        {segment.stepLabel && (
          <div className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-[color:var(--text-2)]">
            &ldquo;{segment.text}&rdquo;
          </div>
        )}
      </div>

      <div className="flex flex-none items-center gap-1.5">
        {isApproved ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-[10.5px] font-semibold text-emerald-700">
            <Check size={10} strokeWidth={2.6} />
            Looks good
          </span>
        ) : isEditing ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-[10.5px] font-semibold text-amber-700">
            <Pencil size={10} strokeWidth={2.4} />
            Editing
          </span>
        ) : (
          <>
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-1 rounded-md border border-black/10 bg-white px-2 py-1 text-[10.5px] font-medium text-[color:var(--text-2)] transition-colors hover:bg-black/5 hover:text-[color:var(--text-1)]"
            >
              <Pencil size={10} strokeWidth={2.2} />
              Edit
            </button>
            <button
              type="button"
              onClick={onApprove}
              className="inline-flex items-center gap-1 rounded-md bg-emerald-500 px-2 py-1 text-[10.5px] font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              <Check size={10} strokeWidth={2.6} />
              Looks good
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
