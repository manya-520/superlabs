"use client";

import { Hand } from "lucide-react";
import { Handle, Position } from "reactflow";

import type { NodeIconId } from "@/lib/scriptedRecording";

import { NODE_ICON_MAP } from "./nodeIcons";

export interface FlowchartNodeData {
  label: string;
  iconId: NodeIconId;
  /** Draws the soft amber "You'll finish this" chip. */
  needsYou?: boolean;
  /** Tight padding + narrower width for the tucked recording panel. */
  compact?: boolean;
}

export function FlowchartNode({ data }: { data: FlowchartNodeData }) {
  const Icon = NODE_ICON_MAP[data.iconId];
  const compact = !!data.compact;

  return (
    <div
      aria-label={data.label + (data.needsYou ? " — you'll finish this step" : "")}
      className={[
        "group relative flex items-center gap-2.5 rounded-xl border bg-white/90 backdrop-blur-md shadow-[0_3px_10px_rgba(15,23,42,0.08)]",
        compact
          ? "min-w-[210px] max-w-[230px] px-2.5 py-2"
          : "min-w-[230px] max-w-[280px] px-3 py-2.5",
        data.needsYou
          ? "border-amber-300/80"
          : "border-[color:var(--brand-border)]",
      ].join(" ")}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0, pointerEvents: "none" }}
      />
      <span
        className={[
          "flex flex-none items-center justify-center rounded-lg bg-[linear-gradient(135deg,rgba(133,57,255,0.12),rgba(181,127,255,0.12))] text-[color:var(--brand)]",
          compact ? "h-7 w-7" : "h-8 w-8",
        ].join(" ")}
        aria-hidden
      >
        <Icon size={compact ? 14 : 16} strokeWidth={1.8} />
      </span>
      <div className="min-w-0 flex-1">
        <div
          className={[
            "truncate font-semibold text-[color:var(--text-1)]",
            compact ? "text-[12px]" : "text-[13px]",
          ].join(" ")}
        >
          {data.label}
        </div>
        {data.needsYou && (
          <div className="mt-1 flex items-center gap-1">
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-100/70 px-1.5 py-[1px] text-[9.5px] font-semibold text-amber-800">
              <Hand size={9} strokeWidth={2.2} />
              You&rsquo;ll finish this
            </span>
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ opacity: 0, pointerEvents: "none" }}
      />
    </div>
  );
}

export const flowchartNodeTypes = {
  superlabs: FlowchartNode,
};
