import ResourcePanel from "./components/ResourcePanel";
import IncidentTable from "./components/IncidentTable";
import StatCard from "./components/StatCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-5xl font-bold mb-2">
        DisasterIQ
      </h1>

      <p className="text-slate-400 mb-10">
        AI-Powered Disaster Response Platform
      </p>

      <div className="grid grid-cols-4 gap-6">
        <StatCard title="Active Disasters" value="3" />
        <StatCard title="Resources" value="5200" />
        <StatCard title="Volunteers" value="47" />
        <StatCard title="Relief Centers" value="12" />
      </div>
      <IncidentTable />
      <ResourcePanel />
    </main>
  );
}