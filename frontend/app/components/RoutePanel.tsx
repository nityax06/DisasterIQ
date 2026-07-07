import { Route, Info } from "lucide-react";

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

const routeData: Record<string, { path: string[]; distance: number; eta: string }> = {
  Delhi: {
    path: ["Delhi Relief Center", "Central Delhi", "Incident Zone"],
    distance: 18,
    eta: "28 min",
  },
  Jaipur: {
    path: ["Delhi Relief Center", "Gurgaon", "Neemrana", "Jaipur"],
    distance: 268,
    eta: "4 hr 20 min",
  },
  Gurgaon: {
    path: ["Delhi Relief Center", "NH-48", "Gurgaon"],
    distance: 32,
    eta: "45 min",
  },
  Pune: {
    path: ["Mumbai Relief Hub", "Lonavala", "Pune"],
    distance: 148,
    eta: "2 hr 40 min",
  },
  Chennai: {
    path: ["Chennai Relief Center", "Marina Zone", "Coastal Incident Zone"],
    distance: 22,
    eta: "35 min",
  },
  Bhubaneshwar: {
    path: ["Bhubaneshwar Relief Center", "Cuttack Road", "Incident Zone"],
    distance: 31,
    eta: "50 min",
  },
  Guwahati: {
    path: ["Guwahati Relief Center", "Dispur", "Incident Zone"],
    distance: 19,
    eta: "30 min",
  },
};

export default function RoutePanel({ incidents }: RoutePanelProps) {
  if (incidents.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-cyan-500/30 hover:bg-white/[0.05]">
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
    routeData[destination] || {
      path: ["Nearest Relief Center", destination],
      distance: 45,
      eta: "Estimated 1 hr",
    };

  return (
    <div className="group relative rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-cyan-500/40 hover:bg-white/[0.05]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Route className="h-4 w-4 text-cyan-300" />
          <h2 className="text-sm font-semibold">Route Optimization</h2>
        </div>

        <div className="group/info relative">
          <Info className="h-4 w-4 text-slate-500 group-hover:text-cyan-300" />

          <div className="absolute right-0 top-6 z-50 hidden w-64 rounded-lg border border-white/10 bg-[#0f172a] p-3 text-[11px] leading-5 text-slate-300 shadow-xl group-hover/info:block">
            Route data uses preset emergency corridors for supported cities and
            fallback estimates for unknown locations.
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-500">Destination</p>
      <p className="mb-3 text-sm font-medium">{destination}</p>

      <div className="rounded-lg border border-white/10 bg-black/30 p-3 transition hover:border-cyan-500/30">
        <p className="text-[11px] text-slate-500">Optimized Route</p>

        <div className="mt-2 space-y-2">
          {route.path.map((point, index) => (
            <div key={point} className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span>{point}</span>
              {index !== route.path.length - 1 && (
                <span className="text-slate-600">→</span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
            Distance:{" "}
            <span className="font-semibold text-cyan-300">
              {route.distance} km
            </span>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
            ETA:{" "}
            <span className="font-semibold text-cyan-300">
              {route.eta}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}