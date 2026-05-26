import { PageHeader } from "../../components/ui/PageHeader";
import { Panel } from "../../components/ui/Panel";

export function UsersPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Users" subtitle="Manage tenant users and roles" />
      <Panel>
        <div className="text-sm text-muted">
          User management UI can be added on top of tenant-scoped user APIs (create/list/disable).
        </div>
      </Panel>
    </div>
  );
}
