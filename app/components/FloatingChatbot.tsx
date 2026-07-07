"use client";

import { FormEvent, useState } from "react";
import { Bot, Send, X, Loader2, MessageSquare } from "lucide-react";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

type ChatItem = {
  role: "user" | "assistant";
  content: string;
};

export default function FloatingChatbot({ incidents }: { incidents: Incident[] }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatItem[]>([
    {
      role: "assistant",
      content: "Hi, I am the DisasterIQ assistant. Ask me about incidents, resources, weather impact, rescue operations, or next response steps.",
    },
  ]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = input.trim();
    if (!question) return;

    const nextMessages: ChatItem[] = [...messages, { role: "user", content: question }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, incidents, mode: "chat", messages: nextMessages.slice(-8) }),
      });
      const data = await response.json();
      setMessages([...nextMessages, { role: "assistant", content: data.answer || "I could not generate a response." }]);
    } catch {
      setMessages([
        ...nextMessages,
        { role: "assistant", content: "Assistant connection failed. Check the Gemini API key and API route." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-5 z-[80] flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/20 px-4 py-3 text-xs font-semibold text-violet-100 shadow-2xl backdrop-blur transition hover:-translate-y-0.5 hover:bg-violet-500/30"
      >
        <MessageSquare className="h-4 w-4" /> AI Chat
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-5 z-[90] flex h-[470px] w-[360px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a]/95 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-violet-300" />
          <div>
            <p className="text-sm font-semibold">DisasterIQ AI Chat</p>
            <p className="text-[11px] text-slate-500">Gemini-powered disaster assistant</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="rounded-md border border-white/10 p-1 text-slate-400 hover:bg-white/10">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3 text-xs">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`max-w-[90%] rounded-xl border p-3 leading-5 ${
              message.role === "user"
                ? "ml-auto border-white/10 bg-white text-black"
                : "border-white/10 bg-black/30 text-slate-300"
            }`}
          >
            {message.content}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 p-3 text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
          </div>
        )}
      </div>

      <form onSubmit={submit} className="flex gap-2 border-t border-white/10 p-3">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about response strategy..."
          className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs outline-none focus:border-violet-500/40"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl border border-violet-500/30 bg-violet-500/20 px-3 text-violet-100 transition hover:bg-violet-500/30 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
