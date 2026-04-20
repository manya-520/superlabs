"use client";

import {
  ArrowRight,
  Bell,
  Clock,
  FileBarChart,
  FileSpreadsheet,
  Play,
  Receipt,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

import { useToast } from "@/components/ui/Toast";

export interface HomeScreenProps {
  onPick: () => void;
}

interface Suggestion {
  id: string;
  label: string;
  blurb: string;
  icon: LucideIcon;
}

const SUGGESTIONS: Suggestion[] = [
  {
    id: "invoices",
    label: "Process invoices",
    blurb: "Log and file them",
    icon: Receipt,
  },
  {
    id: "categorize",
    label: "Categorize expenses",
    blurb: "Tag by category",
    icon: Wallet,
  },
  {
    id: "chase",
    label: "Chase unpaid",
    blurb: "Ping who owes",
    icon: Bell,
  },
  {
    id: "reports",
    label: "Summarize reports",
    blurb: "Monthly rollups",
    icon: FileSpreadsheet,
  },
];

interface SavedAutomation {
  id: string;
  name: string;
  icon: LucideIcon;
  /** How many times this automation ran in `runsWindow`. */
  runs: number;
  runsWindow: string;
  /** Rough hours saved this week, shown as "~Xh". */
  hoursSavedThisWeek: number;
}

const SAVED_AUTOMATIONS: SavedAutomation[] = [
  {
    id: "drafts",
    name: "Expense report drafts",
    icon: FileBarChart,
    runs: 34,
    runsWindow: "past 2 days",
    hoursSavedThisWeek: 7.5,
  },
  {
    id: "timesheets",
    name: "Weekly timesheet sync",
    icon: Clock,
    runs: 12,
    runsWindow: "this month",
    hoursSavedThisWeek: 3,
  },
  {
    id: "followups",
    name: "Client follow-ups",
    icon: Users,
    runs: 28,
    runsWindow: "this week",
    hoursSavedThisWeek: 4,
  },
];

function formatHours(h: number): string {
  return Number.isInteger(h) ? `${h}h` : `${h.toFixed(1)}h`;
}

export function HomeScreen({ onPick }: HomeScreenProps) {
  const [draft, setDraft] = useState("");
  const { toast } = useToast();

  const hoursSavedThisWeek = SAVED_AUTOMATIONS.reduce(
    (sum, a) => sum + a.hoursSavedThisWeek,
    0,
  );

  return (
    <div className="flex h-full flex-col gap-5 px-6 pt-5 pb-5">
      {/* Section 1 — Intro + chat input */}
      <header className="flex flex-col gap-2">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-semibold leading-tight tracking-tight text-[color:var(--text-1)]">
              Hey Maria <span aria-hidden>👋</span>
            </h1>
            <p className="mt-0.5 text-[13px] text-[color:var(--text-2)]">
              What should I automate for you today?
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] text-[color:var(--text-3)]">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand)]"
              aria-hidden
            />
            Pearl · your Superlabs assistant
          </span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.trim()) onPick();
          }}
          className="group flex items-center gap-2 rounded-xl border border-white/70 bg-white/80 px-3.5 py-2.5 shadow-[0_4px_14px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all focus-within:border-[color:var(--brand-border)] focus-within:ring-2 focus-within:ring-[color:var(--brand-ring)]"
        >
          <Sparkles
            size={15}
            strokeWidth={1.8}
            className="flex-none text-[color:var(--brand)]"
            aria-hidden
          />
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Tell me what you&#39;d like to automate…"
            className="flex-1 bg-transparent text-[13.5px] text-[color:var(--text-1)] placeholder:text-[color:var(--text-3)] outline-none"
            aria-label="Describe what to automate"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Continue"
            className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-[color:var(--brand)] text-white transition-opacity hover:bg-[color:var(--brand-hover)] disabled:opacity-40 disabled:pointer-events-none"
          >
            <ArrowRight size={14} strokeWidth={2.2} />
          </button>
        </form>
      </header>

      {/* Section 2 — Try one of these (horizontal) */}
      <section className="flex flex-col gap-2">
        <SectionLabel>Try one of these</SectionLabel>
        <div className="grid grid-cols-4 gap-2.5">
          {SUGGESTIONS.map((s) => (
            <SuggestionTile key={s.id} suggestion={s} onClick={onPick} />
          ))}
        </div>
      </section>

      {/* Section 3 — Your automations */}
      <section className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <SectionLabel>Your automations</SectionLabel>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50/80 px-2 py-[2px] text-[10.5px] font-semibold text-emerald-700">
              <span
                className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                aria-hidden
              />
              Saved ~{formatHours(hoursSavedThisWeek)} this week
            </span>
            <button
              type="button"
              className="text-[11px] font-medium text-[color:var(--brand)] hover:underline"
            >
              See all
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {SAVED_AUTOMATIONS.map((a) => (
            <SavedTile
              key={a.id}
              automation={a}
              onRun={() =>
                toast({
                  kind: "info",
                  title: `${a.name}`,
                  body: "Pearl is on it.",
                })
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[color:var(--text-3)]">
      {children}
    </div>
  );
}

function SuggestionTile({
  suggestion,
  onClick,
}: {
  suggestion: Suggestion;
  onClick: () => void;
}) {
  const Icon = suggestion.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-start gap-1.5 rounded-xl border border-white/70 bg-white/65 px-3 py-3 text-left shadow-[0_2px_8px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all hover:-translate-y-px hover:border-white hover:bg-white/90 hover:shadow-[0_6px_18px_rgba(15,23,42,0.08)]"
    >
      <span
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[linear-gradient(135deg,rgba(133,57,255,0.12),rgba(181,127,255,0.12))] text-[color:var(--brand)]"
        aria-hidden
      >
        <Icon size={14} strokeWidth={1.9} />
      </span>
      <span className="text-[12.5px] font-semibold leading-tight text-[color:var(--text-1)]">
        {suggestion.label}
      </span>
      <span className="text-[10.5px] leading-snug text-[color:var(--text-2)]">
        {suggestion.blurb}
      </span>
    </button>
  );
}

function SavedTile({
  automation,
  onRun,
}: {
  automation: SavedAutomation;
  onRun: () => void;
}) {
  const Icon = automation.icon;
  return (
    <div className="group relative flex flex-col gap-2 overflow-hidden rounded-xl border border-white/55 bg-white/50 px-3 py-2.5 backdrop-blur-xl transition-all hover:border-white hover:bg-white/80">
      <div className="flex items-start gap-2.5">
        <span
          className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-white text-[color:var(--text-1)] shadow-[0_1px_3px_rgba(15,23,42,0.08)]"
          aria-hidden
        >
          <Icon size={13} strokeWidth={1.9} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12px] font-semibold leading-tight text-[color:var(--text-1)]">
            {automation.name}
          </div>
          <div className="mt-0.5 truncate text-[10px] text-[color:var(--text-3)]">
            {automation.runs} runs · {automation.runsWindow}
          </div>
        </div>
        <button
          type="button"
          onClick={onRun}
          aria-label={`Run ${automation.name}`}
          className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[color:var(--brand)]/10 text-[color:var(--brand)] opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Play size={11} strokeWidth={2.4} fill="currentColor" />
        </button>
      </div>
      <div className="flex items-center gap-1 rounded-md bg-emerald-50/70 px-2 py-1 text-[10.5px] font-medium text-emerald-700">
        <TrendingUp size={10} strokeWidth={2.2} aria-hidden />
        Saved ~{formatHours(automation.hoursSavedThisWeek)} this week
      </div>
    </div>
  );
}
