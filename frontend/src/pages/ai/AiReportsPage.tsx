import { useState } from "react";

import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

export function AiReportsPage() {
  const [query, setQuery] = useState("Show laptops under ₹50000.");
  const [out, setOut] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function runSearch() {
    setLoading(true);
    try {
      const d = (await api.post("/ai/search", { query })).data as any;
      setOut(JSON.stringify(d, null, 2));
    } finally {
      setLoading(false);
    }
  }

  async function runSummary() {
    setLoading(true);
    try {
      const d = (await api.post("/ai/summary")).data as any;
      setOut(d.summary);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-xl font-semibold">AI Reports</div>
      <Card>
        <div className="flex gap-2">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button onClick={runSearch} disabled={loading}>
            Search
          </Button>
          <Button className="bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900" onClick={runSummary} disabled={loading}>
            Summary
          </Button>
        </div>
        <pre className="mt-4 text-xs whitespace-pre-wrap">{out || "—"}</pre>
      </Card>
    </div>
  );
}
