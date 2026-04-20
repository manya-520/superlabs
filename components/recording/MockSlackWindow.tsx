"use client";

import { motion } from "framer-motion";
import { Hash, Paperclip } from "lucide-react";

export function MockSlackWindow({ elapsedMs }: { elapsedMs: number }) {
  // After ~2s, the "cursor" moves to the PDF and a click ripple appears.
  const downloadStage = elapsedMs > 2200;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.25)] ring-1 ring-black/10">
      <MockWindowChrome title="Slack" accent="#4A154B" />

      <div className="flex min-h-0 flex-1">
        {/* Channel sidebar */}
        <div className="flex w-[130px] flex-none flex-col gap-1 bg-[#3F0E40] p-2 text-white/85">
          <div className="mb-1 px-2 text-[11px] font-semibold opacity-70">
            Channels
          </div>
          <SidebarRow label="general" />
          <SidebarRow label="finance" />
          <SidebarRow label="invoices-ai-tools" active />
          <SidebarRow label="random" />
          <SidebarRow label="ai-ops" />
        </div>

        {/* Message area */}
        <div className="flex min-w-0 flex-1 flex-col bg-white">
          <div className="flex items-center gap-1.5 border-b border-black/5 px-3 py-2">
            <Hash size={12} className="text-slate-500" aria-hidden />
            <span className="text-[12px] font-semibold text-slate-900">
              invoices-ai-tools
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-2.5 overflow-hidden px-3 py-3 text-[11.5px] text-slate-800">
            <Message name="Nikhil" color="#6366F1">
              Hey, here&rsquo;s the OpenAI bill for this month.
            </Message>
            <motion.div
              initial={{ scale: 0.98, boxShadow: "0 0 0 rgba(0,0,0,0)" }}
              animate={
                downloadStage
                  ? {
                      scale: 1.02,
                      boxShadow: "0 0 0 3px rgba(133,57,255,0.35)",
                    }
                  : {}
              }
              transition={{ duration: 0.3 }}
              className="ml-7 flex w-fit items-center gap-2 rounded-md border border-black/10 bg-slate-50 px-2.5 py-1.5"
            >
              <Paperclip size={11} className="text-slate-500" aria-hidden />
              <span className="text-[11.5px] font-medium text-slate-900">
                openai-invoice-april.pdf
              </span>
              <span className="text-[10.5px] text-slate-500">· 124 KB</span>
            </motion.div>
            <Message name="Nikhil" color="#6366F1">
              Charge it to the Ops card. Thanks!
            </Message>
          </div>

          {/* Cursor ghost */}
          <motion.div
            className="pointer-events-none absolute"
            initial={{ left: 320, top: 330, opacity: 0 }}
            animate={{
              left: downloadStage ? 205 : 320,
              top: downloadStage ? 220 : 330,
              opacity: 1,
            }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          >
            <CursorGlyph />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SidebarRow({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={[
        "flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-[11px]",
        active ? "bg-[#1164A3] font-semibold text-white" : "text-white/80",
      ].join(" ")}
    >
      <Hash size={10} className="opacity-70" aria-hidden />
      {label}
    </div>
  );
}

function Message({
  name,
  color,
  children,
}: {
  name: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <span
        className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded text-[9px] font-bold text-white"
        style={{ backgroundColor: color }}
        aria-hidden
      >
        {name[0]}
      </span>
      <div className="flex-1">
        <div className="text-[11px] font-semibold text-slate-900">{name}</div>
        <div className="mt-0.5 text-[11.5px] leading-snug text-slate-700">
          {children}
        </div>
      </div>
    </div>
  );
}

function MockWindowChrome({ title, accent }: { title: string; accent: string }) {
  return (
    <div
      className="flex h-7 flex-none items-center gap-2 border-b border-black/10 px-2.5"
      style={{ background: accent, color: "white" }}
    >
      <div className="flex items-center gap-1">
        <span className="traffic-dot bg-[#ff5f57] border border-black/20" />
        <span className="traffic-dot bg-[#febc2e] border border-black/20" />
        <span className="traffic-dot bg-[#28c840] border border-black/20" />
      </div>
      <span className="ml-1 text-[10.5px] font-semibold tracking-wide">
        {title}
      </span>
    </div>
  );
}

function CursorGlyph() {
  return (
    <svg
      width="16"
      height="22"
      viewBox="0 0 16 22"
      className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
      aria-hidden
    >
      <path
        d="M1 1L1 18L5 14L8.5 20.5L10.5 19.5L7 13L13 13L1 1Z"
        fill="white"
        stroke="black"
        strokeWidth="1"
      />
    </svg>
  );
}
