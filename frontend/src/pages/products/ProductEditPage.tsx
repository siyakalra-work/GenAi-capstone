import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";

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
      <div className="text-xl font-semibold">Edit product</div>
      <Card>
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
          <Input placeholder="Product name" value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} />
          <Input placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          {error ? <div className="text-sm text-red-500">{error}</div> : null}
          <Button type="submit" className="bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
