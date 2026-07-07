"use client";

import { useState } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

export default function VoiceCommandCenter({ incidents }: { incidents: Incident[] }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setAnswer("Voice recognition is not supported in this browser. Use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => {
      setListening(false);
      setAnswer("Voice command failed. Please try again.");
    };

    recognition.onresult = async (event: any) => {
      const command = event.results?.[0]?.[0]?.transcript || "";
      setTranscript(command);
      await runCommand(command);
    };

    recognition.start();
  }

  async function runCommand(command: string) {
    if (!command.trim() || loading) return;
    setLoading(true);
    setAnswer("");
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "voice",
          incidents,
          // Send the raw transcript only. The API route decides how to execute it.
          question: command,
        }),
      });
      const data = await response.json();
      setAnswer(data.answer || "No response generated.");
    } catch {
      setAnswer("Voice command service is temporarily unavailable. Please retry.");
    } finally {
      setLoading(false);
    }
  }

  const examples = [
    "Summarize all active incidents",
    "How many boats do we need",
    "Predict the next 6 hours",
    "Generate public advisory",
    "Generate an SMS alert",
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20 hover:bg-white/[0.05]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {listening ? <Mic className="h-4 w-4 animate-pulse text-red-300" /> : <MicOff className="h-4 w-4 text-slate-300" />}
          <h2 className="text-sm font-semibold">Voice Command Center</h2>
        </div>
        <span className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[11px] text-slate-400">browser speech</span>
      </div>

      <button onClick={startListening} disabled={listening || loading} className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs transition hover:border-red-500/35 hover:bg-red-500/10 disabled:opacity-60">
        {loading ? <Loader2 className="mr-2 inline h-3.5 w-3.5 animate-spin" /> : <Mic className="mr-2 inline h-3.5 w-3.5" />}
        {listening ? "Listening..." : "Start Voice Command"}
      </button>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {examples.map((item) => (
          <button key={item} onClick={() => runCommand(item)} className="rounded-lg border border-white/10 bg-black/30 px-2 py-2 text-[11px] text-slate-400 transition hover:border-white/25 hover:bg-white/[0.05]">
            {item}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-lg border border-white/10 bg-black/30 p-3 text-xs text-slate-300">
        <p className="text-slate-500">Transcript</p>
        <p className="mt-1">{transcript || "No voice command yet."}</p>
      </div>

      <div className="mt-3 max-h-64 overflow-y-auto rounded-lg border border-white/10 bg-black/30 p-3 text-xs leading-5 text-slate-300 whitespace-pre-wrap">
        {answer || "Voice response will appear here."}
      </div>
    </div>
  );
}
