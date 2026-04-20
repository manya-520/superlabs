"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useMemo, useState } from "react";
import ReactFlow, {
  Background,
  type Edge,
  type Node,
  type NodePositionChange,
} from "reactflow";

import { ChatMessage } from "@/components/ui/ChatMessage";
import {
  flowchartNodeTypes,
  type FlowchartNodeData,
} from "@/components/ui/FlowchartNode";
import { GradientButton } from "@/components/ui/GradientButton";
import { useToast } from "@/components/ui/Toast";
import { REVIEW_FOLLOWUPS } from "@/lib/scriptedRecording";
import { ReviewProvider, useReview } from "@/lib/reviewStore";

export interface ReviewScreenProps {
  onBack: () => void;
  onSaved: () => void;
}

export function ReviewScreen(props: ReviewScreenProps) {
  return (
    <ReviewProvider>
      <ReviewScreenInner {...props} />
    </ReviewProvider>
  );
}

function ReviewScreenInner({ onBack, onSaved }: ReviewScreenProps) {
  const { toast } = useToast();
  const {
    nodes: storeNodes,
    edges: storeEdges,
    answers,
    freeText,
    setFreeText,
    answer,
    moveNode,
  } = useReview();

  const nodes: Node<FlowchartNodeData>[] = useMemo(() => {
    return storeNodes.map((n) => ({
      id: n.id,
      type: "superlabs",
      position: n.position,
      data: {
        label: n.label,
        iconId: n.iconId,
        needsYou: n.isManual,
      },
      draggable: true,
      selectable: false,
    }));
  }, [storeNodes]);

  const edges: Edge[] = useMemo(
    () =>
      storeEdges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: "smoothstep",
        style: { stroke: "rgba(133,57,255,0.5)", strokeWidth: 1.5 },
      })),
    [storeEdges],
  );

  const handleSave = () => {
    toast({
      kind: "success",
      title: "Automation saved",
      body: "Pearl will run it when you need her to.",
    });
    window.setTimeout(onSaved, 900);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-start justify-between gap-3 border-b border-white/40 bg-white/35 px-5 py-3.5">
        <div>
          <h1 className="text-[16px] font-semibold tracking-tight text-[color:var(--text-1)]">
            Here&rsquo;s what I picked up
          </h1>
          <p className="mt-0.5 text-[12px] text-[color:var(--text-2)]">
            Tell me anything to change — I&rsquo;ll adjust.
          </p>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[62%_38%]">
        <div className="relative min-h-0 border-r border-white/40">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={flowchartNodeTypes}
            fitView
            fitViewOptions={{ padding: 0.18, maxZoom: 1 }}
            proOptions={{ hideAttribution: true }}
            onNodesChange={(changes) => {
              for (const c of changes) {
                if (c.type === "position" && c.position) {
                  const pc = c as NodePositionChange;
                  if (pc.position && pc.dragging === false) {
                    moveNode(pc.id, pc.position);
                  }
                }
              }
            }}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag
            zoomOnScroll={false}
            zoomOnPinch
            zoomOnDoubleClick={false}
          >
            <Background gap={18} size={1} color="rgba(15,23,42,0.06)" />
          </ReactFlow>
        </div>

        <aside className="flex min-h-0 flex-col">
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
            <ChatMessage variant="system">
              I tagged the last step as something you&rsquo;ll do yourself —
              it submits to QuickBooks, so I&rsquo;ll line everything up and
              hand it to you.
            </ChatMessage>

            <AnimatePresence initial={false}>
              {REVIEW_FOLLOWUPS.map((q) => {
                const stored = answers[q.answerKey];
                const isAnswered = stored !== undefined;
                return (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-1.5"
                  >
                    <ChatMessage>{q.text}</ChatMessage>
                    {isAnswered ? (
                      <div className="ml-9 inline-flex w-fit items-center gap-1.5 rounded-md bg-[rgba(22,163,74,0.08)] px-2 py-1 text-[11px] font-medium text-[color:var(--success)]">
                        <Check size={12} strokeWidth={2.4} />
                        Got it
                      </div>
                    ) : (
                      <InlineAnswer
                        onAnswer={(value) => answer(q.answerKey, value)}
                        onSkip={() => answer(q.answerKey, "")}
                      />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="border-t border-white/40 bg-white/35 px-4 py-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium text-[color:var(--text-2)]">
                Want to tweak anything? Just tell me.
              </span>
              <div className="flex items-start gap-2">
                <textarea
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  placeholder="e.g., &ldquo;rename step 3 to &lsquo;update ledger&rsquo;&rdquo;"
                  rows={2}
                  className="min-h-[40px] flex-1 resize-y rounded-md border border-black/10 bg-white/90 px-2.5 py-1.5 text-[12px] text-[color:var(--text-1)] placeholder:text-[color:var(--text-3)] outline-none focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand-ring)]"
                />
                <button
                  type="button"
                  disabled={!freeText.trim()}
                  onClick={() => {
                    toast({
                      kind: "success",
                      title: "Got it",
                      body: "I&rsquo;ll take care of it.",
                    });
                    setFreeText("");
                  }}
                  className="rounded-md bg-[color:var(--brand)] px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-40 disabled:pointer-events-none hover:bg-[color:var(--brand-hover)]"
                >
                  Send
                </button>
              </div>
            </label>
          </div>
        </aside>
      </div>

      <footer className="flex items-center justify-between border-t border-white/40 bg-white/45 px-5 py-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md px-3 py-1.5 text-[12px] font-medium text-[color:var(--text-2)] hover:bg-black/5"
        >
          Back
        </button>
        <GradientButton size="lg" onClick={handleSave}>
          Save automation
        </GradientButton>
      </footer>
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
    <div className="ml-9 flex items-center gap-1.5">
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
