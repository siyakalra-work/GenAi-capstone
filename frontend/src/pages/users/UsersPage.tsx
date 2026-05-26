import { Card } from "../../components/ui/Card";

export function UsersPage() {
  return (
    <div className="space-y-4">
      <div className="text-xl font-semibold">Users</div>
      <Card>
        <div className="text-sm text-slate-500 dark:text-slate-400">User management UI can be added on top of `/tenants` and user APIs.</div>
      </Card>
    </div>
  );
}

