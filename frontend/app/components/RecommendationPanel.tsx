"use client";

import { useState } from "react";
import {
  PackageCheck,
  Info,
  ChevronDown,
  ChevronRight,
  Clock,
  TrendingUp,
} from "lucide-react";
import { calculatePriorityScore } from "../priority";
import { calculateAllocation } from "../allocation";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

export default function RecommendationPanel({
  incidents,
}: {
  incidents: Incident[];
}) {
  const [expanded, setExpanded] = useState(true);

  const incident = [...incidents].sort((a, b) => {
    const scoreA = calculatePriorityScore(a.severity, a.population, a.casualties);
    const scoreB = calculatePriorityScore(b.severity, b.population, b.casualties);
    return scoreB - scoreA;
  })[0];

  if (!incident) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="text-sm font-semibold">Resource Allocation</h2>
        <p className="mt-2 text-xs text-slate-500">No active incidents.</p>
      </div>
    );
  }

  const score = calculatePriorityScore(
    incident.severity,
    incident.population,
    incident.casualties
  );

  const allocation = calculateAllocation(
    incident.severity,
    incident.population,
    incident.casualties
  );

  const total =
    allocation.medicalKits + allocation.volunteers + allocation.rescueBoats;

  const deploymentReadiness = Math.min(100, Math.round(score * 0.7));

  return (
    <div className="relative rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-blue-500/30 hover:bg-white/[0.05]">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2"
        >
          <PackageCheck className="h-4 w-4 text-blue-300" />
          <h2 className="text-sm font-semibold">Resource Allocation</h2>
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-500" />
          )}
        </button>

        <div className="group relative">
          <Info className="h-4 w-4 text-slate-500 transition group-hover:text-blue-300" />

          <div className="absolute right-0 top-6 z-50 hidden w-64 rounded-lg border border-white/10 bg-[#0f172a] p-3 text-[11px] leading-5 text-slate-300 shadow-xl group-hover:block">
            Calculates recommended medical kits, volunteers, rescue units,
            readiness and deployment urgency from live incident impact.
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-3">
          <div className="mb-3 rounded-lg border border-white/10 bg-black/30 p-3">
            <p className="text-[11px] text-slate-500">Highest Priority</p>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-sm font-medium">
                {incident.type} · {incident.location}
              </p>

              <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[11px] text-blue-300">
                Score {score}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              ["Medical", allocation.medicalKits, "blue"],
              ["Volunteers", allocation.volunteers, "green"],
              ["Boats", allocation.rescueBoats, "purple"],
            ].map(([label, value, color]) => (
              <div
                key={label}
                className="rounded-lg border border-white/10 bg-black/30 p-3 transition hover:border-blue-500/30 hover:bg-white/[0.04]"
              >
                <p className="text-[11px] text-slate-500">{label}</p>
                <p className="mt-1 text-lg font-semibold">{value}</p>

                <div className="mt-2 h-1.5 rounded-full bg-white/10">
                  <div
                    className={`h-1.5 rounded-full ${
                      color === "blue"
                        ? "bg-blue-400"
                        : color === "green"
                        ? "bg-green-400"
                        : "bg-purple-400"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((Number(value) / total) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-white/10 bg-black/30 p-3 transition hover:border-cyan-500/30">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-cyan-300" />
                <p className="text-[11px] text-slate-500">Deployment ETA</p>
              </div>
              <p className="mt-1 text-sm font-semibold">30–45 min</p>
            </div>

            <div className="rounded-lg border border-white/10 bg-black/30 p-3 transition hover:border-green-500/30">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-green-300" />
                <p className="text-[11px] text-slate-500">Readiness</p>
              </div>

              <div className="mt-2 h-1.5 rounded-full bg-white/10">
                <div
                  className="h-1.5 rounded-full bg-green-400"
                  style={{ width: `${deploymentReadiness}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                {deploymentReadiness}% response-ready
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}