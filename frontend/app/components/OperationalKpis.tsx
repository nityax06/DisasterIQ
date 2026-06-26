import { TrendingUp, TrendingDown } from "lucide-react";
import { calculateAllocation } from "../allocation";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

export default function OperationalKpis({
  incidents,
}: {
  incidents: Incident[];
}) {
  const totalPopulation = incidents.reduce((sum, item) => sum + item.population, 0);
  const totalCasualties = incidents.reduce((sum, item) => sum + item.casualties, 0);

  const medicalNeeded = incidents.reduce((sum, item) => {
    const allocation = calculateAllocation(
      item.severity,
      item.population,
      item.casualties
    );
    return sum + allocation.medicalKits;
  }, 0);

  const criticalCount = incidents.filter(
    (item) => item.severity.toLowerCase() === "critical"
  ).length;

  const cards = [
    ["Critical", criticalCount, "Command alert", "red", true],
    ["Population", totalPopulation, "Affected count", "blue", false],
    ["Medical", medicalNeeded, "Kits estimated", "purple", false],
    ["Casualties", totalCasualties, "Reported impact", "orange", true],
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map(([label, value, sub, color, rising]) => (
        <div
          key={label as string}
          className="rounded-xl border border-white/10 bg-white/[0.035] p-4 transition hover:-translate-y-0.5 hover:border-blue-500/30 hover:bg-white/[0.06]"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] text-slate-500">{label}</p>
              <p className="mt-2 text-2xl font-semibold">{value}</p>
            </div>

            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] ${
                rising
                  ? "border-red-500/20 bg-red-500/10 text-red-300"
                  : "border-green-500/20 bg-green-500/10 text-green-300"
              }`}
            >
              {rising ? (
                <TrendingUp className="inline h-3 w-3" />
              ) : (
                <TrendingDown className="inline h-3 w-3" />
              )}{" "}
              live
            </span>
          </div>

          <p className="mt-2 text-[11px] text-slate-500">{sub}</p>

          <div className="mt-3 flex gap-1">
            {[30, 60, 45, 80, 55].map((height, index) => (
              <div
                key={index}
                className={`w-full rounded-sm ${
                  color === "red"
                    ? "bg-red-400/60"
                    : color === "blue"
                    ? "bg-blue-400/60"
                    : color === "purple"
                    ? "bg-purple-400/60"
                    : "bg-orange-400/60"
                }`}
                style={{ height: `${height / 4}px` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}