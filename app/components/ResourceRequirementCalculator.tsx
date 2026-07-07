"use client";

import { PackageCheck, AlertTriangle } from "lucide-react";
import { resources } from "../resources";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

function severityMultiplier(severity: string) {
  const value = severity.toLowerCase();
  if (value === "critical") return 1.45;
  if (value === "high") return 1.15;
  if (value === "medium") return 0.85;
  return 0.55;
}

function calculateNeeds(incident: Incident) {
  const multiplier = severityMultiplier(incident.severity);
  const floodBoost = incident.type.toLowerCase().includes("flood") ? 1.6 : 1;
  const fireBoost = incident.type.toLowerCase().includes("fire") ? 1.4 : 1;

  return {
    medicalKits: Math.ceil((incident.population / 45 + incident.casualties * 3) * multiplier),
    ambulances: Math.ceil((incident.casualties / 4 + incident.population / 1300) * multiplier),
    medicalTeams: Math.ceil((incident.casualties / 7 + incident.population / 2200) * multiplier),
    rescueTeams: Math.ceil((incident.population / 700 + incident.casualties / 8) * multiplier),
    boats: Math.ceil((incident.population / 1500) * multiplier * floodBoost),
    volunteers: Math.ceil((incident.population / 190 + incident.casualties / 2) * multiplier),
    reliefCamps: Math.ceil((incident.population / 2400) * multiplier),
    fireUnits: Math.ceil((incident.population / 3500 + incident.casualties / 12) * fireBoost),
  };
}

export default function ResourceRequirementCalculator({ incidents }: { incidents: Incident[] }) {
  const topIncident = [...incidents].sort((a, b) => {
    const sev = { critical: 4, high: 3, medium: 2, low: 1 } as Record<string, number>;
    return (
      (sev[b.severity.toLowerCase()] || 0) * 100000 + b.population + b.casualties * 50 -
      ((sev[a.severity.toLowerCase()] || 0) * 100000 + a.population + a.casualties * 50)
    );
  })[0];

  const needs = topIncident ? calculateNeeds(topIncident) : null;
  const boatsAvailable = resources.find((item) => item.name.toLowerCase().includes("boat"))?.available || 0;
  const medicalAvailable = resources.find((item) => item.name.toLowerCase().includes("medical"))?.available || 0;
  const boatGap = needs ? Math.max(0, needs.boats - boatsAvailable) : 0;
  const medicalGap = needs ? Math.max(0, needs.medicalKits - medicalAvailable) : 0;

  const rows = needs
    ? [
        ["🚑 Ambulances", needs.ambulances],
        ["👨‍⚕️ Medical Teams", needs.medicalTeams],
        ["🧰 Medical Kits", needs.medicalKits],
        ["🚤 Rescue Boats", needs.boats],
        ["🛟 Rescue Teams", needs.rescueTeams],
        ["👥 Volunteers", needs.volunteers],
        ["🏕 Relief Camps", needs.reliefCamps],
        ["🚒 Fire Units", needs.fireUnits],
      ]
    : [];

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20 hover:bg-white/[0.05]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PackageCheck className="h-4 w-4 text-emerald-300" />
          <h2 className="text-sm font-semibold">Resource Requirement Calculator</h2>
        </div>
        <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300">
          rule engine
        </span>
      </div>

      {!topIncident || !needs ? (
        <div className="rounded-lg border border-white/10 bg-black/30 p-4 text-xs text-slate-500">
          Add incidents to calculate response requirements.
        </div>
      ) : (
        <>
          <div className="mb-3 rounded-lg border border-white/10 bg-black/30 p-3">
            <p className="text-xs text-slate-500">Priority Incident</p>
            <p className="mt-1 text-sm font-semibold">{topIncident.type} · {topIncident.location}</p>
            <p className="mt-1 text-[11px] text-slate-500">
              Based on severity, affected population and casualties.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {rows.map(([label, value]) => (
              <div key={label.toString()} className="rounded-lg border border-white/10 bg-black/30 p-3 transition hover:border-emerald-500/25 hover:bg-emerald-500/10">
                <p className="text-[11px] text-slate-500">{label}</p>
                <p className="mt-1 text-lg font-semibold">{value}</p>
              </div>
            ))}
          </div>

          {(boatGap > 0 || medicalGap > 0) && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-orange-500/25 bg-orange-500/10 p-3 text-xs text-orange-200">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Estimated shortage: {boatGap > 0 ? `${boatGap} rescue boats` : ""}
                {boatGap > 0 && medicalGap > 0 ? " and " : ""}
                {medicalGap > 0 ? `${medicalGap} medical kits` : ""}.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
