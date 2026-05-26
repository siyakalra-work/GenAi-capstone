import { useState } from "react";

import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PageHeader } from "../../components/ui/PageHeader";
import { Panel } from "../../components/ui/Panel";

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
    <div className="space-y-5">
      <PageHeader title="AI Reports" subtitle="Natural language search and executive summaries" />
      <Panel>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Button onClick={runSearch} disabled={loading}>
            Search
          </Button>
          <Button
            className="bg-slate-900 text-white dark:bg-white/10 dark:text-white border-slate-900/20 dark:border-white/10"
            onClick={runSummary}
            disabled={loading}
          >
            Summary
          </Button>
        </div>
        <div className="mt-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-white/5 p-4">
          <pre className="text-xs whitespace-pre-wrap text-slate-900 dark:text-slate-50">{out || "—"}</pre>
        </div>
      </Panel>
    </div>
  );
}
