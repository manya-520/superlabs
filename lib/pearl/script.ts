/**
 * Phase-tagged caption script for the Pearl voice prototype.
 *
 * "Voice" in the Zoom call is purely simulated via timed caption progression.
 * Each segment carries a duration that drives the caption player's
 * setTimeout chain. Phase boundaries are explicit so the call orchestrator
 * can hook visual changes (hand-raise, share-screen toggles, summary, etc.)
 * to specific points in the script.
 *
 * Workflow context: invoice processing — chosen so the existing
 * MockQuickBooksWindow can be repurposed as the user's shared screen.
 */

export type Speaker = "pearl" | "maria";

export type Phase =
  | "intro"
  | "briefing"
  | "capture"
  | "handraise-prompt"
  | "clarifying"
  | "capture-resume"
  | "revisit-prompt"
  | "revisit-recapture"
  | "wrapup";

/** Friendly per-phase label for the small phase chip in the call chrome. */
export const PHASE_LABEL: Record<Phase, string> = {
  intro: "Pearl is introducing herself",
  briefing: "Pearl is sharing the rules",
  capture: "You're walking through it",
  "handraise-prompt": "Pearl wants to ask",
  clarifying: "Pearl is asking",
  "capture-resume": "Continuing the walk-through",
  "revisit-prompt": "Pearl asked for a redo",
  "revisit-recapture": "Re-recording that step",
  wrapup: "Wrapping up",
};

/** One-or-two-word label for the compact stepper pills. */
export const PHASE_SHORT_LABEL: Record<Phase, string> = {
  intro: "Intro",
  briefing: "Rules",
  capture: "Walk through",
  "handraise-prompt": "Pearl asks",
  clarifying: "Pearl's Q",
  "capture-resume": "Continue",
  "revisit-prompt": "Redo?",
  "revisit-recapture": "Re-record",
  wrapup: "Recap",
};

/**
 * What the user can/should do during each phase. Surfaced inline under
 * the stepper so the user is never unsure what to do next while
 * captions auto-advance.
 */
export const PHASE_HINT: Record<Phase, string> = {
  intro:
    "Pearl is saying hi. Click Next step when you're ready, or wait for her to finish.",
  briefing:
    "Skim the rules. Check the box at the bottom of Pearl's screen, then Start recording.",
  capture:
    "Talk Pearl through your workflow. Try Share screen to demo it, or click Next step when ready.",
  "handraise-prompt": "Pearl has a question — let her ask, or keep talking.",
  clarifying: "Pearl is asking a clarifying question. Your reply auto-plays.",
  "capture-resume":
    "Wrap up the walk-through. Click Next step when you've covered the last bit.",
  "revisit-prompt":
    "Pearl asked you to redo a step — pick Re-record or Skip from the prompt.",
  "revisit-recapture":
    "Re-recording that step. Click Next step when you're done.",
  wrapup:
    "Pearl is showing what she captured. Confirm or edit each step, then End call.",
};

export interface CaptionSegment {
  id: string;
  speaker: Speaker;
  text: string;
  /** How long this caption stays on screen before advancing. */
  durationMs: number;
  phase: Phase;
  /**
   * If true, this segment counts as a "captured step" in the workflow
   * summary at wrap-up. Only user-spoken segments during capture phases
   * should be marked.
   */
  capturedStep?: boolean;
  /** Short label shown in the summary panel for this captured step. */
  stepLabel?: string;
}

/* --------------------------------------------------------------------------
 * Phase 0 — Pearl's introduction
 * Full-window Pearl avatar with a brief hello before any UI shows up. This
 * sets the call's tone (one human-feeling guide, not a webinar) and gives
 * the user a moment to see who they're talking to.
 * ----------------------------------------------------------------------- */
