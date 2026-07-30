import { MessagePrimitive } from "@assistant-ui/react";

export function UserMessage() {
  return (
    <MessagePrimitive.Root className="mb-6 flex justify-end">
      <div className="max-w-[min(85%,640px)] rounded-xl bg-primary px-4 py-3 text-[15px] leading-relaxed text-primary-foreground">
        <MessagePrimitive.Parts />
      </div>
    </MessagePrimitive.Root>
  );
}

export function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="mb-6 flex justify-start">
      <div className="max-w-[min(90%,680px)] rounded-xl border border-border bg-card px-4 py-3 text-[15px] leading-relaxed">
        <MessagePrimitive.Parts />
      </div>
    </MessagePrimitive.Root>
  );
}
