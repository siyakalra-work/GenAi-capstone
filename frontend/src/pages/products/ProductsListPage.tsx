import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PageHeader } from "../../components/ui/PageHeader";
import { Panel } from "../../components/ui/Panel";
import { Table, TD, TH, THead, TR } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";

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
    <div className="space-y-5">
      <PageHeader
        title="Products"
        subtitle="Search, filter, and manage your catalog"
        right={
          <Link to="/products/new">
            <Button className="bg-slate-900 text-white dark:bg-white/10 dark:text-white border-slate-900/20 dark:border-white/10">
              New product
            </Button>
          </Link>
        }
      />

      <Panel>
        <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <div className="flex gap-2 w-full md:max-w-lg">
            <Input placeholder="Search name or SKU" value={q} onChange={(e) => setQ(e.target.value)} />
            <Button onClick={() => setPage(1)}>Search</Button>
          </div>
          <div className="text-xs text-muted">
            Total: <span className="font-semibold text-slate-900 dark:text-white">{data?.meta?.total ?? "—"}</span>
          </div>
        </div>

        <div className="mt-4">
          {loading ? <div className="text-sm text-muted mb-2">Loading…</div> : null}
          <Table>
            <THead>
              <tr>
                <TH>SKU</TH>
                <TH>Name</TH>
                <TH>Stock</TH>
                <TH>Price</TH>
                <TH className="text-right">Action</TH>
              </tr>
            </THead>
            <tbody>
              {(data?.items ?? []).length ? (
                (data?.items ?? []).map((p: any) => (
                  <TR key={p.id}>
                    <TD className="font-medium">{p.sku}</TD>
                    <TD>
                      <div className="font-medium">{p.product_name}</div>
                      <div className="text-xs text-muted">{p.category ?? "—"} · {p.brand ?? "—"}</div>
                    </TD>
                    <TD>
                      {p.quantity === 0 ? (
                        <Badge tone="bad">Out</Badge>
                      ) : p.quantity < 10 ? (
                        <Badge tone="warn">Low</Badge>
                      ) : (
                        <Badge tone="good">Healthy</Badge>
                      )}
                      <span className="ml-2 font-semibold">{p.quantity}</span>
                    </TD>
                    <TD className="font-medium">{p.price ?? "—"}</TD>
                    <TD className="text-right">
                      <Link className="underline underline-offset-4 text-slate-700 dark:text-slate-200" to={`/products/${p.id}/edit`}>
                        Edit
                      </Link>
                    </TD>
                  </TR>
                ))
              ) : (
                <TR>
                  <TD className="py-10 text-center text-muted" colSpan={5 as any}>
                    No products found.
                  </TD>
                </TR>
              )}
            </tbody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-muted">Page {page}</div>
            <div className="flex gap-2">
              <Button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Prev
              </Button>
              <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
