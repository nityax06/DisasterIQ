"use client";

import { useState } from "react";
import { Zap, CheckCircle2 } from "lucide-react";
import { showToast } from "./ToastHost";
import { addNotification } from "./appEvents";

export default function QuickActions() {
  const [completedActions, setCompletedActions] = useState<string[]>([]);

  const actions = [
    {
      label: "New Incident",
      event: "dashboard-view-incidents",
      message: "Incident workspace opened",
    },
    {
      label: "Resources",
      event: "dashboard-view-resources",
      message: "Resource center opened",
    },
    {
      label: "Analytics",
      event: "dashboard-view-analytics",
      message: "Analytics workspace opened",
    },
    {
      label: "Export",
      event: "dashboard-export",
      message: "Export dialog opened",
    },
  ];

  function runAction(action: (typeof actions)[number]) {
    if (!completedActions.includes(action.label)) {
      setCompletedActions([...completedActions, action.label]);
    }

    window.dispatchEvent(new CustomEvent(action.event));

    addNotification("Quick action triggered", action.message, "workflow");
    showToast(action.message);
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.05]">
      <div className="mb-3 flex items-center gap-2">
        <Zap className="h-4 w-4 text-slate-300" />
        <h2 className="text-sm font-semibold">Quick Actions</h2>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const done = completedActions.includes(action.label);

          return (
            <button
              key={action.label}
              onClick={() => runAction(action)}
              className={`rounded-lg border px-3 py-2 text-xs transition hover:-translate-y-0.5 ${
                done
                  ? "border-green-500/30 bg-green-500/10 text-green-300"
                  : "border-white/10 bg-black/30 hover:border-white/30 hover:bg-white/[0.06]"
              }`}
            >
              {done && <CheckCircle2 className="mr-1 inline h-3 w-3" />}
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}