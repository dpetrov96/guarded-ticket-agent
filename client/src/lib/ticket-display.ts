export const PRIORITY_ACCENT: Record<string, string> = {
  critical: "border-l-red-500",
  high: "border-l-orange-500",
  medium: "border-l-amber-400",
  low: "border-l-slate-300",
};

export const PRIORITY_BADGE: Record<string, string> = {
  critical: "bg-red-50 text-red-700 ring-red-200/80",
  high: "bg-orange-50 text-orange-700 ring-orange-200/80",
  medium: "bg-amber-50 text-amber-800 ring-amber-200/80",
  low: "bg-slate-50 text-slate-600 ring-slate-200/80",
};

export const STATUS_BADGE: Record<string, string> = {
  open: "bg-sky-50 text-sky-700 ring-sky-200/80",
  in_progress: "bg-violet-50 text-violet-700 ring-violet-200/80",
  resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200/80",
  closed: "bg-slate-50 text-slate-600 ring-slate-200/80",
};

export const STATUS_DOT: Record<string, string> = {
  open: "bg-sky-500",
  in_progress: "bg-violet-500",
  resolved: "bg-emerald-500",
  closed: "bg-slate-400",
};

export function formatLabel(value: string): string {
  return value.replaceAll("_", " ");
}

export function stripUntrustedMarkers(text: string | undefined): string {
  if (!text) {
    return "";
  }

  return text
    .replaceAll("<<<UNTRUSTED_TICKET_CONTENT>>>", "")
    .replaceAll("<<<END_UNTRUSTED_TICKET_CONTENT>>>", "")
    .trim();
}

export function hasUntrustedContent(text: string | undefined): boolean {
  return Boolean(text?.includes("<<<UNTRUSTED_TICKET_CONTENT>>>"));
}
