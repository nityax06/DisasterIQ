"use client";

import MissionQueue from "./components/MissionQueue";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import jsPDF from "jspdf";

import ResourceChart from "./components/ResourceChart";
import IncidentChart from "./components/IncidentChart";
import AnalyticsSummary from "./components/AnalyticsSummary";

import CommandCenter from "./components/CommandCenter";
import ActionQueue from "./components/ActionQueue";
import OperationsTimeline from "./components/OperationsTimeline";
import ToastHost, { showToast } from "./components/ToastHost";
import LiveClock from "./components/LiveClock";
import ReadinessScore from "./components/ReadinessScore";
import IncidentHeatMap from "./components/IncidentHeatMap";
import NotificationCenter from "./components/NotificationCenter";
import NotificationDrawer from "./components/NotificationDrawer";
import ExportReport from "./components/ExportReport";
import QuickActions from "./components/QuickActions";
import ResponsePlaybook from "./components/ResponsePlaybook";
import MissionControl from "./components/MissionControl";
import WhatIfSimulator from "./components/WhatIfSimulator";
import DashboardIntel from "./components/DashboardIntel";
import ActivityFeed from "./components/ActivityFeed";
import KPIBar from "./components/KPIBar";
import OperationalKpis from "./components/OperationalKpis";
import IncidentMap from "./components/IncidentMap";
import StatusWorkflowBoard from "./components/StatusWorkflowBoard";
import GlobalSearch from "./components/GlobalSearch";
import ThemeAccentSelector from "./components/ThemeAccentSelector";
import AuthGate from "./components/AuthGate";
import SessionControl from "./components/SessionControl";
import WeatherPanel from "./components/WeatherPanel";
import FloatingChatbot from "./components/FloatingChatbot";
import DynamicResourceRouting from "./components/DynamicResourceRouting";
import AIPredictionPanel from "./components/AIPredictionPanel";
import PublicAdvisoryGenerator from "./components/PublicAdvisoryGenerator";
import ResourceRequirementCalculator from "./components/ResourceRequirementCalculator";
import VoiceCommandCenter from "./components/VoiceCommandCenter";

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
  Search,
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

