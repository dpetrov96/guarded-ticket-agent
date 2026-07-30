import { ComposerPrimitive, ThreadPrimitive } from "@assistant-ui/react";
import { AlertTriangle, ArrowUp } from "lucide-react";
import { useState } from "react";

import {
  AssistantMessage,
  UserMessage,
} from "@/components/chat/ChatMessages";
import { ChatEmptyState } from "@/components/chat/ChatEmptyState";
import { useChatSend } from "@/components/chat/ChatSendContext";
import type { TenantSummary } from "@/lib/tenant";
import { cn } from "@/lib/utils";

type ChatThreadProps = {
  tenant: TenantSummary;
};

function ChatError() {
  const { error } = useChatSend();

  if (!error) {
    return null;
  }

  return (
    <div className="mb-3 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] leading-relaxed text-red-800">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      <span className="break-words">{error}</span>
    </div>
  );
}

function ChatComposer() {
  const { sendMessage, isRunning } = useChatSend();
  const [text, setText] = useState("");
  const canSend = text.trim().length > 0 && !isRunning;

  const handleSend = () => {
    const message = text.trim();
    if (!message || isRunning) {
      return;
    }

    sendMessage(message);
    setText("");
  };

  return (
    <ComposerPrimitive.Root
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
    </ComposerPrimitive.Root>
  );
}

export function ChatThread({ tenant }: ChatThreadProps) {
  return (
    <ThreadPrimitive.Root className="flex min-h-0 flex-1 flex-col">
      <ThreadPrimitive.Viewport className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-6">
        <ThreadPrimitive.Empty>
          <ChatEmptyState tenant={tenant} />
        </ThreadPrimitive.Empty>
        <ThreadPrimitive.Messages>
          {({ message }) =>
            message.role === "user" ? <UserMessage /> : <AssistantMessage />
          }
        </ThreadPrimitive.Messages>
      </ThreadPrimitive.Viewport>

      <div className="relative z-10 shrink-0 border-t border-border bg-card px-4 py-3 sm:px-6 sm:py-4">
        <ChatError />
        <ChatComposer />
        <p className="mt-2 hidden text-center text-[13px] text-muted-foreground sm:block">
          Mutations require approval. Tenant scope is enforced at the tool layer.
        </p>
      </div>
    </ThreadPrimitive.Root>
  );
}