export const INTRO_SCRIPT: CaptionSegment[] = [
  {
    id: "i1",
    speaker: "pearl",
    text: "Hi, I'm Pearl from Superlabs.",
    durationMs: 2400,
    phase: "intro",
  },
  {
    id: "i2",
    speaker: "pearl",
    text: "I'll walk through your workflow with you so I can build the automation.",
    durationMs: 3400,
    phase: "intro",
  },
  {
    id: "i3",
    speaker: "pearl",
    text: "Quick ground rules first, then we'll dive in.",
    durationMs: 2600,
    phase: "intro",
  },
];

/* --------------------------------------------------------------------------
 * Phase 1 — Pearl's pre-call briefing
 * Pearl shares the "Quick check before we start" screen and walks through
 * the dos and don'ts. One-way, no user interruption.
 * ----------------------------------------------------------------------- */
export const BRIEFING_SCRIPT: CaptionSegment[] = [
  {
    id: "b1",
    speaker: "pearl",
    text: "Keep your invoice thread open — that's exactly what I want to see.",
    durationMs: 3200,
    phase: "briefing",
  },
  {
    id: "b2",
    speaker: "pearl",
    text: "Work at your normal pace. The realistic flow is the useful one.",
    durationMs: 3400,
    phase: "briefing",
  },
  {
    id: "b3",
    speaker: "pearl",
    text: "Try to do the full thing end-to-end so I see how the steps connect.",
    durationMs: 3400,
    phase: "briefing",
  },
  {
    id: "b4",
    speaker: "pearl",
    text: "Please skip anything personal — banking tabs, passwords, account switches.",
    durationMs: 3600,
    phase: "briefing",
  },
  {
    id: "b5",
    speaker: "pearl",
    text: "Check the box when you're ready and hit Start recording.",
    durationMs: 3000,
    phase: "briefing",
  },
];

/* --------------------------------------------------------------------------
 * Phase 2 — Workflow capture
 * User talks through their invoice processing flow. Pearl listens silently
 * with a pulsing ring on her tile.
 * ----------------------------------------------------------------------- */
export const CAPTURE_SCRIPT: CaptionSegment[] = [
  {
    id: "c1",
    speaker: "maria",
    text: "Okay, so when a new invoice comes in, it usually lands in my email first.",
    durationMs: 4200,
    phase: "capture",
    capturedStep: true,
    stepLabel: "Receive invoice via email",
  },
  {
    id: "c2",
    speaker: "maria",
    text: "I'll open it up and check the vendor name and the amount against our PO log.",
    durationMs: 4400,
    phase: "capture",
    capturedStep: true,
    stepLabel: "Verify vendor + amount against PO log",
  },
  {
    id: "c3",
    speaker: "maria",
    text: "Then I head into QuickBooks and create a new bill entry.",
    durationMs: 3600,
    phase: "capture",
    capturedStep: true,
    stepLabel: "Create new bill entry in QuickBooks",
  },
  {
    id: "c4",
    speaker: "maria",
    text: "I copy the invoice number, the date, and the line items in.",
    durationMs: 3800,
    phase: "capture",
    capturedStep: true,
    stepLabel: "Copy invoice number, date, line items",
  },
];

/* --------------------------------------------------------------------------
 * Phase 3 — Pearl's hand-raise follow-up
 * After ~17s of user talking, Pearl raises her hand. User can ignore or
 * click "Let Pearl ask" to pause and let Pearl ask a clarifying question.
 * ----------------------------------------------------------------------- */
export const CLARIFYING_SCRIPT: CaptionSegment[] = [
  {
    id: "cl1",
    speaker: "pearl",
    text: "Quick one — do you change the categories before saving?",
    durationMs: 3000,
    phase: "clarifying",
  },
  {
    id: "cl2",
    speaker: "maria",
    text: "Sometimes. If the vendor's new I'll pick from the dropdown.",
    durationMs: 2800,
    phase: "clarifying",
  },
  {
    id: "cl3",
    speaker: "pearl",
    text: "Got it. Keep going.",
    durationMs: 1800,
    phase: "clarifying",
  },
];

