import type { Response } from "express";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { google } from "@ai-sdk/google";

import { SYSTEM_PROMPT } from "../lib/agent/system-prompt.js";
import { config, requireGeminiApiKey } from "../lib/config.js";
import {
  createMutateTicketTool,
  createSearchTicketsTool,
} from "../lib/tools/tickets.js";
import type { TenantId } from "../lib/tenant/types.js";

const STREAM_TIMEOUT_MS = 60_000;

export async function handleChatRequest(
  res: Response,
  tenantId: TenantId,
  messages: UIMessage[],
): Promise<void> {
  // Stop generating when the client disconnects; cap runaway streams.
  const disconnect = new AbortController();
  res.on("close", () => disconnect.abort());

  const result = streamText({
    model: google(config.geminiModel),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: {
      // Tools are constructed per-request with the tenant from the verified
      // request context baked in. The model cannot address another tenant.
      search_tickets: createSearchTicketsTool(tenantId),
      // mutate_ticket carries needsApproval: true — the SDK pauses the run
      // and emits an approval request part instead of executing.
      mutate_ticket: createMutateTicketTool(tenantId),
    },
    stopWhen: stepCountIs(5),
    // Free-tier 429s carry retryDelay of ~40s; the default 3 attempts make the
    // UI look frozen. Fail fast and surface the error instead.
    maxRetries: 1,
    abortSignal: AbortSignal.any([
      disconnect.signal,
      AbortSignal.timeout(STREAM_TIMEOUT_MS),
    ]),
  });

  await result.pipeUIMessageStreamToResponse(res, {
    onError: (error) => {
      console.error("[chat] stream error:", error);
      // Don't leak provider/internal details to clients outside development.
      if (config.isProduction) {
        return "The assistant hit an internal error. Please try again.";
      }
      return error instanceof Error ? error.message : String(error);
    },
  });
}

export async function handleChatRequestSafe(
  res: Response,
  tenantId: TenantId,
  messages: UIMessage[],
): Promise<void> {
  try {
    requireGeminiApiKey();
    await handleChatRequest(res, tenantId, messages);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to process chat request",
      });
    }
  }
}
