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
import { useState } from "react";

import { GradientButton } from "@/components/ui/GradientButton";

export interface PreparationScreenProps {
  onStart: () => void;
  onBack: () => void;
}

export function PreparationScreen({ onStart, onBack }: PreparationScreenProps) {
  const [ready, setReady] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-start justify-between gap-3 px-6 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-[0_3px_10px_rgba(15,23,42,0.08)] border border-white/70"
            aria-hidden
          >
            <Image
              src="/superlabs-mark.svg"
              alt=""
              width={20}
              height={18}
              style={{ width: "auto", height: 16 }}
              priority
            />
          </span>
          <div>
            <div className="text-[14px] font-semibold text-[color:var(--text-1)]">
              Pearl
            </div>
            <div className="flex items-center gap-1.5 text-[11.5px] text-[color:var(--text-2)]">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[color:var(--success)]"
                aria-hidden
              />
              Quick check before we start
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="rounded-md px-2 py-1 text-[12px] font-medium text-[color:var(--text-2)] hover:bg-black/5"
        >
          Back
        </button>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-3 px-6 pb-3">
        <Column
          title="Go ahead"
          tone="good"
          vignettes={[
            {
              id: "g1",
              label: "Keep your invoice thread open",
              render: () => <DoChatVignette />,
            },
            {
              id: "g2",
              label: "Work at your normal pace",
              render: () => <DoPaceVignette />,
            },
            {
              id: "g3",
              label: "Do the full flow, end-to-end",
              render: () => <DoFlowVignette />,
            },
          ]}
        />
        <Column
          title="Skip for now"
          tone="bad"
          vignettes={[
            {
              id: "b1",
              label: "Banking or personal tabs",
              render: () => <DontBankVignette />,
            },
            {
              id: "b2",
              label: "Typing passwords on-camera",
              render: () => <DontPasswordVignette />,
            },
            {
              id: "b3",
              label: "Switching user accounts",
              render: () => <DontSwitchVignette />,
            },
          ]}
        />
      </div>

      <div className="flex items-center gap-4 border-t border-white/45 bg-white/50 px-6 py-3.5">
        <label className="flex cursor-pointer items-center gap-2.5">
          <span className="relative flex h-4 w-4 flex-none items-center justify-center">
            <input
              type="checkbox"
              checked={ready}
              onChange={(e) => setReady(e.target.checked)}
              className="peer absolute inset-0 cursor-pointer appearance-none rounded-[4px] border border-black/20 bg-white checked:border-[color:var(--brand)] checked:bg-[color:var(--brand)] focus-visible:ring-2 focus-visible:ring-[color:var(--brand-ring)]"
              aria-label="Got it"
            />
            <svg
              viewBox="0 0 12 12"
              className="pointer-events-none relative h-3 w-3 text-white opacity-0 peer-checked:opacity-100"
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
          <span className="text-[12.5px] font-medium text-[color:var(--text-1)]">
            Got it — I&rsquo;ve closed what I don&rsquo;t want recorded.
          </span>
        </label>

        <GradientButton
          size="lg"
          disabled={!ready}
          onClick={onStart}
          className="ml-auto"
        >
          Start recording
        </GradientButton>
      </div>
    </div>
  );
}

/* ---------- Column ---------- */

interface Vignette {
  id: string;
  label: string;
  render: () => React.ReactNode;
}

function Column({
  title,
  tone,
  vignettes,
}: {
  title: string;
  tone: "good" | "bad";
  vignettes: Vignette[];
}) {
  const isGood = tone === "good";
  return (
    <div
      className={[
        "flex min-h-0 flex-col gap-2 rounded-2xl border bg-white/55 p-3 backdrop-blur-xl",
        isGood
          ? "border-emerald-200/70 shadow-[0_6px_18px_rgba(16,185,129,0.08)]"
          : "border-rose-200/70 shadow-[0_6px_18px_rgba(244,63,94,0.08)]",
      ].join(" ")}
    >
      <div className="flex items-center gap-2 px-1 pb-1">
        <span
          className={[
            "flex h-5 w-5 items-center justify-center rounded-full",
            isGood
              ? "bg-emerald-500 text-white"
              : "bg-rose-500 text-white",
          ].join(" ")}
          aria-hidden
        >
          {isGood ? (
            <Check size={11} strokeWidth={3} />
          ) : (
            <X size={11} strokeWidth={3} />
          )}
        </span>
        <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text-2)]">
          {title}
        </span>
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-3 gap-2">
        {vignettes.map((v) => (
          <div
            key={v.id}
            className="flex min-h-0 items-center gap-3 overflow-hidden rounded-xl border border-white/70 bg-white/75 p-2"
          >
            <div className="relative flex h-full w-20 flex-none items-center justify-center overflow-hidden rounded-lg bg-[linear-gradient(180deg,#F5F3FA,#FFFFFF)]">
              {v.render()}
            </div>
            <span className="min-w-0 text-[12px] font-medium leading-snug text-[color:var(--text-1)]">
              {v.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Vignettes ---------- */

function DoChatVignette() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: [0, 1, 1, 0.6], y: [6, 0, 0, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center gap-1 rounded-md border border-white bg-white px-1.5 py-1 text-[8px] text-[color:var(--text-1)] shadow-[0_2px_5px_rgba(15,23,42,0.08)]"
      >
        <MessageSquare
          size={9}
          className="text-[color:var(--brand)]"
          aria-hidden
        />
        <FileText
          size={9}
          className="text-[color:var(--text-2)]"
          aria-hidden
        />
      </motion.div>
    </div>
  );
}

function DoPaceVignette() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: [0.9, 1.05, 0.9] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-emerald-400/60 bg-white text-emerald-600"
      >
        <Hand size={13} strokeWidth={2} />
      </motion.div>
    </div>
  );
}

function DoFlowVignette() {
  return (
    <div className="relative flex h-full w-full items-center justify-center gap-0.5">
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
          className="h-1.5 w-4 rounded-full bg-emerald-400"
        />
      ))}
    </div>
  );
}

function DontBankVignette() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="relative flex h-8 w-10 items-center justify-center rounded-md border border-rose-200 bg-white">
        <span className="text-[9px] font-bold tracking-tight text-rose-500">
          $$$
        </span>
        <motion.span
          initial={{ scale: 0.9, opacity: 0.6 }}
          animate={{ scale: [0.9, 1.05, 0.9], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-white shadow-[0_2px_4px_rgba(244,63,94,0.4)]"
          aria-hidden
        >
          <X size={9} strokeWidth={3} />
        </motion.span>
      </div>
    </div>
  );
}

function DontPasswordVignette() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -1, 0, 1, 0] }}
        transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 1.4 }}
        className="relative flex h-6 w-6 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-500"
      >
        <Lock size={11} strokeWidth={2} />
      </motion.div>
    </div>
  );
}

function DontSwitchVignette() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: [0.9, 1, 0.9] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-6 w-6 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-500"
      >
        <Shield size={11} strokeWidth={2} />
      </motion.div>
    </div>
  );
}
