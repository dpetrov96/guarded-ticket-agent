import { useEffect, useState } from "react";

import { useTicketRefresh } from "@/context/TicketRefreshContext";
import { fetchTenants, type TenantId, type TenantSummary } from "@/lib/tenant";

type UseTenantsResult = {
  tenants: TenantSummary[];
  loading: boolean;
  error: string | null;
};

export function useTenants(): UseTenantsResult {
  const { version } = useTicketRefresh();
  const [tenants, setTenants] = useState<TenantSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchTenants()
      .then((data) => {
        if (!cancelled) {
          setTenants(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setTenants([]);
          setError(err instanceof Error ? err.message : "Failed to load tenants");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [version]);

  return { tenants, loading, error };
}

export function findTenant(
  tenants: TenantSummary[],
  tenantId: TenantId,
): TenantSummary | undefined {
  return tenants.find((tenant) => tenant.id === tenantId);
}
