import type { TenantId } from "../tenant/types.js";

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "critical";

export type Ticket = {
  id: string;
  displayId: string;
  tenantId: TenantId;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  untrusted?: boolean;
};

export type PublicTicket = Pick<
  Ticket,
  "id" | "displayId" | "title" | "description" | "status" | "priority" | "untrusted"
>;

export type TicketUpdateFields = Partial<
  Pick<Ticket, "title" | "description" | "status">
>;

export type StoreResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
