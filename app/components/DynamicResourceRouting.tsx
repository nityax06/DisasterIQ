"use client";

import { Route, Navigation, AlertTriangle } from "lucide-react";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

const centers: Record<string, { center: string; distance: number; vehicle: string; traffic: string }> = {
  Delhi: { center: "Delhi Relief Center", distance: 8.4, vehicle: "Ambulance + rescue boats", traffic: "Moderate" },
  Gurgaon: { center: "Gurgaon Relief Center", distance: 6.8, vehicle: "Ambulance + volunteer vans", traffic: "Low" },
  Jaipur: { center: "Jaipur Relief Center", distance: 11.2, vehicle: "Fire unit + ambulances", traffic: "Moderate" },
  Chennai: { center: "Chennai Relief Center", distance: 14.5, vehicle: "Ambulance + coastal rescue", traffic: "High" },
  Pune: { center: "Pune Field Depot", distance: 12.6, vehicle: "Medical van + rescue teams", traffic: "Moderate" },
  Bhubaneshwar: { center: "Odisha Relief Hub", distance: 10.1, vehicle: "Ambulance + supply truck", traffic: "Low" },
  Guwahati: { center: "Assam Relief Hub", distance: 9.7, vehicle: "Boat + medical team", traffic: "Moderate" },
  Chandigarh: { center: "Chandigarh Control Base", distance: 7.3, vehicle: "Ambulance + police escort", traffic: "Low" },
};

function eta(distance: number, traffic: string) {
  const baseSpeed = traffic === "High" ? 24 : traffic === "Moderate" ? 34 : 45;
  return Math.ceil((distance / baseSpeed) * 60);
}

export default function DynamicResourceRouting({ incidents }: { incidents: Incident[] }) {
  const topIncident = [...incidents].sort((a, b) => {
    const sev = { critical: 4, high: 3, medium: 2, low: 1 } as Record<string, number>;
    return (sev[b.severity.toLowerCase()] || 0) - (sev[a.severity.toLowerCase()] || 0) || b.population - a.population;
  })[0];

  const route = topIncident ? centers[topIncident.location] : null;
  const minutes = route ? eta(route.distance, route.traffic) : 0;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20 hover:bg-white/[0.05]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Route className="h-4 w-4 text-cyan-300" />
          <h2 className="text-sm font-semibold">Dynamic Resource Routing</h2>
        </div>
        <span className="rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2 py-0.5 text-[11px] text-cyan-300">
          live route
        </span>
      </div>

      {!topIncident || !route ? (
        <div className="rounded-lg border border-white/10 bg-black/30 p-4 text-xs text-slate-500">
          Add incidents to generate route intelligence.
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-white/10 bg-black/30 p-3">
            <p className="text-xs text-slate-500">Priority Route</p>
            <p className="mt-1 text-sm font-semibold">{route.center} → {topIncident.location}</p>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-white/10 bg-black/30 p-3"><p className="text-slate-500">Distance</p><p className="mt-1 text-lg font-semibold">{route.distance} km</p></div>
            <div className="rounded-lg border border-white/10 bg-black/30 p-3"><p className="text-slate-500">ETA</p><p className="mt-1 text-lg font-semibold">{minutes} min</p></div>
            <div className="rounded-lg border border-white/10 bg-black/30 p-3"><p className="text-slate-500">Traffic</p><p className="mt-1 text-lg font-semibold">{route.traffic}</p></div>
            <div className="rounded-lg border border-white/10 bg-black/30 p-3"><p className="text-slate-500">Vehicle</p><p className="mt-1 text-sm font-semibold">{route.vehicle}</p></div>
          </div>

          <div className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-3 text-xs text-cyan-100">
            <Navigation className="mr-1 inline h-3.5 w-3.5" />
            Recommended route is based on nearest relief center, incident type and traffic difficulty.
          </div>

          {route.traffic === "High" && (
            <div className="mt-2 rounded-lg border border-orange-500/25 bg-orange-500/10 p-3 text-xs text-orange-200">
              <AlertTriangle className="mr-1 inline h-3.5 w-3.5" />
              High traffic detected. Use police escort or alternate route if road access worsens.
            </div>
          )}
        </>
      )}
    </div>
  );
}
