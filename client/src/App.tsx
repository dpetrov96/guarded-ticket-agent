import { useEffect, useState } from "react";

import { TenantSwitcher } from "@/components/TenantSwitcher";
import type { TenantId } from "@/lib/tenant";

export default function App() {
  const [tenantId, setTenantId] = useState<TenantId>("tenant-a");
  const [serverStatus, setServerStatus] = useState<"checking" | "ok" | "error">(
    "checking",
  );

  useEffect(() => {
    fetch("/health")
      .then((res) => (res.ok ? setServerStatus("ok") : setServerStatus("error")))
      .catch(() => setServerStatus("error"));
  }, []);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Guarded Ticket Agent
          </h1>
          <p className="text-sm text-muted-foreground">
            React + Express · multi-tenant tool-use with human approval
          </p>
        </div>
        <TenantSwitcher value={tenantId} onChange={setTenantId} />
      </header>

      <main className="flex flex-1 flex-col gap-4 rounded-xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Active tenant: <span className="font-medium text-foreground">{tenantId}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Server:{" "}
          <span className="font-medium text-foreground">
            {serverStatus === "checking" && "checking…"}
            {serverStatus === "ok" && "connected"}
            {serverStatus === "error" && "unreachable — run npm run dev from project root"}
          </span>
        </p>
        <div className="mt-auto rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Chat UI (assistant-ui) and tool-call trace will be added in the next phase.
        </div>
      </main>
    </div>
  );
}
