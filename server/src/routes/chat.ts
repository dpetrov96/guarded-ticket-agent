import { Router } from "express";

import { getTenantId } from "../lib/tenant/context.js";

export const chatRouter = Router();

chatRouter.post("/chat", (req, res) => {
  const tenantResult = getTenantId(req.headers);

  if (!tenantResult.ok) {
    res.status(tenantResult.status).json({ error: tenantResult.error });
    return;
  }

  // Streaming chat + tools will be wired in the next phase.
  res.status(501).json({
    error: "Chat endpoint not implemented yet",
    tenantId: tenantResult.tenantId,
  });
});
