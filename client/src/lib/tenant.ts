import { apiUrl } from "@/lib/api";

export type TenantId = string;

export type TenantSummary = {
  id: TenantId;
  label: string;
  corpName: string;
  prefix: string;
  suggestedPrompts: string[];
};

export async function fetchTenants(): Promise<TenantSummary[]> {
  const response = await fetch(apiUrl("/api/tenants"));
  if (!response.ok) {
    throw new Error("Failed to load tenants");
  }

  const data = (await response.json()) as { tenants: TenantSummary[] };
  return data.tenants;
}
