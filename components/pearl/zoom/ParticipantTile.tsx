"use client";

import { motion } from "framer-motion";
import { Hand, Mic, MicOff, Video as VideoIcon } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

export interface ParticipantTileProps {
  name: string;
  speaking?: boolean;
  /** Show muted mic icon. */
  muted?: boolean;
  /** Subtle pulsing ring around the tile (Pearl while listening). */
  pulsing?: boolean;
  /** Show a small Zoom-style hand-raise overlay icon top-left. */
  handRaised?: boolean;
  /**
   * Tile center content. For Pearl this is the Superlabs jellyfish mark;
   * for Maria it's a synthetic "video off" placeholder with initials.
   */
  children?: ReactNode;
  /**
   * Border accent shown when speaking — Zoom highlights the active speaker.
   * Defaults to false; the orchestrator toggles it via captions.
   */
}

/**
 * Dark rounded tile with a name strip and optional pulsing ring + hand-raise
 * overlay. Mirrors a single Zoom Gallery View participant cell.
 */
export function ParticipantTile({
  name,
  speaking,
  muted,
  pulsing,
  handRaised,
  children,
}: ParticipantTileProps) {
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-[#2a2a2c] ${
        speaking
          ? "ring-2 ring-[color:var(--brand-soft)]"
          : "ring-1 ring-white/5"
      }`}
    >
      {/* Pulsing listening ring (Pearl) */}
      {pulsing && (
        <>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl border-2 border-[color:var(--brand)]"
            initial={{ opacity: 0.45 }}
            animate={{ opacity: [0.45, 0.85, 0.45] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl border-2 border-[color:var(--brand)]"
            initial={{ opacity: 0.5, scale: 1 }}
            animate={{ opacity: [0.5, 0, 0.5], scale: [1, 1.02, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          />
        </>
      )}

      {/* Hand-raise overlay (top-left, like Zoom) */}
      {handRaised && (
        <motion.span
          initial={{ opacity: 0, scale: 0.6, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#fbbf24] text-[#1a1a1d] shadow-[0_4px_12px_rgba(251,191,36,0.4)]"
          aria-label="Hand raised"
        >
          <Hand size={12} strokeWidth={2.4} />
        </motion.span>
      )}

      {/* Tile body content */}
      <div className="relative flex h-full w-full items-center justify-center">
        {children}
      </div>

      {/* Bottom name strip — Zoom style */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/55 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
        {muted ? (
          <MicOff size={10} strokeWidth={2.2} className="text-rose-400" />
        ) : (
          <Mic size={10} strokeWidth={2.2} className="text-white/80" />
        )}
        <span className="truncate">{name}</span>
      </div>
    </div>
  );
}

/**
 * Pearl's tile body: jellyfish mark centered on a soft purple gradient.
 */
export function PearlTileBody() {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_45%,rgba(133,57,255,0.45),transparent_60%),radial-gradient(circle_at_30%_75%,rgba(142,197,252,0.25),transparent_55%),#222226]">
      <motion.div
        initial={{ scale: 0.96 }}
        animate={{ scale: [0.96, 1.02, 0.96] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-white/8 ring-1 ring-white/10 backdrop-blur-md"
      >
        <Image
          src="/superlabs-mark.svg"
          alt=""
          width={48}
          height={42}
          style={{ width: "auto", height: 42 }}
          className="opacity-95"
          priority
        />
      </motion.div>
    </div>
  );
}

/**
 * Maria's tile body: a "camera off" style placeholder with initials and a
 * faint gradient. Keeps the Zoom feel without needing an avatar image.
 */
export function MariaTileBody() {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_40%,#3c3c41,#1f1f23)]">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#5b6bff,#8e7bff)] text-[18px] font-semibold text-white shadow-[0_6px_20px_rgba(91,107,255,0.35)]"
        aria-hidden
      >
        M
      </div>
      <span className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-black/55 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-[0.06em] text-white/70">
        <VideoIcon size={9} strokeWidth={2.4} />
        cam off
      </span>
    </div>
  );
}
