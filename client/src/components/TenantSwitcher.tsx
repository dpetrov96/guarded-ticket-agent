import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TENANTS, type TenantId } from "@/lib/tenant";

type TenantSwitcherProps = {
  value: TenantId;
  onChange: (tenantId: TenantId) => void;
};

export function TenantSwitcher({ value, onChange }: TenantSwitcherProps) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as TenantId)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select tenant" />
      </SelectTrigger>
      <SelectContent>
        {TENANTS.map((tenant) => (
          <SelectItem key={tenant} value={tenant}>
            {tenant}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
