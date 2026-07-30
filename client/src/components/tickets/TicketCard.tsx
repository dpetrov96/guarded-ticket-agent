import { ShieldAlert } from "lucide-react";

import { formatTicketStatus } from "@/lib/tickets";
import type { TicketSummary } from "@/lib/tickets";

type TicketCardProps = {
  ticket: TicketSummary;
};

export function TicketCard({ ticket }: TicketCardProps) {
  return (
    <article className="px-4 py-3.5 transition hover:bg-secondary/40 sm:px-5 sm:py-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="font-mono text-[14px] font-medium text-foreground">
          {ticket.displayId}
        </span>
        <span className="badge shrink-0 capitalize">
          {formatTicketStatus(ticket.status)} · {ticket.priority}
        </span>
      </div>

      <h3 className="text-[15px] font-medium leading-snug text-foreground">
        {ticket.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-[14px] leading-relaxed text-muted-foreground">
        {ticket.description}
      </p>

      {ticket.untrusted ? (
        <p className="mt-3 flex items-center gap-2 text-[14px] text-amber-700">
          <ShieldAlert className="size-4 shrink-0" />
          Untrusted content — treated as data
        </p>
      ) : null}
    </article>
  );
}
