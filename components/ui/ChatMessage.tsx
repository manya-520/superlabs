"use client";

import Image from "next/image";
import type { ReactNode } from "react";

export interface ChatMessageProps {
  children: ReactNode;
  showAvatar?: boolean;
  variant?: "default" | "system";
}

export function ChatMessage({
  children,
  showAvatar = true,
  variant = "default",
}: ChatMessageProps) {
  return (
    <div className="flex items-start gap-2.5">
      {showAvatar ? (
        <span
          className="flex h-7 w-7 flex-none items-center justify-center overflow-hidden rounded-lg bg-white shadow-[0_2px_6px_rgba(15,23,42,0.08)] border border-white/70"
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
      ) : (
        <span className="h-7 w-7 flex-none" aria-hidden />
      )}
      <div
        className={[
          "max-w-[92%] rounded-lg rounded-tl-sm border px-3 py-2 text-[12.5px] leading-relaxed",
          variant === "system"
            ? "bg-[rgba(133,57,255,0.06)] border-[color:var(--brand-border)] text-[color:var(--text-1)]"
            : "bg-white/80 border-white/70 text-[color:var(--text-1)]",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
