"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
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
import { NodeEditPanel } from "@/components/ui/NodeEditPanel";
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
    rename,
    toggleManual,
    deleteNode,
    moveNode,
  } = useReview();

  const [editingId, setEditingId] = useState<string | null>(null);
  const editingNode = storeNodes.find((n) => n.id === editingId) ?? null;

  const openEdit = useCallback((id: string) => setEditingId(id), []);

  const nodes: Node<FlowchartNodeData>[] = useMemo(() => {
    return storeNodes.map((n) => ({
      id: n.id,
      type: "superlabs",
      position: n.position,
      data: {
        label: n.label,
        iconId: n.iconId,
        isManual: n.isManual,
        isEditable: true,
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
      body: "You can run it any time from Home.",
    });
    window.setTimeout(onSaved, 900);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-start justify-between gap-3 border-b border-white/40 bg-white/35 px-5 py-3">
        <div>
          <h1 className="text-[16px] font-semibold tracking-tight text-[color:var(--text-1)]">
            Review your automation
          </h1>
          <p className="mt-0.5 text-[12px] text-[color:var(--text-2)]">
            Click any step to edit.
          </p>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[60%_40%]">
        <div className="relative min-h-0 border-r border-white/40">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={flowchartNodeTypes}
            fitView
            fitViewOptions={{ padding: 0.15, maxZoom: 1 }}
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
            onNodeClick={(_, node) => openEdit(node.id)}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag
            zoomOnScroll={false}
            zoomOnPinch
            zoomOnDoubleClick={false}
          >
            <Background gap={18} size={1} color="rgba(15,23,42,0.06)" />
          </ReactFlow>
          <NodeEditPanel
            open={!!editingNode}
            editKey={editingId ?? "none"}
            initialLabel={editingNode?.label ?? ""}
            initialIsManual={editingNode?.isManual ?? false}
            onSave={(next) => {
              if (!editingNode) return;
              if (next.label !== editingNode.label)
                rename(editingNode.id, next.label);
              if (next.isManual !== editingNode.isManual)
                toggleManual(editingNode.id, next.isManual);
              setEditingId(null);
            }}
            onDelete={() => {
              if (!editingNode) return;
              deleteNode(editingNode.id);
              setEditingId(null);
            }}
            onCancel={() => setEditingId(null)}
          />
        </div>

        <aside className="flex min-h-0 flex-col">
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
            <ChatMessage variant="system">
              I&apos;ve marked one step as manual because it submits data
              externally. You can adjust any step the same way.
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
                      <div className="ml-9 inline-flex items-center gap-1.5 rounded-md bg-[rgba(22,163,74,0.08)] px-2 py-1 text-[11px] font-medium text-[color:var(--success)]">
                        <Check size={12} strokeWidth={2.4} />
                        Answered
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
                Anything else I should know?
              </span>
              <div className="flex items-start gap-2">
                <textarea
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  placeholder="Type a note…"
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
                      body: "Added to your automation notes.",
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
