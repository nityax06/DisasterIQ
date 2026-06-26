"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import IncidentDetailDrawer from "./IncidentDetailDrawer";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

const positions: Record<string, string> = {
  Delhi: "left-[42%] top-[27%]",
  Gurgaon: "left-[40%] top-[31%]",
  Jaipur: "left-[34%] top-[37%]",
  Pune: "left-[36%] top-[66%]",
  Chennai: "left-[55%] top-[84%]",
  Bhubaneshwar: "left-[64%] top-[59%]",
  Guwahati: "left-[79%] top-[35%]",
};

function markerColor(severity: string) {
  if (severity.toLowerCase() === "critical") return "text-red-400";
  if (severity.toLowerCase() === "high") return "text-orange-400";
  if (severity.toLowerCase() === "medium") return "text-yellow-400";
  return "text-green-400";
}

export default function IncidentMap({ incidents }: { incidents: Incident[] }) {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  return (
    <>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.05]">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Interactive India Incident Map</h2>
            <p className="text-xs text-slate-500">
              Click markers to open incident command details.
            </p>
          </div>

          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-slate-400">
            {incidents.length} markers
          </span>
        </div>

        <div className="relative h-80 overflow-hidden rounded-xl border border-white/10 bg-[#020617]">
          <svg viewBox="0 0 420 520" className="absolute inset-0 h-full w-full opacity-90">
            <path
              d="M201 18 L239 38 L264 78 L287 108 L283 146 L309 184 L300 228 L322 268 L303 319 L274 364 L251 411 L226 497 L194 461 L167 414 L142 382 L118 330 L103 283 L84 245 L108 205 L99 155 L128 111 L158 82 L167 38 Z"
              fill="#0f172a"
              stroke="#475569"
              strokeWidth="3"
            />

            <path d="M167 38 L190 95 L158 150 L108 205" stroke="#1e293b" />
            <path d="M190 95 L264 78 L283 146 L230 190 L158 150" stroke="#1e293b" />
            <path d="M158 150 L230 190 L300 228 L322 268" stroke="#1e293b" />
            <path d="M118 330 L180 312 L244 340 L303 319" stroke="#1e293b" />
            <path d="M180 312 L194 461 L226 497 L251 411" stroke="#1e293b" />
            <path d="M244 340 L251 411 L274 364" stroke="#1e293b" />
          </svg>

          <div className="absolute left-4 top-4 rounded-lg border border-white/10 bg-black/50 p-3 text-[11px] text-slate-400">
            <p className="mb-2 text-slate-300">Severity Legend</p>
            <p><span className="text-red-400">●</span> Critical</p>
            <p><span className="text-orange-400">●</span> High</p>
            <p><span className="text-yellow-400">●</span> Medium</p>
            <p><span className="text-green-400">●</span> Low</p>
          </div>

          {incidents.map((incident) => (
            <button
              key={incident.id}
              onClick={() => setSelectedIncident(incident)}
              className={`absolute ${
                positions[incident.location] || "left-1/2 top-1/2"
              } group`}
            >
              <MapPin
                className={`h-5 w-5 animate-pulse ${markerColor(
                  incident.severity
                )}`}
              />

              <div className="absolute left-6 top-0 z-50 hidden w-44 rounded-lg border border-white/10 bg-[#0f172a] p-3 text-left text-[11px] shadow-xl group-hover:block">
                <p className="font-semibold">{incident.type}</p>
                <p className="text-slate-400">{incident.location}</p>
                <p className={markerColor(incident.severity)}>
                  {incident.severity}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <IncidentDetailDrawer
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />
    </>
  );
}