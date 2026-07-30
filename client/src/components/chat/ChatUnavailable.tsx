import { KeyRound, MessageSquare } from "lucide-react";

import type { TenantSummary } from "@/lib/tenant";

type ChatUnavailableProps = {
  tenant: TenantSummary;
};

export function ChatUnavailable({ tenant }: ChatUnavailableProps) {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6 text-center sm:px-8 sm:py-10">
        <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-secondary text-muted-foreground sm:mb-6 sm:size-12">
          <MessageSquare className="size-5 sm:size-6" strokeWidth={1.75} />
        </div>

        <h2 className="text-[20px] font-semibold tracking-[-0.02em] sm:text-[22px]">
          Chat unavailable
        </h2>
        <p className="mt-2 max-w-md text-[14px] leading-relaxed text-muted-foreground sm:mt-3 sm:text-[15px]">
          The agent is not configured for {tenant.corpName} yet. Add your Gemini
          API key to enable live responses.
        </p>

        <div className="mt-6 w-full max-w-lg rounded-lg border border-border bg-secondary/40 px-4 py-3 text-left">
          <div className="mb-2 flex items-center gap-2 text-[14px] font-medium text-foreground">
            <KeyRound className="size-4 text-muted-foreground" />
            Setup
          </div>
          <ol className="list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed text-muted-foreground sm:text-[14px]">
            <li>
              Copy <code className="rounded bg-card px-1 py-0.5">.env.example</code>{" "}
              to <code className="rounded bg-card px-1 py-0.5">.env</code>
            </li>
            <li>
              Set{" "}
              <code className="rounded bg-card px-1 py-0.5">
                GOOGLE_GENERATIVE_AI_API_KEY
              </code>
            </li>
            <li>Restart the server with npm run dev</li>
          </ol>
        </div>
      </div>

      <div className="relative z-10 shrink-0 border-t border-border bg-card px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-end gap-2 opacity-60">
          <textarea
            disabled
            rows={1}
            placeholder="Chat disabled until API key is configured"
            className="max-h-40 min-h-[48px] flex-1 cursor-not-allowed resize-none rounded-lg border border-border bg-muted py-3 pl-4 text-[15px] text-muted-foreground sm:min-h-[52px]"
          />
          <button
            type="button"
            disabled
            className="mb-0.5 flex size-10 shrink-0 cursor-not-allowed items-center justify-center rounded-md bg-primary/50 text-primary-foreground"
            aria-label="Send disabled"
          >
            ↑
          </button>
        </div>
        <p className="mt-2 text-center text-[13px] text-muted-foreground">
          Ticket sidebar and tenant switching still work for demo review.
        </p>
      </div>
    </div>
  );
}
