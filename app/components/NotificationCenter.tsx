"use client";

import { useEffect, useState } from "react";
import { BellRing } from "lucide-react";
import type { AppNotification } from "./appEvents";

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  function loadNotifications() {
    const saved = localStorage.getItem("disasteriq-live-notifications");
    setNotifications(saved ? JSON.parse(saved) : []);
  }

  useEffect(() => {
    loadNotifications();

    window.addEventListener("disasteriq-notification", loadNotifications);

    return () => {
      window.removeEventListener("disasteriq-notification", loadNotifications);
    };
  }, []);

  function dotColor(type: string) {
    if (type === "critical") return "bg-red-400";
    if (type === "resource") return "bg-emerald-400";
    if (type === "broadcast") return "bg-yellow-400";
    if (type === "mission") return "bg-violet-400";
    if (type === "export") return "bg-blue-400";
    return "bg-slate-400";
  }

  const visibleNotifications = notifications.slice(0, 6);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.05]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BellRing className="h-4 w-4 text-slate-300" />
          <h2 className="text-sm font-semibold">Live Notifications</h2>
        </div>

        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-slate-400">
          {notifications.length} alerts
        </span>
      </div>

      {visibleNotifications.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-black/30 p-4 text-xs text-slate-500">
          No live alerts yet. Use Generate Plan, Broadcast, Export, Resolve, or
          Mission Queue actions.
        </div>
      ) : (
        <div className="space-y-2">
          {visibleNotifications.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-white/10 bg-black/30 p-3 text-xs transition hover:border-white/30 hover:bg-white/[0.06]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-2">
                  <span
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${dotColor(
                      item.type
                    )}`}
                  />

                  <div>
                    <p className="font-medium text-slate-200">{item.title}</p>
                    <p className="mt-1 text-[11px] leading-4 text-slate-500">
                      {item.detail}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 text-[11px] text-slate-500">
                  {item.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}