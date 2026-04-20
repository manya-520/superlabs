"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import ReactFlow, {
  Background,
  type Edge,
  type Node,
} from "reactflow";

import { ChatMessage } from "@/components/ui/ChatMessage";
import { ChatQuestionInput } from "@/components/ui/ChatQuestionInput";
import { flowchartNodeTypes, type FlowchartNodeData } from "@/components/ui/FlowchartNode";
import { GradientButton } from "@/components/ui/GradientButton";
import {
  RECORDING_EDGES,
  RECORDING_MESSAGES,
  RECORDING_NODES,
} from "@/lib/scriptedRecording";
import { useScriptedRecording } from "@/lib/useScriptedRecording";

export interface RecordingScreenProps {
  onReview: () => void;
  onBack: () => void;
}

export function RecordingScreen({ onReview, onBack }: RecordingScreenProps) {
  const { visibleNodeIds, visibleMessageIds, isComplete } =
    useScriptedRecording(true);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const nodes: Node<FlowchartNodeData>[] = useMemo(() => {
    return RECORDING_NODES.filter((n) => visibleNodeIds.has(n.id)).map((n) => ({
      id: n.id,
      type: "superlabs",
      position: n.position,
      data: {
        label: n.label,
        iconId: n.iconId,
      },
      draggable: false,
      selectable: false,
    }));
  }, [visibleNodeIds]);

  const edges: Edge[] = useMemo(() => {
    return RECORDING_EDGES.filter(
      (e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target),
    ).map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: "smoothstep",
      animated: !isComplete,
      style: { stroke: "rgba(133,57,255,0.5)", strokeWidth: 1.5 },
    }));
  }, [visibleNodeIds, isComplete]);

  const messages = RECORDING_MESSAGES.filter((m) => visibleMessageIds.has(m.id));

  return (
    <div className="grid h-full min-h-0 grid-cols-[55%_45%]">
      {/* Left: flowchart */}
      <div className="relative flex h-full min-h-0 flex-col border-r border-white/45">
        <div className="flex items-center gap-2 border-b border-white/40 bg-white/35 px-4 py-2.5">
          <span className="pulse-dot" aria-hidden />
          <span className="text-[12px] font-medium text-[color:var(--text-1)]">
            {isComplete ? "Recording complete" : "Recording…"}
          </span>
          <span className="ml-auto text-[11px] text-[color:var(--text-3)]">
            {visibleNodeIds.size} of {RECORDING_NODES.length} steps
          </span>
        </div>
        <div className="relative flex-1 min-h-0">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={flowchartNodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
            proOptions={{ hideAttribution: true }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            className="bg-transparent"
          >
            <Background
              gap={18}
              size={1}
              color="rgba(15,23,42,0.06)"
            />
          </ReactFlow>
          {nodes.length === 0 && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-[12px] text-[color:var(--text-3)]">
              Waiting for your first step…
            </div>
          )}
        </div>
      </div>

      {/* Right: chat */}
      <div className="flex min-h-0 flex-col">
        <div className="flex items-center justify-between border-b border-white/40 bg-white/35 px-4 py-2.5">
          <span className="text-[12px] font-medium text-[color:var(--text-1)]">
            Superlabs
          </span>
          <button
            type="button"
            onClick={onBack}
            className="rounded-md px-2 py-0.5 text-[11px] font-medium text-[color:var(--text-2)] hover:bg-black/5"
          >
            Cancel
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="flex flex-col gap-1.5"
              >
                <ChatMessage variant={m.kind === "intro" ? "system" : "default"}>
                  {m.text}
                </ChatMessage>
                {m.kind === "question" && m.answerKey && (
                  <ChatQuestionInput
                    questionId={m.id}
                    onAnswer={(value) =>
                      setAnswers((prev) => ({ ...prev, [m.answerKey!]: value }))
                    }
                    onSkip={() =>
                      setAnswers((prev) => ({ ...prev, [m.answerKey!]: "" }))
                    }
                  />
                )}
                {m.kind === "outro" && m.ctaLabel && isComplete && (
                  <div className="ml-9 mt-1">
                    <GradientButton size="md" onClick={onReview}>
                      {m.ctaLabel}
                    </GradientButton>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {Object.keys(answers).length > 0 && (
            <p className="mt-auto text-[10.5px] text-[color:var(--text-3)]">
              Your answers stay on this device.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
