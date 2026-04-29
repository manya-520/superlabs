"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Hand, Sparkles } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  ALL_CAPTURED_STEPS,
  BRIEFING_SCRIPT,
  CAPTURE_RESUME_SCRIPT,
  CAPTURE_SCRIPT,
  CLARIFYING_SCRIPT,
  INTRO_SCRIPT,
  PHASE_HINT,
  REVISIT_PROMPT_SCRIPT,
  REVISIT_RECAPTURE_SCRIPT,
  WRAPUP_SCRIPT,
  type CaptionSegment,
  type Phase,
} from "@/lib/pearl/script";
import { useCaptionPlayer } from "@/lib/pearl/useCaptionPlayer";

import { Captions } from "./Captions";
import { InlineToast } from "./InlineToast";
import {
  MariaTileBody,
  ParticipantTile,
  PearlTileBody,
} from "./ParticipantTile";
import { PhaseStepper } from "./PhaseStepper";
import { PrecallChecklist } from "./PrecallChecklist";
import { RecapShare } from "./RecapShare";
import { ZoomToolbar } from "./ZoomToolbar";

const PHASE_ORDER: Phase[] = [
  "intro",
  "briefing",
  "capture",
  "clarifying",
  "capture-resume",
  "revisit-prompt",
  "revisit-recapture",
  "wrapup",
];

export interface ZoomCallProps {
  onRecordingChange: (recording: boolean) => void;
  onSharingChange: (sharing: boolean) => void;
  onEndCall: () => void;
}

/**
 * Phase orchestrator for the Pearl voice prototype call. Owns the call's
 * state machine, drives the timed caption progression via
 * useCaptionPlayer, and renders three layouts:
 * - intro / briefing / capture / clarifying / capture-resume / revisit-* :
 *   the full Zoom layout with two tiles or a Pearl-shares-screen variant
 * - sharing (compact): a tiny Zoom-style dock pinned to the corner, with
 *   the user's actual workflow visible on the desktop behind
 * - wrapup: Pearl shares her captured-steps recap as a full-screen panel
 *
 * Phase 5 (user-initiated re-record) layers on top of phases 2-4 via the
 * persistent toolbar Re-record button. The "Skip ahead" toolbar button
 * gives the user manual agency during otherwise auto-advancing phases.
 */
