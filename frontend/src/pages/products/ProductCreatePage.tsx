import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";

export function ProductCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ product_name: "", sku: "", quantity: 0, price: "" });
  const [error, setError] = useState<string | null>(null);

  const m = useMutation({
    mutationFn: async () => {
      const res = await api.post("/products", {
        product_name: form.product_name,
        sku: form.sku,
        quantity: Number(form.quantity),
        price: form.price ? Number(form.price) : null,
      });
      return res.data;
    },
    onSuccess: () => navigate("/products"),
    onError: (e: any) => setError(e?.response?.data?.detail ?? "Create failed"),
  });

  return (
    <div className="space-y-4">
      <div className="text-xl font-semibold">New product</div>
      <Card>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            m.mutate();
          }}
        >
          <Input placeholder="Product name" value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} />
          <Input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          <Input placeholder="Quantity" type="number" value={String(form.quantity)} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
          <Input placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          {error ? <div className="text-sm text-red-500">{error}</div> : null}
          <Button type="submit" className="bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900" disabled={m.isPending}>
            {m.isPending ? "Saving..." : "Save"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

