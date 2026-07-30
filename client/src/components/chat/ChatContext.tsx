import type { UseChatHelpers } from "@ai-sdk/react";
import { createContext, useContext } from "react";
import type { UIMessage } from "ai";

export type ChatContextValue = UseChatHelpers<UIMessage> & {
  sendUserMessage: (text: string) => void;
};

export const ChatContext = createContext<ChatContextValue | null>(null);

export function useChatContext(): ChatContextValue {
  const value = useContext(ChatContext);
  if (!value) {
    throw new Error("useChatContext must be used within ChatRuntime");
  }
  return value;
}
