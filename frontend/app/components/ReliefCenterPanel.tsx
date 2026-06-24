import { Building2, Info } from "lucide-react";
import { reliefCenters } from "../reliefCenters";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

type ReliefCenterPanelProps = {
  incidents: Incident[];
};

export default function ReliefCenterPanel({
  incidents,
}: ReliefCenterPanelProps) {
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

  const assignedCenter =
    reliefCenters.find((center) => center.capacity >= incident.population) ||
    reliefCenters[0];

  const usage = Math.min(
    100,
    Math.round((incident.population / assignedCenter.capacity) * 100)
  );

  return (
    <div className="group relative rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-purple-500/40 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(168,85,247,0.12)]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-purple-300" />
          <h2 className="text-sm font-semibold">Relief Center</h2>
        </div>

        <Info className="h-4 w-4 text-slate-500 transition group-hover:text-purple-300" />
      </div>

      <p className="text-[11px] text-slate-500">Incident</p>
      <p className="mb-3 text-sm font-medium">
        {incident.type} · {incident.location}
      </p>

      <div className="rounded-lg border border-white/10 bg-black/30 p-3">
        <p className="text-[11px] text-slate-500">Assigned Center</p>
        <p className="text-sm font-semibold">{assignedCenter.name}</p>

        <div className="mt-3 h-1.5 rounded-full bg-white/10">
          <div
            className="h-1.5 rounded-full bg-purple-400"
            style={{ width: `${usage}%` }}
          />
        </div>

        <p className="mt-2 text-[11px] text-slate-500">
          {usage}% capacity load · Max {assignedCenter.capacity}
        </p>
      </div>

      <div className="pointer-events-none absolute right-4 top-12 z-50 hidden w-64 rounded-lg border border-white/10 bg-[#0f172a] p-3 text-[11px] leading-5 text-slate-300 shadow-xl group-hover:block">
        Assigns the most suitable relief center by comparing affected population
        with available center capacity.
      </div>
    </div>
  );
}