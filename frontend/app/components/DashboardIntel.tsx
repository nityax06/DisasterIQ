import { Brain, Target } from "lucide-react";
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

export default function DashboardIntel({ incidents }: Props) {
  const topIncident = [...incidents].sort((a, b) => {
    const scoreA = calculatePriorityScore(a.severity, a.population, a.casualties);
    const scoreB = calculatePriorityScore(b.severity, b.population, b.casualties);
    return scoreB - scoreA;
  })[0];

  if (!topIncident) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="text-sm font-semibold">Situation Intelligence</h2>
        <p className="mt-2 text-xs text-slate-500">No live risk detected.</p>
      </div>
    );
  }

  const score = calculatePriorityScore(
    topIncident.severity,
    topIncident.population,
    topIncident.casualties
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.06] p-4">
        <div className="mb-3 flex items-center gap-2">
          <Brain className="h-4 w-4 text-purple-300" />
          <h2 className="text-sm font-semibold">Situation Intelligence</h2>
        </div>

        <p className="text-xs leading-5 text-slate-300">
          {topIncident.type} in {topIncident.location} is currently the most
          urgent incident. The system recommends prioritizing manpower, medical
          support, and relief coordination for this location first.
        </p>
      </div>

      <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4">
        <div className="mb-3 flex items-center gap-2">
          <Target className="h-4 w-4 text-red-300" />
          <h2 className="text-sm font-semibold">Risk Heat Index</h2>
        </div>

        <p className="text-4xl font-bold text-red-300">{score}</p>

        <p className="mt-2 text-xs text-slate-400">
          Calculated using severity, population impact and casualties.
        </p>
      </div>
    </div>
  );
}