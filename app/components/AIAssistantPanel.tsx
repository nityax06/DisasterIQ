"use client";

import { useMemo, useState } from "react";
import { Brain, Loader2, Sparkles } from "lucide-react";
import { addNotification } from "./appEvents";
import { showToast } from "./ToastHost";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

export default function AIAssistantPanel({ incidents }: { incidents: Incident[] }) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const topIncident = useMemo(() => {
    const rank = { critical: 4, high: 3, medium: 2, low: 1 } as Record<string, number>;
    return [...incidents].sort(
      (a, b) => (rank[b.severity.toLowerCase()] || 0) - (rank[a.severity.toLowerCase()] || 0)
    )[0];
  }, [incidents]);

  async function askAI(prompt: string) {
    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: prompt, incidents, mode: "assistant" }),
      });

      const data = await response.json();
      setAnswer(data.answer || "No recommendation returned.");

      addNotification("AI assistant generated guidance", prompt, "mission");
      showToast(data.fallback ? "Local AI fallback used" : "AI recommendation generated");
    } catch {
      setAnswer("AI assistant could not connect. Check your Gemini API key and API route.");
      showToast("AI assistant unavailable");
    } finally {
      setLoading(false);
    }
  }

  const prompts = [
    "Summarize the current disaster situation and top priority.",
    "Recommend immediate resource allocation for the highest risk incident.",
    "Explain why the current top incident should be prioritized.",
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-violet-300" />
          <div>
            <h2 className="text-sm font-semibold">Gemini Response Assistant</h2>
            <p className="text-xs text-slate-500">
              Free Gemini-powered incident recommendations.
            </p>
          </div>
        </div>

        <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[11px] text-violet-300">
          Gemini ready
        </span>
      </div>

      <div className="mb-3 rounded-lg border border-white/10 bg-black/30 p-3 text-xs">
        <p className="text-slate-500">Current focus</p>
        <p className="mt-1 font-semibold">
          {topIncident ? `${topIncident.type} · ${topIncident.location}` : "No active incident"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => askAI(prompt)}
            disabled={loading}
            className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-left text-xs text-slate-300 transition hover:border-violet-500/30 hover:bg-violet-500/10 disabled:opacity-50"
          >
            <Sparkles className="mr-2 inline h-3.5 w-3.5 text-violet-300" />
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-3 min-h-28 rounded-lg border border-white/10 bg-black/30 p-3 text-xs leading-5 text-slate-300">
        {loading ? (
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Thinking through the response plan...
          </div>
        ) : answer ? (
          <p className="whitespace-pre-wrap">{answer}</p>
        ) : (
          <p className="text-slate-500">
            Select a prompt to generate a Gemini-backed operational recommendation.
          </p>
        )}
      </div>
    </div>
  );
}
