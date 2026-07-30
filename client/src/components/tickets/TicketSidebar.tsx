import { useTenantTickets } from "@/hooks/useTenantTickets";
import { TicketCard } from "@/components/tickets/TicketCard";
import type { TenantSummary } from "@/lib/tenant";
import { cn } from "@/lib/utils";

type TicketSidebarProps = {
  tenant: TenantSummary;
  className?: string;
};

export function TicketSidebar({ tenant, className }: TicketSidebarProps) {
  const { tickets, loading, error } = useTenantTickets(tenant.id);

  return (
    <aside
      className={cn(
        "w-full flex-col overflow-hidden lg:flex lg:w-[340px] lg:shrink-0",
        className,
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-card lg:surface lg:rounded-xl">
        <div className="shrink-0 border-b border-border px-4 py-3 sm:px-5 sm:py-4">
          <h2 className="text-[15px] font-semibold text-foreground">
            Tenant data
          </h2>
          <p className="mt-0.5 text-[14px] text-muted-foreground">
            {loading
              ? "Loading tickets…"
              : `${tickets.length} tickets · ${tenant.corpName}`}
          </p>
        </div>

        <div className="min-h-0 flex-1 divide-y divide-border overflow-y-auto overscroll-contain">
          {error ? (
            <p className="px-4 py-6 text-[14px] text-muted-foreground sm:px-5">
              {error}
            </p>
          ) : null}

          {!loading &&
            !error &&
            tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
        </div>
      </div>
    </aside>
  );
}
