import { useState } from "react";

import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

export function KnowledgeBasePage() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("What is our damaged item policy?");
  const [answer, setAnswer] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);

  async function upload() {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      await api.post("/ai/upload-document", fd, { headers: { "Content-Type": "multipart/form-data" } });
    } finally {
      setUploading(false);
    }
  }

  async function ask() {
    setAsking(true);
    try {
      const d = (await api.post("/ai/ask-document", { question })).data as any;
      setAnswer(`${d.answer}\n\nCitations:\n${JSON.stringify(d.citations, null, 2)}`);
    } finally {
      setAsking(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-xl font-semibold">Knowledge Base</div>
      <Card>
        <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">Upload tenant SOP / guidelines (txt/pdf/docx).</div>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <div className="mt-2">
          <Button onClick={upload} disabled={!file || uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </Card>
      <Card>
        <div className="flex gap-2">
          <Input value={question} onChange={(e) => setQuestion(e.target.value)} />
          <Button className="bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900" onClick={ask} disabled={asking}>
            Ask
          </Button>
        </div>
        <pre className="mt-4 text-xs whitespace-pre-wrap">{answer || "—"}</pre>
      </Card>
    </div>
  );
}
