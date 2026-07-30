import { createContext, useContext } from "react";

type ChatSendContextValue = {
  sendMessage: (text: string) => void;
  isRunning: boolean;
  error: string | null;
};

export const ChatSendContext = createContext<ChatSendContextValue | null>(null);

export function useChatSend(): ChatSendContextValue {
  const value = useContext(ChatSendContext);
  if (!value) {
    throw new Error("useChatSend must be used within ChatRuntime");
  }
  return value;
}
