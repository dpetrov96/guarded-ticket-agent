import express from "express";
import { describe, expect, it } from "vitest";

import { createChatRateLimiter } from "../src/lib/http/chat-rate-limit.js";

function createTestApp(max: number) {
  const app = express();
  app.set("trust proxy", 1);
  app.use(express.json());
  app.post(
    "/api/chat",
    createChatRateLimiter({ max, windowMs: 60_000 }),
    (_req, res) => {
      res.status(200).json({ ok: true });
    },
  );
  return app;
}

describe("chat rate limiting", () => {
  it("returns 429 after the configured request limit", async () => {
    const app = createTestApp(2);
    const server = app.listen(0);
    const port = (server.address() as { port: number }).port;

    try {
      const url = `http://127.0.0.1:${port}/api/chat`;
      const headers = {
        "Content-Type": "application/json",
        "X-Tenant-ID": "tenant-a",
      };

      const first = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ messages: [] }),
      });
      const second = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ messages: [] }),
      });
      const third = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ messages: [] }),
      });

      expect(first.status).toBe(200);
      expect(second.status).toBe(200);
      expect(third.status).toBe(429);

      const body = (await third.json()) as { error: string };
      expect(body.error).toContain("Too many chat requests");
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }
  });
});
