import { apiUrl } from "@/lib/api";

export type HealthResponse = {
  status: string;
  env: string;
  chatConfigured: boolean;
};

export async function fetchChatConfigured(): Promise<boolean> {
  const response = await fetch(apiUrl("/health"));
  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as HealthResponse;
  return data.chatConfigured === true;
}