/* --------------------------------------------------------------------------
 * Phase 2 (resumed) — Continue capture after the clarifying exchange.
 * ----------------------------------------------------------------------- */
export const CAPTURE_RESUME_SCRIPT: CaptionSegment[] = [
  {
    id: "cr1",
    speaker: "maria",
    text: "Then I save the bill and go to pay it.",
    durationMs: 2400,
    phase: "capture-resume",
    capturedStep: true,
    stepLabel: "Save bill in QuickBooks",
  },
  {
    id: "cr2",
    speaker: "maria",
    text: "Click Pay bills, select it, choose ACH.",
    durationMs: 2600,
    phase: "capture-resume",
    capturedStep: true,
    stepLabel: "Pay bill via ACH",
  },
  {
    id: "cr3",
    speaker: "maria",
    text: "Then I mark the invoice as paid and file it.",
    durationMs: 2800,
    phase: "capture-resume",
    capturedStep: true,
    stepLabel: "Mark invoice as paid + file",
  },
];

/* --------------------------------------------------------------------------
 * Phase 4 — Revisit / re-record
 * Pearl asks Maria to redo the "marking as paid" part. User clicks the
 * prominent CTA, then re-records that step via more captions.
 * ----------------------------------------------------------------------- */
export const REVISIT_PROMPT_SCRIPT: CaptionSegment[] = [
  {
    id: "rv1",
    speaker: "pearl",
    text: "Could you show me the marking-as-paid part one more time?",
    durationMs: 3200,
    phase: "revisit-prompt",
  },
];

export const REVISIT_RECAPTURE_SCRIPT: CaptionSegment[] = [
  {
    id: "rc1",
    speaker: "maria",
    text: "Right after ACH confirmation, I reopen the original bill.",
    durationMs: 2800,
    phase: "revisit-recapture",
    capturedStep: true,
    stepLabel: "Open original bill after ACH confirmation",
  },
  {
    id: "rc2",
    speaker: "maria",
    text: "Switch the status to paid and add the payment date in the memo.",
    durationMs: 3000,
    phase: "revisit-recapture",
    capturedStep: true,
    stepLabel: "Set status to paid + add payment date",
  },
  {
    id: "rc3",
    speaker: "maria",
    text: "Drag the email into the paid invoices folder.",
    durationMs: 2600,
    phase: "revisit-recapture",
    capturedStep: true,
    stepLabel: "File email into paid invoices folder",
  },
];

/* --------------------------------------------------------------------------
 * Phase 6 — Wrap-up
 * Pearl signs off, summary panel slides in.
 * ----------------------------------------------------------------------- */
export const WRAPUP_SCRIPT: CaptionSegment[] = [
  {
    id: "w1",
    speaker: "pearl",
    text: "Got what I need — here's what I captured.",
    durationMs: 2600,
    phase: "wrapup",
  },
];

/** All script segments in the order they play through the call. */
export const FULL_SCRIPT: CaptionSegment[] = [
  ...INTRO_SCRIPT,
  ...BRIEFING_SCRIPT,
  ...CAPTURE_SCRIPT,
  ...CLARIFYING_SCRIPT,
  ...CAPTURE_RESUME_SCRIPT,
  ...REVISIT_PROMPT_SCRIPT,
  ...REVISIT_RECAPTURE_SCRIPT,
  ...WRAPUP_SCRIPT,
];

/**
 * Pre-computed list of every script segment that represents a captured
 * workflow step — exported so the wrap-up recap can render the full
 * step list deterministically without having to wait for runtime
 * caption playback to fire onSegmentEnd. This way the recap is always
 * populated, whether the user listened all the way through or skipped
 * straight to it via the stepper.
 */
export const ALL_CAPTURED_STEPS: CaptionSegment[] = FULL_SCRIPT.filter(
  (s) => s.capturedStep,
);

export const SPEAKER_LABEL: Record<Speaker, string> = {
  pearl: "Pearl",
  maria: "Maria",
};
