import SeverityBadge from "./SeverityBadge";
import { incidents } from "../incidents";
import { calculatePriorityScore } from "../priority";

export default function IncidentTable() {
    const sortedIncidents = [...incidents].sort((a, b) => {
  const scoreA = calculatePriorityScore(
    a.severity,
    a.population,
    a.casualties
  );

  const scoreB = calculatePriorityScore(
    b.severity,
    b.population,
    b.casualties
  );

  return scoreB - scoreA;
});
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}