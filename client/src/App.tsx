import { useState } from "react";

import { ChatPanel } from "@/components/chat/ChatPanel";
import { AppHeader } from "@/components/layout/AppHeader";
import type { MobileView } from "@/components/layout/MobileViewTabs";
import { TicketSidebar } from "@/components/tickets/TicketSidebar";
import { findTenant, useTenants } from "@/hooks/useTenants";
import type { TenantId } from "@/lib/tenant";
import { cn } from "@/lib/utils";

export default function App() {
  const { tenants, loading, error } = useTenants();
  const [selectedTenantId, setSelectedTenantId] = useState<TenantId | null>(null);
  const [mobileView, setMobileView] = useState<MobileView>("chat");

  // Derive the active tenant instead of syncing it via an effect.
  const tenantId =
    selectedTenantId && tenants.some((tenant) => tenant.id === selectedTenantId)
      ? selectedTenantId
      : (tenants[0]?.id ?? null);

  if (loading) {
    return (
      <div className="app-shell flex h-dvh items-center justify-center text-[14px] text-muted-foreground">
        Loading tenants…
      </div>
    );
  }

  if (error || tenants.length === 0 || !tenantId) {
    return (
      <div className="app-shell flex h-dvh items-center justify-center px-6 text-center text-[14px] text-muted-foreground">
        {error ?? "No tenants available. Is the API server running?"}
      </div>
    );
  }

  const activeTenant = findTenant(tenants, tenantId);
  if (!activeTenant) {
    return null;
  }

  return (
    <div className="app-shell flex h-dvh flex-col overflow-hidden">
      <AppHeader
        tenants={tenants}
        tenantId={tenantId}
        onTenantChange={setSelectedTenantId}
        mobileView={mobileView}
        onMobileViewChange={setMobileView}
      />

      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col lg:flex-row lg:gap-5 lg:px-6 lg:py-4">
        <TicketSidebar
          tenant={activeTenant}
          className={cn(
            "min-h-0 flex-1 lg:flex-none",
            mobileView === "tickets" ? "flex" : "hidden lg:flex",
          )}
        />

        <main
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-card lg:surface lg:rounded-xl",
            mobileView === "chat" ? "flex" : "hidden lg:flex",
          )}
        >
          <ChatPanel tenant={activeTenant} />
        </main>
      </div>
    </div>
  );
}
