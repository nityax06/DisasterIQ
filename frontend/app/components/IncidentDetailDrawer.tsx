import { X, Brain, Clock3, Route, Building2, PackageCheck } from "lucide-react";
import SeverityBadge from "./SeverityBadge";
import { calculatePriorityScore } from "../priority";
import { calculateAllocation } from "../allocation";
import { reliefCenters } from "../reliefCenters";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

type Props = {
  incident: Incident | null;
  onClose: () => void;
};

export default function IncidentDetailDrawer({ incident, onClose }: Props) {
  if (!incident) return null;

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

  const center =
    reliefCenters.find((item) => item.capacity >= incident.population) ||
    reliefCenters[0];

  const route = {
    path: ["Nearest Relief Center", center.name, incident.location],
    distance: incident.location === "Delhi" ? 18 : incident.location === "Pune" ? 148 : 45,
    eta: score > 120 ? "25–35 min" : "35–50 min",
  };

  return (
    <div className="fixed inset-0 z-[130] flex justify-end bg-black/50 backdrop-blur-sm">
      <div className="h-full w-full max-w-lg overflow-y-auto border-l border-white/10 bg-[#0f172a] p-5 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Incident Detail Center</h2>
            <p className="text-xs text-slate-500">
              Full operational view for selected incident.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-md border border-white/10 p-1 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs text-slate-500">Incident</p>
            <p className="mt-1 text-xl font-semibold">
              {incident.type} · {incident.location}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <SeverityBadge severity={incident.severity} />
              <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[11px] text-blue-300">
                Priority {score}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
              <p className="text-[11px] text-slate-400">Population</p>
              <p className="text-lg font-bold">{incident.population}</p>
            </div>

            <div className="rounded-lg border border-orange-500/20 bg-orange-500/10 p-3">
              <p className="text-[11px] text-slate-400">Casualties</p>
              <p className="text-lg font-bold">{incident.casualties}</p>
            </div>

            <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-3">
              <p className="text-[11px] text-slate-400">ETA</p>
              <p className="text-lg font-bold">{route.eta}</p>
            </div>
          </div>

          <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.06] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-300" />
              <h3 className="text-sm font-semibold">AI Response Advisor</h3>
            </div>

            <p className="text-xs leading-5 text-slate-300">
              Prioritize {incident.location}. Deploy {allocation.volunteers} volunteers,
              allocate {allocation.medicalKits} medical kits, prepare{" "}
              {allocation.rescueBoats} rescue units, and coordinate with{" "}
              {center.name}.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <PackageCheck className="h-4 w-4 text-blue-300" />
              <h3 className="text-sm font-semibold">Recommended Resources</h3>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-lg border border-white/10 p-3">
                Medical
                <p className="mt-1 font-semibold">{allocation.medicalKits}</p>
              </div>

              <div className="rounded-lg border border-white/10 p-3">
                Volunteers
                <p className="mt-1 font-semibold">{allocation.volunteers}</p>
              </div>

              <div className="rounded-lg border border-white/10 p-3">
                Rescue
                <p className="mt-1 font-semibold">{allocation.rescueBoats}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-green-300" />
              <h3 className="text-sm font-semibold">Relief Assignment</h3>
            </div>

            <p className="text-xs text-slate-300">Assigned Center: {center.name}</p>
            <p className="mt-1 text-xs text-slate-500">
              Capacity: {center.capacity}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Route className="h-4 w-4 text-cyan-300" />
              <h3 className="text-sm font-semibold">Route Visualization</h3>
            </div>

            <div className="space-y-2">
              {route.path.map((point) => (
                <div key={point} className="flex items-center gap-2 text-xs">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Distance: {route.distance} km · ETA: {route.eta}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-orange-300" />
              <h3 className="text-sm font-semibold">Status History</h3>
            </div>

            {[
              "Incident reported",
              "Priority calculated",
              "Resources assigned",
              "Relief center selected",
              "Route generated",
            ].map((item, index) => (
              <div key={item} className="mb-3 flex gap-3 text-xs">
                <div className="mt-1 h-2 w-2 rounded-full bg-orange-400" />
                <div>
                  <p>{item}</p>
                  <p className="text-[11px] text-slate-500">T+{index + 1} min</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}