"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Hand,
  Send,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { GradientButton } from "@/components/ui/GradientButton";
import { NODE_ICON_MAP } from "@/components/ui/nodeIcons";
import { useToast } from "@/components/ui/Toast";
import {
  REVIEW_FOLLOWUPS,
  STEP_DETAILS,
  type ReviewFollowUp,
} from "@/lib/scriptedRecording";
import { ReviewProvider, useReview } from "@/lib/reviewStore";

export interface ReviewScreenProps {
  onBack: () => void;
  onContinue: () => void;
}

export function ReviewScreen(props: ReviewScreenProps) {
  return (
    <ReviewProvider>
      <ReviewScreenInner {...props} />
    </ReviewProvider>
  );
}

/**
 * Pearl ties each built-in follow-up question to the specific step it
 * relates to, so the chat only shows relevant prompts when the user is
 * inspecting that step.
 */
const STEP_FOLLOWUPS: Record<string, ReviewFollowUp | undefined> = {
  n1: REVIEW_FOLLOWUPS[0],
  n3: REVIEW_FOLLOWUPS[1],
  n7: REVIEW_FOLLOWUPS[2],
};

function ReviewScreenInner({ onBack, onContinue }: ReviewScreenProps) {
  const { toast } = useToast();
  const { nodes: storeNodes, answers, answer } = useReview();

  const [selectedId, setSelectedId] = useState<string>(
    storeNodes[0]?.id ?? "",
  );
  const [messagesByStep, setMessagesByStep] = useState<
    Record<string, string[]>
  >({});
  const [freeText, setFreeText] = useState("");

  const selectedNode = useMemo(
    () => storeNodes.find((n) => n.id === selectedId),
    [storeNodes, selectedId],
  );
  const selectedDetail = selectedId ? STEP_DETAILS[selectedId] : undefined;
  const selectedIndex = storeNodes.findIndex((n) => n.id === selectedId);
  const selectedFollowUp = selectedId ? STEP_FOLLOWUPS[selectedId] : undefined;
  const stepMessages = selectedId ? (messagesByStep[selectedId] ?? []) : [];

  const handleSend = () => {
    if (!freeText.trim() || !selectedId) return;
    const msg = freeText.trim();
    setMessagesByStep((m) => ({
      ...m,
      [selectedId]: [...(m[selectedId] ?? []), msg],
    }));
    setFreeText("");
    toast({
      kind: "success",
      title: `Step ${selectedIndex + 1} updated`,
      body: "Pearl adjusted this step.",
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center justify-between gap-3 border-b border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.75),rgba(255,255,255,0.45))] px-5 py-3.5 backdrop-blur-xl">
        <div>
          <h1 className="text-[16px] font-semibold tracking-tight text-[color:var(--text-1)]">
            Here&rsquo;s what I picked up
          </h1>
          <p className="mt-0.5 text-[12px] text-[color:var(--text-2)]">
            Tap a step on the right to open it. Tell me anything — I&rsquo;ll
            tweak just that step.
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-white/70 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-[color:var(--text-2)]">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand)]"
            aria-hidden
          />
          {storeNodes.length} steps learned
        </span>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_280px]">
        {/* LEFT — Pearl chat, scoped to selected step */}
        <div className="flex min-h-0 flex-col">
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
            <AnimatePresence mode="wait" initial={false}>
              {selectedNode && selectedDetail ? (
                <motion.div
                  key={selectedId}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-3"
                >
                  <SelectedStepPill
                    index={selectedIndex + 1}
                    label={selectedNode.label}
                    handler={selectedDetail.handler}
                  />

                  <PearlMessage>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: selectedDetail.summary,
                      }}
                    />
                  </PearlMessage>

                  {selectedDetail.handler === "you" && (
                    <PearlMessage>
                      Heads up — this is the one I&rsquo;ll hand back to you.
                      I&rsquo;ll line everything up, you click Save.
                    </PearlMessage>
                  )}

                  {selectedFollowUp &&
                    (() => {
                      const stored = answers[selectedFollowUp.answerKey];
                      const isAnswered = stored !== undefined;
                      return (
                        <div className="flex flex-col gap-1.5">
                          <PearlMessage>{selectedFollowUp.text}</PearlMessage>
                          {isAnswered ? (
                            <UserReply
                              text={stored || "(skipped)"}
                              muted={!stored}
                            />
                          ) : (
                            <InlineAnswer
                              onAnswer={(value) =>
                                answer(selectedFollowUp.answerKey, value)
                              }
                              onSkip={() =>
                                answer(selectedFollowUp.answerKey, "")
                              }
                            />
                          )}
                        </div>
                      );
                    })()}

                  {stepMessages.map((m, i) => (
                    <motion.div
                      key={`m-${selectedId}-${i}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-1.5"
                    >
                      <UserReply text={m} />
                      <PearlMessage>
                        Got it. I updated this step — take a peek on the right.
                      </PearlMessage>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-1 items-center justify-center"
                >
                  <div className="max-w-[260px] rounded-2xl border border-dashed border-white/70 bg-white/40 p-4 text-center text-[12px] text-[color:var(--text-3)]">
                    Tap any step on the right to walk through it with me.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-white/50 bg-white/50 px-5 py-3 backdrop-blur-xl">
            <div className="flex items-end gap-2 rounded-xl border border-white/70 bg-white/90 px-3 py-2 shadow-[0_2px_8px_rgba(15,23,42,0.05)] focus-within:border-[color:var(--brand-border)] focus-within:ring-2 focus-within:ring-[color:var(--brand-ring)]">
              <Sparkles
                size={14}
                strokeWidth={1.9}
                className="mb-1 flex-none text-[color:var(--brand)]"
                aria-hidden
              />
              <textarea
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={
                  selectedNode
                    ? `Tell Pearl about step ${selectedIndex + 1} — ${selectedNode.label.toLowerCase()}…`
                    : "Pick a step on the right first"
                }
                rows={1}
                disabled={!selectedNode}
                className="min-h-[24px] max-h-[80px] flex-1 resize-none bg-transparent text-[12.5px] text-[color:var(--text-1)] placeholder:text-[color:var(--text-3)] outline-none disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!freeText.trim() || !selectedNode}
                aria-label="Send"
                className="mb-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-[color:var(--brand)] text-white transition-opacity disabled:opacity-40 disabled:pointer-events-none hover:bg-[color:var(--brand-hover)]"
              >
                <Send size={12} strokeWidth={2.2} />
              </button>
            </div>
            {selectedNode && (
              <p className="mt-1.5 text-[10.5px] text-[color:var(--text-3)]">
                Anything you send here only changes{" "}
                <span className="font-medium text-[color:var(--text-2)]">
                  step {selectedIndex + 1}
                </span>
                .
              </p>
            )}
          </div>
        </div>

        {/* RIGHT — numbered flow with inline-expanding details */}
        <aside className="flex min-h-0 flex-col overflow-y-auto border-l border-white/40 bg-white/30 px-4 py-4">
          <div className="mb-2 flex items-center justify-between text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[color:var(--text-3)]">
            <span>Your flow</span>
            <span className="text-[9.5px] normal-case tracking-normal text-[color:var(--text-3)]/80">
              {storeNodes.length} steps
            </span>
          </div>
          <ol className="relative flex flex-col gap-1.5">
            {storeNodes.map((n, idx) => (
              <StepRow
                key={n.id}
                index={idx + 1}
                node={n}
                expanded={selectedId === n.id}
                onToggle={() => setSelectedId(n.id)}
                isLast={idx === storeNodes.length - 1}
              />
            ))}
          </ol>
        </aside>
      </div>

      <footer className="flex items-center justify-between border-t border-white/45 bg-white/55 px-5 py-3 backdrop-blur-xl">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md px-3 py-1.5 text-[12px] font-medium text-[color:var(--text-2)] hover:bg-black/5"
        >
          Back
        </button>
        <GradientButton size="lg" onClick={onContinue}>
          Looks good — continue
          <ArrowRight size={14} strokeWidth={2.2} />
        </GradientButton>
      </footer>
    </div>
  );
}

/* --------------- Step row (right column) --------------- */

function StepRow({
  index,
  node,
  expanded,
  onToggle,
  isLast,
}: {
  index: number;
  node: { id: string; label: string; iconId: keyof typeof NODE_ICON_MAP };
  expanded: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  const detail = STEP_DETAILS[node.id];
  const isYou = detail?.handler === "you";
  const Icon = NODE_ICON_MAP[node.iconId];

  return (
    <li className="relative">
      {!isLast && (
        <span
          aria-hidden
          className="absolute left-[15px] top-[36px] h-[calc(100%-4px)] w-px bg-gradient-to-b from-[rgba(133,57,255,0.4)] via-[rgba(133,57,255,0.2)] to-transparent"
        />
      )}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className={[
          "flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition-all",
          expanded
            ? "border-[color:var(--brand-border)] bg-white shadow-[0_4px_14px_rgba(133,57,255,0.15)]"
            : "border-transparent bg-white/55 hover:border-white hover:bg-white/80",
        ].join(" ")}
      >
        <span
          className={[
            "flex h-7 w-7 flex-none items-center justify-center rounded-full text-[11px] font-semibold",
            expanded
              ? "bg-[color:var(--brand)] text-white shadow-[0_2px_6px_rgba(133,57,255,0.35)]"
              : isYou
                ? "bg-amber-100 text-amber-700"
                : "bg-white text-[color:var(--text-2)] shadow-[0_1px_3px_rgba(15,23,42,0.08)]",
          ].join(" ")}
        >
          {index}
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="flex items-center gap-1.5">
            <Icon
              size={12}
              strokeWidth={1.9}
              className="flex-none text-[color:var(--brand)]"
              aria-hidden
            />
            <span className="truncate text-[12.5px] font-medium text-[color:var(--text-1)]">
              {node.label}
            </span>
          </span>
          {isYou && (
            <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full border border-amber-300/60 bg-amber-50 px-1.5 py-[1px] text-[9.5px] font-semibold text-amber-700">
              <Hand size={8} strokeWidth={2.4} />
              You finish this
            </span>
          )}
        </span>
        <ChevronDown
          size={13}
          strokeWidth={2.2}
          className={[
            "flex-none text-[color:var(--text-3)] transition-transform",
            expanded ? "rotate-180 text-[color:var(--brand)]" : "",
          ].join(" ")}
          aria-hidden
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && detail && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="ml-[22px] mt-2 flex flex-col gap-2 rounded-xl border border-white/70 bg-white/85 p-3 shadow-[0_3px_10px_rgba(15,23,42,0.06)] backdrop-blur-xl">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.06em] text-[color:var(--text-3)]">
                {isYou ? (
                  <>
                    <Hand size={9} strokeWidth={2.4} className="text-amber-600" />
                    Hand-off to you
                  </>
                ) : (
                  <>
                    <Check
                      size={9}
                      strokeWidth={2.4}
                      className="text-emerald-500"
                    />
                    Pearl handles it
                  </>
                )}
              </div>

              <dl className="flex flex-col gap-1.5 rounded-lg bg-black/[0.02] p-2">
                <div className="flex flex-col gap-0.5">
                  <dt className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text-3)]">
                    When
                  </dt>
                  <dd className="text-[11.5px] leading-snug text-[color:var(--text-1)]">
                    {detail.when}
                  </dd>
                </div>
                <div className="flex flex-col gap-0.5">
                  <dt className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text-3)]">
                    What happens
                  </dt>
                  <dd className="text-[11.5px] leading-snug text-[color:var(--text-1)]">
                    {detail.what}
                  </dd>
                </div>
              </dl>

              <p className="text-[10.5px] italic text-[color:var(--text-3)]">
                Want it different? Tell Pearl in the chat.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/* --------------- Chat primitives --------------- */

function SelectedStepPill({
  index,
  label,
  handler,
}: {
  index: number;
  label: string;
  handler?: "pearl" | "you";
}) {
  const isYou = handler === "you";
  return (
    <div className="flex items-center gap-2 self-start rounded-full border border-white/70 bg-white/70 px-2.5 py-1 text-[11px] font-medium text-[color:var(--text-2)] backdrop-blur-xl">
      <span
        className={[
          "flex h-5 w-5 flex-none items-center justify-center rounded-full text-[10px] font-semibold",
          isYou
            ? "bg-amber-100 text-amber-700"
            : "bg-[color:var(--brand)] text-white",
        ].join(" ")}
      >
        {index}
      </span>
      <span className="truncate text-[color:var(--text-1)]">{label}</span>
    </div>
  );
}

function PearlMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span
        className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-white shadow-[0_1px_3px_rgba(15,23,42,0.1)] border border-white/80"
        aria-hidden
      >
        <Image
          src="/superlabs-mark.svg"
          alt=""
          width={14}
          height={12}
          style={{ width: "auto", height: 10 }}
        />
      </span>
      <div className="max-w-[88%] rounded-2xl rounded-tl-md border border-white/70 bg-white/85 px-3 py-2 text-[12.5px] leading-relaxed text-[color:var(--text-1)] shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        {children}
      </div>
    </div>
  );
}

function UserReply({ text, muted }: { text: string; muted?: boolean }) {
  return (
    <div className="ml-8 flex justify-end">
      <div
        className={[
          "max-w-[82%] rounded-2xl rounded-tr-md px-3 py-1.5 text-[12px] shadow-[0_2px_8px_rgba(133,57,255,0.16)]",
          muted
            ? "border border-white/70 bg-white/70 italic text-[color:var(--text-3)]"
            : "bg-[color:var(--brand)] text-white",
        ].join(" ")}
      >
        {text}
      </div>
    </div>
  );
}

function InlineAnswer({
  onAnswer,
  onSkip,
}: {
  onAnswer: (value: string) => void;
  onSkip: () => void;
}) {
  const [value, setValue] = useState("");
  return (
    <div className="ml-8 flex items-center gap-1.5">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim()) onAnswer(value.trim());
        }}
        placeholder="Type a quick answer…"
        className="h-8 flex-1 rounded-md border border-black/10 bg-white/90 px-2.5 text-[12px] text-[color:var(--text-1)] placeholder:text-[color:var(--text-3)] outline-none focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand-ring)]"
      />
      <button
        type="button"
        onClick={onSkip}
        className="rounded-md px-2 py-1 text-[11px] font-medium text-[color:var(--text-2)] hover:bg-black/5"
      >
        Skip
      </button>
      <button
        type="button"
        disabled={!value.trim()}
        onClick={() => onAnswer(value.trim())}
        className="rounded-md bg-[color:var(--brand)] px-2.5 py-1 text-[11px] font-semibold text-white disabled:opacity-40 disabled:pointer-events-none"
      >
        Send
      </button>
    </div>
  );
}
