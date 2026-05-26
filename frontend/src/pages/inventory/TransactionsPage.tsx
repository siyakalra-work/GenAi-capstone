import { api } from "../../services/api";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { useEffect, useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Panel } from "../../components/ui/Panel";
import { Table, TD, TH, THead, TR } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";

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
    <div className="space-y-5">
      <PageHeader
        title="Transactions"
        subtitle="Audit inventory stock movements"
        right={
          <>
            <Link to="/inventory/stock-in">
              <Button>Stock In</Button>
            </Link>
            <Link to="/inventory/stock-out">
              <Button>Stock Out</Button>
            </Link>
            <Link to="/inventory/adjustment">
              <Button className="bg-slate-900 text-white dark:bg-white/10 dark:text-white border-slate-900/20 dark:border-white/10">
                Adjustment
              </Button>
            </Link>
          </>
        }
      />

      <Panel>
        {loading ? <div className="text-sm text-muted mb-2">Loading…</div> : null}
        <Table>
          <THead>
            <tr>
              <TH>Type</TH>
              <TH>Product</TH>
              <TH>Notes</TH>
              <TH className="text-right">Qty</TH>
            </tr>
          </THead>
          <tbody>
            {rows.length ? (
              rows.map((t) => (
                <TR key={t.id}>
                  <TD>
                    <Badge tone={t.transaction_type === "in" ? "good" : t.transaction_type === "out" ? "info" : "neutral"}>
                      {t.transaction_type}
                    </Badge>
                  </TD>
                  <TD>
                    <div className="font-medium">{t.product_id}</div>
                    <div className="text-xs text-muted">{t.id}</div>
                  </TD>
                  <TD className="text-muted">{t.notes ?? "—"}</TD>
                  <TD className="text-right font-semibold">{t.quantity}</TD>
                </TR>
              ))
            ) : (
              <TR>
                <TD className="py-10 text-center text-muted" colSpan={4 as any}>
                  No transactions yet.
                </TD>
              </TR>
            )}
          </tbody>
        </Table>
      </Panel>
    </div>
  );
}
