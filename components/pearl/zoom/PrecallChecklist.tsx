"use client";

import { motion } from "framer-motion";
import {
  Check,
  FileText,
  Hand,
  Lock,
  MessageSquare,
  Shield,
  X,
} from "lucide-react";
import Image from "next/image";

export interface PrecallChecklistProps {
  ready: boolean;
  onReadyChange: (next: boolean) => void;
  onStart: () => void;
}

/**
 * Pearl's shared screen for Phase 1. Visually mirrors the existing
 * PreparationScreen's two-column "Go ahead" / "Skip for now" pattern but
 * reproduced standalone (the original component's columns and vignettes
 * are file-private, and we don't want to refactor the existing /
 * flow). Used inside Pearl's tile while screen-sharing during the
 * pre-call briefing.
 */
export function PrecallChecklist({
  ready,
  onReadyChange,
  onStart,
}: PrecallChecklistProps) {
  return (
    <div className="flex h-full w-full flex-col bg-[linear-gradient(180deg,#f6f4fb,#ffffff_55%,#eef1fa)] text-[color:var(--text-1)]">
      <header className="flex items-center justify-between gap-3 px-4 pb-2 pt-3">
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-[0_3px_8px_rgba(15,23,42,0.08)] border border-white/70"
            aria-hidden
          >
            <Image
              src="/superlabs-mark.svg"
              alt=""
              width={16}
              height={14}
              style={{ width: "auto", height: 12 }}
            />
          </span>
          <div>
            <div className="text-[12px] font-semibold leading-tight text-[color:var(--text-1)]">
              Pearl
            </div>
            <div className="flex items-center gap-1 text-[10.5px] text-[color:var(--text-2)]">
              <span
                className="h-1 w-1 rounded-full bg-[color:var(--success)]"
                aria-hidden
              />
              Quick check before we start
            </div>
          </div>
        </div>
        <span className="rounded-md bg-[rgba(133,57,255,0.08)] px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.06em] text-[color:var(--brand)]">
          Pearl is sharing
        </span>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 px-4 pb-2">
        <Column
          title="Go ahead"
          tone="good"
          rows={[
            { id: "g1", label: "Keep your invoice thread open", render: () => <DoChat /> },
            { id: "g2", label: "Work at your normal pace", render: () => <DoPace /> },
            { id: "g3", label: "Do the full flow, end-to-end", render: () => <DoFlow /> },
          ]}
        />
        <Column
          title="Skip for now"
          tone="bad"
          rows={[
            { id: "b1", label: "Banking or personal tabs", render: () => <DontBank /> },
            { id: "b2", label: "Typing passwords on-camera", render: () => <DontPassword /> },
            { id: "b3", label: "Switching user accounts", render: () => <DontSwitch /> },
          ]}
        />
      </div>

      <div className="flex flex-none items-center gap-3 border-t border-black/5 bg-white/55 px-4 py-2.5 backdrop-blur-md">
        <label className="flex cursor-pointer items-center gap-2">
          <span className="relative flex h-3.5 w-3.5 flex-none items-center justify-center">
            <input
              type="checkbox"
              checked={ready}
              onChange={(e) => onReadyChange(e.target.checked)}
              className="peer absolute inset-0 cursor-pointer appearance-none rounded-[3px] border border-black/25 bg-white checked:border-[color:var(--brand)] checked:bg-[color:var(--brand)] focus-visible:ring-2 focus-visible:ring-[color:var(--brand-ring)]"
              aria-label="Got it"
            />
            <svg
              viewBox="0 0 12 12"
              className="pointer-events-none relative h-2.5 w-2.5 text-white opacity-0 peer-checked:opacity-100"
              aria-hidden
            >
              <path
                d="M2.5 6.2 5 8.6l4.5-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-[11.5px] font-medium text-[color:var(--text-1)]">
            Got it — I&rsquo;ve closed what I don&rsquo;t want recorded.
          </span>
        </label>

        <button
          type="button"
          onClick={onStart}
          disabled={!ready}
          className="ml-auto inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-[linear-gradient(135deg,#8539FF,#B57FFF)] px-3.5 text-[12px] font-semibold text-white shadow-[0_4px_12px_rgba(133,57,255,0.28)] transition-[box-shadow,opacity] hover:shadow-[0_6px_16px_rgba(133,57,255,0.32)] disabled:pointer-events-none disabled:opacity-40"
        >
          Start recording
        </button>
      </div>
    </div>
  );
}

