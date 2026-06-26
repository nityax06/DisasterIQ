import { calculateAllocation } from "../allocation";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

export default function OperationalKpis({ incidents }: { incidents: Incident[] }) {
  const totalPopulation = incidents.reduce((sum, item) => sum + item.population, 0);
  const totalCasualties = incidents.reduce((sum, item) => sum + item.casualties, 0);

  const medicalNeeded = incidents.reduce((sum, item) => {
    const allocation = calculateAllocation(item.severity, item.population, item.casualties);
    return sum + allocation.medicalKits;
  }, 0);

  const criticalCount = incidents.filter(
    (item) => item.severity.toLowerCase() === "critical"
  ).length;

  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4">
        <p className="text-[11px] text-slate-400">Critical Incidents</p>
        <p className="mt-1 text-2xl font-bold text-red-300">{criticalCount}</p>
      </div>

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.06] p-4">
        <p className="text-[11px] text-slate-400">Affected Population</p>
        <p className="mt-1 text-2xl font-bold">{totalPopulation}</p>
      </div>

      <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.06] p-4">
        <p className="text-[11px] text-slate-400">Medical Kits Needed</p>
        <p className="mt-1 text-2xl font-bold">{medicalNeeded}</p>
      </div>

      <div className="rounded-xl border border-orange-500/20 bg-orange-500/[0.06] p-4">
        <p className="text-[11px] text-slate-400">Total Casualties</p>
        <p className="mt-1 text-2xl font-bold text-orange-300">{totalCasualties}</p>
      </div>
    </div>
  );
}