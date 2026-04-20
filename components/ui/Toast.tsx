"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
  type LucideIcon,
} from "lucide-react";
import { createContext, useCallback, useContext, useId, useMemo, useRef, useState, type ReactNode } from "react";

type ToastKind = "success" | "info" | "warning" | "error";

export interface Toast {
  id: string;
  title: string;
  body?: string;
  kind: ToastKind;
}

const KIND_ICON: Record<ToastKind, LucideIcon> = {
  success: CheckCircle2,
  info: Info,
  warning: TriangleAlert,
  error: AlertCircle,
};

const KIND_ACCENT: Record<ToastKind, string> = {
  success: "var(--success)",
  info: "var(--info)",
  warning: "var(--warning)",
  error: "var(--error)",
};

interface ToastContextValue {
  toast: (t: Omit<Toast, "id"> & { id?: string }) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<string, number>());
  const idBase = useId();

  const dismiss = useCallback((id: string) => {
    setToasts((all) => all.filter((t) => t.id !== id));
    const handle = timers.current.get(id);
    if (handle) {
      window.clearTimeout(handle);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback<ToastContextValue["toast"]>(
    (input) => {
      const id = input.id ?? `${idBase}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((all) => [...all.filter((t) => t.id !== id), { ...input, id }]);
      const handle = window.setTimeout(() => dismiss(id), 3500);
      timers.current.set(id, handle);
      return id;
    },
    [dismiss, idBase],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[var(--z-toast)] flex flex-col items-end gap-2">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = KIND_ICON[t.kind];
          const role = t.kind === "error" || t.kind === "warning" ? "alert" : "status";
          return (
            <motion.div
              key={t.id}
              role={role}
              aria-live="polite"
              className="pointer-events-auto w-[320px] max-w-[calc(100vw-48px)] rounded-lg border border-black/10 bg-white p-3 shadow-[0_12px_30px_rgba(15,23,42,0.15)]"
              initial={{ opacity: 0, x: 16, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 16, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="flex h-7 w-7 flex-none items-center justify-center rounded-md"
                  style={{ color: KIND_ACCENT[t.kind], background: `color-mix(in srgb, ${KIND_ACCENT[t.kind]} 12%, transparent)` }}
                  aria-hidden
                >
                  <Icon size={15} strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold text-[color:var(--text-1)]">
                    {t.title}
                  </div>
                  {t.body && (
                    <div className="mt-0.5 text-[12px] leading-relaxed text-[color:var(--text-2)]">
                      {t.body}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onDismiss(t.id)}
                  aria-label="Dismiss"
                  className="flex h-6 w-6 flex-none items-center justify-center rounded-md text-[color:var(--text-3)] hover:bg-black/5 hover:text-[color:var(--text-1)]"
                >
                  <X size={12} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
