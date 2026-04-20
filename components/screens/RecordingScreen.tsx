"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import ReactFlow, {
  Background,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
} from "reactflow";
import { useEffect } from "react";

import {
  flowchartNodeTypes,
  type FlowchartNodeData,
} from "@/components/ui/FlowchartNode";
import {
  RECORDING_EDGES,
  RECORDING_NODES,
} from "@/lib/scriptedRecording";
import { useScriptedRecording } from "@/lib/useScriptedRecording";

export interface RecordingScreenProps {
  onReview: () => void;
  onBack: () => void;
}

export function RecordingScreen(props: RecordingScreenProps) {
  return (
    <ReactFlowProvider>
      <RecordingScreenInner {...props} />
    </ReactFlowProvider>
  );
}

function RecordingScreenInner({ onReview, onBack }: RecordingScreenProps) {
  const { visibleNodeIds, isComplete, progress } = useScriptedRecording(true);
  const rf = useReactFlow();

  // Re-fit whenever the visible node set changes, so the latest node is
  // always in view. ReactFlow&rsquo;s `fitView` prop only runs on initial
  // mount, which is why we call it imperatively.
  useEffect(() => {
    const t = window.setTimeout(() => {
      rf.fitView({ padding: 0.15, maxZoom: 0.92, minZoom: 0.35, duration: 280 });
    }, 40);
    return () => window.clearTimeout(t);
  }, [rf, visibleNodeIds]);

  const nodes: Node<FlowchartNodeData>[] = useMemo(() => {
    return RECORDING_NODES.filter((n) => visibleNodeIds.has(n.id)).map((n) => ({
      id: n.id,
      type: "superlabs",
      position: n.position,
      data: {
        label: n.label,
        iconId: n.iconId,
        compact: true,
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
      style: { stroke: "rgba(133,57,255,0.55)", strokeWidth: 1.5 },
    }));
  }, [visibleNodeIds, isComplete]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 border-b border-white/40 bg-white/35 px-3.5 py-2.5">
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[11.5px] font-semibold text-[color:var(--text-1)]">
              {isComplete ? "All set" : "I'm following along"}
            </span>
            <span className="ml-auto text-[10.5px] tabular-nums text-[color:var(--text-3)]">
              {visibleNodeIds.size} / {RECORDING_NODES.length}
            </span>
          </div>
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-black/5">
            <motion.div
              className="h-full bg-[linear-gradient(90deg,#8539FF,#B57FFF)]"
              animate={{ width: `${Math.round(progress * 100)}%` }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      <div className="relative flex-1 min-h-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={flowchartNodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15, maxZoom: 0.92, minZoom: 0.35 }}
          minZoom={0.3}
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
          <Background gap={18} size={1} color="rgba(15,23,42,0.06)" />
        </ReactFlow>
        {nodes.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center text-[12px] leading-relaxed text-[color:var(--text-3)]">
            Start your flow whenever you&rsquo;re ready. I&rsquo;ll sketch it
            here as you go.
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-white/40 bg-white/35 px-3.5 py-2.5">
        {isComplete ? (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onReview}
            className="flex w-full items-center justify-between gap-2 rounded-lg bg-[linear-gradient(135deg,#8539FF,#B57FFF)] px-3 py-2 text-[12.5px] font-semibold text-white shadow-[0_4px_14px_rgba(133,57,255,0.28)]"
          >
            Review what I learned
            <ArrowRight size={14} strokeWidth={2.2} />
          </motion.button>
        ) : (
          <button
            type="button"
            onClick={onBack}
            className="flex-1 rounded-md border border-black/10 bg-white/80 px-3 py-1.5 text-[11.5px] font-medium text-[color:var(--text-2)] hover:bg-white"
          >
            Stop and restart
          </button>
        )}
      </div>
    </div>
  );
}
