"use client";

import { useState } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { calculatePriorityScore } from "../priority";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  incidents: Incident[];
  setActiveView: (view: string) => void;
};

export default function GlobalSearch({
  open,
  onClose,
  incidents,
  setActiveView,
}: Props) {
  const [query, setQuery] = useState("");

  if (!open) return null;

  const features = [
    {
      name: "Dashboard",
      view: "dashboard",
      description: "Command center, KPIs, live overview",
    },
    {
      name: "Incidents",
      view: "incidents",
      description: "Create, edit, delete, search and inspect incidents",
    },
    {
      name: "Operations",
      view: "operations",
      description: "Allocation, volunteers, route, relief center, mission control",
    },
    {
      name: "Resources",
      view: "resources",
      description: "Resource shortage, refill request and availability",
    },
    {
      name: "Analytics",
      view: "analytics",
      description: "Charts, severity distribution and what-if simulation",
    },
    {
      name: "Resource Allocation",
      view: "operations",
      description: "Recommended medical kits, volunteers and rescue units",
    },
    {
      name: "Volunteer Deployment",
      view: "operations",
      description: "Assigns response teams based on required volunteers",
    },
    {
      name: "Route Optimization",
      view: "operations",
      description: "Emergency path, distance and ETA",
    },
    {
      name: "What-If Simulator",
      view: "analytics",
      description: "Test disaster scenarios without saving data",
    },
    {
      name: "PDF Export",
      view: "dashboard",
      description: "Download professional operations report",
    },
  ];

  const q = query.toLowerCase();

  const incidentResults = incidents.filter((incident) => {
    return (
      incident.type.toLowerCase().includes(q) ||
      incident.location.toLowerCase().includes(q) ||
      incident.severity.toLowerCase().includes(q)
    );
  });

  const featureResults = features.filter((feature) => {
    return (
      feature.name.toLowerCase().includes(q) ||
      feature.description.toLowerCase().includes(q)
    );
  });

  function highlight(text: string) {
    if (!query.trim()) return text;

    const lower = text.toLowerCase();
    const start = lower.indexOf(q);

    if (start === -1) return text;

    const end = start + query.length;

    return (
      <>
        {text.slice(0, start)}
        <span className="rounded bg-yellow-400/20 px-1 text-yellow-200">
          {text.slice(start, end)}
        </span>
        {text.slice(end)}
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-[999999] flex items-start justify-center bg-black/70 pt-24 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0f172a] p-4 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Global Search</h2>
            <p className="text-xs text-slate-500">
              Search incidents, locations, modules and tools.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-md border border-white/10 p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4 flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-3 transition focus-within:border-blue-500/40">
          <Search className="h-4 w-4 text-slate-500" />

          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Flood, Delhi, Resources, What-If, Route..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-600"
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-1">
          <div className="mb-4">
            <p className="mb-2 text-[11px] uppercase tracking-wide text-slate-500">
              Incidents
            </p>

            <div className="grid grid-cols-2 gap-2">
              {incidentResults.length === 0 ? (
                <div className="col-span-2 rounded-xl border border-white/10 bg-black/30 p-4 text-xs text-slate-500">
                  No incident matches found.
                </div>
              ) : (
                incidentResults.map((incident) => {
                  const score = calculatePriorityScore(
                    incident.severity,
                    incident.population,
                    incident.casualties
                  );

                  return (
                    <button
                      key={incident.id}
                      onClick={() => {
                        setActiveView("incidents");
                        onClose();
                      }}
                      className="rounded-xl border border-white/10 bg-black/30 p-3 text-left text-xs transition hover:-translate-y-0.5 hover:border-blue-500/40 hover:bg-blue-500/10"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">
                          {highlight(incident.type)} ·{" "}
                          {highlight(incident.location)}
                        </p>

                        <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-300">
                          {score}
                        </span>
                      </div>

                      <p className="mt-1 text-slate-500">
                        {highlight(incident.severity)} · Pop{" "}
                        {incident.population} · Cas. {incident.casualties}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] uppercase tracking-wide text-slate-500">
              Features
            </p>

            <div className="space-y-2">
              {featureResults.map((feature) => (
                <button
                  key={feature.name}
                  onClick={() => {
                    setActiveView(feature.view);
                    onClose();
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/30 p-3 text-left text-xs transition hover:-translate-y-0.5 hover:border-purple-500/40 hover:bg-purple-500/10"
                >
                  <div>
                    <p className="font-semibold">{highlight(feature.name)}</p>
                    <p className="mt-1 text-slate-500">
                      {highlight(feature.description)}
                    </p>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}