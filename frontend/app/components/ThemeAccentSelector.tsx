"use client";

import { useEffect } from "react";

type Props = {
  accent: string;
  setAccent: (accent: string) => void;
};

const themes = [
  { name: "Black", value: "black", dot: "bg-white" },
  { name: "Emerald", value: "emerald", dot: "bg-emerald-400" },
  { name: "Aubergine", value: "aubergine", dot: "bg-violet-400" },
  { name: "Crimson", value: "crimson", dot: "bg-red-400" },
];

export default function ThemeAccentSelector({ accent, setAccent }: Props) {
  useEffect(() => {
    const fixedTheme =
      accent === "graphite"
        ? "black"
        : accent === "green"
        ? "emerald"
        : accent === "purple"
        ? "aubergine"
        : accent === "red"
        ? "crimson"
        : accent;

    document.documentElement.setAttribute("data-theme", fixedTheme);

    if (fixedTheme !== accent) {
      setAccent(fixedTheme);
    }
  }, [accent, setAccent]);

  return (
    <>
      <style jsx global>{`
        :root[data-theme="black"] body {
          background: #000000 !important;
        }

        :root[data-theme="black"] main {
          background:
            radial-gradient(circle at top left, rgba(255, 255, 255, 0.075), transparent 28%),
            #000000 !important;
        }

        :root[data-theme="black"] aside {
          background: #030303 !important;
          border-color: rgba(255, 255, 255, 0.18) !important;
        }

        :root[data-theme="black"] header {
          background: rgba(0, 0, 0, 0.96) !important;
          border-color: rgba(255, 255, 255, 0.18) !important;
        }

        :root[data-theme="black"] .rounded-xl,
        :root[data-theme="black"] .rounded-2xl {
          border-color: rgba(255, 255, 255, 0.16) !important;
        }

        :root[data-theme="black"] .bg-white\\/\\[0\\.03\\],
        :root[data-theme="black"] .bg-white\\/\\[0\\.035\\] {
          background: #0d0d0d !important;
        }

        :root[data-theme="black"] .bg-black\\/30,
        :root[data-theme="black"] .bg-black\\/40 {
          background: #050505 !important;
        }

        :root[data-theme="black"] button:hover,
        :root[data-theme="black"] .rounded-lg:hover,
        :root[data-theme="black"] .rounded-xl:hover {
          border-color: rgba(255, 255, 255, 0.32) !important;
          background-color: #141414 !important;
        }

        :root[data-theme="black"] input,
        :root[data-theme="black"] select {
          background: #050505 !important;
          border-color: rgba(255, 255, 255, 0.18) !important;
        }

        :root[data-theme="black"] table thead {
          background: #111111 !important;
        }

        :root[data-theme="black"] table tr:hover {
          background: #141414 !important;
        }

        :root[data-theme="emerald"] body {
          background: #020403 !important;
        }

        :root[data-theme="emerald"] main {
          background:
            radial-gradient(circle at top left, rgba(16, 185, 129, 0.12), transparent 30%),
            radial-gradient(circle at bottom right, rgba(6, 78, 59, 0.16), transparent 32%),
            #020403 !important;
        }

        :root[data-theme="emerald"] aside,
        :root[data-theme="emerald"] header {
          background: rgba(3, 10, 7, 0.96) !important;
          border-color: rgba(52, 211, 153, 0.18) !important;
        }

        :root[data-theme="emerald"] .rounded-xl,
        :root[data-theme="emerald"] .rounded-2xl {
          border-color: rgba(52, 211, 153, 0.14) !important;
        }

        :root[data-theme="emerald"] .bg-white\\/\\[0\\.03\\],
        :root[data-theme="emerald"] .bg-white\\/\\[0\\.035\\] {
          background: rgba(5, 18, 12, 0.9) !important;
        }

        :root[data-theme="emerald"] .bg-black\\/30,
        :root[data-theme="emerald"] .bg-black\\/40 {
          background: rgba(2, 8, 5, 0.95) !important;
        }

        :root[data-theme="emerald"] .text-blue-300,
        :root[data-theme="emerald"] .text-blue-400,
        :root[data-theme="emerald"] .text-cyan-300 {
          color: #6ee7b7 !important;
        }

        :root[data-theme="emerald"] .bg-blue-500\\/10,
        :root[data-theme="emerald"] .bg-cyan-500\\/10 {
          background-color: rgba(16, 185, 129, 0.11) !important;
        }

        :root[data-theme="emerald"] .border-blue-500\\/20,
        :root[data-theme="emerald"] .border-blue-500\\/30,
        :root[data-theme="emerald"] .border-blue-500\\/40,
        :root[data-theme="emerald"] .border-cyan-500\\/20,
        :root[data-theme="emerald"] .border-cyan-500\\/30,
        :root[data-theme="emerald"] .border-cyan-500\\/40 {
          border-color: rgba(52, 211, 153, 0.28) !important;
        }

        :root[data-theme="emerald"] button:hover,
        :root[data-theme="emerald"] .rounded-lg:hover,
        :root[data-theme="emerald"] .rounded-xl:hover {
          background-color: rgba(6, 78, 59, 0.18) !important;
          border-color: rgba(52, 211, 153, 0.34) !important;
        }

        :root[data-theme="emerald"] input,
        :root[data-theme="emerald"] select {
          background: rgba(2, 8, 5, 0.95) !important;
          border-color: rgba(52, 211, 153, 0.16) !important;
        }

        :root[data-theme="emerald"] table thead {
          background: rgba(6, 78, 59, 0.16) !important;
        }

        :root[data-theme="emerald"] table tr:hover {
          background: rgba(6, 78, 59, 0.2) !important;
        }

        :root[data-theme="aubergine"] body {
          background: #050208 !important;
        }

        :root[data-theme="aubergine"] main {
          background:
            radial-gradient(circle at top left, rgba(168, 85, 247, 0.12), transparent 30%),
            radial-gradient(circle at bottom right, rgba(76, 29, 149, 0.18), transparent 34%),
            #050208 !important;
        }

        :root[data-theme="aubergine"] aside,
        :root[data-theme="aubergine"] header {
          background: rgba(8, 4, 13, 0.96) !important;
          border-color: rgba(196, 181, 253, 0.16) !important;
        }

        :root[data-theme="aubergine"] .rounded-xl,
        :root[data-theme="aubergine"] .rounded-2xl {
          border-color: rgba(196, 181, 253, 0.14) !important;
        }

        :root[data-theme="aubergine"] .bg-white\\/\\[0\\.03\\],
        :root[data-theme="aubergine"] .bg-white\\/\\[0\\.035\\] {
          background: rgba(16, 8, 26, 0.9) !important;
        }

        :root[data-theme="aubergine"] .bg-black\\/30,
        :root[data-theme="aubergine"] .bg-black\\/40 {
          background: rgba(7, 3, 12, 0.95) !important;
        }

        :root[data-theme="aubergine"] .text-blue-300,
        :root[data-theme="aubergine"] .text-blue-400,
        :root[data-theme="aubergine"] .text-cyan-300 {
          color: #c4b5fd !important;
        }

        :root[data-theme="aubergine"] .bg-blue-500\\/10,
        :root[data-theme="aubergine"] .bg-cyan-500\\/10 {
          background-color: rgba(124, 58, 237, 0.12) !important;
        }

        :root[data-theme="aubergine"] .border-blue-500\\/20,
        :root[data-theme="aubergine"] .border-blue-500\\/30,
        :root[data-theme="aubergine"] .border-blue-500\\/40,
        :root[data-theme="aubergine"] .border-cyan-500\\/20,
        :root[data-theme="aubergine"] .border-cyan-500\\/30,
        :root[data-theme="aubergine"] .border-cyan-500\\/40 {
          border-color: rgba(196, 181, 253, 0.26) !important;
        }

        :root[data-theme="aubergine"] button:hover,
        :root[data-theme="aubergine"] .rounded-lg:hover,
        :root[data-theme="aubergine"] .rounded-xl:hover {
          background-color: rgba(76, 29, 149, 0.2) !important;
          border-color: rgba(196, 181, 253, 0.34) !important;
        }

        :root[data-theme="aubergine"] input,
        :root[data-theme="aubergine"] select {
          background: rgba(7, 3, 12, 0.95) !important;
          border-color: rgba(196, 181, 253, 0.16) !important;
        }

        :root[data-theme="aubergine"] table thead {
          background: rgba(76, 29, 149, 0.16) !important;
        }

        :root[data-theme="aubergine"] table tr:hover {
          background: rgba(76, 29, 149, 0.2) !important;
        }

        :root[data-theme="crimson"] body {
          background: #060202 !important;
        }

        :root[data-theme="crimson"] main {
          background:
            radial-gradient(circle at top left, rgba(239, 68, 68, 0.12), transparent 30%),
            radial-gradient(circle at bottom right, rgba(127, 29, 29, 0.18), transparent 34%),
            #060202 !important;
        }

        :root[data-theme="crimson"] aside,
        :root[data-theme="crimson"] header {
          background: rgba(12, 4, 4, 0.96) !important;
          border-color: rgba(252, 165, 165, 0.16) !important;
        }

        :root[data-theme="crimson"] .rounded-xl,
        :root[data-theme="crimson"] .rounded-2xl {
          border-color: rgba(252, 165, 165, 0.14) !important;
        }

        :root[data-theme="crimson"] .bg-white\\/\\[0\\.03\\],
        :root[data-theme="crimson"] .bg-white\\/\\[0\\.035\\] {
          background: rgba(23, 8, 8, 0.9) !important;
        }

        :root[data-theme="crimson"] .bg-black\\/30,
        :root[data-theme="crimson"] .bg-black\\/40 {
          background: rgba(10, 3, 3, 0.95) !important;
        }

        :root[data-theme="crimson"] .text-blue-300,
        :root[data-theme="crimson"] .text-blue-400,
        :root[data-theme="crimson"] .text-cyan-300 {
          color: #fca5a5 !important;
        }

        :root[data-theme="crimson"] .bg-blue-500\\/10,
        :root[data-theme="crimson"] .bg-cyan-500\\/10 {
          background-color: rgba(239, 68, 68, 0.11) !important;
        }

        :root[data-theme="crimson"] .border-blue-500\\/20,
        :root[data-theme="crimson"] .border-blue-500\\/30,
        :root[data-theme="crimson"] .border-blue-500\\/40,
        :root[data-theme="crimson"] .border-cyan-500\\/20,
        :root[data-theme="crimson"] .border-cyan-500\\/30,
        :root[data-theme="crimson"] .border-cyan-500\\/40 {
          border-color: rgba(252, 165, 165, 0.26) !important;
        }

        :root[data-theme="crimson"] button:hover,
        :root[data-theme="crimson"] .rounded-lg:hover,
        :root[data-theme="crimson"] .rounded-xl:hover {
          background-color: rgba(127, 29, 29, 0.22) !important;
          border-color: rgba(252, 165, 165, 0.34) !important;
        }

        :root[data-theme="crimson"] input,
        :root[data-theme="crimson"] select {
          background: rgba(10, 3, 3, 0.95) !important;
          border-color: rgba(252, 165, 165, 0.16) !important;
        }

        :root[data-theme="crimson"] table thead {
          background: rgba(127, 29, 29, 0.16) !important;
        }

        :root[data-theme="crimson"] table tr:hover {
          background: rgba(127, 29, 29, 0.2) !important;
        }
      `}</style>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:bg-white/[0.05]">
        <p className="mb-2 text-[11px] text-slate-500">Theme Mode</p>

        <div className="grid grid-cols-4 gap-2">
          {themes.map((item) => {
            const active = accent === item.value;

            return (
              <button
                key={item.value}
                onClick={() => setAccent(item.value)}
                className={`rounded-lg border px-2 py-2 text-[11px] transition hover:-translate-y-0.5 ${
                  active
                    ? "border-white/40 bg-white/15 text-white"
                    : "border-white/10 bg-black/30 text-slate-400 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <span
                  className={`mr-1 inline-block h-2 w-2 rounded-full ${item.dot}`}
                />
                {item.name}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}