import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useState } from "react";
import { useAuth } from "../../store/auth";
import { PageHeader } from "../../components/ui/PageHeader";
import { Panel } from "../../components/ui/Panel";

export function SettingsPage() {
  const { tenantId, setTenant } = useAuth();
  const [v, setV] = useState(tenantId ?? "");
  return (
    <div className="space-y-4">
      <PageHeader title="Settings" subtitle="Tenant context and preferences" />
      <Panel>
        <div className="text-sm text-muted mb-2">Tenant context header (X-Tenant-ID)</div>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1">
            <Input value={v} onChange={(e) => setV(e.target.value)} placeholder="Tenant ID" />
          </div>
          <Button
            className="bg-slate-900 text-white dark:bg-white/10 dark:text-white border-slate-900/20 dark:border-white/10"
            onClick={() => setTenant(v || null)}
          >
            Save
          </Button>
        </div>
      </Panel>
    </div>
  );
}
