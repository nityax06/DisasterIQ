"use client";

import { useState } from "react";
import { Radio, Loader2, Copy } from "lucide-react";
import { showToast } from "./ToastHost";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

export default function PublicAdvisoryGenerator({ incidents }: { incidents: Incident[] }) {
  const [format, setFormat] = useState("short public advisory");
  const [language, setLanguage] = useState("English");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (loading) return;
    setLoading(true);
    setAnswer("");
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "advisory",
          incidents,
          question: `Generate a ${format} in ${language} for the current highest priority incident. It must be calm, clear, public-safe, non-alarmist, and include what citizens should do now.`,
        }),
      });
      const data = await response.json();
      setAnswer(data.answer || "Advisory unavailable.");
    } catch {
      setAnswer("Advisory service is temporarily unavailable. Please retry.");
    } finally {
      setLoading(false);
    }
  }

  async function copyText() {
    if (!answer) return;
    await navigator.clipboard.writeText(answer);
    showToast("Public advisory copied");
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20 hover:bg-white/[0.05]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-orange-300" />
          <h2 className="text-sm font-semibold">Public Advisory Generator</h2>
        </div>
        <span className="rounded-full border border-orange-500/25 bg-orange-500/10 px-2 py-0.5 text-[11px] text-orange-300">citizen alert</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select value={format} onChange={(e) => setFormat(e.target.value)} className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs outline-none">
          <option>short public advisory</option>
          <option>SMS alert</option>
          <option>social media post</option>
          <option>evacuation notice</option>
        </select>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs outline-none">
          <option>English</option>
          <option>Hindi</option>
          <option>simple Hinglish</option>
        </select>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button onClick={generate} disabled={loading} className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs transition hover:border-orange-500/35 hover:bg-orange-500/10 disabled:opacity-60">
          {loading ? <Loader2 className="mr-2 inline h-3.5 w-3.5 animate-spin" /> : null}
          Generate Advisory
        </button>
        <button onClick={copyText} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs transition hover:border-white/25 hover:bg-white/[0.05]">
          <Copy className="mr-2 inline h-3.5 w-3.5" /> Copy
        </button>
      </div>

      <div className="mt-3 max-h-72 overflow-y-auto rounded-lg border border-white/10 bg-black/30 p-3 text-xs leading-5 text-slate-300 whitespace-pre-wrap">
        {answer || "Generate a clear public advisory based on the current highest-priority incident and live weather context."}
      </div>
    </div>
  );
}
