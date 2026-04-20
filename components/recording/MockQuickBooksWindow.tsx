"use client";

import { motion } from "framer-motion";

const FIELDS: { label: string; value: string; appearAtMs: number }[] = [
  { label: "Vendor", value: "OpenAI, LLC", appearAtMs: 12800 },
  { label: "Invoice #", value: "INV-20240416-02", appearAtMs: 13500 },
  { label: "Date", value: "Apr 16, 2026", appearAtMs: 14100 },
  { label: "Amount", value: "$120.00", appearAtMs: 14700 },
  { label: "Category", value: "AI tools · Ops", appearAtMs: 15300 },
];

export function MockQuickBooksWindow({ elapsedMs }: { elapsedMs: number }) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.25)] ring-1 ring-black/10">
      <div className="flex h-7 flex-none items-center gap-2 border-b border-black/10 bg-[#2CA01C] px-2.5 text-white">
        <div className="flex items-center gap-1">
          <span className="traffic-dot bg-[#ff5f57] border border-black/20" />
          <span className="traffic-dot bg-[#febc2e] border border-black/20" />
          <span className="traffic-dot bg-[#28c840] border border-black/20" />
        </div>
        <span className="ml-1 text-[10.5px] font-semibold tracking-wide">
          QuickBooks Online
        </span>
      </div>

      <div className="flex h-9 flex-none items-center gap-3 border-b border-black/10 bg-[#F6F6F6] px-3 text-[11px] text-slate-700">
        <span className="font-semibold text-[#2CA01C]">Expenses</span>
        <span className="opacity-60">Banking</span>
        <span className="opacity-60">Reports</span>
        <span className="ml-auto rounded-full border border-black/10 bg-white px-2 py-0.5 text-[10px] text-slate-500">
          Maria · Acme Labs
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10.5px] font-semibold uppercase tracking-wider text-[#2CA01C]">
              New expense
            </div>
            <div className="mt-0.5 text-[14px] font-semibold text-slate-900">
              Record a vendor bill
            </div>
          </div>
          <span className="rounded-md border border-black/10 bg-slate-50 px-2 py-1 text-[10px] text-slate-500">
            Draft
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          {FIELDS.map((f) => {
            const filled = elapsedMs >= f.appearAtMs;
            return (
              <Field
                key={f.label}
                label={f.label}
                value={f.value}
                filled={filled}
              />
            );
          })}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-black/10 pt-3">
          <div className="text-[11px] text-slate-500">
            All fields look good.
          </div>
          <motion.button
            type="button"
            initial={{ opacity: 0.5 }}
            animate={{
              opacity: elapsedMs >= 15800 ? [0.7, 1, 0.7] : 0.5,
              boxShadow:
                elapsedMs >= 15800
                  ? "0 0 0 4px rgba(44,160,28,0.22)"
                  : "0 0 0 0 rgba(44,160,28,0)",
            }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="cursor-pointer rounded-md bg-[#2CA01C] px-3 py-1.5 text-[11px] font-semibold text-white"
          >
            Save and close
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  filled,
}: {
  label: string;
  value: string;
  filled: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div
        className={[
          "flex h-7 items-center rounded-md border px-2 text-[11.5px]",
          filled
            ? "border-[rgba(44,160,28,0.35)] bg-[rgba(44,160,28,0.05)] text-slate-900"
            : "border-black/10 bg-white text-slate-400",
        ].join(" ")}
      >
        {filled ? (
          <motion.span
            initial={{ opacity: 0, x: -2 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {value}
          </motion.span>
        ) : (
          <motion.span
            className="inline-block h-3 w-[1px] bg-slate-400"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  );
}
