import { useState } from "react";

import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PageHeader } from "../../components/ui/PageHeader";
import { Panel } from "../../components/ui/Panel";

export function AiAssistantPage() {
  const [message, setMessage] = useState("Which products are running low?");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function ask() {
    setLoading(true);
    try {
      const d = (await api.post("/ai/chat", { message })).data as { answer: string };
      setAnswer(d.answer);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader title="AI Assistant" subtitle="Ask natural-language questions about your tenant inventory" />
      <Panel>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1">
            <Input value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <Button
            className="bg-slate-900 text-white dark:bg-white/10 dark:text-white border-slate-900/20 dark:border-white/10"
            onClick={ask}
            disabled={loading}
          >
            {loading ? "Thinking…" : "Ask"}
          </Button>
        </div>
        <div className="mt-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-white/5 p-4">
          <pre className="text-xs whitespace-pre-wrap text-slate-900 dark:text-slate-50">{answer || "—"}</pre>
        </div>
      </Panel>
    </div>
  );
}
