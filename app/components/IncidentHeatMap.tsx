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

export default function IncidentHeatMap({ incidents }: { incidents: Incident[] }) {
  const regions = [
    { name: "North", cities: ["Delhi", "Gurgaon", "Jaipur"] },
    { name: "West", cities: ["Pune", "Mumbai"] },
    { name: "South", cities: ["Chennai"] },
    { name: "East", cities: ["Bhubaneshwar"] },
    { name: "North-East", cities: ["Guwahati"] },
  ];

  const data = regions.map((region) => {
    const regionIncidents = incidents.filter((incident) =>
      region.cities.includes(incident.location)
    );

    const population = regionIncidents.reduce((sum, item) => sum + item.population, 0);

    const intensity = regionIncidents.reduce(
      (sum, item) =>
        sum + calculatePriorityScore(item.severity, item.population, item.casualties),
      0
    );

    return {
      ...region,
      incidents: regionIncidents,
      population,
      intensity,
    };
  });

  const maxIntensity = Math.max(1, ...data.map((item) => item.intensity));

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.05]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-300" />
          <h2 className="text-sm font-semibold">Regional Incident Heat</h2>
        </div>

        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-slate-400">
          {incidents.length} incidents
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {data.map((region) => {
          const percent = Math.round((region.intensity / maxIntensity) * 100);

          return (
            <div
              key={region.name}
              title={`${region.population} affected population`}
              className="rounded-lg border border-white/10 bg-black/30 p-3 text-xs transition hover:border-orange-500/30 hover:bg-orange-500/10"
            >
              <p className="font-medium">{region.name}</p>

              <div className="mt-3 h-24 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
                <div
                  className={`h-full w-full ${
                    percent > 75
                      ? "bg-red-500/60"
                      : percent > 45
                      ? "bg-orange-500/50"
                      : percent > 20
                      ? "bg-yellow-500/40"
                      : "bg-green-500/30"
                  }`}
                  style={{ opacity: Math.max(0.25, percent / 100) }}
                />
              </div>

              <div className="mt-3 space-y-1 text-[11px] text-slate-500">
                <p>{region.incidents.length} incidents</p>
                <p>{region.population} population</p>
                <p>{percent}% intensity</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex gap-3 text-[11px] text-slate-500">
        <span><span className="text-green-400">●</span> Low</span>
        <span><span className="text-yellow-400">●</span> Medium</span>
        <span><span className="text-orange-400">●</span> High</span>
        <span><span className="text-red-400">●</span> Critical</span>
      </div>
    </div>
  );
}