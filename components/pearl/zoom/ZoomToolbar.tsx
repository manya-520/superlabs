"use client";

import {
  ChevronRight,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  RotateCcw,
  Video as VideoIcon,
  VideoOff,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ZoomToolbarProps {
  micMuted: boolean;
  videoOff: boolean;
  isSharing: boolean;
  /** Show the "Re-record this part" button. Hidden during briefing/wrap-up. */
  showRerecord: boolean;
  /** Allow Share Screen — only meaningful while the user is the speaker. */
  canShare?: boolean;
  /** Show the "Skip ahead" button — gives the user agency between phases. */
  showSkip?: boolean;
  onToggleMic: () => void;
  onToggleVideo: () => void;
  onToggleShare: () => void;
  onRerecord: () => void;
  onSkip?: () => void;
  onEndCall: () => void;
}

/**
 * Bottom dark toolbar with Zoom-style icon + label buttons. The "Re-record
 * this part" button is the persistent self-correction control from Phase 5;
 * it sits between Share Screen and End Call so it's always within reach.
 */
export function ZoomToolbar({
  micMuted,
  videoOff,
  isSharing,
  showRerecord,
  canShare = true,
  showSkip = false,
  onToggleMic,
  onToggleVideo,
  onToggleShare,
  onRerecord,
  onSkip,
  onEndCall,
}: ZoomToolbarProps) {
  return (
    <div className="relative z-10 flex h-[72px] flex-none items-center justify-center gap-1 border-t border-white/5 bg-[#1a1a1d] px-3">
      <ToolbarButton
        icon={micMuted ? MicOff : Mic}
        label={micMuted ? "Unmute" : "Mute"}
        active={!micMuted}
        accent={micMuted ? "danger" : undefined}
        onClick={onToggleMic}
      />
      <ToolbarButton
        icon={videoOff ? VideoOff : VideoIcon}
        label={videoOff ? "Start Video" : "Stop Video"}
        active={!videoOff}
        accent={videoOff ? "danger" : undefined}
        onClick={onToggleVideo}
      />
      <ToolbarButton
        icon={MonitorUp}
        label={isSharing ? "Stop Share" : "Share Screen"}
        active={isSharing}
        accent={isSharing ? "brand" : undefined}
        disabled={!canShare && !isSharing}
        onClick={onToggleShare}
      />

      {showRerecord && (
        <>
          <span aria-hidden className="mx-1 h-8 w-px bg-white/10" />
          <ToolbarButton
            icon={RotateCcw}
            label="Re-record"
            accent="brand"
            onClick={onRerecord}
          />
        </>
      )}

      {showSkip && onSkip && (
        <ToolbarButton
          icon={ChevronRight}
          label="Next step"
          subtle
          onClick={onSkip}
        />
      )}

      <span aria-hidden className="mx-1 h-8 w-px bg-white/10" />

      <ToolbarButton
        icon={PhoneOff}
        label="End"
        accent="end"
        onClick={onEndCall}
      />
    </div>
  );
}

function ToolbarButton({
  icon: Icon,
  label,
  active,
  accent,
  subtle,
  disabled,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  accent?: "danger" | "brand" | "end";
  /** Lower-emphasis presentation, used for tertiary actions like Skip. */
  subtle?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  const accentClass =
    accent === "end"
      ? "bg-[#dc2626] text-white hover:bg-[#ef4444]"
      : accent === "danger"
        ? "bg-[#3a1414] text-[#ff6b6b] hover:bg-[#4a1818]"
        : accent === "brand"
          ? "bg-[rgba(133,57,255,0.18)] text-[color:var(--brand-soft)] hover:bg-[rgba(133,57,255,0.28)]"
          : subtle
            ? "text-white/55 hover:bg-white/8 hover:text-white"
            : active
              ? "bg-white/8 text-white hover:bg-white/14"
              : "text-white/85 hover:bg-white/8";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex min-w-[56px] flex-col items-center gap-1 rounded-md px-2.5 py-1.5 transition-colors disabled:pointer-events-none disabled:opacity-35 ${accentClass}`}
    >
      <Icon size={18} strokeWidth={2} />
      <span className="text-[10.5px] font-medium leading-tight">{label}</span>
    </button>
  );
}
