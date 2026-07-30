import type { PublicTicket, Ticket } from "./types.js";

export function toPublicTicket(ticket: Ticket): PublicTicket {
  return {
    id: ticket.id,
    displayId: ticket.displayId,
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority,
    ...(ticket.untrusted ? { untrusted: true } : {}),
  };
}
