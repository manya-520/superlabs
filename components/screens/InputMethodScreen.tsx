"use client";

import { ImageIcon, Sparkles, Type, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useToast } from "@/components/ui/Toast";

export interface InputMethodScreenProps {
  onPickRecording: () => void;
  onBack: () => void;
}

interface Method {
  id: string;
  icon: LucideIcon;
  title: string;
  blurb: string;
  detail: string;
  pearlsPick?: boolean;
  onClick: () => void;
}

export function InputMethodScreen({
  onPickRecording,
  onBack,
}: InputMethodScreenProps) {
  const { toast } = useToast();

  const methods: Method[] = [
    {
      id: "record",
      icon: Video,
      title: "Record your screen",
      blurb: "Do it once, I&rsquo;ll watch.",
      detail: "Fastest. Works on anything.",
      pearlsPick: true,
      onClick: onPickRecording,
    },
    {
      id: "describe",
      icon: Type,
      title: "Describe it in words",
      blurb: "Type the steps as you&rsquo;d do them.",
      detail: "Good for simple flows.",
      onClick: () =>
        toast({
          kind: "info",
          title: "Coming soon",
          body: "Describing in text is on the way.",
        }),
    },
    {
      id: "upload",
      icon: ImageIcon,
      title: "Upload screenshots",
      blurb: "Walk me through with a few images.",
      detail: "Great for quick one-offs.",
      onClick: () =>
        toast({
          kind: "info",
          title: "Coming soon",
          body: "Screenshot walkthroughs are on the way.",
        }),
    },
  ];

  return (
    <div className="flex h-full flex-col gap-4 px-6 pt-5 pb-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-[color:var(--text-1)]">
            How should I learn this?
          </h1>
          <p className="mt-0.5 text-[12.5px] text-[color:var(--text-2)]">
            Pick how you&rsquo;d like to show me — whatever feels easiest.
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

      <div className="grid min-h-0 flex-1 grid-cols-3 gap-3">
        {methods.map((m) => (
          <MethodCard key={m.id} method={m} />
        ))}
      </div>

      <footer className="flex items-center justify-center gap-1.5 text-[11px] text-[color:var(--text-3)]">
        <span
          className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand)]"
          aria-hidden
        />
        Pearl will save whatever works best for you.
      </footer>
    </div>
  );
}

function MethodCard({ method }: { method: Method }) {
  const Icon = method.icon;
  const { pearlsPick } = method;

  return (
    <div
      className={
        pearlsPick
          ? "relative rounded-2xl p-[1.5px] bg-[linear-gradient(160deg,rgba(133,57,255,0.75),rgba(181,127,255,0.35)_55%,rgba(255,255,255,0.7))] shadow-[0_10px_30px_rgba(133,57,255,0.18)]"
          : ""
      }
    >
      <button
        type="button"
        onClick={method.onClick}
        className={[
          "group relative flex h-full w-full flex-col items-start gap-3 overflow-hidden px-4 pt-4 pb-3.5 text-left transition-all",
          pearlsPick
            ? "rounded-[14.5px] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,255,255,0.78))] backdrop-blur-2xl hover:bg-white"
            : "rounded-2xl border border-white/60 bg-white/55 backdrop-blur-xl hover:-translate-y-px hover:border-white hover:bg-white/80 hover:shadow-[0_8px_22px_rgba(15,23,42,0.08)]",
        ].join(" ")}
      >
        <span
          aria-hidden
          className={[
            "flex h-10 w-10 flex-none items-center justify-center rounded-xl",
            pearlsPick
              ? "bg-[linear-gradient(135deg,rgba(133,57,255,0.18),rgba(181,127,255,0.18))] text-[color:var(--brand)] shadow-[0_3px_10px_rgba(133,57,255,0.18)]"
              : "bg-white text-[color:var(--text-1)] shadow-[0_2px_6px_rgba(15,23,42,0.08)]",
          ].join(" ")}
        >
          <Icon size={18} strokeWidth={1.8} />
        </span>

        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-semibold leading-tight text-[color:var(--text-1)]">
            {method.title}
          </span>
          <span
            className="text-[12px] leading-snug text-[color:var(--text-2)]"
            dangerouslySetInnerHTML={{ __html: method.blurb }}
          />
        </div>

        <div className="mt-auto flex w-full items-center justify-between gap-2 pt-2">
          <span className="text-[11px] text-[color:var(--text-3)]">
            {method.detail}
          </span>
          {pearlsPick && <PearlsPickTag />}
        </div>

        {pearlsPick && (
          <span
            aria-hidden
            className="pointer-events-none absolute -right-6 -top-10 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(133,57,255,0.25),transparent_70%)]"
          />
        )}
      </button>
    </div>
  );
}

function PearlsPickTag() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--brand-border)] bg-[rgba(133,57,255,0.08)] px-2 py-[2px] text-[10px] font-semibold uppercase tracking-[0.06em] text-[color:var(--brand)]">
      <Sparkles size={9} strokeWidth={2.2} aria-hidden />
      Pearl&rsquo;s pick
    </span>
  );
}
