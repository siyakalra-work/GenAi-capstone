import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PageHeader } from "../../components/ui/PageHeader";
import { Panel } from "../../components/ui/Panel";

export function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    api
      .get(`/products/${id}`)
      .then((r) => {
        if (!alive) return;
        setForm({ ...r.data, price: r.data.price ?? "" });
      })
      .catch((e: any) => setError(e?.response?.data?.detail ?? "Load failed"));
    return () => {
      alive = false;
    };
  }, [id]);

  if (!form) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <PageHeader title="Edit Product" subtitle="Update pricing and details" />
      <Panel>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            setLoading(true);
            api
              .put(`/products/${id}`, { product_name: form.product_name, price: form.price ? Number(form.price) : null })
              .then(() => navigate("/products"))
              .catch((err: any) => setError(err?.response?.data?.detail ?? "Update failed"))
              .finally(() => setLoading(false));
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <div className="text-xs text-muted mb-1">Product name</div>
              <Input placeholder="Product name" value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} />
            </div>
            <div>
              <div className="text-xs text-muted mb-1">Price</div>
              <Input placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <div className="text-xs text-muted mb-1">SKU</div>
              <Input value={form.sku} disabled />
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
