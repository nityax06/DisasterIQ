import SeverityBadge from "./SeverityBadge";
import { calculatePriorityScore } from "../priority";
import { supabase } from "../supabaseClient";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

type IncidentTableProps = {
  incidents: Incident[];
  setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>;
};

export default function IncidentTable({
  incidents,
  setIncidents,
}: IncidentTableProps) {
  const sortedIncidents = [...incidents].sort((a, b) => {
    const scoreA = calculatePriorityScore(a.severity, a.population, a.casualties);
    const scoreB = calculatePriorityScore(b.severity, b.population, b.casualties);

    return scoreB - scoreA;
  });

  async function handleDelete(id: number) {
    const { error } = await supabase
      .from("incidents")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting incident:", error);
      alert("Could not delete incident from database.");
      return;
    }

    setIncidents((previousIncidents) =>
      previousIncidents.filter((item) => item.id !== id)
    );
  }

  async function handleEdit(incident: Incident) {
    const newSeverity = prompt(
      "Enter severity: Low, Medium, High, or Critical",
      incident.severity
    );

    if (!newSeverity) return;

    const { error } = await supabase
      .from("incidents")
      .update({ severity: newSeverity })
      .eq("id", incident.id);

    if (error) {
      console.error("Error updating incident:", error);
      alert("Could not update incident in database.");
      return;
    }

    setIncidents((previousIncidents) =>
      previousIncidents.map((item) =>
        item.id === incident.id
          ? { ...item, severity: newSeverity }
          : item
      )
    );
  }

  if (sortedIncidents.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="text-sm font-semibold">Recent Incidents</h2>
        <p className="mt-2 text-xs text-slate-500">
          No incidents reported yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Recent Incidents</h2>
          <p className="text-xs text-slate-500">
            Ranked automatically by priority score.
          </p>
        </div>

        <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-slate-400">
          {sortedIncidents.length} records
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/[0.03] text-slate-400">
            <tr>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Location</th>
              <th className="px-3 py-2 font-medium">Severity</th>
              <th className="px-3 py-2 font-medium">Score</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedIncidents.map((incident) => {
              const score = calculatePriorityScore(
                incident.severity,
                incident.population,
                incident.casualties
              );

              return (
                <tr
                  key={incident.id}
                  className="border-t border-white/10 transition hover:bg-white/[0.04]"
                  title={`Population: ${incident.population}, Casualties: ${incident.casualties}`}
                >
                  <td className="px-3 py-2 font-medium">{incident.type}</td>
                  <td className="px-3 py-2 text-slate-300">{incident.location}</td>
                  <td className="px-3 py-2">
                    <SeverityBadge severity={incident.severity} />
                  </td>
                  <td className="px-3 py-2 font-semibold text-white">
                    {score}
                  </td>

                  <td className="px-3 py-2">
                    <button
                      onClick={() => handleEdit(incident)}
                      className="mr-2 rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-[11px] font-medium text-blue-300 transition hover:bg-blue-500/20"
                      title="Edit incident severity"
                    >
                      ✎ Edit
                    </button>

                    <button
                      onClick={() => handleDelete(incident.id)}
                      className="rounded-md border border-red-500/20 bg-red-500/10 px-2 py-1 text-[11px] font-medium text-red-300 transition hover:bg-red-500/20"
                      title="Delete this incident permanently"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}