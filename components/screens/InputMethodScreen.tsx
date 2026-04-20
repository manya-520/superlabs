"use client";

import { ImageIcon, Sparkles, Type, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useToast } from "@/components/ui/Toast";

export interface InputMethodScreenProps {
  onPickRecording: () => void;
  onBack: () => void;
}

export function InputMethodScreen({
  onPickRecording,
  onBack,
}: InputMethodScreenProps) {
  const { toast } = useToast();

  return (
    <div className="flex h-full flex-col gap-5 px-6 pt-7 pb-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-[color:var(--text-1)]">
            How should I learn this?
          </h1>
          <p className="mt-1 text-[12.5px] text-[color:var(--text-2)]">
            Pick how you&apos;d like to show me.
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="rounded-md px-2 py-1 text-[12px] font-medium text-[color:var(--text-2)] hover:bg-black/5"
        >
          Back
        </button>
      </header>

      <ul className="flex flex-col">
        <InputRow
          icon={Video}
          title="Record your screen"
          blurb="Do it once, I&rsquo;ll watch and pick it up."
          pearlsPick
          onClick={onPickRecording}
        />
        <InputRow
          icon={Type}
          title="Describe it in words"
          blurb="Type what you&rsquo;d normally do, step by step."
          onClick={() =>
            toast({
              kind: "info",
              title: "Coming soon",
              body: "Describing in text is on the way.",
            })
          }
        />
        <InputRow
          icon={ImageIcon}
          title="Upload screenshots"
          blurb="Walk me through it with a few images."
          onClick={() =>
            toast({
              kind: "info",
              title: "Coming soon",
              body: "Screenshot walkthroughs are on the way.",
            })
          }
        />
      </ul>

      <footer className="mt-auto flex items-center justify-center gap-1.5 text-[11px] text-[color:var(--text-3)]">
        <span
          className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand)]"
          aria-hidden
        />
        Pearl will save whatever works best for you.
      </footer>
    </div>
  );
}

interface InputRowProps {
  icon: LucideIcon;
  title: string;
  blurb: string;
  pearlsPick?: boolean;
  onClick?: () => void;
}

function InputRow({
  icon: Icon,
  title,
  blurb,
  pearlsPick,
  onClick,
}: InputRowProps) {
  return (
    <li
      className={
        pearlsPick
          ? "rounded-xl p-[1.5px] bg-[linear-gradient(135deg,rgba(133,57,255,0.85),rgba(181,127,255,0.55))] shadow-[0_6px_20px_rgba(133,57,255,0.14)]"
          : ""
      }
    >
      <button
        type="button"
        onClick={onClick}
        className={[
          "group flex w-full items-center gap-3 px-3.5 py-3 text-left transition-all",
          pearlsPick
            ? "rounded-[10.5px] bg-white hover:bg-white"
            : "rounded-xl border border-transparent hover:border-white/70 hover:bg-white/60",
        ].join(" ")}
      >
        <span
          className={[
            "flex h-9 w-9 flex-none items-center justify-center rounded-lg",
            pearlsPick
              ? "bg-[linear-gradient(135deg,rgba(133,57,255,0.15),rgba(181,127,255,0.15))] text-[color:var(--brand)]"
              : "bg-[rgba(15,23,42,0.04)] text-[color:var(--text-1)]",
          ].join(" ")}
          aria-hidden
        >
          <Icon size={16} strokeWidth={1.8} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="flex items-center gap-2">
            <span className="truncate text-[13.5px] font-semibold text-[color:var(--text-1)]">
              {title}
            </span>
            {pearlsPick && <PearlsPickTag />}
          </span>
          <span className="mt-0.5 truncate text-[12px] text-[color:var(--text-2)]">
            {blurb}
          </span>
        </span>
      </button>
    </li>
  );
}

function PearlsPickTag() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--brand-border)] bg-[rgba(133,57,255,0.06)] px-2 py-[2px] text-[10px] font-semibold uppercase tracking-[0.06em] text-[color:var(--brand)]">
      <Sparkles size={9} strokeWidth={2.2} aria-hidden />
      Pearl&apos;s pick
    </span>
  );
}
