import { apiUrl } from "@/lib/api";
import type { TenantId } from "@/lib/tenant";

export type TicketSummary = {
  id: string;
  displayId: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  untrusted?: boolean;
};

export async function fetchTickets(tenantId: TenantId): Promise<TicketSummary[]> {
  const response = await fetch(apiUrl("/api/tickets"), {
    headers: {
      "X-Tenant-ID": tenantId,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load tickets");
  }

  const data = (await response.json()) as { tickets: TicketSummary[] };
  return data.tickets;
}

export function formatTicketStatus(status: string): string {
  return status.replaceAll("_", " ");
}
