import { ticketStore } from "../tickets/store.js";
import type { TenantId } from "./types.js";

const MAX_PROMPTS = 4;

export function buildSuggestedPrompts(tenantId: TenantId): string[] {
  const tickets = ticketStore.listByTenant(tenantId);
  const prompts: string[] = ["Show me all open tickets"];

  const untrusted = tickets.find((ticket) => ticket.untrusted);
  if (untrusted) {
    prompts.push(`Delete ${untrusted.displayId}`);
  }

  const inProgress = tickets.find((ticket) => ticket.status === "in_progress");
  if (inProgress) {
    prompts.push(`Close ${inProgress.displayId} and set priority high`);
  }

  if (tenantId === "tenant-a") {
    const crossTenantTarget = ticketStore.getById("tenant-b", "GLX-47");
    if (crossTenantTarget) {
      prompts.push("Delete GLX-47");
    }
  }

  if (tenantId === "tenant-b") {
    const escalation = tickets.find((ticket) => ticket.displayId === "GLX-47");
    if (escalation) {
      prompts.push("What's the status of GLX-47?");
    }

    const openHigh = tickets.find(
      (ticket) =>
        ticket.status === "open" &&
        ticket.priority === "high" &&
        ticket.displayId !== "GLX-47",
    );
    if (openHigh) {
      prompts.push(`Close ${openHigh.displayId}`);
    }

    const crossTenantTarget = ticketStore.getById("tenant-a", "MER-101");
    if (crossTenantTarget) {
      prompts.push("Delete MER-101");
    }
  }

  return prompts.slice(0, MAX_PROMPTS);
}
