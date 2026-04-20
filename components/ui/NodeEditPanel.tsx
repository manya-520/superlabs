"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { GradientButton } from "./GradientButton";

export interface NodeEditPanelProps {
  open: boolean;
  /** Identity of the node being edited; used to remount local state on change. */
  editKey: string;
  initialLabel: string;
  initialIsManual: boolean;
  onSave: (next: { label: string; isManual: boolean }) => void;
  onDelete: () => void;
  onCancel: () => void;
}

export function NodeEditPanel(props: NodeEditPanelProps) {
  return (
    <AnimatePresence>
      {props.open && (
        <NodeEditPanelInner
          key={props.editKey}
          {...props}
        />
      )}
    </AnimatePresence>
  );
}

function NodeEditPanelInner({
  initialLabel,
  initialIsManual,
  onSave,
  onDelete,
  onCancel,
}: NodeEditPanelProps) {
  const [label, setLabel] = useState(initialLabel);
  const [isManual, setIsManual] = useState(initialIsManual);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", handleKey);
    };
  }, [onCancel]);

  return (
    <>
          <motion.div
            className="absolute inset-0 z-[var(--z-modal)] bg-black/20 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onCancel}
            aria-hidden
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Edit step"
            className="absolute left-1/2 top-1/2 z-[calc(var(--z-modal)+1)] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/70 bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,0.22)]"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between">
              <h3 className="text-[14px] font-semibold text-[color:var(--text-1)]">
                Edit step
              </h3>
              <button
                type="button"
                onClick={onCancel}
                aria-label="Close"
                className="flex h-7 w-7 items-center justify-center rounded-md text-[color:var(--text-2)] hover:bg-black/5"
              >
                <X size={14} />
              </button>
            </div>

            <label className="block">
              <span className="mb-1 block text-[12px] font-medium text-[color:var(--text-2)]">
                Name
              </span>
              <input
                ref={inputRef}
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="h-9 w-full rounded-md border border-black/10 bg-white px-2.5 text-[13px] text-[color:var(--text-1)] outline-none focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand-ring)]"
              />
            </label>

            <div className="mt-3">
              <span className="mb-1 block text-[12px] font-medium text-[color:var(--text-2)]">
                How should Superlabs handle this step?
              </span>
              <div className="flex items-center justify-between rounded-md bg-black/[0.03] p-2">
                <span className="text-[12px] text-[color:var(--text-1)]">
                  {isManual
                    ? "I'll do this myself"
                    : "Automate this step"}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={!isManual}
                  aria-label="Automate this step"
                  onClick={() => setIsManual((v) => !v)}
                  className={[
                    "relative inline-flex h-[18px] w-[34px] flex-none items-center rounded-full transition-colors",
                    !isManual ? "bg-[color:var(--brand)]" : "bg-black/15",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "inline-block h-[14px] w-[14px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform",
                      !isManual ? "translate-x-[18px]" : "translate-x-[2px]",
                    ].join(" ")}
                  />
                </button>
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-[color:var(--text-2)]">
                Manual steps are flagged so you can handle them yourself.
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center gap-1.5 rounded-md border border-red-500/20 px-2.5 py-1.5 text-[12px] font-medium text-red-600 hover:bg-red-500/5"
              >
                <Trash2 size={13} />
                Delete
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-md px-3 py-1.5 text-[12px] font-medium text-[color:var(--text-2)] hover:bg-black/5"
                >
                  Cancel
                </button>
                <GradientButton
                  size="md"
                  onClick={() => onSave({ label: label.trim() || initialLabel, isManual })}
                >
                  Save
                </GradientButton>
              </div>
            </div>
          </motion.div>
    </>
  );
}
