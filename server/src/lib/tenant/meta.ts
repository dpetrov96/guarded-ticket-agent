import type { TenantId } from "./types.js";
import { TENANTS } from "./types.js";

export type TenantMeta = {
  id: TenantId;
  label: string;
  corpName: string;
  prefix: string;
  suggestedPrompts: string[];
};

export const TENANT_META: Record<TenantId, Omit<TenantMeta, "id">> = {
  "tenant-a": {
    label: "Meridian",
    corpName: "Meridian Systems",
    prefix: "MER",
    suggestedPrompts: [
      "Show me all open tickets",
      "Delete MER-103",
      "Close MER-102 and set priority high",
      "Delete GLX-47",
    ],
  },
  "tenant-b": {
    label: "Globex",
    corpName: "Globex Industries",
    prefix: "GLX",
    suggestedPrompts: [
      "Show me all open tickets",
      "What's the status of GLX-47?",
      "Close GLX-201",
      "Delete MER-101",
    ],
  },
};

export function listTenants(): TenantMeta[] {
  return TENANTS.map((id) => ({
    id,
    ...TENANT_META[id],
  }));
}

export function getTenantMeta(tenantId: TenantId): TenantMeta {
  return { id: tenantId, ...TENANT_META[tenantId] };
}

export function formatAllowedTenants(): string {
  return TENANTS.join(", ");
}
