import type { TenantId, TenantSummary } from "@/lib/tenant";
import { cn } from "@/lib/utils";

type TenantSwitcherProps = {
  tenants: TenantSummary[];
  value: TenantId;
  onChange: (tenantId: TenantId) => void;
};

export function TenantSwitcher({
  tenants,
  value,
  onChange,
}: TenantSwitcherProps) {
  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      <span className="hidden text-[13px] font-medium text-muted-foreground md:inline">
        Tenant
      </span>
      <div className="flex rounded-lg border border-border bg-secondary/60 p-0.5">
        {tenants.map((tenant) => {
          const active = tenant.id === value;
          return (
            <button
              key={tenant.id}
              type="button"
              onClick={() => onChange(tenant.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors sm:px-4 sm:text-[14px]",
                active
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tenant.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
