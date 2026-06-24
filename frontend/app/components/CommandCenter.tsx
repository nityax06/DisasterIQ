import { ShieldAlert, FileText, Radio, Wand2 } from "lucide-react";
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

type CommandCenterProps = {
  incidents: Incident[];
};

export default function CommandCenter({ incidents }: CommandCenterProps) {
  const topIncident = [...incidents].sort((a, b) => {
    const scoreA = calculatePriorityScore(a.severity, a.population, a.casualties);
    const scoreB = calculatePriorityScore(b.severity, b.population, b.casualties);
    return scoreB - scoreA;
  })[0];

  if (!topIncident) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="text-sm font-semibold">Command Center</h2>
        <p className="mt-2 text-xs text-slate-500">No active incidents.</p>
      </div>
    );
  }

  const score = calculatePriorityScore(
    topIncident.severity,
    topIncident.population,
    topIncident.casualties
  );

  const allocation = calculateAllocation(
    topIncident.severity,
    topIncident.population,
    topIncident.casualties
  );

  function copySummary() {
    navigator.clipboard.writeText(
      `DisasterIQ Summary: ${topIncident.type} in ${topIncident.location}. Priority Score: ${score}. Allocate ${allocation.medicalKits} medical kits and ${allocation.volunteers} volunteers.`
    );
    alert("Command summary copied.");
  }

  return (
    <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.06] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-blue-300" />
          <h2 className="text-sm font-semibold">Command Center</h2>
        </div>

        <span className="rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-[11px] text-green-300">
          Confidence 87%
        </span>
      </div>

      <p className="text-xs text-slate-400">Current Highest Risk</p>
      <p className="mt-1 text-lg font-semibold">
        {topIncident.type} · {topIncident.location}
      </p>

      <p className="mt-2 text-xs text-slate-400">
        Recommended action: dispatch medical kits, volunteers, and notify the
        nearest relief center.
      </p>

      <div className="mt-4 grid grid-cols-4 gap-3 text-xs">
        <div className="rounded-lg border border-white/10 bg-black/30 p-3">
          <p className="text-slate-500">Priority</p>
          <p className="mt-1 text-lg font-bold text-blue-300">{score}</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/30 p-3">
          <p className="text-slate-500">Medical</p>
          <p className="mt-1 text-lg font-bold">{allocation.medicalKits}</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/30 p-3">
          <p className="text-slate-500">Volunteers</p>
          <p className="mt-1 text-lg font-bold">{allocation.volunteers}</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/30 p-3">
          <p className="text-slate-500">Boats</p>
          <p className="mt-1 text-lg font-bold">{allocation.rescueBoats}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={copySummary}
          className="flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs text-blue-300 hover:bg-blue-500/20"
        >
          <FileText className="h-3.5 w-3.5" />
          Copy Summary
        </button>

        <button
          onClick={() => alert("Response plan generated.")}
          className="flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-2 text-xs text-purple-300 hover:bg-purple-500/20"
        >
          <Wand2 className="h-3.5 w-3.5" />
          Generate Plan
        </button>

        <button
          onClick={() => alert("Emergency broadcast queued.")}
          className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs text-green-300 hover:bg-green-500/20"
        >
          <Radio className="h-3.5 w-3.5" />
          Broadcast
        </button>
      </div>
    </div>
  );
}