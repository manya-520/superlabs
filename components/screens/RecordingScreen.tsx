"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Pause, Play, RotateCcw, Square, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
} from "reactflow";

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
  showPearlIntro?: boolean;
  onDismissPearlIntro?: () => void;
}

export function RecordingScreen(props: RecordingScreenProps) {
  return (
    <ReactFlowProvider>
      <RecordingScreenInner {...props} />
    </ReactFlowProvider>
  );
}

function RecordingScreenInner({
  onReview,
  onBack,
  showPearlIntro,
  onDismissPearlIntro,
}: RecordingScreenProps) {
  const [paused, setPaused] = useState(false);
  // Scripted recording runs only when the Pearl intro is dismissed AND the
  // user hasn&rsquo;t paused it.
  const active = !showPearlIntro && !paused;
  const { visibleNodeIds, isComplete, reset } = useScriptedRecording(active);
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

  const count = visibleNodeIds.size;

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      {/* Top bar — living status, no X/N */}
      <div className="flex items-center gap-2 border-b border-white/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.75),rgba(255,255,255,0.4))] px-3.5 py-2.5 backdrop-blur-2xl">
        <div className="flex flex-1 items-center gap-2">
          <span className="flex items-center gap-1" aria-hidden>
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.span
                key={i}
                animate={
                  paused || isComplete
                    ? { opacity: 0.4 }
                    : { opacity: [0.35, 1, 0.35] }
                }
                transition={
                  paused || isComplete
                    ? { duration: 0.2 }
                    : { duration: 1.2, repeat: Infinity, delay }
                }
                className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand)]"
              />
            ))}
          </span>
          <span className="text-[11.5px] font-semibold text-[color:var(--text-1)]">
            {isComplete
              ? "All set"
              : paused
                ? "Paused"
                : count === 0
                  ? "Watching…"
                  : "Following along"}
          </span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-[2px] text-[10.5px] font-semibold tabular-nums text-[color:var(--text-2)] shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
            <motion.span
              key={count}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-[color:var(--brand)]"
            >
              {count}
            </motion.span>
            {count === 1 ? "step" : "steps"}
          </span>
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
        {!showPearlIntro && nodes.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center text-[12px] leading-relaxed text-[color:var(--text-3)]">
            Start your flow whenever you&rsquo;re ready. I&rsquo;ll sketch it
            here as you go.
          </div>
        )}
      </div>

      {/* Bottom action bar — hierarchy: Pause (reversible) · Stop (advances) · Reset (destructive).
          When the flow is complete, Pause collapses away and Stop becomes the brand CTA. */}
      <div className="flex items-center gap-1.5 border-t border-white/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.4),rgba(255,255,255,0.7))] px-3 py-2.5 backdrop-blur-2xl">
        {!isComplete && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-black/10 bg-white/95 px-2.5 py-1.5 text-[11.5px] font-semibold text-[color:var(--text-1)] shadow-[0_1px_2px_rgba(15,23,42,0.06)] hover:bg-white"
          >
            {paused ? (
              <>
                <Play size={11} strokeWidth={2.3} fill="currentColor" />
                Resume
              </>
            ) : (
              <>
                <Pause size={11} strokeWidth={2.3} fill="currentColor" />
                Pause
              </>
            )}
          </button>
        )}

        {isComplete ? (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onReview}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[linear-gradient(135deg,#8539FF,#B57FFF)] px-2.5 py-1.5 text-[12px] font-semibold text-white shadow-[0_4px_14px_rgba(133,57,255,0.28)]"
          >
            Review
            <ArrowRight size={12} strokeWidth={2.3} />
          </motion.button>
        ) : (
          <button
            type="button"
            onClick={onReview}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-black/5 bg-white/60 px-2.5 py-1.5 text-[11.5px] font-medium text-[color:var(--text-2)] hover:bg-white/90 hover:text-[color:var(--text-1)]"
          >
            <Square
              size={10}
              strokeWidth={0}
              fill="currentColor"
              className="text-rose-500/80"
            />
            Stop
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            setPaused(false);
            reset();
          }}
          className="flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[11.5px] font-medium text-[color:var(--text-3)] hover:bg-black/5 hover:text-[color:var(--text-1)]"
        >
          <RotateCcw size={11} strokeWidth={2.2} />
          Reset
        </button>
      </div>

      {/* First-time Pearl greeting */}
      <AnimatePresence>
        {showPearlIntro && (
          <PearlIntroOverlay onDismiss={onDismissPearlIntro} />
        )}
      </AnimatePresence>
    </div>
  );
}

function PearlIntroOverlay({ onDismiss }: { onDismiss?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 z-10 flex items-center justify-center px-5"
    >
      <div className="absolute inset-0 bg-white/70 backdrop-blur-xl" aria-hidden />
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative z-10 flex w-full flex-col items-center gap-3 rounded-2xl border border-white/80 bg-white/95 px-5 py-5 text-center shadow-[0_10px_32px_rgba(133,57,255,0.18)]"
      >
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full text-[color:var(--text-3)] hover:bg-black/5 hover:text-[color:var(--text-1)]"
        >
          <X size={13} strokeWidth={2.2} />
        </button>

        <motion.span
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(133,57,255,0.16),rgba(181,127,255,0.16))] shadow-[0_6px_16px_rgba(133,57,255,0.18)]"
        >
          <Image
            src="/superlabs-mark.svg"
            alt=""
            width={36}
            height={32}
            style={{ width: "auto", height: 28 }}
            priority
          />
        </motion.span>

        <div className="flex flex-col gap-1">
          <span className="text-[14.5px] font-semibold text-[color:var(--text-1)]">
            Hi Maria <span aria-hidden>👋</span>
          </span>
          <span className="text-[12px] leading-relaxed text-[color:var(--text-2)]">
            I&rsquo;m Pearl, your little Superlabs octopus. I&rsquo;ll quietly
            follow along and learn as you go.
          </span>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="mt-1 w-full rounded-lg bg-[linear-gradient(135deg,#8539FF,#B57FFF)] px-3 py-2 text-[12.5px] font-semibold text-white shadow-[0_4px_14px_rgba(133,57,255,0.28)]"
        >
          Okay, let&rsquo;s go
        </button>
      </motion.div>
    </motion.div>
  );
}
