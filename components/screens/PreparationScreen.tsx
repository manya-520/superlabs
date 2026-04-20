"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { GradientButton } from "@/components/ui/GradientButton";

export interface PreparationScreenProps {
  onStart: () => void;
  onBack: () => void;
}

interface PearlMessage {
  id: string;
  text: string;
}

const PEARL_INTRO: PearlMessage[] = [
  {
    id: "p1",
    text: "Hey Maria — before we start, a couple quick things so you feel good about this.",
  },
  {
    id: "p2",
    text: "Your screen recording stays on this laptop. I use it to learn, then it&rsquo;s gone. Nothing leaves your device.",
  },
  {
    id: "p3",
    text: "I won&rsquo;t interrupt while you work. If you open something personal by accident, hit Stop and we&rsquo;ll start over.",
  },
  {
    id: "p4",
    text: "Just do your invoice flow the way you always do. I&rsquo;ll follow along.",
  },
];

export function PreparationScreen({ onStart, onBack }: PreparationScreenProps) {
  const [ready, setReady] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-start justify-between gap-3 px-6 pt-6 pb-3">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-[0_2px_6px_rgba(15,23,42,0.08)] border border-white/70"
            aria-hidden
          >
            <Image
              src="/superlabs-mark.svg"
              alt=""
              width={18}
              height={16}
              style={{ width: "auto", height: 14 }}
              priority
            />
          </span>
          <div>
            <div className="text-[13.5px] font-semibold text-[color:var(--text-1)]">
              Pearl
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[color:var(--text-2)]">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[color:var(--success)]"
                aria-hidden
              />
              Ready when you are
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

      <div className="flex flex-1 min-h-0 flex-col gap-2.5 overflow-y-auto px-6 py-3">
        {PEARL_INTRO.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.25, duration: 0.28, ease: "easeOut" }}
            className="max-w-[92%] self-start rounded-2xl rounded-tl-md border border-white/70 bg-white/85 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-[color:var(--text-1)] shadow-[0_2px_10px_rgba(15,23,42,0.04)]"
            dangerouslySetInnerHTML={{ __html: m.text }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-white/45 bg-white/40 px-6 py-4">
        <label className="flex cursor-pointer items-center gap-3 rounded-lg">
          <span className="relative flex h-4 w-4 flex-none items-center justify-center">
            <input
              type="checkbox"
              checked={ready}
              onChange={(e) => setReady(e.target.checked)}
              className="peer absolute inset-0 cursor-pointer appearance-none rounded-[4px] border border-black/20 bg-white checked:border-[color:var(--brand)] checked:bg-[color:var(--brand)] focus-visible:ring-2 focus-visible:ring-[color:var(--brand-ring)]"
              aria-label="I'm ready"
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
          <span className="text-[13px] font-medium text-[color:var(--text-1)]">
            I&rsquo;ve closed anything I don&rsquo;t want recorded.
          </span>
        </label>

        <GradientButton
          size="lg"
          disabled={!ready}
          onClick={onStart}
          className="w-full"
        >
          Start recording
        </GradientButton>
      </div>
    </div>
  );
}
