import { BarChart3, Users, Activity, PackageCheck } from "lucide-react";
import { calculateAllocation } from "../allocation";
import { calculatePriorityScore } from "../priority";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

export default function AnalyticsSummary({
  incidents,
}: {
  incidents: Incident[];
}) {
  const totalPopulation = incidents.reduce((sum, item) => sum + item.population, 0);
  const totalCasualties = incidents.reduce((sum, item) => sum + item.casualties, 0);

  const avgPriority =
    incidents.length === 0
      ? 0
      : Math.round(
          incidents.reduce(
            (sum, item) =>
              sum +
              calculatePriorityScore(
                item.severity,
                item.population,
                item.casualties
              ),
            0
          ) / incidents.length
        );

  const medicalNeeded = incidents.reduce((sum, item) => {
    const allocation = calculateAllocation(
      item.severity,
      item.population,
      item.casualties
    );
    return sum + allocation.medicalKits;
  }, 0);

  const cards = [
    {
      label: "Avg Priority",
      value: avgPriority,
      sub: "risk intensity",
      icon: Activity,
      accent: "text-blue-300",
    },
    {
      label: "Population",
      value: totalPopulation,
      sub: "affected people",
      icon: Users,
      accent: "text-green-300",
    },
    {
      label: "Casualties",
      value: totalCasualties,
      sub: "reported total",
      icon: BarChart3,
      accent: "text-orange-300",
    },
    {
      label: "Medical Need",
      value: medicalNeeded,
      sub: "kits estimated",
      icon: PackageCheck,
      accent: "text-purple-300",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-blue-500/30 hover:bg-white/[0.05]"
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-slate-500">{card.label}</p>
              <Icon className={`h-4 w-4 ${card.accent}`} />
            </div>

            <p className="mt-2 text-2xl font-semibold">{card.value}</p>

            <div className="mt-3 h-1.5 rounded-full bg-white/10">
              <div
                className="h-1.5 rounded-full bg-blue-400"
                style={{
                  width: `${Math.min(100, Number(card.value) || 20)}%`,
                }}
              />
            </div>

            <p className="mt-2 text-[11px] text-slate-500">{card.sub}</p>
          </div>
        );
      })}
    </div>
  );
}