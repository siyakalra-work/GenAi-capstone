import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";

export function ProductsListPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .get("/products", { params: { q, page, page_size: 20 } })
      .then((r) => {
        if (!alive) return;
        setData(r.data);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [q, page]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">Products</div>
        <Link to="/products/new">
          <Button className="bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900">New product</Button>
        </Link>
      </div>
      <Card>
        <div className="flex gap-2 mb-3">
          <Input placeholder="Search name/SKU" value={q} onChange={(e) => setQ(e.target.value)} />
          <Button onClick={() => setPage(1)}>Search</Button>
        </div>
        {loading ? <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">Loading...</div> : null}
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-2">SKU</th>
                <th>Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(data?.items ?? []).map((p: any) => (
                <tr key={p.id} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="py-2">{p.sku}</td>
                  <td>{p.product_name}</td>
                  <td>{p.quantity}</td>
                  <td>{p.price ?? "—"}</td>
                  <td className="text-right">
                    <Link className="underline" to={`/products/${p.id}/edit`}>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Total: {data?.meta?.total ?? "—"}
          </div>
          <div className="flex gap-2">
            <Button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </Button>
            <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
