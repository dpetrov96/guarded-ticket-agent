import { useEffect, useState } from "react";

import { useTicketRefresh } from "@/context/TicketRefreshContext";
import { fetchTickets, type TicketSummary } from "@/lib/tickets";
import type { TenantId } from "@/lib/tenant";

type TicketsState = {
  tenantId: TenantId | null;
  tickets: TicketSummary[];
  error: string | null;
};

type UseTenantTicketsResult = {
  tickets: TicketSummary[];
  loading: boolean;
  error: string | null;
};

export function useTenantTickets(tenantId: TenantId): UseTenantTicketsResult {
  const { version } = useTicketRefresh();
  const [state, setState] = useState<TicketsState>({
    tenantId: null,
    tickets: [],
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetchTickets(tenantId)
      .then((tickets) => {
        if (!cancelled) {
          setState({ tenantId, tickets, error: null });
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            tenantId,
            tickets: [],
            error: err instanceof Error ? err.message : "Failed to load tickets",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [tenantId, version]);

  // Loading is derived: we have not yet stored a result for the current tenant.
  const loading = state.tenantId !== tenantId;

  return {
    tickets: loading ? [] : state.tickets,
    loading,
    error: loading ? null : state.error,
  };
}
