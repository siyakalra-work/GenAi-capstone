import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PageHeader } from "../../components/ui/PageHeader";
import { Panel } from "../../components/ui/Panel";

export function ProductCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ product_name: "", sku: "", quantity: 0, price: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-4">
      <PageHeader title="New Product" subtitle="Create a product in your tenant catalog" />
      <Panel>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            setError(null);
            api
              .post("/products", {
                product_name: form.product_name,
                sku: form.sku,
                quantity: Number(form.quantity),
                price: form.price ? Number(form.price) : null,
              })
              .then(() => navigate("/products"))
              .catch((err: any) => setError(err?.response?.data?.detail ?? "Create failed"))
              .finally(() => setLoading(false));
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <div className="text-xs text-muted mb-1">Product name</div>
              <Input placeholder="e.g. Wireless Mouse" value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} />
            </div>
            <div>
              <div className="text-xs text-muted mb-1">SKU</div>
              <Input placeholder="e.g. MSE-WL-001" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            </div>
            <div>
              <div className="text-xs text-muted mb-1">Quantity</div>
              <Input placeholder="0" type="number" value={String(form.quantity)} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
            </div>
            <div>
              <div className="text-xs text-muted mb-1">Price</div>
              <Input placeholder="e.g. 999" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
          </div>
          {error ? <div className="text-sm text-red-500">{error}</div> : null}
          <div className="flex gap-2">
            <Button type="button" onClick={() => navigate("/products")}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-slate-900 text-white dark:bg-white/10 dark:text-white border-slate-900/20 dark:border-white/10"
              disabled={loading}
            >
            {loading ? "Saving..." : "Save"}
          </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
