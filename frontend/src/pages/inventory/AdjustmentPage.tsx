import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PageHeader } from "../../components/ui/PageHeader";
import { Panel } from "../../components/ui/Panel";

export function AdjustmentPage() {
  const navigate = useNavigate();
  const [productId, setProductId] = useState("");
  const [newQuantity, setNewQuantity] = useState(0);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    api.get("/products", { params: { page: 1, page_size: 50 } }).then((r) => {
      if (!alive) return;
      setProducts(r.data?.items ?? []);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader title="Adjustment" subtitle="Manually correct on-hand stock for a product" />
      <Panel>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            setLoading(true);
            api
              .post("/inventory/adjustment", { product_id: productId, new_quantity: newQuantity, notes: notes || null })
              .then(() => navigate("/inventory/transactions"))
              .catch((err: any) => setError(err?.response?.data?.detail ?? "Failed"))
              .finally(() => setLoading(false));
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <div className="text-xs text-muted mb-1">Product</div>
              <select className="w-full rounded-xl border border-slate-200/70 dark:border-slate-800/60 bg-white/70 dark:bg-white/5 px-3 py-2 text-sm backdrop-blur" value={productId} onChange={(e) => setProductId(e.target.value)}>
            <option value="">Select product</option>
            {products.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.sku} — {p.product_name}
              </option>
            ))}
          </select>
            </div>
            <div>
              <div className="text-xs text-muted mb-1">New quantity</div>
              <Input type="number" value={String(newQuantity)} onChange={(e) => setNewQuantity(Number(e.target.value))} />
            </div>
            <div>
              <div className="text-xs text-muted mb-1">Notes</div>
              <Input placeholder="Reason / notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
          {error ? <div className="text-sm text-red-500">{error}</div> : null}
          <div className="flex gap-2">
            <Button type="button" onClick={() => navigate("/inventory/transactions")}>
              Cancel
            </Button>
            <Button type="submit" className="bg-slate-900 text-white dark:bg-white/10 dark:text-white border-slate-900/20 dark:border-white/10" disabled={loading || !productId}>
              {loading ? "Saving..." : "Submit"}
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
