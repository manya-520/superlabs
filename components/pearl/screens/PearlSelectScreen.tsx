"use client";

import { motion } from "framer-motion";
import { ImageIcon, Mic, Sparkles, Type, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";

import { useToast } from "@/components/ui/Toast";

export interface PearlSelectScreenProps {
  onJoinZoom: () => void;
  onBack: () => void;
}

interface SecondaryMethod {
  id: string;
  icon: LucideIcon;
  title: string;
  onClick: () => void;
}

export function PearlSelectScreen({
  onJoinZoom,
  onBack,
}: PearlSelectScreenProps) {
  const { toast } = useToast();

  const secondary: SecondaryMethod[] = [
    {
      id: "record",
      icon: Video,
      title: "Record your screen",
      onClick: () =>
        toast({
          kind: "info",
          title: "Coming soon in this prototype",
          body: "Try the call with Pearl instead.",
        }),
    },
    {
      id: "describe",
      icon: Type,
      title: "Describe in words",
      onClick: () =>
        toast({
          kind: "info",
          title: "Coming soon in this prototype",
          body: "Try the call with Pearl instead.",
        }),
    },
    {
      id: "upload",
      icon: ImageIcon,
      title: "Upload screenshots",
      onClick: () =>
        toast({
          kind: "info",
          title: "Coming soon in this prototype",
          body: "Try the call with Pearl instead.",
        }),
    },
  ];

  return (
    <div className="flex h-full flex-col gap-5 px-6 pt-5 pb-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-[color:var(--text-1)]">
            How should I learn this?
          </h1>
          <p className="mt-0.5 text-[12.5px] text-[color:var(--text-2)]">
            I&rsquo;ve picked the fastest way for you.
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

      {/* Pearl's-pick hero card — clean solid border, two-column layout */}
      <div className="relative overflow-hidden rounded-2xl border border-[color:var(--brand-border)] bg-white/85 backdrop-blur-2xl shadow-[0_18px_42px_rgba(133,57,255,0.18)]">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(133,57,255,0.18),transparent_72%)]"
        />

        <div className="relative grid grid-cols-[1fr_238px] gap-4 px-6 py-5">
          {/* LEFT: Pitch + CTA */}
          <div className="flex min-w-0 flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-1 rounded-full border border-[color:var(--brand-border)] bg-[rgba(133,57,255,0.08)] px-2 py-[2px] text-[10px] font-semibold uppercase tracking-[0.06em] text-[color:var(--brand)]">
              <Sparkles size={9} strokeWidth={2.2} aria-hidden />
              Pearl&rsquo;s pick
            </span>

            <div>
              <h2 className="text-[19px] font-semibold leading-tight tracking-tight text-[color:var(--text-1)]">
                Hop on a quick call with Pearl
              </h2>
              <p className="mt-1 text-[13px] leading-snug text-[color:var(--text-2)]">
                She&rsquo;ll walk through it with you — fastest way to get
                started.
              </p>
            </div>

            <ul className="flex flex-col gap-1 text-[11.5px] text-[color:var(--text-2)]">
              <PerkRow>~5 minutes, no prep needed</PerkRow>
              <PerkRow>Pearl asks the right questions as you go</PerkRow>
              <PerkRow>You can re-record any step on the fly</PerkRow>
            </ul>

            <div className="mt-1">
              <ZoomButton onClick={onJoinZoom} />
            </div>
          </div>

          {/* RIGHT: Live Zoom-tile preview of Pearl waiting */}
          <PearlPreviewTile />
        </div>
      </div>

      {/* Inline alternates — three small text links so they never overflow */}
      <div className="mt-auto flex flex-col items-center gap-2">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text-3)]">
          Or try another way
        </span>
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {secondary.map((m, i) => (
            <span key={m.id} className="flex items-center gap-1.5">
              {i > 0 && (
                <span
                  className="h-1 w-1 rounded-full bg-[color:var(--text-3)]/50"
                  aria-hidden
                />
              )}
              <SecondaryPill method={m} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function PerkRow({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-1.5">
      <span
        aria-hidden
        className="mt-[5px] flex h-1.5 w-1.5 flex-none rounded-full bg-[color:var(--brand)]"
      />
      <span>{children}</span>
    </li>
  );
}

/**
 * A miniature Zoom participant tile that previews what the call will
 * look like — Pearl's jellyfish on a dark background with a pulsing
 * brand ring (her listening state) and a "● Live · ready" indicator.
 * This is intentionally rich so users see who they're calling and feel
 * the call is "right there".
 */
function PearlPreviewTile() {
  return (
    <div className="relative flex h-full min-h-[200px] items-stretch">
      <div
        className="relative h-full w-full overflow-hidden rounded-xl shadow-[0_10px_30px_rgba(15,23,42,0.25),inset_0_1px_0_rgba(255,255,255,0.06)]"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(133,57,255,0.5), transparent 60%), radial-gradient(circle at 30% 80%, rgba(142,197,252,0.28), transparent 55%), #1f1f23",
        }}
      >
        {/* Pulsing listening ring */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl border-2 border-[color:var(--brand)]"
          initial={{ opacity: 0.45 }}
          animate={{ opacity: [0.45, 0.85, 0.45] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Pearl avatar */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.96 }}
            animate={{ scale: [0.96, 1.02, 0.96] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-[78px] w-[78px] items-center justify-center rounded-full bg-white/8 ring-1 ring-white/10 backdrop-blur-md"
          >
            <Image
              src="/superlabs-mark.svg"
              alt=""
              width={48}
              height={42}
              style={{ width: "auto", height: 38 }}
              priority
            />
          </motion.div>
        </div>

        {/* Top-right "live" badge */}
        <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/55 px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.06em] text-white/80 backdrop-blur-sm">
          <span
            className="h-1 w-1 rounded-full bg-emerald-400"
            aria-hidden
          />
          Live · ready
        </span>

        {/* Bottom-left name strip — Zoom style */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/55 px-1.5 py-1 text-[10.5px] font-medium text-white backdrop-blur-sm">
          <Mic size={9} strokeWidth={2.2} className="text-white/80" />
          Pearl
        </div>
      </div>
    </div>
  );
}

/**
 * Zoom-branded primary CTA. Renders a Zoom-style camera glyph on a
 * white tile + "Open Zoom".
 */
function ZoomButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex h-10 items-center gap-2 rounded-md bg-[linear-gradient(135deg,#8539FF,#B57FFF)] pl-1 pr-4 text-[13.5px] font-semibold text-white shadow-[0_8px_22px_rgba(133,57,255,0.32)] transition-shadow hover:shadow-[0_12px_28px_rgba(133,57,255,0.4)] active:translate-y-px"
    >
      <span
        aria-hidden
        className="flex h-8 w-8 flex-none items-center justify-center rounded-[5px] bg-white text-[#2D8CFF] shadow-[inset_0_-1px_0_rgba(0,0,0,0.04)]"
      >
        <ZoomGlyph />
      </span>
      Open Zoom
    </button>
  );
}

function ZoomGlyph() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} role="img" aria-label="Zoom">
      <rect x="3" y="7" width="13" height="10" rx="2.2" fill="currentColor" />
      <path
        d="M16 11.2 L21.2 8.4 A0.6 0.6 0 0 1 22 9 V15 A0.6 0.6 0 0 1 21.2 15.6 L16 12.8 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SecondaryPill({ method }: { method: SecondaryMethod }) {
  const Icon = method.icon;
  return (
    <button
      type="button"
      onClick={method.onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/55 px-2.5 py-1 text-[11px] font-medium text-[color:var(--text-2)] backdrop-blur-md transition-colors hover:border-white hover:bg-white/85 hover:text-[color:var(--text-1)]"
    >
      <Icon size={11} strokeWidth={1.9} aria-hidden />
      {method.title}
    </button>
  );
}
