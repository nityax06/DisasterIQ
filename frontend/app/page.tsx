"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import ResourceChart from "./components/ResourceChart";
import IncidentChart from "./components/IncidentChart";
import SystemMetrics from "./components/SystemMetrics";
import CommandCenter from "./components/CommandCenter";
import ActionQueue from "./components/ActionQueue";
import OperationsTimeline from "./components/OperationsTimeline";
import ToastHost from "./components/ToastHost";
import LiveClock from "./components/LiveClock";
import ReadinessScore from "./components/ReadinessScore";
import IncidentHeatMap from "./components/IncidentHeatMap";
import NotificationCenter from "./components/NotificationCenter";
import ExportReport from "./components/ExportReport";
import QuickActions from "./components/QuickActions";
import ResponsePlaybook from "./components/ResponsePlaybook";
import MissionControl from "./components/MissionControl";
import WhatIfSimulator from "./components/WhatIfSimulator";
import DashboardIntel from "./components/DashboardIntel";
import ActivityFeed from "./components/ActivityFeed";
import KPIBar from "./components/KPIBar";

import RoutePanel from "./components/RoutePanel";
import IncidentForm from "./components/IncidentForm";
import RecommendationPanel from "./components/RecommendationPanel";
import AlertBanner from "./components/AlertBanner";
import ResourcePanel from "./components/ResourcePanel";
import VolunteerPanel from "./components/VolunteerPanel";
import ReliefCenterPanel from "./components/ReliefCenterPanel";
import IncidentTable from "./components/IncidentTable";
import StatCard from "./components/StatCard";

import {
  BarChart3,
  AlertTriangle,
  Settings,
  Package,
  Activity,
} from "lucide-react";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

const navItems = [
  { icon: BarChart3, label: "Dashboard", view: "dashboard" },
  { icon: AlertTriangle, label: "Incidents", view: "incidents" },
  { icon: Settings, label: "Operations", view: "operations" },
  { icon: Package, label: "Resources", view: "resources" },
  { icon: Activity, label: "Analytics", view: "analytics" },
];

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");

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

    const channel = supabase
      .channel("incidents-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "incidents",
        },
        () => {
          loadIncidents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className="h-screen bg-[#05060f] text-white flex overflow-hidden text-sm">
      <aside
        className={`h-screen shrink-0 border-r border-white/10 bg-black/40 backdrop-blur-xl transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        } hidden lg:flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {sidebarOpen && (
            <div>
              <p className="font-bold">
                Disaster<span className="text-blue-400">IQ</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Response Intelligence
              </p>
            </div>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-400 hover:bg-white/10 hover:text-white"
          >
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const active = activeView === item.view;

            return (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 transition ${
                  active
                    ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="h-4 w-4" />

                {sidebarOpen && (
                  <span className="text-sm">{item.label}</span>
                )}

                {!sidebarOpen && (
                  <span className="absolute left-14 z-50 hidden rounded-md border border-white/10 bg-black px-3 py-2 text-xs text-white shadow-xl group-hover:block">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto p-3">
          <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3">
            {sidebarOpen ? (
              <>
                <p className="text-[11px] text-slate-400">System Status</p>
                <p className="mt-1 text-xs text-green-300">
                  ● Supabase Connected
                </p>
              </>
            ) : (
              <p className="text-green-300 text-center">●</p>
            )}
          </div>
        </div>
      </aside>

      <section className="flex-1 h-screen flex flex-col overflow-hidden">
        <header className="h-14 shrink-0 border-b border-white/10 bg-[#020617]/95 backdrop-blur-xl flex items-center justify-between px-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-blue-400">
              Emergency Operations
            </p>
            <h1 className="text-sm font-semibold">
              {navItems.find((item) => item.view === activeView)?.label} View
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <LiveClock />

            <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-[11px] text-green-300">
              ● Operational
            </span>

            <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[11px] text-purple-300">
              ● Supabase
            </span>

            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[11px] text-blue-300">
              ● Auto Priority
            </span>

            <span className="animate-pulse rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[11px] text-orange-300">
              ▲ {incidents.length} Active
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeView === "dashboard" && (
            <>
              <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <h2 className="text-xl font-bold">
                  Disaster<span className="text-blue-400">IQ</span>
                </h2>

                <p className="text-xs text-slate-400 max-w-3xl mt-2 leading-5">
                  Intelligent emergency response platform for incident
                  prioritization, resource allocation, volunteer deployment,
                  relief-center assignment, and route optimization.
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {["Next.js", "Supabase", "TypeScript", "Dijkstra", "CRUD"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-slate-300 hover:border-blue-500/40 hover:text-blue-300"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </section>

              <AlertBanner />

              <section className="grid grid-cols-4 gap-3">
                <StatCard
                  title="Active Disasters"
                  value={incidents.length.toString()}
                  icon="🌍"
                  accent="hover:border-red-500/50"
                />
                <StatCard
                  title="Resources"
                  value="5200"
                  icon="📦"
                  accent="hover:border-blue-500/50"
                />
                <StatCard
                  title="Volunteers"
                  value="90"
                  icon="👥"
                  accent="hover:border-green-500/50"
                />
                <StatCard
                  title="Relief Centers"
                  value="4"
                  icon="🏥"
                  accent="hover:border-purple-500/50"
                />
              </section>

              <CommandCenter incidents={incidents} />

              <DashboardIntel incidents={incidents} />

              <KPIBar incidents={incidents.length} />

              <section className="grid grid-cols-2 gap-3">
                <ReadinessScore />
                <IncidentHeatMap incidents={incidents} />
              </section>

              <section className="grid grid-cols-3 gap-3">
                <NotificationCenter />
                <ExportReport incidents={incidents.length} />
                <QuickActions />
              </section>

              <section className="grid grid-cols-4 gap-3">
                <SystemMetrics />
                <ActionQueue incidents={incidents} />
                <ActivityFeed />
                <OperationsTimeline />
              </section>
            </>
          )}

          {activeView === "incidents" && (
            <section className="space-y-4">
              <IncidentForm incidents={incidents} setIncidents={setIncidents} />
              <IncidentTable incidents={incidents} setIncidents={setIncidents} />
            </section>
          )}

          {activeView === "operations" && (
            <section className="grid grid-cols-3 gap-3">
              <RecommendationPanel incidents={incidents} />
              <VolunteerPanel incidents={incidents} />
              <ReliefCenterPanel incidents={incidents} />
              <RoutePanel incidents={incidents} />
              <ResponsePlaybook incidents={incidents} />
              <MissionControl />
              <ActionQueue incidents={incidents} />
              <OperationsTimeline />
            </section>
          )}

          {activeView === "resources" && (
            <section className="grid grid-cols-2 gap-3">
              <ResourcePanel />
              <ResourceChart />
            </section>
          )}

          {activeView === "analytics" && (
            <section className="grid grid-cols-2 gap-3">
              <IncidentChart incidents={incidents} />
              <ResourceChart />
              <SystemMetrics />
              <OperationsTimeline />
              <WhatIfSimulator />
              <IncidentHeatMap incidents={incidents} />
            </section>
          )}

          <footer className="border-t border-white/10 pt-4 text-[11px] text-slate-500">
            DisasterIQ © 2026 — Intelligent Emergency Resource Allocation and
            Route Optimization System.
          </footer>
        </div>
      </section>

      <ToastHost />
    </main>
  );
}