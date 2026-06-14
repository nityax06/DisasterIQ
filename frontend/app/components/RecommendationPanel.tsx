import { calculatePriorityScore } from "../priority";
import { getRecommendations } from "../recommendations";
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
export default function RecommendationPanel({ incidents }: RecommendationPanelProps) {
  const highestPriorityIncident = [...incidents].sort((a, b) => {
    const scoreA = calculatePriorityScore(a.severity, a.population, a.casualties);
    const scoreB = calculatePriorityScore(b.severity, b.population, b.casualties);

    return scoreB - scoreA;
  })[0];

  const recommendations = getRecommendations(highestPriorityIncident.severity);

  return (
    <div className="mt-10 bg-slate-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Resource Recommendation</h2>

      <p className="text-slate-400 mb-2">Highest Priority Incident</p>

      <p className="text-xl font-bold mb-4">
        {highestPriorityIncident.type} - {highestPriorityIncident.location}
      </p>

      <ul className="list-disc list-inside space-y-2">
        {recommendations.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}