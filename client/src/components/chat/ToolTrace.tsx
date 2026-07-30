import type { ReactNode } from "react";
import {
  CheckCircle2,
  Loader2,
  Pencil,
  Search,
  ShieldAlert,
  XCircle,
} from "lucide-react";

import { ChatTicketCard, type ChatTicket } from "@/components/chat/ChatTicketCard";
import { cn } from "@/lib/utils";

type ToolTraceProps = {
  toolName: string;
  status?: string;
  icon?: ReactNode;
  subtitle?: string;
  children?: ReactNode;
};

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string; Icon: typeof Loader2 }
> = {
  running: {
    label: "Running",
    className: "bg-sky-50 text-sky-700",
    Icon: Loader2,
  },
  completed: {
    label: "Done",
    className: "bg-emerald-50 text-emerald-700",
    Icon: CheckCircle2,
  },
  denied: {
    label: "Denied",
    className: "bg-red-50 text-red-700",
    Icon: XCircle,
  },
  "awaiting approval": {
    label: "Needs approval",
    className: "bg-amber-50 text-amber-800",
    Icon: ShieldAlert,
  },
};

const TOOL_ICONS: Record<string, typeof Search> = {
  search_tickets: Search,
  mutate_ticket: Pencil,
};

export function ToolTrace({
  toolName,
  status,
  icon,
  subtitle,
  children,
}: ToolTraceProps) {
  const normalizedStatus = status ?? "running";
  const config = STATUS_CONFIG[normalizedStatus] ?? STATUS_CONFIG.running;
  const StatusIcon = config.Icon;
  const isRunning = normalizedStatus === "running";
  const ToolIcon = TOOL_ICONS[toolName] ?? Search;

  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-gradient-to-b from-card to-secondary/20 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-start gap-3 px-4 py-3">
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon ?? <ToolIcon className="size-4" strokeWidth={2} />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-foreground">
                {toolName === "search_tickets"
                  ? "Ticket search"
                  : toolName === "mutate_ticket"
                    ? "Ticket mutation"
                    : toolName}
              </p>
              {subtitle ? (
                <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                  {subtitle}
                </p>
              ) : null}
            </div>

            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
                config.className,
              )}
            >
              <StatusIcon className={cn("size-3.5", isRunning && "animate-spin")} />
              {config.label}
            </span>
          </div>
        </div>
      </div>

      {children ? (
        <div className="border-t border-border/60 px-4 py-3">{children}</div>
      ) : null}
    </div>
  );
}

type SearchResult = {
  count?: number;
  tickets?: ChatTicket[];
};

type SearchArgs = {
  query?: string;
};

export function SearchTicketsTrace({
  args = {},
  result,
  status,
}: {
  args?: SearchArgs;
  result?: SearchResult;
  status?: string;
}) {
  const query = args?.query?.trim();
  const tickets = result?.tickets ?? [];
  const count = result?.count ?? tickets.length;
  const isRunning = (status ?? "running") === "running" && result === undefined;

  const subtitle = query
    ? `“${query}”`
    : "All tickets in your tenant";

  return (
    <ToolTrace
      toolName="search_tickets"
      status={status}
      subtitle={subtitle}
    >
      {isRunning ? (
        <div className="space-y-2">
          {[0, 1].map((key) => (
            <div
              key={key}
              className="h-[72px] animate-pulse rounded-xl bg-secondary/60"
            />
          ))}
        </div>
      ) : result !== undefined ? (
        <div className="space-y-3">
          <p className="text-[12px] font-medium text-muted-foreground">
            {count === 0
              ? "No matching tickets"
              : `${count} ticket${count === 1 ? "" : "s"} found`}
          </p>

          {tickets.length > 0 ? (
            <div className="grid gap-2.5 sm:grid-cols-2">
              {tickets.map((ticket) => (
                <ChatTicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-border bg-secondary/30 px-3 py-4 text-center text-[13px] text-muted-foreground">
              Try a different search term or list all tickets with an empty query.
            </p>
          )}
        </div>
      ) : null}
    </ToolTrace>
  );
}

type MutateArgs = {
  id?: string;
  action?: string;
  fields?: Record<string, unknown>;
};

type MutateResult = {
  success?: boolean;
  error?: string;
  action?: string;
  id?: string;
  displayId?: string;
  ticket?: ChatTicket;
};

export function MutateTicketTrace({
  args = {},
  result,
  status,
}: {
  args?: MutateArgs;
  result?: MutateResult;
  status?: string;
}) {
  const fields = args?.fields ?? {};
  const ticketRef = args?.id ?? "—";
  const action = args?.action ?? "—";

  const subtitle =
    args?.action === "delete"
      ? `Delete ${ticketRef}`
      : args?.action === "update"
        ? `Update ${ticketRef}`
        : `Request on ${ticketRef}`;

  return (
    <ToolTrace toolName="mutate_ticket" status={status} subtitle={subtitle}>
      <dl className="grid gap-2 text-[13px]">
        <div className="flex gap-3">
          <dt className="w-14 shrink-0 text-muted-foreground">Action</dt>
          <dd className="font-medium capitalize">{action}</dd>
        </div>

        {args?.action === "update" && Object.keys(fields).length > 0 ? (
          <div className="flex gap-3">
            <dt className="w-14 shrink-0 text-muted-foreground">Changes</dt>
            <dd>
              <ul className="space-y-1">
                {Object.entries(fields).map(([key, value]) => (
                  <li
                    key={key}
                    className="rounded-md bg-secondary/50 px-2 py-1 font-mono text-[12px]"
                  >
                    <span className="text-muted-foreground">{key}:</span>{" "}
                    {String(value)}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}
      </dl>

      {result !== undefined ? (
        <div className="mt-3 border-t border-border/60 pt-3">
          {result.success === false ? (
            <p className="text-[13px] text-red-700">
              {result.error ?? "Mutation failed"}
            </p>
          ) : result.ticket ? (
            <ChatTicketCard ticket={result.ticket} compact />
          ) : (
            <p className="text-[13px] text-emerald-700">
              {result.action === "delete"
                ? `Deleted ${result.displayId ?? result.id ?? "ticket"}`
                : `Updated ${result.displayId ?? result.id ?? "ticket"}`}
            </p>
          )}
        </div>
      ) : null}
    </ToolTrace>
  );
}
