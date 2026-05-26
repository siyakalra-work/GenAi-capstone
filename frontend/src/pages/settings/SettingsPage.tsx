import { useAuthStore } from "../../store/authStore";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useState } from "react";

export function SettingsPage() {
  const tenantId = useAuthStore((s) => s.tenantId);
  const setTenant = useAuthStore((s) => s.setTenant);
  const [v, setV] = useState(tenantId ?? "");
  return (
    <div className="space-y-4">
      <div className="text-xl font-semibold">Settings</div>
      <Card>
        <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">Tenant context header (X-Tenant-ID)</div>
        <div className="flex gap-2">
          <Input value={v} onChange={(e) => setV(e.target.value)} placeholder="Tenant ID" />
          <Button onClick={() => setTenant(v || null)}>Save</Button>
        </div>
      </Card>
    </div>
  );
}

