import { Users, Info } from "lucide-react";
import { assignVolunteerTeams } from "../volunteers";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

type VolunteerPanelProps = {
  incidents: Incident[];
};

export default function VolunteerPanel({
  incidents,
}: VolunteerPanelProps) {
  if (incidents.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="text-sm font-semibold">Volunteer Deployment</h2>
        <p className="mt-2 text-xs text-slate-500">No active incidents.</p>
      </div>
    );
  }

  const incident = [...incidents].sort(
    (a, b) => b.casualties - a.casualties
  )[0];

  const requiredVolunteers = Math.max(
    10,
    Math.round(incident.population * 0.02 + incident.casualties * 5)
  );

  const assignedTeams = assignVolunteerTeams(requiredVolunteers);
  const assignedTotal = assignedTeams.reduce(
    (sum, team) => sum + team.members,
    0
  );

  return (
    <div className="group relative rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-green-500/40 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(34,197,94,0.12)]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-green-300" />
          <h2 className="text-sm font-semibold">Volunteer Deployment</h2>
        </div>

        <Info className="h-4 w-4 text-slate-500 transition group-hover:text-green-300" />
      </div>

      <p className="text-[11px] text-slate-500">Incident</p>
      <p className="mb-3 text-sm font-medium">
        {incident.type} · {incident.location}
      </p>

      <div className="mb-3 flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2">
        <span className="text-[11px] text-slate-500">Assigned / Required</span>
        <span className="text-sm font-semibold text-green-300">
          {assignedTotal}/{requiredVolunteers}
        </span>
      </div>

      <div className="space-y-2">
        {assignedTeams.map((team) => (
          <div
            key={team.id}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs transition hover:border-green-500/30"
          >
            <span>{team.name}</span>
            <span className="font-semibold text-white">
              {team.members}
            </span>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute right-4 top-12 z-50 hidden w-64 rounded-lg border border-white/10 bg-[#0f172a] p-3 text-[11px] leading-5 text-slate-300 shadow-xl group-hover:block">
        Estimates required volunteers from affected population and casualty
        count, then assigns available response teams.
      </div>
    </div>
  );
}