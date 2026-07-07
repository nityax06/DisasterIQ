"use client";

import { useEffect, useState } from "react";
import {
  Server,
  Bell,
  ClipboardList,
  PackageCheck,
  Route,
  Brain,
} from "lucide-react";

export default function SystemMetrics() {
  const [notificationCount, setNotificationCount] = useState(0);
  const [missionCount, setMissionCount] = useState(0);

  function loadMetrics() {
    const notifications = localStorage.getItem("disasteriq-live-notifications");
    const missions = localStorage.getItem("disasteriq-missions");

    setNotificationCount(notifications ? JSON.parse(notifications).length : 0);
    setMissionCount(missions ? JSON.parse(missions).length : 0);
  }

  useEffect(() => {
    loadMetrics();
    window.addEventListener("disasteriq-notification", loadMetrics);
    window.addEventListener("disasteriq-mission", loadMetrics);

    return () => {
      window.removeEventListener("disasteriq-notification", loadMetrics);
      window.removeEventListener("disasteriq-mission", loadMetrics);
    };
  }, []);

  const metrics = [
    { label: "Database", status: "Online", meta: "99.9%", response: "42ms", icon: Server },
    { label: "Notifications", status: "Live", meta: `${notificationCount} logs`, response: "18ms", icon: Bell },
    { label: "Mission Queue", status: "Ready", meta: `${missionCount} missions`, response: "24ms", icon: ClipboardList },
    { label: "Resource Engine", status: "Active", meta: "stable", response: "31ms", icon: PackageCheck },
    { label: "Route Engine", status: "Active", meta: "ready", response: "27ms", icon: Route },
    { label: "AI Advisor", status: "Enabled", meta: "87%", response: "51ms", icon: Brain },
  ];

  return (
    <div className="h-[430px] rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.05]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">System Health Monitor</h2>
          <p className="text-xs text-slate-500">Live operational module status.</p>
        </div>

        <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[11px] text-green-300">
          healthy
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-xl border border-white/10 bg-black/30 p-3 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.05]"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5">
                    <Icon className="h-3.5 w-3.5 text-slate-300" />
                  </div>
                  <p className="text-xs font-semibold leading-tight">{item.label}</p>
                </div>

                <span className="rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-[10px] text-green-300">
                  {item.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <p className="text-slate-600">Load</p>
                  <p className="mt-0.5 text-slate-300">{item.meta}</p>
                </div>

                <div>
                  <p className="text-slate-600">Latency</p>
                  <p className="mt-0.5 text-slate-300">{item.response}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}