import { ChatRuntime } from "@/components/chat/ChatRuntime";
import { ChatUnavailable } from "@/components/chat/ChatUnavailable";
import { useChatConfigured } from "@/hooks/useChatConfigured";
import type { TenantSummary } from "@/lib/tenant";

type ChatPanelProps = {
  tenant: TenantSummary;
};

export function ChatPanel({ tenant }: ChatPanelProps) {
  const chatConfigured = useChatConfigured();

  if (chatConfigured === null) {
    return (
      <div className="flex h-full min-h-0 flex-1 items-center justify-center text-[14px] text-muted-foreground">
        Checking chat configuration…
      </div>
    );
  }

  if (!chatConfigured) {
    return <ChatUnavailable tenant={tenant} />;
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <ChatRuntime key={tenant.id} tenant={tenant} />
    </div>
  );
}
