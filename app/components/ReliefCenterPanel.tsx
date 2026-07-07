import { Building2, Info, Users, BedDouble } from "lucide-react";
import { reliefCenters } from "../reliefCenters";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

export default function ReliefCenterPanel({
  incidents,
}: {
  incidents: Incident[];
}) {
  if (incidents.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="text-sm font-semibold">Relief Center</h2>
        <p className="mt-2 text-xs text-slate-500">No active incidents.</p>
      </div>
    );
  }

  const incident = [...incidents].sort(
    (a, b) => b.population - a.population
  )[0];

  const center =
    reliefCenters.find((item) => item.capacity >= incident.population) ||
    reliefCenters[0];

  const usage = Math.min(
    100,
    Math.round((incident.population / center.capacity) * 100)
  );

  const remaining = Math.max(0, center.capacity - incident.population);

  return (
    <div className="relative rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-purple-500/30 hover:bg-white/[0.05]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-purple-300" />
          <h2 className="text-sm font-semibold">Relief Center</h2>
        </div>

        <div className="group relative">
          <Info className="h-4 w-4 text-slate-500 transition group-hover:text-purple-300" />

          <div className="absolute right-0 top-6 z-50 hidden w-64 rounded-lg border border-white/10 bg-[#0f172a] p-3 text-[11px] leading-5 text-slate-300 shadow-xl group-hover:block">
            Assigns the nearest suitable relief center by comparing affected
            population with center capacity and remaining availability.
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-black/30 p-3">
        <p className="text-[11px] text-slate-500">Incident</p>
        <p className="mt-1 text-sm font-medium">
          {incident.type} · {incident.location}
        </p>
      </div>

      <div className="mt-3 rounded-lg border border-white/10 bg-black/30 p-3 transition hover:border-purple-500/30">
        <p className="text-[11px] text-slate-500">Assigned Center</p>
        <p className="mt-1 text-sm font-semibold">{center.name}</p>

        <div className="mt-3 h-2 rounded-full bg-white/10">
          <div
            className="h-2 rounded-full bg-purple-400"
            style={{ width: `${usage}%` }}
          />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
          <div className="rounded-md border border-white/10 bg-white/[0.03] p-2">
            Load
            <p className="mt-1 font-semibold text-purple-300">{usage}%</p>
          </div>

          <div className="rounded-md border border-white/10 bg-white/[0.03] p-2">
            Capacity
            <p className="mt-1 font-semibold">{center.capacity}</p>
          </div>

          <div className="rounded-md border border-white/10 bg-white/[0.03] p-2">
            Remaining
            <p className="mt-1 font-semibold text-green-300">{remaining}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-white/10 bg-black/30 p-3 transition hover:border-blue-500/30">
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-blue-300" />
            <p className="text-[11px] text-slate-500">Staffing</p>
          </div>
          <p className="mt-1 text-sm font-semibold">Ready</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/30 p-3 transition hover:border-green-500/30">
          <div className="flex items-center gap-2">
            <BedDouble className="h-3.5 w-3.5 text-green-300" />
            <p className="text-[11px] text-slate-500">Shelter Status</p>
          </div>
          <p className="mt-1 text-sm font-semibold">Available</p>
        </div>
      </div>
    </div>
  );
}