"use client";

import { useState } from "react";
import { resources } from "../resources";
import { PackagePlus } from "lucide-react";

function getShortageLevel(gap: number) {
  if (gap <= 0) {
    return {
      label: "Stable",
      priority: "Low",
      eta: "Ready",
      color: "text-green-300",
      bg: "bg-green-500/10",
      border: "border-green-500/30",
    };
  }

  if (gap < 500) {
    return {
      label: "Minor",
      priority: "Medium",
      eta: "45 min",
      color: "text-yellow-300",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
    };
  }

  if (gap < 1500) {
    return {
      label: "Severe",
      priority: "High",
      eta: "30 min",
      color: "text-orange-300",
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
    };
  }

  return {
    label: "Critical",
    priority: "Urgent",
    eta: "15 min",
    color: "text-red-300",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  };
}

export default function ResourcePanel() {
  const [requested, setRequested] = useState<string[]>([]);

  function requestRefill(resourceName: string) {
    if (!requested.includes(resourceName)) {
      setRequested([...requested, resourceName]);
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.045]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Resource Summary</h2>
          <p className="text-xs text-slate-500">
            Monitor shortage severity, refill priority, utilization and ETA.
          </p>
        </div>

        <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-slate-400">
          {requested.length} requested
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="min-w-[980px] w-full text-left text-xs">
          <thead className="bg-white/[0.03] text-slate-400">
            <tr>
              <th className="px-3 py-2 font-medium">Resource</th>
              <th className="px-3 py-2 font-medium">Utilization</th>
              <th className="px-3 py-2 font-medium">Available</th>
              <th className="px-3 py-2 font-medium">Required</th>
              <th className="px-3 py-2 font-medium">Gap</th>
              <th className="px-3 py-2 font-medium">Severity</th>
              <th className="px-3 py-2 font-medium">Priority</th>
              <th className="px-3 py-2 font-medium">ETA</th>
              <th className="px-3 py-2 font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {resources.map((resource) => {
              const gap = resource.required - resource.available;
              const shortage = gap > 0;
              const isRequested = requested.includes(resource.name);
              const level = getShortageLevel(gap);

              const utilization = Math.min(
                100,
                Math.round((resource.available / resource.required) * 100)
              );

              return (
                <tr
                  key={resource.id}
                  className="border-t border-white/10 transition hover:bg-blue-500/[0.06]"
                >
                  <td className="px-3 py-2 font-medium">
                    {resource.name}
                  </td>

                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-1.5 rounded-full ${
                            utilization < 40
                              ? "bg-red-400"
                              : utilization < 70
                              ? "bg-yellow-400"
                              : "bg-green-400"
                          }`}
                          style={{ width: `${utilization}%` }}
                        />
                      </div>

                      <span className="text-[11px] text-slate-400">
                        {utilization}%
                      </span>
                    </div>
                  </td>

                  <td className="px-3 py-2 text-slate-300">
                    {resource.available}
                  </td>

                  <td className="px-3 py-2 text-slate-300">
                    {resource.required}
                  </td>

                  <td
                    className={`px-3 py-2 font-semibold ${
                      shortage ? "text-red-300" : "text-green-300"
                    }`}
                  >
                    {gap}
                  </td>

                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] ${level.border} ${level.bg} ${level.color}`}
                    >
                      {level.label}
                    </span>
                  </td>

                  <td className="px-3 py-2 text-slate-300">
                    {level.priority}
                  </td>

                  <td className="px-3 py-2 text-slate-300">
                    {level.eta}
                  </td>

                  <td className="px-3 py-2">
                    <button
                      onClick={() => requestRefill(resource.name)}
                      disabled={!shortage || isRequested}
                      className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] transition hover:-translate-y-0.5 ${
                        isRequested
                          ? "border-green-500/20 bg-green-500/10 text-green-300"
                          : shortage
                          ? "border-blue-500/20 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                          : "border-white/10 bg-white/[0.03] text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      <PackagePlus className="h-3.5 w-3.5" />
                      {isRequested ? "Requested" : "Request"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}