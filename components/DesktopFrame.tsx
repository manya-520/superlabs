"use client";

import {
  Compass,
  FileText,
  Folder,
  Mail,
  MessageSquare,
  Music2,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

interface DesktopIcon {
  icon: LucideIcon;
  label: string;
}

const DESKTOP_ICONS: DesktopIcon[] = [
  { icon: Folder, label: "Documents" },
  { icon: Mail, label: "Mail" },
  { icon: Compass, label: "Browser" },
  { icon: MessageSquare, label: "Slack" },
  { icon: FileText, label: "Notes" },
  { icon: Music2, label: "Music" },
];

export function DesktopFrame({ children }: { children: ReactNode }) {
  return (
    <div className="wallpaper-gradient relative h-screen w-screen overflow-hidden">
      {/* Simulated desktop icons — backdrop only, kept quiet. */}
      <div
        className="pointer-events-none absolute left-6 top-12 flex flex-col gap-5 opacity-55"
        aria-hidden
      >
        {DESKTOP_ICONS.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/55 text-slate-600 shadow-[0_2px_8px_rgba(15,23,42,0.10)] backdrop-blur-md">
              <Icon size={20} strokeWidth={1.6} />
            </div>
            <span className="text-[10px] font-medium text-slate-700/80 drop-shadow-sm">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Soft glow orbs to give depth, subtle. */}
      <div
        className="pointer-events-none absolute -left-40 top-24 h-96 w-96 rounded-full bg-[rgba(133,57,255,0.35)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-16 h-[26rem] w-[26rem] rounded-full bg-[rgba(130,170,255,0.35)] blur-3xl"
        aria-hidden
      />

      {children}
    </div>
  );
}
