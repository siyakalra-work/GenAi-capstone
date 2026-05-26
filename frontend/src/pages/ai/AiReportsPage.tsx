import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

export function AiReportsPage() {
  const [query, setQuery] = useState("Show laptops under ₹50000.");
  const [out, setOut] = useState<string>("");

  const search = useMutation({
    mutationFn: async () => (await api.post("/ai/search", { query })).data as any,
    onSuccess: (d) => setOut(JSON.stringify(d, null, 2)),
  });

  const summary = useMutation({
    mutationFn: async () => (await api.post("/ai/summary")).data as any,
    onSuccess: (d) => setOut(d.summary),
  });

  return (
    <div className="space-y-4">
      <div className="text-xl font-semibold">AI Reports</div>
      <Card>
        <div className="flex gap-2">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button onClick={() => search.mutate()} disabled={search.isPending}>
            Search
          </Button>
          <Button className="bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900" onClick={() => summary.mutate()} disabled={summary.isPending}>
            Summary
          </Button>
        </div>
        <pre className="mt-4 text-xs whitespace-pre-wrap">{out || "—"}</pre>
      </Card>
    </div>
  );
}

