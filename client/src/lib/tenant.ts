export const TENANTS = ["tenant-a", "tenant-b"] as const;

export type TenantId = (typeof TENANTS)[number];

export function isTenantId(value: string): value is TenantId {
  return (TENANTS as readonly string[]).includes(value);
}
