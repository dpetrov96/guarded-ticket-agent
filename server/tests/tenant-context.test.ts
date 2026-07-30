import { describe, expect, it } from "vitest";

import { getTenantId } from "../src/lib/tenant/context.js";

describe("getTenantId", () => {
  it("accepts a valid tenant header", () => {
    const result = getTenantId({ "x-tenant-id": "tenant-a" });
    expect(result).toEqual({ ok: true, tenantId: "tenant-a" });
  });

  it("rejects missing tenant header", () => {
    const result = getTenantId({});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(400);
    }
  });

  it("rejects unknown tenant", () => {
    const result = getTenantId({ "x-tenant-id": "tenant-c" });
    expect(result.ok).toBe(false);
  });
});
