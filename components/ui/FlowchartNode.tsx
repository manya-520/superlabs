"use client";

import { Lock } from "lucide-react";
import { Handle, Position } from "reactflow";

import type { NodeIconId } from "@/lib/scriptedRecording";

import { NODE_ICON_MAP } from "./nodeIcons";

export interface FlowchartNodeData {
  label: string;
  iconId: NodeIconId;
  isManual?: boolean;
  isEditable?: boolean;
  isAppearing?: boolean;
}

export function FlowchartNode({ data }: { data: FlowchartNodeData }) {
  const Icon = NODE_ICON_MAP[data.iconId];
  const interactive = data.isEditable;

  return (
    <div
      aria-label={data.label + (data.isManual ? " (manual step)" : "")}
      className={[
        "group relative flex min-w-[220px] max-w-[280px] items-center gap-3 rounded-xl border px-3 py-2.5",
        "bg-white/85 backdrop-blur-md shadow-[0_4px_14px_rgba(15,23,42,0.08)]",
        data.isManual
          ? "border-amber-300/70"
          : "border-[color:var(--brand-border)]",
        interactive ? "cursor-pointer hover:bg-white hover:-translate-y-px transition-all" : "",
      ].join(" ")}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0, pointerEvents: "none" }}
      />
      <span
        className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-[linear-gradient(135deg,rgba(133,57,255,0.12),rgba(181,127,255,0.12))] text-[color:var(--brand)]"
        aria-hidden
      >
        <Icon size={16} strokeWidth={1.8} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold text-[color:var(--text-1)]">
          {data.label}
        </div>
        {data.isManual && (
          <div className="mt-1 flex items-center gap-1">
            <span className="manual-step-badge">
              <Lock size={9} strokeWidth={2.4} />
              Manual step
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
