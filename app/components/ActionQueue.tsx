"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Send } from "lucide-react";
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

export default function ActionQueue({ incidents }: { incidents: Incident[] }) {
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("disasteriq-action-queue");
    if (saved) setDone(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("disasteriq-action-queue", JSON.stringify(done));
  }, [done]);

  const topIncident = incidents[0];

  const actions = [
    `Dispatch volunteers to ${topIncident?.location || "priority zone"}`,
    `Allocate medical kits`,
    `Prepare rescue boat units`,
    `Notify nearest relief center`,
    `Confirm route clearance`,
    `Send field status update`,
  ];

  function toggleAction(action: string) {
    const updated = done.includes(action)
      ? done.filter((item) => item !== action)
      : [...done, action];

    setDone(updated);

    addNotification(
      "Action queue updated",
      `${action} ${updated.includes(action) ? "completed" : "reopened"}.`,
      "workflow"
    );

    showToast(updated.includes(action) ? "Action completed" : "Action reopened");
  }

  return (
    <div className="h-[430px] rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.05]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Action Queue</h2>
          <p className="text-xs text-slate-500">Persistent response checklist.</p>
        </div>

        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-slate-400">
          {done.length}/{actions.length} done
        </span>
      </div>

      <div className="max-h-[340px] space-y-2 overflow-y-auto pr-1">
        {actions.map((action) => {
          const completed = done.includes(action);

          return (
            <button
              key={action}
              onClick={() => toggleAction(action)}
              className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition hover:-translate-y-0.5 ${
                completed
                  ? "border-green-500/25 bg-green-500/10 text-green-300 hover:bg-green-500/15"
                  : "border-white/10 bg-black/30 text-slate-300 hover:border-white/25 hover:bg-white/[0.05]"
              }`}
            >
              <span className="flex items-center gap-2">
                {completed ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4 text-slate-500" />
                )}
                {action}
              </span>

              <Send className="h-3.5 w-3.5 opacity-60" />
            </button>
          );
        })}
      </div>
    </div>
  );
}