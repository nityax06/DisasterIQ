"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Send } from "lucide-react";
import { calculatePriorityScore } from "../priority";
import { calculateAllocation } from "../allocation";
import { showToast } from "./ToastHost";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

type ActionQueueProps = {
  incidents: Incident[];
};

export default function ActionQueue({ incidents }: ActionQueueProps) {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("disasteriq-action-queue");
    if (saved) {
      setCompleted(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "disasteriq-action-queue",
      JSON.stringify(completed)
    );
  }, [completed]);

  const topIncident = [...incidents].sort((a, b) => {
    const scoreA = calculatePriorityScore(a.severity, a.population, a.casualties);
    const scoreB = calculatePriorityScore(b.severity, b.population, b.casualties);
    return scoreB - scoreA;
  })[0];

  if (!topIncident) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-blue-500/30 hover:bg-white/[0.05]">
        <h2 className="text-sm font-semibold">Action Queue</h2>
        <p className="mt-2 text-xs text-slate-500">No generated actions.</p>
      </div>
    );
  }

  const allocation = calculateAllocation(
    topIncident.severity,
    topIncident.population,
    topIncident.casualties
  );

  const actions = [
    `Dispatch ${allocation.volunteers} volunteers to ${topIncident.location}`,
    `Allocate ${allocation.medicalKits} medical kits`,
    `Prepare ${allocation.rescueBoats} rescue boat units`,
    `Notify nearest relief center`,
  ];

  function toggleAction(action: string) {
    const alreadyDone = completed.includes(action);

    setCompleted((previous) =>
      alreadyDone
        ? previous.filter((item) => item !== action)
        : [...previous, action]
    );

    showToast(alreadyDone ? "Action reopened" : "Action marked complete");
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-green-500/30 hover:bg-white/[0.05]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Action Queue</h2>
          <p className="text-xs text-slate-500">
            Persistent response checklist.
          </p>
        </div>

        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-slate-400">
          {completed.filter((item) => actions.includes(item)).length}/{actions.length} done
        </span>
      </div>

      <div className="space-y-2">
        {actions.map((action) => {
          const done = completed.includes(action);

          return (
            <button
              key={action}
              onClick={() => toggleAction(action)}
              className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-xs transition hover:-translate-y-0.5 ${
                done
                  ? "border-green-500/30 bg-green-500/10 text-green-300 hover:bg-green-500/20"
                  : "border-white/10 bg-black/30 hover:border-blue-500/40 hover:bg-blue-500/10"
              }`}
            >
              <span className="flex items-center gap-2">
                {done ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4 text-slate-500" />
                )}
                {action}
              </span>

              <Send className="h-3.5 w-3.5 opacity-50" />
            </button>
          );
        })}
      </div>
    </div>
  );
}