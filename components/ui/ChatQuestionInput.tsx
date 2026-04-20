"use client";

import { Check, Send, SkipForward } from "lucide-react";
import { useState } from "react";

export interface ChatQuestionInputProps {
  questionId: string;
  placeholder?: string;
  onAnswer?: (value: string) => void;
  onSkip?: () => void;
}

export function ChatQuestionInput({
  questionId,
  placeholder = "Type a quick answer…",
  onAnswer,
  onSkip,
}: ChatQuestionInputProps) {
  const [value, setValue] = useState("");
  const [answered, setAnswered] = useState<null | "answered" | "skipped">(null);

  if (answered) {
    return (
      <div className="ml-9 inline-flex items-center gap-1.5 rounded-md bg-[rgba(22,163,74,0.08)] px-2 py-1 text-[11px] font-medium text-[color:var(--success)]">
        <Check size={12} strokeWidth={2.4} />
        {answered === "answered" ? "Answered" : "Skipped"}
      </div>
    );
  }

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAnswer?.(trimmed);
    setAnswered("answered");
  };

  return (
    <div className="ml-9 flex items-center gap-1.5">
      <input
        id={`q-${questionId}`}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        className="h-8 flex-1 rounded-md border border-black/10 bg-white/90 px-2.5 text-[12px] text-[color:var(--text-1)] placeholder:text-[color:var(--text-3)] outline-none focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand-ring)]"
      />
      <button
        type="button"
        onClick={() => {
          onSkip?.();
          setAnswered("skipped");
        }}
        aria-label="Skip question"
        className="flex h-8 w-8 items-center justify-center rounded-md text-[color:var(--text-2)] hover:bg-black/5"
      >
        <SkipForward size={13} />
      </button>
      <button
        type="button"
        onClick={submit}
        aria-label="Send answer"
        disabled={!value.trim()}
        className="flex h-8 w-8 items-center justify-center rounded-md bg-[color:var(--brand)] text-white transition-colors disabled:opacity-40 disabled:pointer-events-none hover:bg-[color:var(--brand-hover)]"
      >
        <Send size={12} />
      </button>
    </div>
  );
}
