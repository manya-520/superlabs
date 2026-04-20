"use client";

import { motion } from "framer-motion";

const HEADERS = ["Date", "Vendor", "Amount", "Status", "Receipt", "Notes"];

interface Row {
  values: (string | { text: string; appearAtMs: number })[];
  status?: { label: string; appearAtMs: number };
  receipt?: { appearAtMs: number };
}

// Pre-existing rows (already entered) plus the one Maria is typing now.
const ROWS: Row[] = [
  {
    values: ["Mar 4", "Notion", "$16.00", "Paid", "✓", "Team plan"],
  },
  {
    values: ["Mar 12", "Linear", "$40.00", "Paid", "✓", "Standard"],
  },
  {
    values: ["Mar 28", "Figma", "$180.00", "Paid", "✓", ""],
  },
  {
    values: [
      { text: "Apr 16", appearAtMs: 5400 },
      { text: "OpenAI", appearAtMs: 6100 },
      { text: "$120.00", appearAtMs: 6800 },
    ],
    status: { label: "Unpaid", appearAtMs: 7900 },
    receipt: { appearAtMs: 10400 },
  },
];

export function MockExcelWindow({ elapsedMs }: { elapsedMs: number }) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.25)] ring-1 ring-black/10">
      <Chrome title="invoices.xlsx — Excel" />

      <div className="flex h-8 flex-none items-center gap-3 border-b border-black/10 bg-[#F3F2F1] px-3 text-[11px] text-slate-700">
        <span className="font-semibold">Home</span>
        <span className="opacity-60">Insert</span>
        <span className="opacity-60">Formulas</span>
        <span className="opacity-60">Data</span>
        <span className="ml-auto rounded bg-[#107C41] px-2 py-0.5 text-[10px] font-semibold text-white">
          invoices · 2026
        </span>
      </div>

      <div className="flex-1 overflow-hidden">
        <table className="w-full border-separate border-spacing-0 text-[11px]">
          <thead>
            <tr>
              <th className="w-9 border-b border-r border-black/10 bg-[#F3F2F1] px-2 py-1 text-left font-semibold text-slate-500">
                #
              </th>
              {HEADERS.map((h) => (
                <th
                  key={h}
                  className="border-b border-r border-black/10 bg-[#F3F2F1] px-2 py-1 text-left font-semibold text-slate-700"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, rowIdx) => {
              const isCurrent = rowIdx === ROWS.length - 1;
              return (
                <tr key={rowIdx}>
                  <td className="border-b border-r border-black/10 bg-[#F3F2F1] px-2 py-1 text-slate-500">
                    {rowIdx + 2}
                  </td>
                  {HEADERS.map((_, colIdx) => (
                    <Cell
                      key={colIdx}
                      row={row}
                      colIdx={colIdx}
                      elapsedMs={elapsedMs}
                      isCurrent={isCurrent}
                    />
                  ))}
                </tr>
              );
            })}
            {/* Padding rows to fill grid */}
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={`pad-${i}`}>
                <td className="border-b border-r border-black/10 bg-[#F3F2F1] px-2 py-1 text-slate-500">
                  {ROWS.length + 2 + i}
                </td>
                {HEADERS.map((_, c) => (
                  <td
                    key={c}
                    className="border-b border-r border-black/10 px-2 py-1"
                  >
                    &nbsp;
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Cell({
  row,
  colIdx,
  elapsedMs,
  isCurrent,
}: {
  row: Row;
  colIdx: number;
  elapsedMs: number;
  isCurrent: boolean;
}) {
  const raw = row.values[colIdx];
  let text = "";
  let appearAt = 0;
  if (typeof raw === "string") {
    text = raw;
  } else if (raw) {
    text = raw.text;
    appearAt = raw.appearAtMs;
  }

  const isStatusCol = colIdx === 3;
  const isReceiptCol = colIdx === 4;

  if (isCurrent && isStatusCol && row.status) {
    const visible = elapsedMs >= row.status.appearAtMs;
    return (
      <td className="border-b border-r border-black/10 px-2 py-1">
        {visible && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="inline-flex items-center rounded-sm bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800"
          >
            {row.status.label}
          </motion.span>
        )}
      </td>
    );
  }

  if (isCurrent && isReceiptCol && row.receipt) {
    const visible = elapsedMs >= row.receipt.appearAtMs;
    return (
      <td className="border-b border-r border-black/10 px-2 py-1">
        {visible && (
          <motion.span
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1 rounded border border-black/10 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-600"
          >
            <span aria-hidden>📎</span>
            pdf
          </motion.span>
        )}
      </td>
    );
  }

  const visible = elapsedMs >= appearAt;
  const blinking = isCurrent && !visible && colIdx < row.values.length;

  return (
    <td
      className={[
        "relative border-b border-r border-black/10 px-2 py-1 text-slate-800",
        isCurrent && colIdx === 0 ? "bg-[rgba(16,124,65,0.06)]" : "",
      ].join(" ")}
    >
      {visible ? (
        <motion.span
          initial={isCurrent ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {text}
        </motion.span>
      ) : blinking ? (
        <motion.span
          className="inline-block h-3 w-[1px] bg-slate-700"
          animate={{ opacity: [0.1, 1, 0.1] }}
          transition={{ duration: 0.7, repeat: Infinity }}
        />
      ) : (
        <span>&nbsp;</span>
      )}
    </td>
  );
}

function Chrome({ title }: { title: string }) {
  return (
    <div className="flex h-7 flex-none items-center gap-2 border-b border-black/10 bg-[#217346] px-2.5 text-white">
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
