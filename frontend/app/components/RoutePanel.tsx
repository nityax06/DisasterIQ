import { Route, Info } from "lucide-react";
import { findShortestRoute } from "../routes";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

type RoutePanelProps = {
  incidents: Incident[];
};

export default function RoutePanel({
  incidents,
}: RoutePanelProps) {
  if (incidents.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="text-sm font-semibold">Route Optimization</h2>
        <p className="mt-2 text-xs text-slate-500">No active incidents.</p>
      </div>
    );
  }

  const incident = [...incidents].sort(
    (a, b) => b.casualties - a.casualties
  )[0];

  const destination = incident.location;

  const route =
    destination === "Jaipur"
      ? findShortestRoute("Delhi Relief Center", "Jaipur")
      : destination === "Gurgaon"
      ? findShortestRoute("Delhi Relief Center", "Gurgaon")
      : {
          path: ["Delhi Relief Center", destination],
          distance: "Unknown",
        };

  return (
    <div className="group relative rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-cyan-500/40 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Route className="h-4 w-4 text-cyan-300" />
          <h2 className="text-sm font-semibold">Route Optimization</h2>
        </div>

        <Info className="h-4 w-4 text-slate-500 transition group-hover:text-cyan-300" />
      </div>

      <p className="text-[11px] text-slate-500">Destination</p>
      <p className="mb-3 text-sm font-medium">{destination}</p>

      <div className="rounded-lg border border-white/10 bg-black/30 p-3">
        <p className="text-[11px] text-slate-500">Optimized Route</p>
        <p className="mt-1 text-xs font-medium leading-5">
          {route.path.join(" → ")}
        </p>

        <p className="mt-3 text-[11px] text-slate-500">
          Distance:{" "}
          <span className="font-semibold text-cyan-300">
            {route.distance} km
          </span>
        </p>
      </div>

      <div className="pointer-events-none absolute right-4 top-12 z-50 hidden w-64 rounded-lg border border-white/10 bg-[#0f172a] p-3 text-[11px] leading-5 text-slate-300 shadow-xl group-hover:block">
        Uses Dijkstra shortest path logic where route graph data is available;
        otherwise marks the route distance as unknown.
      </div>
    </div>
  );
}