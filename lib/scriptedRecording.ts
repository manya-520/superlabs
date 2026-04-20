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

export interface ReviewFollowUp {
  id: string;
  text: string;
  answerKey: string;
}

/**
 * Vertical flow positions (in the tucked-right recording panel).
 * React Flow uses top-left origin so y increases downward. x is fixed so the
 * chain stays centered in the narrow panel.
 */
const NODE_X = 20;
const NODE_SPACING_Y = 56;
const NODE_START_Y = 8;

function nodeY(index: number): number {
  return NODE_START_Y + index * NODE_SPACING_Y;
}

/**
 * Labels are intentionally conversational — what a person might describe
 * themselves doing, not app-speak like "Open Slack".
 */
export const RECORDING_NODES: RecordingNode[] = [
  {
    id: "n1",
    label: "Pull invoice from Slack",
    iconId: "slack",
    position: { x: NODE_X, y: nodeY(0) },
    appearAtMs: 0,
  },
  {
    id: "n2",
    label: "Save the PDF",
    iconId: "download",
    position: { x: NODE_X, y: nodeY(1) },
    appearAtMs: 2500,
  },
  {
    id: "n3",
    label: "Log it in the ledger",
    iconId: "excel",
    position: { x: NODE_X, y: nodeY(2) },
    appearAtMs: 5000,
  },
  {
    id: "n4",
    label: "Mark it unpaid",
    iconId: "check",
    position: { x: NODE_X, y: nodeY(3) },
    appearAtMs: 7500,
  },
  {
    id: "n5",
    label: "Attach the receipt",
    iconId: "image",
    position: { x: NODE_X, y: nodeY(4) },
    appearAtMs: 10000,
  },
  {
    id: "n6",
    label: "Switch to QuickBooks",
    iconId: "quickbooks",
    position: { x: NODE_X, y: nodeY(5) },
    appearAtMs: 12500,
  },
  {
    id: "n7",
    label: "Create the entry",
    iconId: "entry",
    position: { x: NODE_X, y: nodeY(6) },
    appearAtMs: 15000,
  },
];

export const RECORDING_EDGES: RecordingEdge[] = RECORDING_NODES.slice(1).map(
  (node, idx) => ({
    id: `e-${RECORDING_NODES[idx].id}-${node.id}`,
    source: RECORDING_NODES[idx].id,
    target: node.id,
  }),
);

/**
 * After recording ends, Pearl asks these to sharpen the automation. They
 * appear as a chat conversation on the Review screen — the user doesn&apos;t
 * fiddle with toggles, they just talk to Pearl.
 */
export const REVIEW_FOLLOWUPS: ReviewFollowUp[] = [
  {
    id: "f1",
    text: "Do invoices always come from the same Slack channel, or should I watch more than one?",
    answerKey: "slack-channel",
  },
  {
    id: "f2",
    text: "Is the ledger always the same sheet, or does it rotate by month?",
    answerKey: "ledger-sheet",
  },
  {
    id: "f3",
    text: "Any amount I should flag for your eyes before I enter it?",
    answerKey: "threshold",
  },
];

/**
 * Node 7 submits data to QuickBooks on Maria&rsquo;s behalf, so Pearl hands
 * it back to her. It&rsquo;s informational — not something the user toggles.
 */
export const MANUAL_NODE_IDS: string[] = ["n7"];

/** Wall-clock time before the Review CTA is shown. */
export const RECORDING_DURATION_MS = 17000;
