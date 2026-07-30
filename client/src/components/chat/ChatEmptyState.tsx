import { MessageSquare } from "lucide-react";

import { useChatSend } from "@/components/chat/ChatSendContext";
import type { TenantSummary } from "@/lib/tenant";

function SuggestedPrompts({ prompts }: { prompts: string[] }) {
  const { sendMessage, isRunning } = useChatSend();

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          disabled={isRunning}
          onClick={() => sendMessage(prompt)}
          className="rounded-lg border border-border bg-card px-4 py-2.5 text-[14px] text-foreground transition hover:border-primary/30 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}

type ChatEmptyStateProps = {
  tenant: TenantSummary;
};

export function ChatEmptyState({ tenant }: ChatEmptyStateProps) {
  return (
    <div className="flex min-h-[min(100%,24rem)] flex-col items-center justify-center px-4 py-6 text-center sm:px-8 sm:py-10">
      <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground sm:mb-6 sm:size-12">
        <MessageSquare className="size-5 sm:size-6" strokeWidth={1.75} />
      </div>

      <h2 className="text-[20px] font-semibold tracking-[-0.02em] sm:text-[22px]">
        Ask about {tenant.corpName} tickets
      </h2>
      <p className="mt-2 max-w-md text-[14px] leading-relaxed text-muted-foreground sm:mt-3 sm:text-[15px]">
        Reads are scoped to your tenant before the model sees them. Updates and
        deletes pause for your approval.
      </p>

      <div className="mt-6 w-full max-w-2xl sm:mt-10">
        <SuggestedPrompts prompts={tenant.suggestedPrompts} />
      </div>
    </div>
  );
}
