import { CheckCircle2, Loader2, ShieldAlert, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type ToolTraceProps = {
  toolName: string;
  args: unknown;
  result?: unknown;
  status?: string;
};

const STATUS_ICON: Record<string, typeof Loader2> = {
  running: Loader2,
  completed: CheckCircle2,
  denied: XCircle,
  "awaiting approval": ShieldAlert,
};

export function ToolTrace({ toolName, args, result, status }: ToolTraceProps) {
  const normalizedStatus = status ?? "running";
  const Icon = STATUS_ICON[normalizedStatus] ?? Loader2;
  const isRunning = normalizedStatus === "running";

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-border bg-secondary/30 text-[14px]">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-2.5">
        <span className="font-mono text-[14px] font-medium text-foreground">
          {toolName}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[13px] font-medium capitalize",
            normalizedStatus === "awaiting approval" &&
              "bg-amber-50 text-amber-800",
            normalizedStatus === "denied" && "bg-red-50 text-red-700",
            normalizedStatus === "completed" && "bg-emerald-50 text-emerald-700",
            isRunning && "bg-sky-50 text-sky-700",
          )}
        >
          <Icon className={cn("size-3.5", isRunning && "animate-spin")} />
          {normalizedStatus}
        </span>
      </div>
      <pre className="overflow-x-auto px-4 py-3 text-[13px] leading-relaxed text-muted-foreground">
        {JSON.stringify(args, null, 2)}
      </pre>
      {result !== undefined ? (
        <pre className="overflow-x-auto border-t border-border bg-card px-4 py-3 text-[13px] leading-relaxed">
          {JSON.stringify(result, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}
