import { tool, zodSchema } from "ai";
import { z } from "zod";

import { ticketStore } from "../tickets/store.js";
import type { Ticket } from "../tickets/types.js";
import type { TenantId } from "../tenant/types.js";

export const MUTATE_TICKET_TOOL_NAME = "mutate_ticket";

export const UNTRUSTED_CONTENT_START = "<<<UNTRUSTED_TICKET_CONTENT>>>";
export const UNTRUSTED_CONTENT_END = "<<<END_UNTRUSTED_TICKET_CONTENT>>>";

/**
 * Spotlighting: ticket descriptions are attacker-controlled. Delimiting them
 * makes the data/instruction boundary explicit to the model. This is a
 * mitigation layer only — the hard guarantees (tenant scoping, approval gate)
 * are enforced in code and hold even if the model ignores the markers.
 */
function spotlightDescription(description: string): string {
  return `${UNTRUSTED_CONTENT_START}${description}${UNTRUSTED_CONTENT_END}`;
}

function toToolTicket(ticket: Ticket) {
  return {
    id: ticket.id,
    displayId: ticket.displayId,
    title: ticket.title,
    status: ticket.status,
    priority: ticket.priority,
    description: spotlightDescription(ticket.description),
  };
}

export function createSearchTicketsTool(tenantId: TenantId) {
  return tool({
    description:
      "Search tickets for the current tenant by id, display id, title, description, or status. " +
      "Pass an empty query to list all tickets.",
    inputSchema: zodSchema(
      z.object({
        query: z
          .string()
          .describe("Search text matched against ticket fields"),
      }),
    ),
    execute: async ({ query }) => {
      // tenantId comes from the authenticated request context (closure),
      // never from model-controlled input — query content cannot widen scope.
      const tickets = ticketStore.search(tenantId, query);
      return {
        count: tickets.length,
        tickets: tickets.map(toToolTicket),
      };
    },
  });
}

export function createMutateTicketTool(tenantId: TenantId) {
  return tool({
    description:
      "Update or delete a ticket for the current tenant. " +
      "Accepts the internal id or the display id (e.g. MER-101). " +
      "Requires explicit human approval in the UI before execution.",
    // Approval is a property of the tool itself, not of a particular chat
    // route: wherever this tool is registered, the AI SDK will halt the run
    // and emit an approval request instead of calling execute().
    needsApproval: true,
    inputSchema: zodSchema(
      z.object({
        id: z.string().describe("Ticket id or display id (e.g. MER-101)"),
        action: z.enum(["update", "delete"]),
        fields: z
          .object({
            title: z.string().optional(),
            description: z.string().optional(),
            status: z
              .enum(["open", "in_progress", "resolved", "closed"])
              .optional(),
          })
          .optional()
          .describe("Fields to update when action is update"),
      }),
    ),
    execute: async ({ id, action, fields }) => {
      if (action === "delete") {
        const result = ticketStore.delete(tenantId, id);
        if (!result.ok) {
          return { success: false, error: result.error };
        }
        return {
          success: true,
          action,
          id: result.data.id,
          displayId: result.data.displayId,
        };
      }

      const result = ticketStore.update(tenantId, id, fields ?? {});
      if (!result.ok) {
        return { success: false, error: result.error };
      }

      return {
        success: true,
        action,
        ticket: toToolTicket(result.data),
      };
    },
  });
}