const accentClasses: Record<string, string> = {
  black: "from-black via-black to-zinc-950",
  emerald: "from-emerald-950/30 via-black to-black",
  aubergine: "from-violet-950/30 via-black to-black",
  crimson: "from-red-950/30 via-black to-black",
};

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [accent, setAccent] = useState("black");
  const [lastUpdated, setLastUpdated] = useState(0);

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
    setLastUpdated(0);
  }

  function exportPdf() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("DisasterIQ Emergency Report", 20, 20);

    doc.setFontSize(11);
    doc.text(`Active Incidents: ${incidents.length}`, 20, 40);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 50);
    doc.text("System Status: Operational", 20, 60);
    doc.text("Database: Supabase Connected", 20, 70);
    doc.text("Priority Engine: Enabled", 20, 80);

    doc.save("DisasterIQ_Report.pdf");
    showToast("PDF exported using keyboard shortcut");
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

    const timer = setInterval(() => {
      setLastUpdated((value) => value + 1);
    }, 1000);

    function handleShortcuts(event: KeyboardEvent) {
      if (event.ctrlKey && event.key.toLowerCase() === "f") {
        event.preventDefault();
        setGlobalSearchOpen(true);
      }

      if (event.altKey && event.key.toLowerCase() === "n") {
        event.preventDefault();
        setActiveView("incidents");
        showToast("New incident page opened");
      }

      if (event.ctrlKey && event.key.toLowerCase() === "e") {
        event.preventDefault();
        exportPdf();
      }
    }

    window.addEventListener("keydown", handleShortcuts);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(timer);
      window.removeEventListener("keydown", handleShortcuts);
    };
  }, [incidents.length]);

  useEffect(() => {
    function openIncidents() {
      setActiveView("incidents");
    }

    function openResources() {
      setActiveView("resources");
    }

    function openAnalytics() {
      setActiveView("analytics");
    }

    window.addEventListener("dashboard-view-incidents", openIncidents);
    window.addEventListener("dashboard-view-resources", openResources);
    window.addEventListener("dashboard-view-analytics", openAnalytics);

    return () => {
      window.removeEventListener("dashboard-view-incidents", openIncidents);
      window.removeEventListener("dashboard-view-resources", openResources);
      window.removeEventListener("dashboard-view-analytics", openAnalytics);
    };
  }, []);

  return (
    <AuthGate>
      <main
      className={`h-screen bg-gradient-to-br ${accentClasses[accent]} bg-black text-white flex overflow-hidden text-sm`}
    >
      <aside
        className={`h-screen shrink-0 border-r border-white/10 bg-black/40 backdrop-blur-xl transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        } hidden lg:flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {sidebarOpen && (
            <div>
              <p className="font-bold">
                Disaster<span className="text-slate-300">IQ</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Response Intelligence
              </p>
            </div>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-400 transition-all duration-200 hover:bg-white/10 hover:text-white"
          >
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = activeView === item.view;

            return (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${
                  active
                    ? "bg-white/[0.08] text-white border border-white/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="h-4 w-4" />

                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="space-y-3 p-3">
          {sidebarOpen && (
            <ThemeAccentSelector accent={accent} setAccent={setAccent} />
          )}

          <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3 transition-all duration-200 hover:border-green-500/30 hover:bg-green-500/15">
            {sidebarOpen ? (
              <>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[11px] font-medium text-slate-400">
                    Live Sync
                  </p>
                  <span className="rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-[10px] text-green-300">
                    Connected
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="rounded-lg border border-white/10 bg-black/20 p-2">
                    <p className="text-slate-600">Updated</p>
                    <p className="mt-0.5 text-green-300">{lastUpdated}s ago</p>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-black/20 p-2">
                    <p className="text-slate-600">Realtime</p>
                    <p className="mt-0.5 text-green-300">Enabled</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-green-300 text-center">●</p>
            )}
          </div>
        </div>
      </aside>

      <section className="flex-1 h-screen flex flex-col overflow-hidden">
        <header className="h-14 shrink-0 border-b border-white/10 bg-black/95 backdrop-blur-xl flex items-center justify-between px-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
              Emergency Operations
            </p>
            <h1 className="text-sm font-semibold">
              {navItems.find((item) => item.view === activeView)?.label} View
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setGlobalSearchOpen(true)}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-slate-300 transition-all duration-200 hover:border-white/30"
            >
              <Search className="mr-1 inline h-3 w-3" />
              Search <span className="ml-1 text-slate-500">Ctrl+F</span>
            </button>

            <SessionControl />
            <NotificationDrawer />
            <LiveClock />

            <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-[11px] text-green-300">
              🟢 System Operational
            </span>

            <span className="rounded-full border border-white/20 bg-white/[0.04] px-3 py-1 text-[11px] text-slate-300">
              🛰 Live Sync {lastUpdated}s
            </span>

            <span className="animate-pulse rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[11px] text-orange-300">
              🚨 {incidents.length} Active Incidents
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeView === "dashboard" && (
            <>
              <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_0_40px_rgba(15,23,42,0.35)]">
                <h2 className="text-xl font-bold">
                  National Disaster Response Command Center
                </h2>

                <p className="text-xs text-slate-400 max-w-3xl mt-2 leading-5">
                  Live operational intelligence for disaster monitoring, AI-assisted
                  prioritization, weather-aware response coordination, resource deployment
                  and field operations.
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {[
                    "Alt+N New Incident",
                    "Ctrl+F Global Search",
                    "Ctrl+E Export PDF",
                    "Supabase Realtime",
                    "OpenAI Assistant",
                    "Weather Intelligence",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-slate-300 hover:border-white/30 hover:text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>

              <AlertBanner />

              <section className="grid grid-cols-4 gap-3">
                <StatCard title="Active Disasters" value={incidents.length.toString()} icon="🌍" accent="hover:border-white/30" />
                <StatCard title="Resources" value="5200" icon="📦" accent="hover:border-white/30" />
                <StatCard title="Volunteers" value="90" icon="👥" accent="hover:border-white/30" />
                <StatCard title="Relief Centers" value="4" icon="🏥" accent="hover:border-white/30" />
              </section>

              <OperationalKpis incidents={incidents} />
              <CommandCenter incidents={incidents} />

              <section>
                <WeatherPanel incidents={incidents} />
              </section>

              <section className="grid grid-cols-2 gap-3">
                <ResourceRequirementCalculator incidents={incidents} />
                <DynamicResourceRouting incidents={incidents} />
              </section>

              <section className="grid grid-cols-3 gap-3">
                <AIPredictionPanel incidents={incidents} />
                <PublicAdvisoryGenerator incidents={incidents} />
                <VoiceCommandCenter incidents={incidents} />
              </section>

              <DashboardIntel incidents={incidents} />
              <KPIBar incidents={incidents.length} />

              <section className="grid grid-cols-2 gap-3">
                <ReadinessScore />
                <IncidentHeatMap incidents={incidents} />
              </section>

              <section className="grid grid-cols-2 gap-3">
                <IncidentMap incidents={incidents} />
                <StatusWorkflowBoard incidents={incidents} />
              </section>

              <section className="grid grid-cols-2 gap-3">
                <NotificationCenter />
                <div className="space-y-3">
                  <QuickActions />
                  <MissionQueue />
                </div>
              </section>

              <section className="grid grid-cols-4 gap-3">
                
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
              <ResourceRequirementCalculator incidents={incidents} />
              <DynamicResourceRouting incidents={incidents} />
              <AIPredictionPanel incidents={incidents} />
              <PublicAdvisoryGenerator incidents={incidents} />
              <VoiceCommandCenter incidents={incidents} />
              <MissionQueue />
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
            <>
              <AnalyticsSummary incidents={incidents} />

              <section className="grid grid-cols-2 gap-3">
                <IncidentChart incidents={incidents} />
                <ResourceChart />
        
                <IncidentHeatMap incidents={incidents} />
                <IncidentMap incidents={incidents} />
                <WhatIfSimulator />
              </section>
            </>
          )}

          <footer className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-slate-500">
            <div>
              DisasterIQ © 2026
              <span className="ml-2 text-slate-600">
                Intelligent Emergency Resource Allocation & Route Optimization
              </span>
            </div>

            <div className="text-slate-600">Version 1.0.0</div>
          </footer>
        </div>
      </section>

      <GlobalSearch
        open={globalSearchOpen}
        onClose={() => setGlobalSearchOpen(false)}
        incidents={incidents}
        setActiveView={setActiveView}
      />

      <ExportReport incidents={incidents} />
      <FloatingChatbot incidents={incidents} />
      <ToastHost />
      </main>
    </AuthGate>
  );
}