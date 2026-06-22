"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import RoutePanel from "./components/RoutePanel";

import IncidentForm from "./components/IncidentForm";
import RecommendationPanel from "./components/RecommendationPanel";
import AlertBanner from "./components/AlertBanner";
import ResourcePanel from "./components/ResourcePanel";
import VolunteerPanel from "./components/VolunteerPanel";
import ReliefCenterPanel from "./components/ReliefCenterPanel";
import IncidentTable from "./components/IncidentTable";
import StatCard from "./components/StatCard";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  async function loadIncidents() {
    const { data, error } = await supabase
      .from("incidents")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error loading incidents:", error);
      return;
    }

    setIncidents(data || []);
  }

  useEffect(() => {
    loadIncidents();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="px-8 py-10 border-b border-slate-800">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-400 mb-3">
          Emergency Operations Dashboard
        </p>

        <h1 className="text-6xl font-bold mb-4">DisasterIQ</h1>

        <p className="text-slate-400 max-w-3xl text-lg">
          AI-powered disaster response and resource optimization platform
          designed to prioritize incidents, allocate resources, assign volunteer
          teams, recommend relief centers, and calculate optimized response
          routes.
        </p>
      </section>

      <section className="p-8">
        <AlertBanner />

        <div className="grid grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Active Disasters"
            value={incidents.length.toString()}
          />
          <StatCard title="Resources" value="5200" />
          <StatCard title="Volunteers" value="90" />
          <StatCard title="Relief Centers" value="4" />
        </div>

        <IncidentForm
          incidents={incidents}
          setIncidents={setIncidents}
        />

        <IncidentTable
          incidents={incidents}
          setIncidents={setIncidents}
        />

        <div className="grid grid-cols-2 gap-6">
          <RecommendationPanel incidents={incidents} />
          <VolunteerPanel incidents={incidents} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <ReliefCenterPanel incidents={incidents} />
          <RoutePanel incidents={incidents} />
        </div>

        <ResourcePanel />

        <footer className="mt-12 border-t border-slate-800 pt-6 text-slate-500 text-sm">
          <p>
            DisasterIQ © 2026 — Intelligent Emergency Resource Allocation and
            Route Optimization System.
          </p>
        </footer>
      </section>
    </main>
  );
}