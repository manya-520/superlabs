export type NodeIconId =
  | "slack"
  | "download"
  | "excel"
  | "check"
  | "image"
  | "quickbooks"
  | "entry";

export interface RecordingNode {
  id: string;
  label: string;
  iconId: NodeIconId;
  position: { x: number; y: number };
  /** Delay in milliseconds from the start of the recording. */
  appearAtMs: number;
}

export interface RecordingEdge {
  id: string;
  source: string;
  target: string;
}

export interface RecordingMessage {
  id: string;
  kind: "intro" | "question" | "outro";
  text: string;
  appearAtMs: number;
  /** Optional storage key so answers can be held in local state. */
  answerKey?: string;
  /** CTA label, e.g. the Review button on the final message. */
  ctaLabel?: string;
}

export interface ReviewFollowUp {
  id: string;
  text: string;
  answerKey: string;
}

/**
 * Vertical flow positions. React Flow uses top-left origin so y increases
 * downward. x is fixed so the chain stays centered in the ~440px panel.
 */
const NODE_X = 60;
const NODE_SPACING_Y = 92;
const NODE_START_Y = 20;

function nodeY(index: number): number {
  return NODE_START_Y + index * NODE_SPACING_Y;
}

export const RECORDING_NODES: RecordingNode[] = [
  {
    id: "n1",
    label: "Open Slack",
    iconId: "slack",
    position: { x: NODE_X, y: nodeY(0) },
    appearAtMs: 0,
  },
  {
    id: "n2",
    label: "Download invoice attachment",
    iconId: "download",
    position: { x: NODE_X, y: nodeY(1) },
    appearAtMs: 3000,
  },
  {
    id: "n3",
    label: "Log in Excel",
    iconId: "excel",
    position: { x: NODE_X, y: nodeY(2) },
    appearAtMs: 6000,
  },
  {
    id: "n4",
    label: "Mark paid / unpaid",
    iconId: "check",
    position: { x: NODE_X, y: nodeY(3) },
    appearAtMs: 9000,
  },
  {
    id: "n5",
    label: "Attach image to record",
    iconId: "image",
    position: { x: NODE_X, y: nodeY(4) },
    appearAtMs: 12000,
  },
  {
    id: "n6",
    label: "Open Intuit QuickBooks",
    iconId: "quickbooks",
    position: { x: NODE_X, y: nodeY(5) },
    appearAtMs: 15000,
  },
  {
    id: "n7",
    label: "Create invoice entry",
    iconId: "entry",
    position: { x: NODE_X, y: nodeY(6) },
    appearAtMs: 18000,
  },
];

export const RECORDING_EDGES: RecordingEdge[] = RECORDING_NODES.slice(1).map(
  (node, idx) => ({
    id: `e-${RECORDING_NODES[idx].id}-${node.id}`,
    source: RECORDING_NODES[idx].id,
    target: node.id,
  }),
);

export const RECORDING_MESSAGES: RecordingMessage[] = [
  {
    id: "m1",
    kind: "intro",
    text: "I'll follow along while you show me. I'll ask a few questions as you go.",
    appearAtMs: 500,
  },
  {
    id: "m2",
    kind: "question",
    text: "Do these invoices always come from the same Slack channel?",
    appearAtMs: 4000,
    answerKey: "slack-channel",
  },
  {
    id: "m3",
    kind: "question",
    text: "Is there a specific Excel sheet I should use every time?",
    appearAtMs: 7000,
    answerKey: "excel-sheet",
  },
  {
    id: "m4",
    kind: "question",
    text: "How do you decide whether something is paid vs unpaid?",
    appearAtMs: 10000,
    answerKey: "paid-rule",
  },
  {
    id: "m5",
    kind: "question",
    text: "Are there any invoices I shouldn't auto-create in QuickBooks?",
    appearAtMs: 16000,
    answerKey: "skip-rule",
  },
  {
    id: "m6",
    kind: "outro",
    text: "Looks like you're done. Want to review what I've got?",
    appearAtMs: 19000,
    ctaLabel: "Review",
  },
];

export const REVIEW_FOLLOWUPS: ReviewFollowUp[] = [
  {
    id: "f1",
    text: "Any deadline these usually need to be paid by?",
    answerKey: "deadline",
  },
  {
    id: "f2",
    text: "Any amount threshold I should flag for your review?",
    answerKey: "threshold",
  },
];

export const MANUAL_NODE_IDS: string[] = ["n7"];

/** Total wall-clock time before the Review CTA becomes available. */
export const RECORDING_DURATION_MS = 20000;
