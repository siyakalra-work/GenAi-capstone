import { useState } from "react";

import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

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
    <div className="space-y-4">
      <div className="text-xl font-semibold">AI Assistant</div>
      <Card>
        <div className="flex gap-2">
          <Input value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button className="bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900" onClick={ask} disabled={loading}>
            Ask
          </Button>
        </div>
        <pre className="mt-4 text-xs whitespace-pre-wrap">{answer || "—"}</pre>
      </Card>
    </div>
  );
}
