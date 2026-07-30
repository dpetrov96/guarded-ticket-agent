import { ShieldAlert } from "lucide-react";

import { cn } from "@/lib/utils";

export type MutateArgs = {
  id?: string;
  action?: string;
  fields?: Record<string, unknown>;
};

type ApprovalModalProps = {
  open: boolean;
  args: MutateArgs;
  onApprove: () => void;
  onDeny: () => void;
};

export function ApprovalModal({
  open,
  args,
  onApprove,
  onDeny,
}: ApprovalModalProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-6 backdrop-blur-[2px]",
        !open && "pointer-events-none invisible",
      )}
      role="dialog"
      aria-modal="true"
    >
      <div className="surface w-full max-w-md rounded-xl p-6">
        <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
          <ShieldAlert className="size-5" />
        </div>
        <h2 className="text-[18px] font-semibold tracking-[-0.01em]">
          Approve ticket mutation?
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          The agent wants to run a mutating action. Review the request before
          continuing.
        </p>
        <dl className="mt-5 space-y-3 rounded-lg border border-border bg-secondary/30 p-4 text-[15px]">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Ticket</dt>
            <dd className="font-mono font-medium">{args.id ?? "unknown"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Action</dt>
            <dd className="font-medium capitalize">{args.action ?? "unknown"}</dd>
          </div>
          {args.fields ? (
            <div>
              <dt className="text-muted-foreground">Fields</dt>
              <dd className="mt-1 font-mono text-[13px]">
                {JSON.stringify(args.fields, null, 2)}
              </dd>
            </div>
          ) : null}
        </dl>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onDeny} className="btn-secondary">
            Deny
          </button>
          <button type="button" onClick={onApprove} className="btn-primary">
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
