"use client";

import { useState } from "react";
import { Brain, Loader2 } from "lucide-react";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

export default function AIPredictionPanel({ incidents }: { incidents: Incident[] }) {
  const [horizon, setHorizon] = useState("next 6 hours");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function runPrediction() {
    if (loading) return;
    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "prediction",
          incidents,
          question: `Predict operational risks, resource pressure, evacuation needs, weather impact, and response priorities for the ${horizon}. Give practical command-center actions.`,
        }),
      });
      const data = await response.json();
      setAnswer(data.answer || "Prediction unavailable.");
    } catch {
      setAnswer("Prediction service is temporarily unavailable. Please retry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20 hover:bg-white/[0.05]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-violet-300" />
          <h2 className="text-sm font-semibold">AI Prediction</h2>
        </div>
        <span className="rounded-full border border-violet-500/25 bg-violet-500/10 px-2 py-0.5 text-[11px] text-violet-300">Gemini</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {["next 6 hours", "next 12 hours", "next 24 hours"].map((item) => (
          <button
            key={item}
            onClick={() => setHorizon(item)}
            className={`rounded-lg border px-3 py-2 text-xs transition hover:border-white/25 ${
              horizon === item ? "border-violet-500/40 bg-violet-500/10 text-violet-200" : "border-white/10 bg-black/30 text-slate-400"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <button
        onClick={runPrediction}
        disabled={loading}
        className="mt-3 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs transition hover:border-violet-500/35 hover:bg-violet-500/10 disabled:opacity-60"
      >
        {loading ? <Loader2 className="mr-2 inline h-3.5 w-3.5 animate-spin" /> : null}
        Predict Operational Risk
      </button>

      <div className="mt-3 max-h-72 overflow-y-auto rounded-lg border border-white/10 bg-black/30 p-3 text-xs leading-5 text-slate-300 whitespace-pre-wrap">
        {answer || "AI prediction will appear here. It will consider current incidents, severity, population, casualties and live weather."}
      </div>
    </div>
  );
}
