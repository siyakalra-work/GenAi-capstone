import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";

export function AdjustmentPage() {
  const navigate = useNavigate();
  const [productId, setProductId] = useState("");
  const [newQuantity, setNewQuantity] = useState(0);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const products = useQuery({
    queryKey: ["products", "picker"],
    queryFn: async () => (await api.get("/products?page=1&page_size=50")).data as any,
  });

  const m = useMutation({
    mutationFn: async () => (await api.post("/inventory/adjustment", { product_id: productId, new_quantity: newQuantity, notes: notes || null })).data,
    onSuccess: () => navigate("/inventory/transactions"),
    onError: (e: any) => setError(e?.response?.data?.detail ?? "Failed"),
  });

  return (
    <div className="space-y-4">
      <div className="text-xl font-semibold">Adjustment</div>
      <Card>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            m.mutate();
          }}
        >
          <select className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm" value={productId} onChange={(e) => setProductId(e.target.value)}>
            <option value="">Select product</option>
            {(products.data?.items ?? []).map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.sku} — {p.product_name}
              </option>
            ))}
          </select>
          <Input type="number" value={String(newQuantity)} onChange={(e) => setNewQuantity(Number(e.target.value))} />
          <Input placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          {error ? <div className="text-sm text-red-500">{error}</div> : null}
          <Button type="submit" className="bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900" disabled={m.isPending || !productId}>
            {m.isPending ? "Saving..." : "Submit"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

