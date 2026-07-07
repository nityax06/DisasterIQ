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
      type: "workflow" as const,
    },
    {
      label: "Resources",
      event: "dashboard-view-resources",
      message: "Resource center opened",
      type: "resource" as const,
    },
    {
      label: "Analytics",
      event: "dashboard-view-analytics",
      message: "Analytics workspace opened",
      type: "workflow" as const,
    },
    {
      label: "Export",
      event: "dashboard-export",
      message: "Export dialog opened",
      type: "export" as const,
    },
    {
      label: "Refill Request",
      event: "dashboard-resource-refill",
      message: "Emergency refill request added",
      type: "resource" as const,
    },
    {
      label: "System Check",
      event: "dashboard-system-check",
      message: "System readiness check completed",
      type: "workflow" as const,
    },
  ];

  function runAction(action: (typeof actions)[number]) {
    if (!completedActions.includes(action.label)) {
      setCompletedActions([...completedActions, action.label]);
    }

    window.dispatchEvent(new CustomEvent(action.event));

    addNotification("Quick action triggered", action.message, action.type);
    showToast(action.message);
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.05]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-slate-300" />
          <h2 className="text-sm font-semibold">Quick Actions</h2>
        </div>

        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-slate-400">
          {completedActions.length}/{actions.length}
        </span>
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