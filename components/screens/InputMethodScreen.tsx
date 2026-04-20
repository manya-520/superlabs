"use client";

import { ImageIcon, Type, Video } from "lucide-react";

import { AutomationCard } from "@/components/ui/AutomationCard";
import { useToast } from "@/components/ui/Toast";

export interface InputMethodScreenProps {
  onPickRecording: () => void;
  onBack: () => void;
}

export function InputMethodScreen({
  onPickRecording,
  onBack,
}: InputMethodScreenProps) {
  const { toast } = useToast();

  return (
    <div className="flex h-full flex-col gap-4 px-6 py-6">
      <header className="flex items-start justify-between gap-3">
        <h1 className="text-[20px] font-semibold tracking-tight text-[color:var(--text-1)]">
          How would you like to teach Superlabs?
        </h1>
        <button
          type="button"
          onClick={onBack}
          className="rounded-md px-2 py-1 text-[12px] font-medium text-[color:var(--text-2)] hover:bg-black/5"
        >
          Back
        </button>
      </header>

      <div className="flex flex-col gap-2.5">
        <AutomationCard
          icon={Video}
          title="Record your screen"
          subtitle="Show us by doing it once"
          recommended
          recommendedTooltip="Recording captures the most detail"
          onClick={onPickRecording}
        />
        <AutomationCard
          icon={Type}
          title="Describe in text"
          subtitle="Write out the steps"
          onClick={() =>
            toast({
              kind: "info",
              title: "Coming soon",
              body: "Text-based teaching is on the way.",
            })
          }
        />
        <AutomationCard
          icon={ImageIcon}
          title="Upload screenshots"
          subtitle="Walk through with images"
          onClick={() =>
            toast({
              kind: "info",
              title: "Coming soon",
              body: "Screenshot walkthroughs are on the way.",
            })
          }
        />
      </div>
    </div>
  );
}
