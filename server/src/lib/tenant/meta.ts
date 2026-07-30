import { buildSuggestedPrompts } from "./suggested-prompts.js";
import type { TenantId } from "./types.js";
import { TENANTS } from "./types.js";

export type TenantMeta = {
  id: TenantId;
  label: string;
  corpName: string;
  prefix: string;
  suggestedPrompts: string[];
};

export const TENANT_META: Record<
  TenantId,
  Omit<TenantMeta, "id" | "suggestedPrompts">
> = {
  "tenant-a": {
    label: "Meridian",
    corpName: "Meridian Systems",
    prefix: "MER",
  },
  "tenant-b": {
    label: "Globex",
    corpName: "Globex Industries",
    prefix: "GLX",
  },
};

export function listTenants(): TenantMeta[] {
  return TENANTS.map((id) => ({
    id,
    ...TENANT_META[id],
    suggestedPrompts: buildSuggestedPrompts(id),
  }));
}

export function getTenantMeta(tenantId: TenantId): TenantMeta {
  return {
    id: tenantId,
    ...TENANT_META[tenantId],
    suggestedPrompts: buildSuggestedPrompts(tenantId),
  };
}

export function formatAllowedTenants(): string {
  return TENANTS.join(", ");
}
