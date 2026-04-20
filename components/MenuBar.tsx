"use client";

import { BatteryFull, Search, Wifi } from "lucide-react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export interface MenuBarProps {
  onLogoClick?: () => void;
  pulseLogo?: boolean;
  showTooltip?: boolean;
}

export function MenuBar({
  onLogoClick,
  pulseLogo,
  showTooltip,
}: MenuBarProps) {
  return (
    <header
      className="glass-dark fixed top-0 left-0 right-0 z-[var(--z-sticky)] flex h-7 items-center justify-between px-3 text-white"
      role="banner"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onLogoClick}
          aria-label="Open Superlabs"
          className="relative flex items-center gap-1.5 rounded-md px-1.5 py-0.5 hover:bg-white/10 transition-colors"
        >
          <span
            className={`flex h-4 w-[18px] items-center justify-center ${pulseLogo ? "logo-pulse" : ""}`}
            aria-hidden
          >
            <Image
              src="/superlabs-mark.svg"
              alt=""
              width={18}
              height={16}
              style={{ width: "auto", height: 14 }}
              priority
            />
          </span>
          <span className="text-[12px] font-semibold tracking-tight">
            Superlabs
          </span>
          <AnimatePresence>
            {showTooltip && (
              <motion.span
                role="tooltip"
                className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1a1a1a] px-2 py-1 text-[11px] font-medium text-white shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                Click to open
                <span
                  className="absolute left-1/2 bottom-full -translate-x-1/2 border-4 border-transparent border-b-[#1a1a1a]"
                  aria-hidden
                />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <span className="text-[11.5px] text-white/75 hidden sm:inline">
          File
        </span>
        <span className="text-[11.5px] text-white/75 hidden sm:inline">
          Edit
        </span>
        <span className="text-[11.5px] text-white/75 hidden sm:inline">
          View
        </span>
        <span className="text-[11.5px] text-white/75 hidden sm:inline">
          Help
        </span>
      </div>

      <div className="flex items-center gap-3 text-white/85">
        <Search size={12} strokeWidth={2} aria-hidden />
        <BatteryFull size={14} strokeWidth={2} aria-hidden />
        <Wifi size={12} strokeWidth={2} aria-hidden />
        <span className="text-[11.5px] tabular-nums">
          Tue Apr 15 · 2:47 PM
        </span>
      </div>
    </header>
  );
}
