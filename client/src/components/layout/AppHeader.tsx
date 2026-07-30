import { Shield } from "lucide-react";

import {
  MobileViewTabs,
  type MobileView,
} from "@/components/layout/MobileViewTabs";
import { TenantSwitcher } from "@/components/tenant/TenantSwitcher";
import type { TenantId, TenantSummary } from "@/lib/tenant";

type AppHeaderProps = {
  tenants: TenantSummary[];
  tenantId: TenantId;
  onTenantChange: (tenantId: TenantId) => void;
  mobileView: MobileView;
  onMobileViewChange: (view: MobileView) => void;
};

export function AppHeader({
  tenants,
  tenantId,
  onTenantChange,
  mobileView,
  onMobileViewChange,
}: AppHeaderProps) {
  return (
    <header className="z-40 shrink-0 border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-6 sm:px-6 sm:py-3.5">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground sm:size-9">
            <Shield className="size-[16px] sm:size-[18px]" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-[15px] font-semibold tracking-[-0.01em] sm:text-[17px]">
              <span className="lg:hidden">Ticket Agent</span>
              <span className="hidden lg:inline">Guarded Ticket Agent</span>
            </h1>
            <p className="hidden text-[14px] text-muted-foreground lg:block">
              Tenant-scoped tools · approval-gated mutations
            </p>
          </div>
        </div>

        <TenantSwitcher
          tenants={tenants}
          value={tenantId}
          onChange={onTenantChange}
        />
      </div>

      <MobileViewTabs view={mobileView} onChange={onMobileViewChange} />
    </header>
  );
}
