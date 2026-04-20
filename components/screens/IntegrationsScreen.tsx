"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  FileSpreadsheet,
  LineChart,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { GradientButton } from "@/components/ui/GradientButton";
import { useToast } from "@/components/ui/Toast";

export interface IntegrationsScreenProps {
  onBack: () => void;
  onSaved: () => void;
}

interface Integration {
  id: string;
  name: string;
  scope: string;
  icon: LucideIcon;
  color: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: "slack",
    name: "Slack",
    scope: "Read invoice PDFs from #invoices-ai-tools",
    icon: MessageSquare,
    color: "#4A154B",
  },
  {
    id: "excel",
    name: "Excel",
    scope: "Edit invoices.xlsx in your Finance folder",
    icon: FileSpreadsheet,
    color: "#107C41",
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    scope: "Draft expense entries on the Ops card",
    icon: LineChart,
    color: "#2CA01C",
  },
];

export function IntegrationsScreen({
  onBack,
  onSaved,
}: IntegrationsScreenProps) {
  const { toast } = useToast();
  const [connected, setConnected] = useState<Record<string, boolean>>({});

  const allConnected = useMemo(
    () => INTEGRATIONS.every((i) => connected[i.id]),
    [connected],
  );

  const connect = (id: string) => {
    setConnected((c) => ({ ...c, [id]: true }));
  };

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
      <header className="flex items-start justify-between gap-3 px-6 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-[0_3px_10px_rgba(15,23,42,0.08)] border border-white/70"
            aria-hidden
          >
            <Image
              src="/superlabs-mark.svg"
              alt=""
              width={20}
              height={18}
              style={{ width: "auto", height: 16 }}
            />
          </span>
          <div>
            <h1 className="text-[17px] font-semibold tracking-tight leading-tight text-[color:var(--text-1)]">
              A few connections to finish
            </h1>
            <p className="mt-0.5 text-[12px] text-[color:var(--text-2)]">
              I need access to these apps to run your automation.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="rounded-md px-2 py-1 text-[12px] font-medium text-[color:var(--text-2)] hover:bg-black/5"
        >
          Back
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-2 px-6 py-3">
        {INTEGRATIONS.map((i) => (
          <IntegrationRow
            key={i.id}
            integration={i}
            connected={!!connected[i.id]}
            onConnect={() => connect(i.id)}
          />
        ))}

        <div className="mt-2 flex items-start gap-2 rounded-xl border border-white/60 bg-white/40 px-3 py-2.5 text-[11.5px] text-[color:var(--text-2)]">
          <ShieldCheck
            size={14}
            strokeWidth={1.9}
            className="mt-0.5 flex-none text-emerald-500"
            aria-hidden
          />
          <span>
            Pearl only touches what&rsquo;s needed for this automation. You can
            disconnect anytime from Settings.
          </span>
        </div>
      </div>

      <footer className="flex items-center justify-between gap-3 border-t border-white/45 bg-white/55 px-6 py-3.5 backdrop-blur-xl">
        <span className="text-[11.5px] text-[color:var(--text-3)]">
          {allConnected
            ? "All set — you’re good to go."
            : `${Object.values(connected).filter(Boolean).length} of ${INTEGRATIONS.length} connected`}
        </span>
        <GradientButton size="lg" onClick={handleSave} disabled={!allConnected}>
          Save automation
          <ArrowRight size={14} strokeWidth={2.2} />
        </GradientButton>
      </footer>
    </div>
  );
}

function IntegrationRow({
  integration,
  connected,
  onConnect,
}: {
  integration: Integration;
  connected: boolean;
  onConnect: () => void;
}) {
  const Icon = integration.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={[
        "flex items-center gap-3 rounded-xl border bg-white/80 px-3 py-2.5 shadow-[0_2px_8px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-colors",
        connected ? "border-emerald-200/70" : "border-white/70",
      ].join(" ")}
    >
      <span
        className="flex h-9 w-9 flex-none items-center justify-center rounded-xl text-white shadow-[0_2px_6px_rgba(15,23,42,0.12)]"
        style={{ backgroundColor: integration.color }}
        aria-hidden
      >
        <Icon size={16} strokeWidth={2} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-semibold text-[color:var(--text-1)]">
            {integration.name}
          </span>
          {connected && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-1.5 py-[1px] text-[10px] font-semibold text-emerald-700">
              <Check size={9} strokeWidth={2.8} />
              Connected
            </span>
          )}
        </div>
        <span className="mt-0.5 truncate text-[11.5px] text-[color:var(--text-2)]">
          {integration.scope}
        </span>
      </div>
      {connected ? (
        <button
          type="button"
          className="rounded-md px-2 py-1 text-[11px] font-medium text-[color:var(--text-3)] hover:bg-black/5"
          onClick={() => void 0}
          aria-label={`Manage ${integration.name}`}
        >
          Manage
        </button>
      ) : (
        <button
          type="button"
          onClick={onConnect}
          className="rounded-lg bg-[color:var(--brand)] px-3 py-1.5 text-[12px] font-semibold text-white shadow-[0_3px_10px_rgba(133,57,255,0.28)] hover:bg-[color:var(--brand-hover)]"
        >
          Connect
        </button>
      )}
    </motion.div>
  );
}
