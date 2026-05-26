import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

export function KnowledgeBasePage() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("What is our damaged item policy?");
  const [answer, setAnswer] = useState<string>("");

  const upload = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      if (!file) throw new Error("No file");
      fd.append("file", file);
      return (await api.post("/ai/upload-document", fd, { headers: { "Content-Type": "multipart/form-data" } })).data as any;
    },
  });

  const ask = useMutation({
    mutationFn: async () => (await api.post("/ai/ask-document", { question })).data as any,
    onSuccess: (d) => setAnswer(`${d.answer}\n\nCitations:\n${JSON.stringify(d.citations, null, 2)}`),
  });

  return (
    <div className="space-y-4">
      <div className="text-xl font-semibold">Knowledge Base</div>
      <Card>
        <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">Upload tenant SOP / guidelines (txt/pdf/docx).</div>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <div className="mt-2">
          <Button onClick={() => upload.mutate()} disabled={!file || upload.isPending}>
            {upload.isPending ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </Card>
      <Card>
        <div className="flex gap-2">
          <Input value={question} onChange={(e) => setQuestion(e.target.value)} />
          <Button className="bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900" onClick={() => ask.mutate()} disabled={ask.isPending}>
            Ask
          </Button>
        </div>
        <pre className="mt-4 text-xs whitespace-pre-wrap">{answer || "—"}</pre>
      </Card>
    </div>
  );
}

