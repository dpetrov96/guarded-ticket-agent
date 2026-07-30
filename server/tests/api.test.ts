import express from "express";
import { describe, expect, it } from "vitest";

import { tenantsRouter } from "../src/routes/tenants.js";
import { ticketsRouter } from "../src/routes/tickets.js";

function createApp() {
  const app = express();
  app.use("/api", tenantsRouter);
  app.use("/api", ticketsRouter);
  return app;
}

describe("tenant and ticket APIs", () => {
  it("lists tenants with display metadata", async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as { port: number }).port;

    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/tenants`);
      expect(response.status).toBe(200);

      const body = (await response.json()) as {
        tenants: Array<{ id: string; label: string; suggestedPrompts: string[] }>;
      };

      expect(body.tenants).toHaveLength(2);
      expect(body.tenants[0]?.label).toBe("Meridian");
      expect(body.tenants[0]?.suggestedPrompts.length).toBeGreaterThan(0);
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }
  });

  it("returns tenant-scoped tickets with display ids", async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as { port: number }).port;

    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/tickets`, {
        headers: { "X-Tenant-ID": "tenant-a" },
      });
      expect(response.status).toBe(200);

      const body = (await response.json()) as {
        tickets: Array<{ id: string; displayId: string; untrusted?: boolean }>;
      };

      expect(body.tickets.some((ticket) => ticket.displayId === "MER-101")).toBe(
        true,
      );
      expect(body.tickets.some((ticket) => ticket.id === "47")).toBe(false);
      expect(body.tickets.some((ticket) => ticket.untrusted === true)).toBe(true);
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }
  });
});
