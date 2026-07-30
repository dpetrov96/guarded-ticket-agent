import { useAui } from "@assistant-ui/react";
import { useEffect } from "react";

import { ApprovalModal } from "@/components/chat/ApprovalModal";
import { ToolTrace } from "@/components/chat/ToolTrace";
import type { MutateArgs } from "@/components/chat/ApprovalModal";

export function ChatToolRegistration() {
  const aui = useAui();

  useEffect(() => {
    const unregisterSearch = aui.tools.setToolUI(
      "search_tickets",
      ({ args, result }) => (
        <ToolTrace
          toolName="search_tickets"
          args={args}
          result={result}
          status={result === undefined ? "running" : "completed"}
        />
      ),
    );

    const unregisterMutate = aui.tools.setToolUI(
      "mutate_ticket",
      ({ args, approval, respondToApproval, result }) => {
        const pending = approval?.approved === undefined;

        return (
          <>
            <ToolTrace
              toolName="mutate_ticket"
              args={args}
              result={result}
              status={
                pending
                  ? "awaiting approval"
                  : approval?.approved === false
                    ? "denied"
                    : "completed"
              }
            />
            <ApprovalModal
              open={pending}
              args={args as MutateArgs}
              onApprove={() => respondToApproval?.({ approved: true })}
              onDeny={() =>
                respondToApproval?.({
                  approved: false,
                  reason: "User denied the mutation",
                })
              }
            />
          </>
        );
      },
    );

    return () => {
      unregisterSearch();
      unregisterMutate();
    };
  }, [aui]);

  return null;
}
