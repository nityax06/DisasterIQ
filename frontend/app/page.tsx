"use client";
import ResourceChart from "./components/ResourceChart";
import IncidentChart from "./components/IncidentChart";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import {
  BarChart3,
  AlertTriangle,
  Settings,
  Package,
} from "lucide-react";
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

const navItems = [
  {
    icon: BarChart3,
    label: "Dashboard",
    href: "#dashboard",
    hint: "Overview of live disaster operations.",
  },
  {
    icon: AlertTriangle,
    label: "Incidents",
    href: "#incidents",
    hint: "Create, edit, delete and prioritize incidents.",
  },
  {
    icon: Settings,
    label: "Operations",
    href: "#operations",
    hint: "Allocation, volunteers, centers and route optimization.",
  },
  {
    icon: Package,
    label: "Resources",
    href: "#resources",
    hint: "Monitor shortages and resource availability.",
  },
];

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    <main className="min-h-screen bg-[#05060f] text-white flex text-sm">
      <aside
        className={`sticky top-0 h-screen border-r border-white/10 bg-black/40 backdrop-blur-xl transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        } hidden lg:flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {sidebarOpen && (
            <div>
              <p className="font-bold">
                Disaster<span className="text-blue-400">IQ</span>
              </p>
              <p className="text-[11px] text-slate-500">Response Intelligence</p>
            </div>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-400 hover:bg-white/10 hover:text-white"
            title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              title={item.hint}
              className="group relative flex items-center gap-3 rounded-lg px-3 py-2 text-slate-400 hover:bg-white/5 hover:text-white transition"
            >
              <span className="text-base transition group-hover:scale-110">
                <item.icon className="h-4 w-4 transition group-hover:scale-110" />
              </span>

              {sidebarOpen && (
                <span className="text-sm">
                  {item.label}
                </span>
              )}

              {!sidebarOpen && (
                <span className="absolute left-14 z-50 hidden rounded-md border border-white/10 bg-black px-3 py-2 text-xs text-white shadow-xl group-hover:block">
                  {item.label}
                </span>
              )}
            </a>
          ))}
        </nav>

        <div className="mt-auto p-3">
          <div
            className="rounded-xl border border-green-500/20 bg-green-500/10 p-3"
            title="Database connection is active through Supabase."
          >
            {sidebarOpen ? (
              <>
                <p className="text-[11px] text-slate-400">System Status</p>
                <p className="mt-1 text-xs text-green-300">● Supabase Connected</p>
              </>
            ) : (
              <p className="text-green-300 text-center">●</p>
            )}
          </div>
        </div>
      </aside>

      <section className="flex-1 overflow-x-hidden">
        <header className="sticky top-0 z-50 h-14 border-b border-white/10 bg-[#020617]/90 backdrop-blur-xl flex items-center justify-between px-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-blue-400">
              Emergency Operations
            </p>
            <h1 className="text-sm font-semibold">Disaster Response Dashboard</h1>
          </div>

          <div className="flex items-center gap-2">
            <span
              title="The application is running normally."
              className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-[11px] text-green-300"
            >
              ● Operational
            </span>

            <span
              title="Incident data is connected to Supabase database."
              className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[11px] text-purple-300"
            >
              ● Supabase
            </span>

            <span
              title="Incidents are automatically ranked using the priority scoring algorithm."
              className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[11px] text-blue-300"
            >
              ● Auto Priority
            </span>

            <span
              title="Total active incidents currently loaded from Supabase."
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-slate-300"
            >
              {incidents.length} incidents
            </span>
          </div>
        </header>

        <div className="p-5 space-y-5">
          <section id="dashboard" className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <h2 className="text-xl font-bold">
              Disaster<span className="text-blue-400">IQ</span>
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl mt-2 leading-5">
              Intelligent emergency response platform for incident prioritization,
              resource allocation, volunteer deployment, relief-center assignment,
              and route optimization.
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {["Next.js", "Supabase", "TypeScript", "Dijkstra", "CRUD"].map((tag) => (
                <span
                  key={tag}
                  title={`${tag} is used in this project.`}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-slate-300 hover:border-blue-500/40 hover:text-blue-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          <AlertBanner />

          <div className="grid grid-cols-4 gap-3">
            <StatCard title="Active Disasters" value={incidents.length.toString()} icon="🌍" accent="hover:border-red-500/50" />
            <StatCard title="Resources" value="5200" icon="📦" accent="hover:border-blue-500/50" />
            <StatCard title="Volunteers" value="90" icon="👥" accent="hover:border-green-500/50" />
            <StatCard title="Relief Centers" value="4" icon="🏥" accent="hover:border-purple-500/50" />
          </div>

          <section id="incidents" className="space-y-4">
            <IncidentForm incidents={incidents} setIncidents={setIncidents} />
            <IncidentTable incidents={incidents} setIncidents={setIncidents} />
          </section>

          <section id="operations" className="grid grid-cols-2 gap-3">
            <RecommendationPanel incidents={incidents} />
            <VolunteerPanel incidents={incidents} />
            <ReliefCenterPanel incidents={incidents} />
            <RoutePanel incidents={incidents} />
          </section>

          <section
            id="resources"
            className="grid grid-cols-2 gap-3"
          >
            <ResourcePanel />
            <IncidentChart incidents={incidents} />
            <ResourceChart />
          </section>

          <footer className="border-t border-white/10 pt-4 text-[11px] text-slate-500">
            DisasterIQ © 2026 — Intelligent Emergency Resource Allocation and Route Optimization System.
          </footer>
        </div>
      </section>
    </main>
  );
}