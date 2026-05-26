import { useState } from "react";

import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PageHeader } from "../../components/ui/PageHeader";
import { Panel } from "../../components/ui/Panel";

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
    <div className="space-y-5">
      <PageHeader title="Knowledge Base" subtitle="Upload SOPs and ask questions with citations (tenant-isolated)" />

      <Panel>
        <div className="text-sm text-muted mb-3">Upload tenant SOP / guidelines (txt/pdf/docx)</div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <input
            className="block w-full text-sm text-muted file:mr-4 file:rounded-xl file:border-0 file:px-4 file:py-2 file:bg-slate-900 file:text-white dark:file:bg-white/10 dark:file:text-white file:cursor-pointer"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <Button
            onClick={upload}
            disabled={!file || uploading}
            className="bg-slate-900 text-white dark:bg-white/10 dark:text-white border-slate-900/20 dark:border-white/10"
          >
            {uploading ? "Uploading…" : "Upload"}
          </Button>
        </div>
      </Panel>

      <Panel>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1">
            <Input value={question} onChange={(e) => setQuestion(e.target.value)} />
          </div>
          <Button
            className="bg-slate-900 text-white dark:bg-white/10 dark:text-white border-slate-900/20 dark:border-white/10"
            onClick={ask}
            disabled={asking}
          >
            {asking ? "Searching…" : "Ask"}
          </Button>
        </div>
        <div className="mt-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-white/5 p-4">
          <pre className="text-xs whitespace-pre-wrap text-slate-900 dark:text-slate-50">{answer || "—"}</pre>
        </div>
      </Panel>
    </div>
  );
}
