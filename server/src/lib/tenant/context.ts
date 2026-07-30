import { formatAllowedTenants } from "./meta.js";
import { isTenantId, type TenantId } from "./types.js";

type TenantResult =
  | { ok: true; tenantId: TenantId }
  | { ok: false; status: number; error: string };

export function getTenantId(headers: Record<string, unknown>): TenantResult {
  const raw = headers["x-tenant-id"];

  if (typeof raw !== "string" || raw.trim() === "") {
    return {
      ok: false,
      status: 400,
      error: "Missing X-Tenant-ID header",
    };
  }

  const tenantId = raw.trim();

  if (!isTenantId(tenantId)) {
    return {
      ok: false,
      status: 400,
      error: `Invalid tenant. Allowed: ${formatAllowedTenants()}`,
    };
  }

  return { ok: true, tenantId };
}
