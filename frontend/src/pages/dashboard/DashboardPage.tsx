import { Card } from "../../components/ui/Card";
import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { api } from "../../services/api";

export function DashboardPage() {
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [lowStock, setLowStock] = useState<number | null>(null);
  const [recentTx, setRecentTx] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([
      api.get("/products", { params: { page: 1, page_size: 1 } }),
      api.get("/products", { params: { page: 1, page_size: 1, stock_status: "low" } }),
      api.get("/inventory/transactions", { params: { page: 1, page_size: 10 } }),
    ])
      .then(([pAll, pLow, tx]) => {
        if (!alive) return;
        setTotalProducts(pAll.data?.meta?.total ?? null);
        setLowStock(pLow.data?.meta?.total ?? null);
        setRecentTx(tx.data ?? []);
      })
      .catch(() => {
        if (!alive) return;
        setTotalProducts(null);
        setLowStock(null);
        setRecentTx([]);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const movement = useMemo(() => {
    // Demo chart dataset from recent transactions; in real app compute from DB.
    const hours = Array.from({ length: 12 }).map((_, i) => `${(i + 1) * 2}h`);
    const base = hours.map((h, idx) => ({
      name: h,
      stockIn: Math.max(0, (recentTx[idx]?.transaction_type === "in" ? recentTx[idx]?.quantity : 0) ?? 0),
      stockOut: Math.max(0, (recentTx[idx]?.transaction_type === "out" ? Math.abs(recentTx[idx]?.quantity) : 0) ?? 0),
    }));
    // If empty, show a nice placeholder shape
    const hasAny = base.some((r) => r.stockIn || r.stockOut);
    if (hasAny) return base;
    return hours.map((h, i) => ({
      name: h,
      stockIn: [22, 18, 12, 10, 14, 9, 16, 11, 28, 15, 24, 19][i],
      stockOut: [9, 8, 7, 6, 9, 5, 10, 7, 12, 9, 11, 8][i],
    }));
  }, [recentTx]);

  const categories = useMemo(() => {
    // Placeholder categories for layout parity.
    return [
      { name: "Electronics", value: 60, color: "#60A5FA" },
      { name: "Groceries", value: 22, color: "#34D399" },
      { name: "Lifestyle", value: 18, color: "#F472B6" },
    ];
  }, []);

  const kpis = useMemo(
    () => [
      { label: "Total Products", value: totalProducts ?? "—", delta: "+4.3% vs last month", tone: "good" as const },
      { label: "Low Stock", value: lowStock ?? "—", delta: "-1.2% vs last month", tone: "warn" as const },
      { label: "Inventory In", value: "₹8,980,097", delta: "+3.5% vs last month", tone: "good" as const },
      { label: "Inventory Out", value: "₹78,458,798", delta: "-2.0% vs last month", tone: "bad" as const },
    ],
    [lowStock, totalProducts],
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-semibold tracking-tight">Dashboard</div>
          <div className="text-sm text-muted">Overview of inventory health and activity</div>
        </div>
        {loading ? <div className="text-sm text-muted">Syncing…</div> : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-muted">{k.label}</div>
                <div className="mt-1 text-2xl font-semibold">{k.value}</div>
              </div>
              <div className="h-9 w-9 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/70 dark:border-slate-800/60" />
            </div>
            <div
              className={
                "mt-3 text-xs " +
                (k.tone === "good"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : k.tone === "warn"
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-rose-600 dark:text-rose-400")
              }
            >
              {k.delta}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Sales & Purchase</div>
                <div className="text-xs text-muted">Inventory movement summary</div>
              </div>
              <div className="text-xs text-muted px-3 py-1.5 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/70 dark:border-slate-800/60">
                This Year
              </div>
            </div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={movement} barGap={6}>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.25)" />
                  <XAxis dataKey="name" tick={{ fill: "rgba(148,163,184,0.9)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "rgba(148,163,184,0.9)", fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(148,163,184,0.2)", borderRadius: 12, color: "#fff" }} />
                  <Legend />
                  <Bar dataKey="stockIn" name="Total Purchase" fill="rgba(96,165,250,0.85)" radius={[10, 10, 10, 10]} />
                  <Bar dataKey="stockOut" name="Total Sales" fill="rgba(52,211,153,0.75)" radius={[10, 10, 10, 10]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Top Categories</div>
              <div className="text-xs text-muted">Weekly</div>
            </div>
            <div className="text-xs text-muted px-3 py-1.5 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/70 dark:border-slate-800/60">
              Weekly
            </div>
          </div>

          <div className="mt-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(148,163,184,0.2)", borderRadius: 12, color: "#fff" }} />
                  <Pie data={categories} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={3}>
                    {categories.map((c) => (
                      <Cell key={c.name} fill={c.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

          <div className="mt-2 space-y-2">
            {categories.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                  <span className="text-muted">{c.name}</span>
                </div>
                <span className="font-medium">{Math.round(c.value)}%</span>
              </div>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-muted">
              <div className="rounded-xl border border-slate-200/70 dark:border-slate-800/60 bg-slate-100/40 dark:bg-white/5 p-3">
                Total Categories
                <div className="text-base font-semibold text-slate-900 dark:text-white mt-1">690</div>
              </div>
              <div className="rounded-xl border border-slate-200/70 dark:border-slate-800/60 bg-slate-100/40 dark:bg-white/5 p-3">
                Total Products
                <div className="text-base font-semibold text-slate-900 dark:text-white mt-1">{totalProducts ?? "—"}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Recent Transactions</div>
            <div className="text-xs text-muted">Latest inventory movements</div>
          </div>
          <div className="text-xs text-muted px-3 py-1.5 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/70 dark:border-slate-800/60">
            View All
          </div>
        </div>

        <div className="mt-4 overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted">
              <tr>
                <th className="py-2 font-medium">Product</th>
                <th className="font-medium">Date</th>
                <th className="font-medium">Status</th>
                <th className="font-medium text-right">Qty</th>
              </tr>
            </thead>
            <tbody>
              {recentTx.length ? (
                recentTx.map((t) => (
                  <tr key={t.id} className="border-t border-slate-200/60 dark:border-slate-800/60">
                    <td className="py-3">
                      <div className="font-medium">{t.product_id}</div>
                      <div className="text-xs text-muted">{t.id}</div>
                    </td>
                    <td className="text-muted">{(t.created_at ?? "").toString().slice(0, 10) || "—"}</td>
                    <td>
                      <span
                        className={
                          "inline-flex items-center rounded-full px-3 py-1 text-xs border " +
                          (t.transaction_type === "in"
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                            : t.transaction_type === "out"
                              ? "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20"
                              : "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20")
                        }
                      >
                        {t.transaction_type === "in" ? "Completed" : t.transaction_type === "out" ? "Completed" : "Draft"}
                      </span>
                    </td>
                    <td className="text-right font-semibold">{t.quantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-muted">
                    No transactions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
