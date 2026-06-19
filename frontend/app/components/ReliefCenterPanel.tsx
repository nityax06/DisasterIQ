import { reliefCenters } from "../reliefCenters";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

type ReliefCenterPanelProps = {
  incidents: Incident[];
};

export default function ReliefCenterPanel({
  incidents,
}: ReliefCenterPanelProps) {
  if (incidents.length === 0) {
    return (
      <div className="mt-10 bg-slate-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Relief Center Assignment</h2>
        <p className="text-slate-400">No active incidents.</p>
      </div>
    );
  }

  const highestPopulationIncident = [...incidents].sort(
    (a, b) => b.population - a.population
  )[0];

  const assignedCenter =
    reliefCenters.find(
      (center) => center.capacity >= highestPopulationIncident.population
    ) || reliefCenters[0];

  return (
    <div className="mt-10 bg-slate-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Relief Center Assignment</h2>

      <p className="text-slate-400 mb-2">Incident</p>
      <p className="text-xl font-bold mb-4">
        {highestPopulationIncident.type} - {highestPopulationIncident.location}
      </p>

      <div className="bg-slate-900 p-4 rounded-lg">
        <p className="text-slate-400">Assigned Relief Center</p>
        <p className="text-2xl font-bold">{assignedCenter.name}</p>
        <p className="text-slate-400 mt-2">
          Capacity: {assignedCenter.capacity}
        </p>
      </div>
    </div>
  );
}