"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  Siren,
  Send,
  RefreshCw,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { showToast } from "./ToastHost";

const missionActions = [
  {
    label: "Approve Response",
    doneLabel: "Approved",
    icon: Shield,
    message: "Emergency response approved",
  },
  {
    label: "Dispatch Resources",
    doneLabel: "Resources Sent",
    icon: Siren,
    message: "Resource dispatch initiated",
  },
  {
    label: "Notify Volunteers",
    doneLabel: "Notification Sent",
    icon: Send,
    message: "Volunteer notification sent",
  },
  {
    label: "Lock Incident",
    doneLabel: "Locked",
    icon: Lock,
    message: "Incident locked for command review",
  },
  {
    label: "Reallocate Supplies",
    doneLabel: "Reallocated",
    icon: RefreshCw,
    message: "Supplies reallocated",
  },
  {
    label: "Broadcast Alert",
    doneLabel: "Broadcasted",
    icon: Send,
    message: "Emergency broadcast completed",
  },
];

export default function MissionControl() {
  const [activeActions, setActiveActions] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("disasteriq-mission-actions");

    if (saved) {
      setActiveActions(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "disasteriq-mission-actions",
      JSON.stringify(activeActions)
    );
  }, [activeActions]);

  function runMissionAction(label: string, message: string) {
    if (!activeActions.includes(label)) {
      setActiveActions([...activeActions, label]);
    }

    showToast(message);
  }

  const progress = Math.round(
    (activeActions.length / missionActions.length) * 100
  );

  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.05]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-red-300" />
          <h2 className="text-sm font-semibold">Mission Control</h2>
        </div>

        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-slate-400">
          {progress}% complete
        </span>
      </div>

      <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-red-400 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {missionActions.map((action) => {
          const Icon = action.icon;
          const active = activeActions.includes(action.label);

          return (
            <button
              key={action.label}
              onClick={() => runMissionAction(action.label, action.message)}
              className={`rounded-lg border px-3 py-3 text-xs transition hover:-translate-y-0.5 ${
                active
                  ? "border-green-500/30 bg-green-500/10 text-green-300"
                  : "border-white/10 bg-black/30 hover:border-red-500/40 hover:bg-red-500/10"
              }`}
            >
              {active ? (
                <CheckCircle2 className="mx-auto mb-1 h-4 w-4" />
              ) : (
                <Icon className="mx-auto mb-1 h-4 w-4" />
              )}

              {active ? action.doneLabel : action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}