import type { TenantId } from "../tenant/types.js";
import { SEED_TICKETS } from "./seed.js";
import type {
  StoreResult,
  Ticket,
  TicketStatus,
  TicketUpdateFields,
} from "./types.js";

function cloneTicket(ticket: Ticket): Ticket {
  return { ...ticket };
}

function matchesQuery(ticket: Ticket, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return (
    ticket.id.toLowerCase().includes(normalized) ||
    ticket.displayId.toLowerCase().includes(normalized) ||
    ticket.title.toLowerCase().includes(normalized) ||
    ticket.description.toLowerCase().includes(normalized) ||
    ticket.status.toLowerCase().includes(normalized)
  );
}

export class TicketStore {
  private tickets: Ticket[];

  constructor(seed: Ticket[] = SEED_TICKETS) {
    this.tickets = seed.map(cloneTicket);
  }

  search(tenantId: TenantId, query: string): Ticket[] {
    return this.tickets
      .filter((ticket) => ticket.tenantId === tenantId)
      .filter((ticket) => matchesQuery(ticket, query))
      .map(cloneTicket);
  }

  /**
   * Resolves a ticket by internal id or human-facing displayId (e.g. "MER-101"),
   * always scoped to the caller's tenant. Cross-tenant refs resolve to -1.
   */
  private findIndexByRef(tenantId: TenantId, ref: string): number {
    const normalized = ref.trim().toLowerCase();
    return this.tickets.findIndex(
      (entry) =>
        entry.tenantId === tenantId &&
        (entry.id.toLowerCase() === normalized ||
          entry.displayId.toLowerCase() === normalized),
    );
  }

  getById(tenantId: TenantId, ref: string): Ticket | null {
    const index = this.findIndexByRef(tenantId, ref);
    return index === -1 ? null : cloneTicket(this.tickets[index]);
  }

  update(
    tenantId: TenantId,
    ref: string,
    fields: TicketUpdateFields,
  ): StoreResult<Ticket> {
    const index = this.findIndexByRef(tenantId, ref);

    if (index === -1) {
      return {
        ok: false,
        error: `Ticket ${ref} was not found for this tenant`,
      };
    }

    const current = this.tickets[index];
    const next: Ticket = {
      ...current,
      ...fields,
      // Identity and tenant ownership can never be changed via update fields.
      id: current.id,
      displayId: current.displayId,
      tenantId: current.tenantId,
    };

    this.tickets[index] = next;
    return { ok: true, data: cloneTicket(next) };
  }

  delete(tenantId: TenantId, ref: string): StoreResult<{ id: string; displayId: string }> {
    const index = this.findIndexByRef(tenantId, ref);

    if (index === -1) {
      return {
        ok: false,
        error: `Ticket ${ref} was not found for this tenant`,
      };
    }

    const [removed] = this.tickets.splice(index, 1);
    return { ok: true, data: { id: removed.id, displayId: removed.displayId } };
  }

  listByTenant(tenantId: TenantId): Ticket[] {
    return this.tickets
      .filter((ticket) => ticket.tenantId === tenantId)
      .map(cloneTicket);
  }
}

export const ticketStore = new TicketStore();

export function isTicketStatus(value: string): value is TicketStatus {
  return ["open", "in_progress", "resolved", "closed"].includes(value);
}
