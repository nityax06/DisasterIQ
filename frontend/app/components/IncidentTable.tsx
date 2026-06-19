import SeverityBadge from "./SeverityBadge";
import { calculatePriorityScore } from "../priority";

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

  if (sortedIncidents.length === 0) {
    return (
      <div className="mt-10 bg-slate-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Incidents</h2>
        <p className="text-slate-400">No incidents reported yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-10 bg-slate-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Recent Incidents</h2>

      <table className="w-full text-left">
        <thead>
          <tr className="text-slate-400 border-b border-slate-700">
            <th className="pb-3">Type</th>
            <th className="pb-3">Location</th>
            <th className="pb-3">Severity</th>
            <th className="pb-3">Priority Score</th>
            <th className="pb-3">Actions</th>
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
              <tr key={incident.id} className="border-b border-slate-700">
                <td className="py-3">{incident.type}</td>
                <td className="py-3">{incident.location}</td>
                <td className="py-3">
                  <SeverityBadge severity={incident.severity} />
                </td>
                <td className="py-3 font-bold">{score}</td>

                <td className="py-3">
                  <button
                    onClick={() => {
                      const newSeverity = prompt(
                        "Enter severity: Low, Medium, High, or Critical",
                        incident.severity
                      );

                      if (!newSeverity) return;

                      setIncidents((previousIncidents) =>
                        previousIncidents.map((item) =>
                          item.id === incident.id
                            ? { ...item, severity: newSeverity }
                            : item
                        )
                      );
                    }}
                    className="bg-blue-600 px-3 py-1 rounded text-sm font-bold mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      setIncidents((previousIncidents) =>
                        previousIncidents.filter(
                          (item) => item.id !== incident.id
                        )
                      )
                    }
                    className="bg-red-600 px-3 py-1 rounded text-sm font-bold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}