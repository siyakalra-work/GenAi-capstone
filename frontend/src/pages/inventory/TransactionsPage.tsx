import { api } from "../../services/api";
import { Card } from "../../components/ui/Card";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { useEffect, useState } from "react";

export function TransactionsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .get("/inventory/transactions")
      .then((r) => {
        if (!alive) return;
        setRows(r.data ?? []);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">Transactions</div>
        <div className="flex gap-2">
          <Link to="/inventory/stock-in"><Button>Stock In</Button></Link>
          <Link to="/inventory/stock-out"><Button>Stock Out</Button></Link>
          <Link to="/inventory/adjustment"><Button>Adjustment</Button></Link>
        </div>
      </div>
      <Card>
        {loading ? <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">Loading...</div> : null}
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500 dark:text-slate-400">
            <tr>
              <th className="py-2">Type</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="border-t border-slate-200 dark:border-slate-800">
                <td className="py-2">{t.transaction_type}</td>
                <td>{t.product_id}</td>
                <td>{t.quantity}</td>
                <td>{t.notes ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
