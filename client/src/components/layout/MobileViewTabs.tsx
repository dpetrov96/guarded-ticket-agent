import { MessageSquare, PanelLeft } from "lucide-react";

import { cn } from "@/lib/utils";

export type MobileView = "chat" | "tickets";

type MobileViewTabsProps = {
  view: MobileView;
  onChange: (view: MobileView) => void;
};

export function MobileViewTabs({ view, onChange }: MobileViewTabsProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-3 sm:px-6 lg:hidden">
      <div className="flex rounded-lg border border-border bg-secondary/60 p-0.5">
        <button
          type="button"
          onClick={() => onChange("chat")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-[14px] font-medium transition-colors",
            view === "chat"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground",
          )}
        >
          <MessageSquare className="size-4" />
          Chat
        </button>
        <button
          type="button"
          onClick={() => onChange("tickets")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-[14px] font-medium transition-colors",
            view === "tickets"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground",
          )}
        >
          <PanelLeft className="size-4" />
          Tickets
        </button>
      </div>
    </div>
  );
}
