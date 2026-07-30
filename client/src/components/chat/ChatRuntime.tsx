import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChat } from "@ai-sdk/react";
import {
  AssistantChatTransport,
  useAISDKRuntime,
} from "@assistant-ui/react-ai-sdk";
import { lastAssistantMessageIsCompleteWithApprovalResponses } from "ai";
import { useCallback, useMemo } from "react";

import { ChatSendContext } from "@/components/chat/ChatSendContext";
import { ChatThread } from "@/components/chat/ChatThread";
import { ChatToolRegistration } from "@/components/chat/chat-toolkit";
import { apiUrl } from "@/lib/api";
import type { TenantSummary } from "@/lib/tenant";

type ChatRuntimeProps = {
  tenant: TenantSummary;
};

export function ChatRuntime({ tenant }: ChatRuntimeProps) {
  const transport = useMemo(
    () =>
      new AssistantChatTransport({
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

  const runtime = useAISDKRuntime(chat);

  const sendMessage = useCallback(
    (text: string) => {
      const message = text.trim();
      if (!message || chat.status === "streaming" || chat.status === "submitted") {
        return;
      }
      void chat.sendMessage({ text: message });
    },
    [chat],
  );

  const sendContext = useMemo(
    () => ({
      sendMessage,
      isRunning: chat.status === "streaming" || chat.status === "submitted",
      error:
        chat.status === "error"
          ? (chat.error?.message ?? "The chat request failed.")
          : null,
    }),
    [sendMessage, chat.status, chat.error],
  );

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <ChatSendContext.Provider value={sendContext}>
        <ChatToolRegistration />
        <div className="flex h-full min-h-0 flex-1 flex-col">
          <ChatThread tenant={tenant} />
        </div>
      </ChatSendContext.Provider>
    </AssistantRuntimeProvider>
  );
}
