import { isToolUIPart, type UIMessage } from "ai";

import { MarkdownMessage } from "@/components/chat/MarkdownMessage";
import { ToolPartView } from "@/components/chat/tool-ui";

type ChatMessageListProps = {
  messages: UIMessage[];
  onApprove: (approvalId: string) => void;
  onDeny: (approvalId: string) => void;
};

function AssistantMessageContent({
  message,
  onApprove,
  onDeny,
}: {
  message: UIMessage;
  onApprove: (approvalId: string) => void;
  onDeny: (approvalId: string) => void;
}) {
  const toolParts = message.parts.filter(isToolUIPart);
  const textContent = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");

  return (
    <div className="flex w-full max-w-[min(96%,760px)] flex-col gap-3">
      {toolParts.map((part) => (
        <ToolPartView
          key={part.toolCallId}
          part={part}
          onApprove={onApprove}
          onDeny={onDeny}
        />
      ))}

      {textContent.trim() ? (
        <div className="rounded-xl border border-border bg-card px-4 py-3 text-[15px] leading-relaxed">
          <MarkdownMessage content={textContent} />
        </div>
      ) : null}
    </div>
  );
}

export function ChatMessageList({
  messages,
  onApprove,
  onDeny,
}: ChatMessageListProps) {
  return (
    <div className="space-y-6">
      {messages.map((message) =>
        message.role === "user" ? (
          <div key={message.id} className="flex justify-end">
            <div className="max-w-[min(85%,640px)] rounded-xl bg-primary px-4 py-3 text-[15px] leading-relaxed text-primary-foreground">
              {message.parts
                .filter((part) => part.type === "text")
                .map((part) => part.text)
                .join("")}
            </div>
          </div>
        ) : (
          <div key={message.id} className="flex justify-start">
            <AssistantMessageContent
              message={message}
              onApprove={onApprove}
              onDeny={onDeny}
            />
          </div>
        ),
      )}
    </div>
  );
}
