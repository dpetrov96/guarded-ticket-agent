import { ShieldAlert } from "lucide-react";

import {
  formatLabel,
  hasUntrustedContent,
  PRIORITY_ACCENT,
  PRIORITY_BADGE,
  STATUS_BADGE,
  STATUS_DOT,
  stripUntrustedMarkers,
} from "@/lib/ticket-display";
import { cn } from "@/lib/utils";

export type ChatTicket = {
  id: string;
  displayId: string;
  title: string;
  status: string;
  priority: string;
  description?: string;
};

type ChatTicketCardProps = {
  ticket: ChatTicket;
  compact?: boolean;
};

function Pill({
  label,
  className,
  dotClassName,
}: {
  label: string;
  className?: string;
  dotClassName?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ring-1 ring-inset",
        className,
      )}
    >
      {dotClassName ? (
        <span className={cn("size-1.5 rounded-full", dotClassName)} />
      ) : null}
      {formatLabel(label)}
    </span>
  );
}

export function ChatTicketCard({ ticket, compact = false }: ChatTicketCardProps) {
  const description = stripUntrustedMarkers(ticket.description);
  const untrusted = hasUntrustedContent(ticket.description);

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/80 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition hover:border-primary/20 hover:shadow-[0_4px_12px_rgba(94,106,210,0.08)]",
        "border-l-[3px]",
        PRIORITY_ACCENT[ticket.priority] ?? PRIORITY_ACCENT.low,
        compact ? "p-3" : "p-4",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[12px] font-semibold tracking-wide text-primary">
              {ticket.displayId}
            </span>
            <Pill
              label={ticket.status}
              className={STATUS_BADGE[ticket.status] ?? STATUS_BADGE.open}
              dotClassName={STATUS_DOT[ticket.status] ?? STATUS_DOT.open}
            />
            <Pill
              label={ticket.priority}
              className={PRIORITY_BADGE[ticket.priority] ?? PRIORITY_BADGE.low}
            />
          </div>
          <h3
            className={cn(
              "font-medium leading-snug text-foreground",
              compact ? "text-[13px]" : "text-[14px]",
            )}
          >
            {ticket.title}
          </h3>
        </div>
      </div>

      {description && !compact ? (
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}

      {untrusted ? (
        <p className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-amber-700">
          <ShieldAlert className="size-3.5 shrink-0" />
          Untrusted content in description
        </p>
      ) : null}
    </article>
  );
}
