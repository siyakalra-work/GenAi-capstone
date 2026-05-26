import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";

export function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const q = useQuery({
    queryKey: ["product", id],
    queryFn: async () => (await api.get(`/products/${id}`)).data as any,
    enabled: !!id,
  });

  const [form, setForm] = useState<any>(null);
  if (q.data && !form) setForm({ ...q.data, price: q.data.price ?? "" });

  const m = useMutation({
    mutationFn: async () => (await api.put(`/products/${id}`, { product_name: form.product_name, price: form.price ? Number(form.price) : null })).data,
    onSuccess: () => navigate("/products"),
    onError: (e: any) => setError(e?.response?.data?.detail ?? "Update failed"),
  });

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
            m.mutate();
          }}
        >
          <Input placeholder="Product name" value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} />
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

