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

type RecommendationPanelProps = {
  incidents: Incident[];
};

export default function RecommendationPanel({
  incidents,
}: RecommendationPanelProps) {
  const highestPriorityIncident = [...incidents].sort((a, b) => {
    const scoreA = calculatePriorityScore(a.severity, a.population, a.casualties);
    const scoreB = calculatePriorityScore(b.severity, b.population, b.casualties);

    return scoreB - scoreA;
  })[0];

  if (!highestPriorityIncident) {
    return (
      <div className="mt-10 bg-slate-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Resource Allocation</h2>
        <p className="text-slate-400">No active incidents.</p>
      </div>
    );
  }

  const priorityScore = calculatePriorityScore(
    highestPriorityIncident.severity,
    highestPriorityIncident.population,
    highestPriorityIncident.casualties
  );

  const allocation = calculateAllocation(
    highestPriorityIncident.severity,
    highestPriorityIncident.population,
    highestPriorityIncident.casualties
  );

  return (
    <div className="mt-10 bg-slate-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Resource Allocation Engine</h2>

      <p className="text-slate-400 mb-2">Highest Priority Incident</p>

      <p className="text-xl font-bold mb-4">
        {highestPriorityIncident.type} - {highestPriorityIncident.location}
      </p>

      <p className="text-slate-400 mb-4">
        Priority Score: <span className="font-bold text-white">{priorityScore}</span>
      </p>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-900 p-4 rounded-lg">
          <p className="text-slate-400">Medical Kits</p>
          <p className="text-3xl font-bold">{allocation.medicalKits}</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-lg">
          <p className="text-slate-400">Volunteers</p>
          <p className="text-3xl font-bold">{allocation.volunteers}</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-lg">
          <p className="text-slate-400">Rescue Boats</p>
          <p className="text-3xl font-bold">{allocation.rescueBoats}</p>
        </div>
      </div>
    </div>
  );
}