"use client";

import { useEffect } from "react";

type Props = {
  accent: string;
  setAccent: (accent: string) => void;
};

const themes = [
  {
    name: "Black",
    value: "black",
    dot: "bg-white",
    preview: "from-zinc-950 via-zinc-900 to-black",
  },
  {
    name: "Emerald",
    value: "emerald",
    dot: "bg-emerald-400",
    preview: "from-emerald-950 via-zinc-950 to-black",
  },
  {
    name: "Aubergine",
    value: "aubergine",
    dot: "bg-violet-400",
    preview: "from-violet-950 via-zinc-950 to-black",
  },
  {
    name: "Crimson",
    value: "crimson",
    dot: "bg-red-400",
    preview: "from-red-950 via-zinc-950 to-black",
  },
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

    if (fixedTheme !== accent) setAccent(fixedTheme);
  }, [accent, setAccent]);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-white/20 hover:bg-white/[0.05]">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-medium text-slate-400">
          Interface Theme
        </p>

        <span className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[10px] text-slate-500">
          4 modes
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {themes.map((item) => {
          const active = accent === item.value;

          return (
            <button
              key={item.value}
              onClick={() => setAccent(item.value)}
              className={`rounded-xl border p-3 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                active
                  ? "border-white/50 bg-white/[0.1]"
                  : "border-white/10 bg-black/30 hover:border-white/25 hover:bg-white/[0.05]"
              }`}
            >
              <div
                className={`mb-2 h-10 rounded-xl bg-gradient-to-br ${item.preview}`}
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-200">
                  {item.name}
                </span>

                <span
                  className={`h-2.5 w-2.5 rounded-full ${item.dot}`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}