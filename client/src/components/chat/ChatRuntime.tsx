import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithApprovalResponses,
} from "ai";
import { useCallback, useMemo } from "react";

import { ChatContext, type ChatContextValue } from "@/components/chat/ChatContext";
import { ChatThread } from "@/components/chat/ChatThread";
import { apiUrl } from "@/lib/api";
import type { TenantSummary } from "@/lib/tenant";

type ChatRuntimeProps = {
  tenant: TenantSummary;
};

export function ChatRuntime({ tenant }: ChatRuntimeProps) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: apiUrl("/api/chat"),
        headers: {
          "X-Tenant-ID": tenant.id,
        },
      }),
    [tenant.id],
  );

  const chat = useChat({
    transport,
    sendAutomaticallyWhen:
      lastAssistantMessageIsCompleteWithApprovalResponses,
  });

  const sendUserMessage = useCallback(
    (text: string) => {
      const message = text.trim();
      if (
        !message ||
        chat.status === "streaming" ||
        chat.status === "submitted"
      ) {
        return;
      }

      void chat.sendMessage({ text: message });
    },
    [chat],
  );

  const contextValue = useMemo<ChatContextValue>(
    () => ({
      ...chat,
      sendUserMessage,
    }),
    [chat, sendUserMessage],
  );

  return (
    <ChatContext.Provider value={contextValue}>
      <div className="flex h-full min-h-0 flex-1 flex-col">
        <ChatThread tenant={tenant} />
      </div>
    </ChatContext.Provider>
  );
}
