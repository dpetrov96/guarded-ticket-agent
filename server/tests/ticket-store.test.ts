import { describe, expect, it, beforeEach } from "vitest";

import { TicketStore } from "../src/lib/tickets/store.js";

describe("TicketStore", () => {
  let store: TicketStore;

  beforeEach(() => {
    store = new TicketStore();
  });

  it("returns only tenant-a tickets for tenant-a searches", () => {
    const results = store.search("tenant-a", "");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((ticket) => ticket.tenantId === "tenant-a")).toBe(true);
    expect(results.some((ticket) => ticket.id === "47")).toBe(false);
  });

  it("does not expose tenant-b ticket #47 to tenant-a", () => {
    const byId = store.getById("tenant-a", "47");
    const search = store.search("tenant-a", "executive escalation");

    expect(byId).toBeNull();
    expect(search.some((ticket) => ticket.id === "47")).toBe(false);
    expect(search.every((ticket) => ticket.tenantId === "tenant-a")).toBe(true);
  });

  it("rejects cross-tenant updates", () => {
    const before = store.getById("tenant-b", "47");
    expect(before).not.toBeNull();

    const result = store.update("tenant-a", "47", { status: "closed" });
    expect(result.ok).toBe(false);

    const after = store.getById("tenant-b", "47");
    expect(after?.status).toBe("open");
  });

  it("rejects cross-tenant deletes", () => {
    const result = store.delete("tenant-a", "47");
    expect(result.ok).toBe(false);
    expect(store.getById("tenant-b", "47")).not.toBeNull();
  });
});
