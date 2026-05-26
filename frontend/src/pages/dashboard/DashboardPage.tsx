import { api } from "../../services/api";
import { Card } from "../../components/ui/Card";
import { useEffect, useState } from "react";

export function DashboardPage() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    api
      .get("/products", { params: { page: 1, page_size: 1 } })
      .then((r) => {
        if (!alive) return;
        setTotal(r.data?.meta?.total ?? null);
      })
      .catch(() => {
        if (!alive) return;
        setTotal(null);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="text-xl font-semibold">Dashboard</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-sm text-slate-500 dark:text-slate-400">Total Products</div>
          <div className="text-2xl font-semibold">{total ?? "—"}</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500 dark:text-slate-400">Low Stock</div>
          <div className="text-2xl font-semibold">{"—"}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Ask AI Assistant for low-stock list</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500 dark:text-slate-400">Recent Activity</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">See Transactions</div>
        </Card>
      </div>
    </div>
  );
}
