import { Flame } from "lucide-react";
import { calculatePriorityScore } from "../priority";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

type Props = {
  incidents: Incident[];
};

export default function IncidentHeatMap({ incidents }: Props) {
  const ranked = [...incidents]
    .sort((a, b) => {
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
    })
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-orange-500/20 bg-orange-500/[0.06] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Flame className="h-4 w-4 text-orange-300" />
        <h2 className="text-sm font-semibold">Incident Heat Ranking</h2>
      </div>

      <div className="space-y-2">
        {ranked.map((incident) => {
          const score = calculatePriorityScore(
            incident.severity,
            incident.population,
            incident.casualties
          );

          return (
            <div
              key={incident.id}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs"
            >
              <span>
                {incident.type} · {incident.location}
              </span>

              <span className="font-semibold text-orange-300">
                {score}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}