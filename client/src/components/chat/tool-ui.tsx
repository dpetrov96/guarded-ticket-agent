import {
  getToolName,
  type DynamicToolUIPart,
  type ToolUIPart,
} from "ai";

import { ApprovalModal, type MutateArgs } from "@/components/chat/ApprovalModal";
import {
  MutateTicketTrace,
  SearchTicketsTrace,
} from "@/components/chat/ToolTrace";

type AnyToolPart = ToolUIPart | DynamicToolUIPart;

function resolveToolStatus(part: AnyToolPart): string {
  switch (part.state) {
    case "output-available":
      return "completed";
    case "output-error":
    case "output-denied":
      return "denied";
    case "approval-requested":
      return "awaiting approval";
    case "approval-responded":
      return "running";
    default:
      return "running";
  }
}

type ToolPartViewProps = {
  part: AnyToolPart;
  onApprove?: (approvalId: string) => void;
  onDeny?: (approvalId: string) => void;
};

export function ToolPartView({ part, onApprove, onDeny }: ToolPartViewProps) {
  const toolName = getToolName(part);
  const status = resolveToolStatus(part);
  const args =
    "input" in part && part.input != null && typeof part.input === "object"
      ? part.input
      : {};
  const result =
    part.state === "output-available"
      ? part.output
      : part.state === "output-error"
        ? { success: false, error: part.errorText }
        : undefined;

  const approvalId =
    part.state === "approval-requested" ? part.approval.id : undefined;

  const trace =
    toolName === "search_tickets" ? (
      <SearchTicketsTrace
        args={args as { query?: string }}
        result={result as never}
        status={status}
      />
    ) : toolName === "mutate_ticket" ? (
      <MutateTicketTrace
        args={args as MutateArgs}
        result={result as never}
        status={status}
      />
    ) : null;

  return (
    <>
      {trace}
      {toolName === "mutate_ticket" && approvalId ? (
        <ApprovalModal
          open
          args={args as MutateArgs}
          onApprove={() => onApprove?.(approvalId)}
          onDeny={() => onDeny?.(approvalId)}
        />
      ) : null}
    </>
  );
}
