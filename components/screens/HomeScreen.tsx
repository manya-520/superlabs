"use client";

import { BarChart3, MessageSquare, Receipt, Wallet } from "lucide-react";

import { AutomationCard } from "@/components/ui/AutomationCard";
import { useToast } from "@/components/ui/Toast";

export interface HomeScreenProps {
  onPick: () => void;
}

export function HomeScreen({ onPick }: HomeScreenProps) {
  const { toast } = useToast();

  return (
    <div className="flex h-full flex-col gap-4 px-6 py-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-[24px] font-semibold tracking-tight text-[color:var(--text-1)]">
          Hey Maria <span aria-hidden>👋</span>
        </h1>
        <p className="text-[14px] text-[color:var(--text-2)]">
          Let&apos;s automate something.
        </p>
      </header>

      <div className="flex flex-col gap-2.5">
        <AutomationCard
          icon={MessageSquare}
          title="Process AI tool invoices from Slack"
          subtitle="Log, file, and enter in QuickBooks"
          recommended
          recommendedTooltip="Based on what you do most this month"
          onClick={onPick}
        />
        <AutomationCard
          icon={Wallet}
          title="Categorize expenses"
          subtitle="Tag expenses by category"
          onClick={() =>
            toast({
              kind: "info",
              title: "Coming soon",
              body: "This automation isn't ready yet.",
            })
          }
        />
        <AutomationCard
          icon={Receipt}
          title="Reconcile receipts"
          subtitle="Match receipts to transactions"
          onClick={() =>
            toast({
              kind: "info",
              title: "Coming soon",
              body: "This automation isn't ready yet.",
            })
          }
        />
        <AutomationCard
          icon={BarChart3}
          title="Generate expense reports"
          subtitle="Monthly expense summaries"
          onClick={() =>
            toast({
              kind: "info",
              title: "Coming soon",
              body: "This automation isn't ready yet.",
            })
          }
        />
      </div>

      <footer className="mt-auto text-center text-[11px] text-[color:var(--text-3)]">
        You can always add your own automations later.
      </footer>
    </div>
  );
}
