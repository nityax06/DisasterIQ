"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Users,
  PackageCheck,
  Radio,
  Download,
  CheckCircle2,
  Timer,
  MapPin,
  ClipboardList,
  Gauge,
} from "lucide-react";
import { calculateAllocation } from "../allocation";
import { calculatePriorityScore } from "../priority";
import { resources } from "../resources";
import type { AppNotification, Mission } from "./appEvents";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

export default function AnalyticsSummary({ incidents }: { incidents: Incident[] }) {
  const [statusMap, setStatusMap] = useState<Record<number, string>>({});
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);

  function loadData() {
    const savedStatuses = localStorage.getItem("disasteriq-incident-statuses");
    const savedNotifications = localStorage.getItem("disasteriq-live-notifications");
    const savedMissions = localStorage.getItem("disasteriq-missions");

    setStatusMap(savedStatuses ? JSON.parse(savedStatuses) : {});
    setNotifications(savedNotifications ? JSON.parse(savedNotifications) : []);
    setMissions(savedMissions ? JSON.parse(savedMissions) : []);
  }

  useEffect(() => {
    loadData();

    window.addEventListener("disasteriq-status-update", loadData);
    window.addEventListener("disasteriq-notification", loadData);
    window.addEventListener("disasteriq-mission", loadData);

    return () => {
      window.removeEventListener("disasteriq-status-update", loadData);
      window.removeEventListener("disasteriq-notification", loadData);
      window.removeEventListener("disasteriq-mission", loadData);
    };
  }, []);

  const totalPopulation = incidents.reduce((sum, item) => sum + item.population, 0);

  const avgPriority =
    incidents.length === 0
      ? 0
      : Math.round(
          incidents.reduce(
            (sum, item) =>
              sum +
              calculatePriorityScore(item.severity, item.population, item.casualties),
            0
          ) / incidents.length
        );

  const medicalNeeded = incidents.reduce((sum, item) => {
    const allocation = calculateAllocation(item.severity, item.population, item.casualties);
    return sum + allocation.medicalKits;
  }, 0);

  const resolvedCount = incidents.filter(
    (incident) => statusMap[incident.id] === "Resolved"
  ).length;

  const resolvedPercent =
    incidents.length === 0 ? 0 : Math.round((resolvedCount / incidents.length) * 100);

  const totalRequired = resources.reduce((sum, item) => sum + item.required, 0);
  const totalAvailable = resources.reduce((sum, item) => sum + item.available, 0);
  const resourceUtilization = Math.round((totalAvailable / totalRequired) * 100);

  const highestRisk = [...incidents].sort((a, b) => {
    return (
      calculatePriorityScore(b.severity, b.population, b.casualties) -
      calculatePriorityScore(a.severity, a.population, a.casualties)
    );
  })[0];

  const completedMissions = missions.filter((mission) => mission.status === "Completed").length;
  const missionCompletion =
    missions.length === 0 ? 0 : Math.round((completedMissions / missions.length) * 100);

  const broadcasts = notifications.filter((item) => item.type === "broadcast").length;
  const exports = notifications.filter((item) => item.type === "export").length;

  const cards = [
    { label: "Active", value: incidents.length, sub: "incidents", icon: Activity },
    { label: "Resolved", value: `${resolvedPercent}%`, sub: `${resolvedCount} closed`, icon: CheckCircle2 },
    { label: "Avg Priority", value: avgPriority, sub: "risk index", icon: Gauge },
    { label: "Avg ETA", value: avgPriority > 120 ? "30m" : "45m", sub: "response window", icon: Timer },
    { label: "Resources", value: `${resourceUtilization}%`, sub: "stock readiness", icon: PackageCheck },
    { label: "Population", value: totalPopulation, sub: "affected people", icon: Users },
    { label: "Risk Region", value: highestRisk?.location || "-", sub: highestRisk?.type || "none", icon: MapPin },
    { label: "Missions", value: `${missionCompletion}%`, sub: `${missions.length} created`, icon: ClipboardList },
    { label: "Broadcasts", value: broadcasts, sub: "sent alerts", icon: Radio },
    { label: "Exports", value: exports, sub: "reports made", icon: Download },
    { label: "Medical", value: medicalNeeded, sub: "kits needed", icon: PackageCheck },
    { label: "Live Events", value: notifications.length, sub: "notifications", icon: Activity },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.05]"
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-slate-500">{card.label}</p>
              <Icon className="h-4 w-4 text-slate-300" />
            </div>

            <p className="mt-2 truncate text-2xl font-semibold">{card.value}</p>

            <div className="mt-3 h-1.5 rounded-full bg-white/10">
              <div
                className="h-1.5 rounded-full bg-white"
                style={{
                  width: `${Math.min(
                    100,
                    typeof card.value === "number" ? card.value : 65
                  )}%`,
                }}
              />
            </div>

            <p className="mt-2 text-[11px] text-slate-500">{card.sub}</p>
          </div>
        );
      })}
    </div>
  );
}