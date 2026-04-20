"use client";

import { useId, useState } from "react";

export interface RecommendedBadgeProps {
  tooltip?: string;
  className?: string;
}

export function RecommendedBadge({
  tooltip,
  className = "",
}: RecommendedBadgeProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  const badge = (
    <span
      className={`recommended-badge ${className}`}
      aria-describedby={tooltip ? tooltipId : undefined}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={tooltip ? 0 : -1}
    >
      Recommended
    </span>
  );

  if (!tooltip) return badge;

  return (
    <span className="relative inline-flex">
      {badge}
      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute top-full right-0 mt-2 z-[var(--z-tooltip)] whitespace-nowrap rounded-md bg-[#1a1a1a] px-2 py-1 text-[11px] font-medium text-white shadow-md"
        >
          {tooltip}
        </span>
      )}
    </span>
  );
}
