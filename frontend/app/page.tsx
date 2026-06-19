"use client";
import { useState } from "react";
import { incidentStore } from "./data/incidentStore";
import IncidentForm from "./components/IncidentForm";
import RecommendationPanel from "./components/RecommendationPanel";
import AlertBanner from "./components/AlertBanner";
import ResourcePanel from "./components/ResourcePanel";
import IncidentTable from "./components/IncidentTable";
import StatCard from "./components/StatCard";

export default function Home() {
  const [incidents, setIncidents] = useState(incidentStore);
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-5xl font-bold mb-2">
        DisasterIQ
      </h1>

      <p className="text-slate-400 mb-10">
        AI-Powered Disaster Response Platform
      </p>
      <AlertBanner />
      <div className="grid grid-cols-4 gap-6">
        <StatCard 
          title="Active Disasters" 
          value={incidents.length.toString()}
         />
        <StatCard title="Resources" value="5200" />
        <StatCard title="Volunteers" value="47" />
        <StatCard title="Relief Centers" value="12" />
      </div>
      
      <IncidentForm setIncidents={setIncidents} />
      <IncidentTable
        incidents={incidents}
        setIncidents={setIncidents}
      />
      <RecommendationPanel incidents={incidents} />
      <ResourcePanel />
    </main>
  );
}