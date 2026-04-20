"use client";

import type { LucideIcon } from "lucide-react";

import { RecommendedBadge } from "./RecommendedBadge";

export interface AutomationCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  recommended?: boolean;
  recommendedTooltip?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function AutomationCard({
  icon: Icon,
  title,
  subtitle,
  recommended,
  recommendedTooltip,
  onClick,
  disabled,
}: AutomationCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "group flex w-full items-center gap-3 rounded-xl border border-white/50 bg-white/55 p-3.5 text-left",
        "backdrop-blur-xl transition-all duration-200",
        "hover:bg-white/80 hover:border-white/80 hover:-translate-y-px hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)]",
        "disabled:opacity-50 disabled:pointer-events-none",
        "focus-visible:outline-2 focus-visible:outline-[color:var(--brand)] focus-visible:outline-offset-2",
      ].join(" ")}
    >
      <span
        className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-[linear-gradient(135deg,rgba(133,57,255,0.10),rgba(181,127,255,0.10))] text-[color:var(--brand)]"
        aria-hidden
      >
        <Icon size={18} strokeWidth={1.8} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-[14px] font-semibold text-[color:var(--text-1)]">
            {title}
          </span>
          {recommended && (
            <RecommendedBadge tooltip={recommendedTooltip} />
          )}
        </span>
        <span className="mt-0.5 block truncate text-[12px] text-[color:var(--text-2)]">
          {subtitle}
        </span>
      </span>
      <span
        className="text-[color:var(--text-3)] transition-transform duration-200 group-hover:translate-x-0.5"
        aria-hidden
      >
        ›
      </span>
    </button>
  );
}
