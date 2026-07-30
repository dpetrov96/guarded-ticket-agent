/**
 * API base URL for production builds.
 * - Dev: empty string → Vite proxy handles /api and /health
 * - AWS split deploy: set VITE_API_URL to the ALB/API domain
 * - AWS CloudFront same-origin: leave empty, route /api/* to ALB in CloudFront
 */
export function getApiBaseUrl(): string {
  const url = import.meta.env.VITE_API_URL as string | undefined;
  if (!url?.trim()) {
    return "";
  }
  return url.replace(/\/$/, "");
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
