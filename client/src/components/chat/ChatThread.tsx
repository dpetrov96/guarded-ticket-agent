import { AlertTriangle, ArrowUp } from "lucide-react";
import { useCallback, useState } from "react";

import { useChatContext } from "@/components/chat/ChatContext";
import { ChatEmptyState } from "@/components/chat/ChatEmptyState";
import { ChatMessageList } from "@/components/chat/ChatMessageList";
import { useRefreshOnTicketMutations } from "@/hooks/useRefreshOnTicketMutations";
import type { TenantSummary } from "@/lib/tenant";
import { cn } from "@/lib/utils";

type ChatThreadProps = {
  tenant: TenantSummary;
};

function ChatError({ message }: { message: string }) {
  return (
    <div className="mb-3 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] leading-relaxed text-red-800">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      <span className="break-words">{message}</span>
    </div>
  );
}

function ChatComposer() {
  const { sendUserMessage, status } = useChatContext();
  const [text, setText] = useState("");
  const isRunning = status === "streaming" || status === "submitted";
  const canSend = text.trim().length > 0 && !isRunning;

  const handleSend = () => {
    const message = text.trim();
    if (!message || isRunning) {
      return;
    }

    sendUserMessage(message);
    setText("");
  };

  return (
    <form
      className="flex items-end gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        handleSend();
      }}
    >
      <textarea
        value={text}
        disabled={isRunning}
        placeholder="Ask about tickets…"
        rows={1}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey && canSend) {
            event.preventDefault();
            handleSend();
          }
        }}
        className="max-h-40 min-h-[48px] flex-1 resize-none rounded-lg border border-border bg-background py-3 pl-4 text-[15px] outline-none transition placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15 sm:min-h-[52px]"
      />
      <button
        type="submit"
        disabled={!canSend}
        className={cn(
          "mb-0.5 flex size-10 shrink-0 items-center justify-center rounded-md",
          "bg-primary text-primary-foreground transition hover:bg-[#4f57c4] disabled:opacity-40",
        )}
        aria-label="Send message"
      >
        <ArrowUp className="size-4" strokeWidth={2.25} />
      </button>
    </form>
  );
}

export function ChatThread({ tenant }: ChatThreadProps) {
  const { messages, status, error, addToolApprovalResponse } = useChatContext();
  useRefreshOnTicketMutations(messages);
  const isRunning = status === "streaming" || status === "submitted";

  const handleApprove = useCallback(
    (approvalId: string) => {
      void addToolApprovalResponse({ id: approvalId, approved: true });
    },
    [addToolApprovalResponse],
  );

  const handleDeny = useCallback(
    (approvalId: string) => {
      void addToolApprovalResponse({
        id: approvalId,
        approved: false,
        reason: "User denied the mutation",
      });
    },
    [addToolApprovalResponse],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-6">
        {messages.length === 0 ? (
          <ChatEmptyState tenant={tenant} />
        ) : (
          <ChatMessageList
            messages={messages}
            onApprove={handleApprove}
            onDeny={handleDeny}
          />
        )}
        {isRunning ? (
          <div className="mt-4 flex justify-start">
            <div className="rounded-xl border border-border bg-card px-4 py-3 text-muted-foreground">
              <span className="inline-block size-2 animate-pulse rounded-full bg-primary" />
            </div>
          </div>
        ) : null}
      </div>

      <div className="relative z-10 shrink-0 border-t border-border bg-card px-4 py-3 sm:px-6 sm:py-4">
        {status === "error" && error ? <ChatError message={error.message} /> : null}
        <ChatComposer />
        <p className="mt-2 hidden text-center text-[13px] text-muted-foreground sm:block">
          Mutations require approval. Tenant scope is enforced at the tool layer.
        </p>
      </div>
    </div>
  );
}
