import { useQuery } from "@tanstack/react-query";

import { api } from "../../services/api";
import { Card } from "../../components/ui/Card";

export function DashboardPage() {
  const products = useQuery({
    queryKey: ["products", "dashboard"],
    queryFn: async () => (await api.get("/products?page=1&page_size=1")).data as any,
  });

  return (
    <div className="space-y-4">
      <div className="text-xl font-semibold">Dashboard</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-sm text-slate-500 dark:text-slate-400">Total Products</div>
          <div className="text-2xl font-semibold">{products.data?.meta?.total ?? "—"}</div>
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

