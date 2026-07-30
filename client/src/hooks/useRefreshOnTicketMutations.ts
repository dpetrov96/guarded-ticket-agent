import { getToolName, isToolUIPart, type UIMessage } from "ai";
import { useEffect, useRef } from "react";

import { useTicketRefresh } from "@/context/TicketRefreshContext";

type MutateOutput = {
  success?: boolean;
};

function findLatestSuccessfulMutation(
  messages: UIMessage[],
): string | null {
  for (let messageIndex = messages.length - 1; messageIndex >= 0; messageIndex -= 1) {
    const message = messages[messageIndex];
    if (message.role !== "assistant") {
      continue;
    }

    for (let partIndex = message.parts.length - 1; partIndex >= 0; partIndex -= 1) {
      const part = message.parts[partIndex];
      if (!isToolUIPart(part) || getToolName(part) !== "mutate_ticket") {
        continue;
      }

      if (part.state !== "output-available") {
        continue;
      }

      const output = part.output as MutateOutput | undefined;
      if (output?.success) {
        return part.toolCallId;
      }
    }
  }

  return null;
}

export function useRefreshOnTicketMutations(messages: UIMessage[]) {
  const { refreshTicketData } = useTicketRefresh();
  const lastMutationRef = useRef<string | null>(null);

  useEffect(() => {
    const mutationId = findLatestSuccessfulMutation(messages);
    if (!mutationId || mutationId === lastMutationRef.current) {
      return;
    }

    lastMutationRef.current = mutationId;
    refreshTicketData();
  }, [messages, refreshTicketData]);
}
