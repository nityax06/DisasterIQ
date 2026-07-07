"use client";

import { useEffect, useState } from "react";
import { GitBranch } from "lucide-react";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
};

export default function StatusWorkflowBoard({
  incidents,
}: {
  incidents: Incident[];
}) {
  const [statusMap, setStatusMap] = useState<Record<number, string>>({});

  function loadStatuses() {
    const saved = localStorage.getItem("disasteriq-incident-statuses");
    setStatusMap(saved ? JSON.parse(saved) : {});
  }

  useEffect(() => {
    loadStatuses();

    window.addEventListener("disasteriq-status-update", loadStatuses);

    return () => {
      window.removeEventListener("disasteriq-status-update", loadStatuses);
    };
  }, []);

  const columns = ["Reported", "Investigating", "Responding", "Resolved"];

  function statusFor(id: number) {
    return statusMap[id] || "Reported";
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.05]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-slate-300" />
          <h2 className="text-sm font-semibold">Incident Workflow</h2>
        </div>

        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-slate-400">
          {incidents.length} tracked
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {columns.map((column) => {
          const items = incidents.filter(
            (incident) => statusFor(incident.id) === column
          );

          return (
            <div
              key={column}
              className="min-h-44 rounded-lg border border-white/10 bg-black/30 p-2 transition hover:bg-white/[0.04]"
            >
              <p className="mb-2 rounded-md bg-white/[0.04] px-2 py-1 text-[11px] font-semibold text-slate-300">
                {column}
              </p>

              <div className="space-y-2">
                {items.length === 0 ? (
                  <div className="rounded-md border border-dashed border-white/10 p-3 text-center text-[11px] text-slate-600">
                    Empty
                  </div>
                ) : (
                  items.map((incident) => (
                    <div
                      key={incident.id}
                      className="rounded-md border border-white/10 bg-white/[0.04] p-2 text-[11px] transition hover:border-white/30 hover:bg-white/[0.07]"
                    >
                      <p className="font-medium">{incident.type}</p>
                      <p className="mt-1 text-slate-500">{incident.location}</p>
                      <p className="mt-1 text-[10px] text-slate-600">
                        {incident.severity}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}