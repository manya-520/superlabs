"use client";

import { ArrowRight, Bell, FileSpreadsheet, Receipt, Sparkles, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

export interface HomeScreenProps {
  onPick: () => void;
}

interface Suggestion {
  id: string;
  label: string;
  icon: LucideIcon;
}

const SUGGESTIONS: Suggestion[] = [
  { id: "invoices", label: "Process invoices from Slack", icon: Receipt },
  { id: "categorize", label: "Categorize expenses", icon: Wallet },
  { id: "chase", label: "Chase unpaid invoices", icon: Bell },
  { id: "summary", label: "Summarize monthly reports", icon: FileSpreadsheet },
];

export function HomeScreen({ onPick }: HomeScreenProps) {
  const [draft, setDraft] = useState("");

  return (
    <div className="flex h-full flex-col gap-5 px-6 pt-7 pb-6">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-[22px] font-semibold tracking-tight text-[color:var(--text-1)]">
          Hey Maria <span aria-hidden>👋</span>
        </h1>
        <p className="text-[13.5px] leading-relaxed text-[color:var(--text-2)]">
          What should I automate for you today?
        </p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (draft.trim()) onPick();
        }}
        className="group flex items-center gap-2 rounded-xl border border-white/70 bg-white/85 px-3.5 py-2.5 shadow-[0_4px_14px_rgba(15,23,42,0.06)] transition-all focus-within:border-[color:var(--brand-border)] focus-within:ring-2 focus-within:ring-[color:var(--brand-ring)]"
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

      <div className="flex flex-col gap-2">
        <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[color:var(--text-3)]">
          Or try one of these
        </div>
        <ul className="flex flex-col">
          {SUGGESTIONS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={onPick}
                className="group flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors hover:bg-white/55 focus-visible:bg-white/55"
              >
                <span
                  className="flex h-7 w-7 flex-none items-center justify-center rounded-md bg-[rgba(133,57,255,0.08)] text-[color:var(--brand)]"
                  aria-hidden
                >
                  <s.icon size={14} strokeWidth={1.9} />
                </span>
                <span className="flex-1 text-[13px] font-medium text-[color:var(--text-1)]">
                  {s.label}
                </span>
                <span
                  className="text-[color:var(--text-3)] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
                  aria-hidden
                >
                  <ArrowRight size={13} strokeWidth={1.8} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <footer className="mt-auto flex items-center justify-center gap-1.5 text-[11px] text-[color:var(--text-3)]">
        <span
          className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand)]"
          aria-hidden
        />
        Pearl · your Superlabs agent
      </footer>
    </div>
  );
}
