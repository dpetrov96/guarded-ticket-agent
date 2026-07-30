import { Router } from "express";
import type { UIMessage } from "ai";

import { getTenantId } from "../lib/tenant/context.js";
import { handleChatRequestSafe } from "./chat-handler.js";

export const chatRouter = Router();

chatRouter.post("/chat", async (req, res) => {
  const tenantResult = getTenantId(req.headers);

  if (!tenantResult.ok) {
    res.status(tenantResult.status).json({ error: tenantResult.error });
    return;
  }

  const { messages } = req.body as { messages?: UIMessage[] };

  if (!Array.isArray(messages)) {
    res.status(400).json({ error: "Expected messages array in request body" });
    return;
  }

  await handleChatRequestSafe(res, tenantResult.tenantId, messages);
});
