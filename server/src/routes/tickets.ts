import { Router } from "express";

import { ticketStore } from "../lib/tickets/store.js";
import { toPublicTicket } from "../lib/tickets/present.js";
import { getTenantId } from "../lib/tenant/context.js";

export const ticketsRouter = Router();

ticketsRouter.get("/tickets", (req, res) => {
  const tenantResult = getTenantId(req.headers);

  if (!tenantResult.ok) {
    res.status(tenantResult.status).json({ error: tenantResult.error });
    return;
  }

  const tickets = ticketStore
    .listByTenant(tenantResult.tenantId)
    .map(toPublicTicket);

  res.json({ tickets });
});
