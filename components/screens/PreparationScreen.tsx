"use client";

import { AlertCircle, Shield } from "lucide-react";
import { useState } from "react";

import { GradientButton } from "@/components/ui/GradientButton";

export interface PreparationScreenProps {
  onStart: () => void;
  onBack: () => void;
}

export function PreparationScreen({ onStart, onBack }: PreparationScreenProps) {
  const [ready, setReady] = useState(false);

  return (
    <div className="flex h-full flex-col gap-4 px-6 py-6">
      <header className="flex items-start justify-between gap-3">
        <h1 className="text-[20px] font-semibold tracking-tight text-[color:var(--text-1)]">
          Before we start
        </h1>
        <button
          type="button"
          onClick={onBack}
          className="rounded-md px-2 py-1 text-[12px] font-medium text-[color:var(--text-2)] hover:bg-black/5"
        >
          Back
        </button>
      </header>

      <div className="flex flex-col gap-2.5">
        <InfoCard
          icon={<Shield size={16} strokeWidth={1.8} />}
          accent="success"
          title="Your recording stays private"
          body="Only used to build your automation. Not stored long-term."
        />
        <InfoCard
          icon={<AlertCircle size={16} strokeWidth={1.8} />}
          accent="warning"
          title="Watch what's on screen"
          body="Close anything sensitive before recording."
        />
      </div>

      <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-lg border border-white/50 bg-white/55 p-3 backdrop-blur-md transition-colors hover:bg-white/75">
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
          I&apos;m ready
        </span>
      </label>

      <div className="mt-auto">
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

function InfoCard({
  icon,
  title,
  body,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  accent: "success" | "warning";
}) {
  const accentStyles =
    accent === "success"
      ? {
          bg: "bg-[rgba(22,163,74,0.08)]",
          border: "border-[rgba(22,163,74,0.20)]",
          color: "text-[color:var(--success)]",
        }
      : {
          bg: "bg-[rgba(161,98,7,0.08)]",
          border: "border-[rgba(161,98,7,0.20)]",
          color: "text-[color:var(--warning)]",
        };

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border ${accentStyles.bg} ${accentStyles.border} p-3.5`}
    >
      <span
        className={`flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-white ${accentStyles.color}`}
        aria-hidden
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold text-[color:var(--text-1)]">
          {title}
        </div>
        <div className="mt-0.5 text-[12px] leading-relaxed text-[color:var(--text-2)]">
          {body}
        </div>
      </div>
    </div>
  );
}
