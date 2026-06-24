"use client";

import { useState } from "react";
import {
  PackageCheck,
  Info,
  ChevronDown,
  ChevronRight,
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

type RecommendationPanelProps = {
  incidents: Incident[];
};

export default function RecommendationPanel({
  incidents,
}: RecommendationPanelProps) {
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

  const priorityScore = calculatePriorityScore(
    incident.severity,
    incident.population,
    incident.casualties
  );

  const allocation = calculateAllocation(
    incident.severity,
    incident.population,
    incident.casualties
  );

  return (
    <div className="group relative rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-blue-500/40 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(59,130,246,0.12)]">
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

        <Info className="h-4 w-4 text-slate-500 transition group-hover:text-blue-300" />
      </div>

      {expanded && (
        <div className="mt-3">
          <p className="text-[11px] text-slate-500">Highest Priority</p>
          <p className="mb-3 text-sm font-medium">
            {incident.type} · {incident.location}
          </p>

          <div className="mb-3 flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2">
            <span className="text-[11px] text-slate-500">Priority Score</span>
            <span className="text-sm font-semibold text-blue-300">
              {priorityScore}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-white/10 bg-black/30 p-3 transition hover:border-blue-500/30">
              <p className="text-[11px] text-slate-500">Medical</p>
              <p className="text-lg font-semibold">{allocation.medicalKits}</p>
            </div>

            <div className="rounded-lg border border-white/10 bg-black/30 p-3 transition hover:border-green-500/30">
              <p className="text-[11px] text-slate-500">Volunteers</p>
              <p className="text-lg font-semibold">{allocation.volunteers}</p>
            </div>

            <div className="rounded-lg border border-white/10 bg-black/30 p-3 transition hover:border-purple-500/30">
              <p className="text-[11px] text-slate-500">Boats</p>
              <p className="text-lg font-semibold">{allocation.rescueBoats}</p>
            </div>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute right-4 top-12 z-50 hidden w-64 rounded-lg border border-white/10 bg-[#0f172a] p-3 text-[11px] leading-5 text-slate-300 shadow-xl group-hover:block">
        Calculates medical kits, volunteer count, and rescue boats using severity,
        affected population, and casualties.
      </div>
    </div>
  );
}