interface Row {
  id: string;
  label: string;
  render: () => React.ReactNode;
}

function Column({
  title,
  tone,
  rows,
}: {
  title: string;
  tone: "good" | "bad";
  rows: Row[];
}) {
  const isGood = tone === "good";
  return (
    <div
      className={`flex min-h-0 flex-col gap-1.5 rounded-xl border bg-white/65 p-2 backdrop-blur-md ${
        isGood
          ? "border-emerald-200/70 shadow-[0_4px_14px_rgba(16,185,129,0.08)]"
          : "border-rose-200/70 shadow-[0_4px_14px_rgba(244,63,94,0.08)]"
      }`}
    >
      <div className="flex items-center gap-1.5 px-0.5">
        <span
          className={`flex h-4 w-4 items-center justify-center rounded-full text-white ${
            isGood ? "bg-emerald-500" : "bg-rose-500"
          }`}
          aria-hidden
        >
          {isGood ? (
            <Check size={9} strokeWidth={3} />
          ) : (
            <X size={9} strokeWidth={3} />
          )}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text-2)]">
          {title}
        </span>
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-3 gap-1.5">
        {rows.map((r) => (
          <div
            key={r.id}
            className="flex min-h-0 items-center gap-2 overflow-hidden rounded-lg border border-white/70 bg-white/85 px-1.5 py-1.5"
          >
            <div className="relative flex h-full w-12 flex-none items-center justify-center overflow-hidden rounded-md bg-[linear-gradient(180deg,#F5F3FA,#FFFFFF)]">
              {r.render()}
            </div>
            <span className="min-w-0 text-[10.5px] font-medium leading-tight text-[color:var(--text-1)]">
              {r.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Compact vignettes (smaller versions of the originals) ---------- */

function DoChat() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: [0, 1, 1, 0.6], y: [4, 0, 0, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      className="flex items-center gap-0.5 rounded-[3px] border border-white bg-white px-1 py-0.5 text-[7px] shadow-[0_2px_4px_rgba(15,23,42,0.08)]"
    >
      <MessageSquare size={7} className="text-[color:var(--brand)]" />
      <FileText size={7} className="text-[color:var(--text-2)]" />
    </motion.div>
  );
}

function DoPace() {
  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: [0.9, 1.05, 0.9] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-emerald-400/60 bg-white text-emerald-600"
    >
      <Hand size={9} strokeWidth={2} />
    </motion.div>
  );
}

function DoFlow() {
  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            delay: i * 0.25,
            ease: "easeInOut",
          }}
          className="h-1 w-2.5 rounded-full bg-emerald-400"
        />
      ))}
    </div>
  );
}

function DontBank() {
  return (
    <div className="relative flex h-6 w-7 items-center justify-center rounded-md border border-rose-200 bg-white">
      <span className="text-[7px] font-bold tracking-tight text-rose-500">
        $$$
      </span>
      <motion.span
        initial={{ scale: 0.9, opacity: 0.6 }}
        animate={{ scale: [0.9, 1.05, 0.9], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-rose-500 text-white"
        aria-hidden
      >
        <X size={7} strokeWidth={3} />
      </motion.span>
    </div>
  );
}

function DontPassword() {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, -1, 0, 1, 0] }}
      transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 1.4 }}
      className="flex h-5 w-5 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-500"
    >
      <Lock size={8} strokeWidth={2} />
    </motion.div>
  );
}

function DontSwitch() {
  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: [0.9, 1, 0.9] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="flex h-5 w-5 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-500"
    >
      <Shield size={8} strokeWidth={2} />
    </motion.div>
  );
}