export function ZoomCall({
  onRecordingChange,
  onSharingChange,
  onEndCall,
}: ZoomCallProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [briefingReady, setBriefingReady] = useState(false);
  const [recording, setRecording] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [pearlHandRaised, setPearlHandRaised] = useState(false);
  const [showHandPrompt, setShowHandPrompt] = useState(false);
  const [showRevisitCTA, setShowRevisitCTA] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [rerecordToast, setRerecordToast] = useState(false);
  const [voiceHintVisible, setVoiceHintVisible] = useState(true);

  // Auto-dismiss the voice-via-captions hint after a few seconds so it
  // doesn't linger.
  useEffect(() => {
    if (!voiceHintVisible) return;
    const t = window.setTimeout(() => setVoiceHintVisible(false), 5000);
    return () => window.clearTimeout(t);
  }, [voiceHintVisible]);

  const segments = useMemo(() => {
    switch (phase) {
      case "intro":
        return INTRO_SCRIPT;
      case "briefing":
        return BRIEFING_SCRIPT;
      case "capture":
        return CAPTURE_SCRIPT;
      case "handraise-prompt":
        return [];
      case "clarifying":
        return CLARIFYING_SCRIPT;
      case "capture-resume":
        return CAPTURE_RESUME_SCRIPT;
      case "revisit-prompt":
        return REVISIT_PROMPT_SCRIPT;
      case "revisit-recapture":
        return REVISIT_RECAPTURE_SCRIPT;
      case "wrapup":
        return WRAPUP_SCRIPT;
      default:
        return [];
    }
  }, [phase]);

  const handledHandRaiseRef = useRef(false);
  useEffect(() => {
    handledHandRaiseRef.current = false;
  }, [phase]);

  const handleSegmentEnd = useCallback(
    (segment: CaptionSegment) => {
      if (
        phase === "capture" &&
        segment.id === "c3" &&
        !handledHandRaiseRef.current
      ) {
        handledHandRaiseRef.current = true;
        setPearlHandRaised(true);
        setShowHandPrompt(true);
      }
    },
    [phase],
  );

  const handlePhaseComplete = useCallback(() => {
    switch (phase) {
      case "intro":
        setPhase("briefing");
        break;
      case "briefing":
        // User must check the box to advance.
        break;
      case "capture":
        if (pearlHandRaised) {
          setPhase("clarifying");
        } else {
          setPhase("capture-resume");
        }
        break;
      case "clarifying":
        setPearlHandRaised(false);
        setShowHandPrompt(false);
        // Returning from Pearl's clarifying question is the natural
        // moment to drop screen-share so Steps 5-7 play in the full
        // two-tile layout. Without this the call stays compact through
        // the entire back half and feels stuck.
        setIsSharing(false);
        setPhase("capture-resume");
        break;
      case "capture-resume":
        setPhase("revisit-prompt");
        break;
      case "revisit-prompt":
        setShowRevisitCTA(true);
        break;
      case "revisit-recapture":
        setShowRevisitCTA(false);
        setIsSharing(false);
        setPhase("wrapup");
        break;
      case "wrapup":
        setShowSummary(true);
        break;
      default:
        break;
    }
  }, [phase, pearlHandRaised]);

  const [playerState, playerControls] = useCaptionPlayer({
    segments,
    autoStart: true,
    onComplete: handlePhaseComplete,
    onSegmentEnd: handleSegmentEnd,
  });

  useEffect(() => {
    onRecordingChange(recording);
  }, [recording, onRecordingChange]);

  useEffect(() => {
    onSharingChange(isSharing);
  }, [isSharing, onSharingChange]);

  /* ---------- Auto-play wiring ----------------------------------------
   * The prototype is a sit-back-and-watch demo. Every "gate" that
   * would normally need a click — checking the briefing box, starting
   * the recording, toggling Share Screen, accepting Pearl's
   * hand-raise, choosing Re-record on the revisit prompt —
   * auto-resolves on a timer if the user doesn't click first. The
   * user can still take over manually at any time; each effect tears
   * its timer down on cleanup so phase jumps don't fire stale state.
   * ----------------------------------------------------------------- */

  // Briefing → auto-check + auto-start once briefing captions finish.
  useEffect(() => {
    if (phase !== "briefing") return;
    if (!playerState.isComplete) return;
    const t1 = window.setTimeout(() => {
      setBriefingReady(true);
    }, 700);
    const t2 = window.setTimeout(() => {
      setRecording(true);
      setPhase("capture");
    }, 2000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [phase, playerState.isComplete]);

  // Capture → auto-trigger Share Screen ~3.5s in so the user always
  // sees the "minimize-to-corner + workflow visible on desktop" moment.
  useEffect(() => {
    if (phase !== "capture") return;
    if (isSharing) return;
    const t = window.setTimeout(() => setIsSharing(true), 3500);
    return () => window.clearTimeout(t);
  }, [phase, isSharing]);

  // Hand-raise → auto-resolve to "Let Pearl ask" after 1.6s so the
  // call deterministically reaches clarifying.
  useEffect(() => {
    if (!showHandPrompt) return;
    const t = window.setTimeout(() => {
      setShowHandPrompt(false);
      setPhase("clarifying");
    }, 1600);
    return () => window.clearTimeout(t);
  }, [showHandPrompt]);

  // Revisit prompt → auto-pick Re-record so the user sees Phase 4
  // without having to click.
  useEffect(() => {
    if (!showRevisitCTA) return;
    const t = window.setTimeout(() => {
      setShowRevisitCTA(false);
      setPhase("revisit-recapture");
    }, 1500);
    return () => window.clearTimeout(t);
  }, [showRevisitCTA]);


  /* ---------- Handlers ---------- */

  const handleStartRecording = () => {
    setRecording(true);
    setPhase("capture");
  };

  const handleLetPearlAsk = () => {
    setShowHandPrompt(false);
    setPhase("clarifying");
  };

  const handleRevisitClick = () => {
    setShowRevisitCTA(false);
    setPhase("revisit-recapture");
  };

  const handleRevisitSkip = () => {
    setShowRevisitCTA(false);
    setPhase("wrapup");
  };

  const handleToolbarRerecord = () => {
    playerControls.dropLast();
    setRerecordToast(true);
    window.setTimeout(() => setRerecordToast(false), 1600);
  };

  const handleToggleShare = () => {
    setIsSharing((s) => !s);
  };

  /**
   * Skip-ahead: jumps the call to the next phase. Gives the user agency
   * if they're tired of waiting for captions to play through. Also
   * useful for reviewers who want to see all phases quickly.
   */
  const handleSkipAhead = () => {
    handlePhaseComplete();
  };

  /**
   * Direct jump to any phase via the stepper. Resets transient overlays
   * and aligns the recording flag with the target phase so the chrome's
   * REC indicator stays correct. Captured steps are preserved on
   * forward jumps; on backward jumps to capture phases we keep them too
   * (the user can re-record individual ones if they want).
   */
  const goToPhase = (target: Phase) => {
    if (target === phase) return;
    setShowHandPrompt(false);
    setShowRevisitCTA(false);
    setShowSummary(false);
    setIsSharing(false);
    if (target === "intro" || target === "briefing") {
      setRecording(false);
      if (target === "briefing") setBriefingReady(false);
    } else {
      setRecording(true);
    }
    if (target === "clarifying") {
      setPearlHandRaised(true);
    }
    if (target === "wrapup") {
      // Skipping straight to wrap-up means show summary as soon as the
      // wrapup captions finish; mirrors the natural flow.
      setPearlHandRaised(false);
    }
    setPhase(target);
  };

  /* ---------- Derived view state ---------- */

  const showToolbarRerecord =
    phase === "capture" ||
    phase === "clarifying" ||
    phase === "capture-resume" ||
    phase === "revisit-recapture";

  const showSkipAhead =
    phase !== "briefing" && // briefing requires user to check the box
    !showSummary;

  const isPearlSharing = phase === "briefing";
  const summaryVisible = showSummary;
  const isCompact = isSharing && !summaryVisible;

  const canShare =
    phase === "capture" ||
    phase === "clarifying" ||
    phase === "capture-resume" ||
    phase === "revisit-recapture";

  /* ---------- Compact (sharing) layout -------------------------------- */
  if (isCompact) {
    return (
      <div className="relative flex h-full w-full flex-col bg-[#1c1c1e] text-white">
        <div className="relative flex min-h-0 flex-1 flex-col gap-2 p-2.5">
          <PhaseStepper
            order={PHASE_ORDER}
            current={phase}
            onJump={goToPhase}
          />

          <div className="relative h-[140px] flex-none overflow-hidden rounded-lg">
            <ParticipantTile
              name="Pearl"
              speaking={isPearlSpeaking(playerState.current)}
              pulsing
              handRaised={pearlHandRaised}
            >
              <PearlTileBody />
            </ParticipantTile>
          </div>

          <CompactCaption current={playerState.current} />

          <AnimatePresence>
            {showHandPrompt && (
              <motion.button
                key="hand-prompt-compact"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                onClick={handleLetPearlAsk}
                type="button"
                className="flex items-center gap-2 rounded-md border border-[#fbbf24]/40 bg-[#241d0e] px-2.5 py-1.5 text-left text-[11px] font-medium text-white transition-colors hover:bg-[#2c2310]"
              >
                <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#fbbf24] text-[#1a1a1d]">
                  <Hand size={11} strokeWidth={2.4} />
                </span>
                <span>Pearl wants to ask · tap to let her</span>
              </motion.button>
            )}
          </AnimatePresence>

          <InlineToast
            visible={rerecordToast}
            message="Re-recording the last step…"
          />
        </div>

        <CompactToolbar
          micMuted={micMuted}
          showRerecord={showToolbarRerecord}
          showSkip={showSkipAhead}
          onToggleMic={() => setMicMuted((m) => !m)}
          onStopShare={handleToggleShare}
          onRerecord={handleToolbarRerecord}
          onSkip={handleSkipAhead}
          onEndCall={onEndCall}
        />
      </div>
    );
  }

  /* ---------- Full layout --------------------------------------------- */
  return (
    <div className="relative flex h-full w-full flex-col bg-[#1c1c1e]">
      <div className="relative flex min-h-0 flex-1">
        <div className="relative flex min-h-0 flex-1 flex-col gap-2 p-4">
          {/* Always-visible stepper + hint so the user always knows where
              they are, what to do next, and how to skip around. */}
          <PhaseStepper
            order={PHASE_ORDER}
            current={phase}
            onJump={goToPhase}
          />
          <p className="px-1 text-[11px] leading-snug text-white/55">
            <span className="font-medium text-white/75">Next:</span>{" "}
            {PHASE_HINT[phase]}
          </p>

          {summaryVisible ? (
            // Phase 6 — Pearl shares her recap as a full-screen layout
            <SharedScreenLayout
              isPearlSharing
              shareLabel="Pearl is sharing her recap"
              speakerTile={
                <ParticipantTile name="Pearl" speaking pulsing={false}>
                  <RecapShare
                    steps={ALL_CAPTURED_STEPS}
                    onEndCall={onEndCall}
                  />
                </ParticipantTile>
              }
              thumbnail={
                <ParticipantTile name="Maria" muted={micMuted}>
                  <MariaTileBody />
                </ParticipantTile>
              }
            />
          ) : phase === "intro" ? (
            <PearlIntroLayout />
          ) : isPearlSharing ? (
            <SharedScreenLayout
              isPearlSharing
              shareLabel="Pearl is sharing her screen"
              speakerTile={
                <ParticipantTile name="Pearl" speaking pulsing={false}>
                  <PrecallChecklist
                    ready={briefingReady}
                    onReadyChange={setBriefingReady}
                    onStart={handleStartRecording}
                  />
                </ParticipantTile>
              }
              thumbnail={
                <ParticipantTile name="Maria" muted={micMuted}>
                  <MariaTileBody />
                </ParticipantTile>
              }
            />
          ) : (
            <div className="grid min-h-0 flex-1 grid-cols-2 gap-3">
              <ParticipantTile
                name="Maria"
                speaking={isMariaSpeaking(playerState.current)}
                muted={micMuted}
              >
                <MariaTileBody />
              </ParticipantTile>
              <ParticipantTile
                name="Pearl"
                speaking={isPearlSpeaking(playerState.current)}
                pulsing={
                  phase === "capture" ||
                  phase === "capture-resume" ||
                  phase === "revisit-recapture"
                }
                handRaised={pearlHandRaised}
              >
                <PearlTileBody />
              </ParticipantTile>
            </div>
          )}

          {!summaryVisible && <Captions current={playerState.current} />}

          {/* "Voice is via captions" hint — shows briefly at the start */}
          <AnimatePresence>
            {voiceHintVisible && (
              <motion.div
                key="voice-hint"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-md bg-black/55 px-2 py-1 text-[10.5px] font-medium text-white/80 backdrop-blur-md"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-soft)]"
                  aria-hidden
                />
                Prototype: voice plays as captions below
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showHandPrompt && (
              <motion.div
                key="hand-prompt"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="absolute right-4 top-12 z-10 flex items-center gap-2.5 rounded-lg border border-[#fbbf24]/40 bg-[#241d0e] px-3 py-2 shadow-[0_10px_24px_rgba(0,0,0,0.4)]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fbbf24] text-[#1a1a1d]">
                  <Hand size={13} strokeWidth={2.4} />
                </span>
                <div>
                  <div className="text-[12px] font-semibold text-white">
                    Pearl has a question
                  </div>
                  <div className="text-[10.5px] text-white/55">
                    Keep talking, or pause to hear her out.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLetPearlAsk}
                  className="ml-2 inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-white/18"
                >
                  Let Pearl ask
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showRevisitCTA && (
              <motion.div
                key="revisit-cta"
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
                className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 rounded-2xl border border-[color:var(--brand-soft)]/40 bg-[#1f1729] px-6 py-5 shadow-[0_18px_40px_rgba(0,0,0,0.5)]"
              >
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(133,57,255,0.18)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[color:var(--brand-soft)]">
                  <Sparkles size={10} strokeWidth={2.4} />
                  Pearl asked
                </span>
                <p className="max-w-[320px] text-center text-[12.5px] leading-snug text-white/80">
                  Want to redo &ldquo;marking the invoice as paid&rdquo; so I
                  catch the click order?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRevisitSkip}
                    className="inline-flex h-8 items-center rounded-md border border-white/12 bg-white/5 px-3 text-[12px] font-medium text-white/80 transition-colors hover:bg-white/10"
                  >
                    Skip
                  </button>
                  <button
                    type="button"
                    onClick={handleRevisitClick}
                    className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[linear-gradient(135deg,#8539FF,#B57FFF)] px-3 text-[12px] font-semibold text-white shadow-[0_4px_14px_rgba(133,57,255,0.32)] transition-shadow hover:shadow-[0_6px_18px_rgba(133,57,255,0.42)]"
                  >
                    Re-record this part
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <InlineToast
            visible={rerecordToast}
            message="Re-recording the last step…"
          />
        </div>
      </div>

      {/* Toolbar is hidden during the wrap-up recap — RecapShare has its
          own End call button so there's only ever one. */}
      {!summaryVisible && (
        <ZoomToolbar
          micMuted={micMuted}
          videoOff={videoOff}
          isSharing={isSharing}
          canShare={canShare}
          showRerecord={showToolbarRerecord}
          showSkip={showSkipAhead}
          onToggleMic={() => setMicMuted((m) => !m)}
          onToggleVideo={() => setVideoOff((v) => !v)}
          onToggleShare={handleToggleShare}
          onRerecord={handleToolbarRerecord}
          onSkip={handleSkipAhead}
          onEndCall={onEndCall}
        />
      )}
    </div>
  );
}

/* ---------- Helpers ---------- */

function isPearlSpeaking(current: CaptionSegment | null): boolean {
  return !!current && current.speaker === "pearl";
}

function isMariaSpeaking(current: CaptionSegment | null): boolean {
  return !!current && current.speaker === "maria";
}

function PearlIntroLayout() {
  return (
    <div
      className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl"
      style={{
        background:
          "radial-gradient(circle at 50% 40%, rgba(133,57,255,0.55), transparent 60%), radial-gradient(circle at 30% 80%, rgba(142,197,252,0.3), transparent 55%), #1f1f23",
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative"
        >
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: [0.6, 0.95, 0.6], scale: [1, 1.06, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              boxShadow:
                "0 0 0 8px rgba(133,57,255,0.18), 0 0 0 24px rgba(133,57,255,0.08)",
            }}
          />
          <span className="relative flex h-[140px] w-[140px] items-center justify-center rounded-full bg-white/8 ring-1 ring-white/15 backdrop-blur-md">
            <Image
              src="/superlabs-mark.svg"
              alt="Pearl"
              width={84}
              height={72}
              style={{ width: "auto", height: 72 }}
              priority
            />
          </span>
        </motion.div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[20px] font-semibold tracking-tight text-white">
            Pearl
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-2.5 py-0.5 text-[10.5px] font-medium uppercase tracking-[0.08em] text-white/70">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-soft)]"
              aria-hidden
            />
            from Superlabs
          </span>
        </div>
      </div>
    </div>
  );
}

function SharedScreenLayout({
  speakerTile,
  thumbnail,
  isPearlSharing,
  shareLabel,
}: {
  speakerTile: React.ReactNode;
  thumbnail: React.ReactNode;
  isPearlSharing?: boolean;
  shareLabel?: string;
}) {
  return (
    <div className="relative flex min-h-0 flex-1 overflow-hidden rounded-xl">
      <div className="relative h-full w-full">{speakerTile}</div>
      <div className="absolute right-3 top-3 z-10 h-[110px] w-[160px] overflow-hidden rounded-lg shadow-[0_8px_22px_rgba(0,0,0,0.4)]">
        {thumbnail}
      </div>
      {isPearlSharing && shareLabel && (
        <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-md bg-black/60 px-2 py-1 text-[10px] font-medium text-white/85 backdrop-blur-sm">
          {shareLabel}
        </div>
      )}
    </div>
  );
}

function CompactCaption({ current }: { current: CaptionSegment | null }) {
  return (
    <div className="flex min-h-0 flex-1 items-end">
      <AnimatePresence mode="wait">
        {current ? (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full rounded-md bg-black/55 px-2.5 py-2 text-[11.5px] leading-snug text-white"
          >
            <div className="mb-0.5 flex items-center gap-1 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-white/55">
              <span
                className={`h-1 w-1 rounded-full ${
                  current.speaker === "pearl"
                    ? "bg-[color:var(--brand-soft)]"
                    : "bg-emerald-400"
                }`}
                aria-hidden
              />
              {current.speaker === "pearl" ? "Pearl" : "Maria"}
            </div>
            {current.text}
          </motion.div>
        ) : (
          <div className="w-full rounded-md bg-white/5 px-2.5 py-2 text-[11px] text-white/45">
            Listening…
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CompactToolbar({
  micMuted,
  showRerecord,
  showSkip,
  onToggleMic,
  onStopShare,
  onRerecord,
  onSkip,
  onEndCall,
}: {
  micMuted: boolean;
  showRerecord: boolean;
  showSkip: boolean;
  onToggleMic: () => void;
  onStopShare: () => void;
  onRerecord: () => void;
  onSkip: () => void;
  onEndCall: () => void;
}) {
  return (
    <div className="flex h-12 flex-none items-center justify-between gap-1 border-t border-white/5 bg-[#17171a] px-2">
      <button
        type="button"
        onClick={onToggleMic}
        className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
          micMuted
            ? "bg-[#3a1414] text-[#ff6b6b]"
            : "text-white/85 hover:bg-white/8"
        }`}
        aria-label={micMuted ? "Unmute" : "Mute"}
      >
        <MicGlyph muted={micMuted} />
      </button>

      <button
        type="button"
        onClick={onStopShare}
        className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[rgba(133,57,255,0.18)] px-2.5 text-[10.5px] font-semibold text-[color:var(--brand-soft)] transition-colors hover:bg-[rgba(133,57,255,0.28)]"
      >
        Stop sharing
      </button>

      {showRerecord && (
        <button
          type="button"
          onClick={onRerecord}
          className="flex h-8 items-center gap-1 rounded-md px-2 text-[10.5px] font-medium text-white/85 transition-colors hover:bg-white/8"
          aria-label="Re-record last step"
        >
          <RerecordGlyph />
          Re-do
        </button>
      )}

      {showSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="flex h-8 items-center gap-1 rounded-md px-2 text-[10.5px] font-medium text-white/65 transition-colors hover:bg-white/8 hover:text-white"
          aria-label="Advance to next phase"
        >
          Next ›
        </button>
      )}

      <button
        type="button"
        onClick={onEndCall}
        className="flex h-8 w-8 items-center justify-center rounded-md bg-[#dc2626] text-white transition-colors hover:bg-[#ef4444]"
        aria-label="End call"
      >
        <PhoneOffGlyph />
      </button>
    </div>
  );
}

/* Inline glyphs for the compact toolbar. */
function MicGlyph({ muted }: { muted: boolean }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 11a7 7 0 0 1-14 0M12 18v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {muted && (
        <path
          d="M4 4l16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function RerecordGlyph() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneOffGlyph() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M10.7 14.7a16 16 0 0 0 4.6 3.2l2.7-1.7a1.6 1.6 0 0 1 1.7-.1l3 1.7c.6.4 1 1.2.7 2L22.4 22A2 2 0 0 1 20 23.7C10.5 22.6 1.4 13.5.3 4A2 2 0 0 1 2 1.6l2.2-1A1.6 1.6 0 0 1 6 1.3l1.7 3a1.6 1.6 0 0 1-.1 1.7l-1.7 2.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 3l18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
