"use client";

import { useEffect, useState } from "react";
import { Activity, CheckCircle2 } from "lucide-react";
import type { AppNotification } from "./appEvents";

export default function OperationsTimeline() {
  const [events, setEvents] = useState<AppNotification[]>([]);

  function loadEvents() {
    const saved = localStorage.getItem("disasteriq-live-notifications");
    setEvents(saved ? JSON.parse(saved) : []);
  }

  useEffect(() => {
    loadEvents();
    window.addEventListener("disasteriq-notification", loadEvents);

    return () => window.removeEventListener("disasteriq-notification", loadEvents);
  }, []);

  const timeline =
    events.length > 0
      ? events
      : [
          {
            id: 1,
            title: "System initialized",
            detail: "DisasterIQ command modules are ready.",
            time: "Ready",
            type: "workflow",
          },
          {
            id: 2,
            title: "Priority engine enabled",
            detail: "Incident scoring system is active.",
            time: "Ready",
            type: "workflow",
          },
          {
            id: 3,
            title: "Supabase connected",
            detail: "Database sync is available.",
            time: "Ready",
            type: "workflow",
          },
        ];

  return (
    <div className="h-[430px] rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.05]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyan-300" />
          <h2 className="text-sm font-semibold">Operations Timeline</h2>
        </div>

        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-slate-400">
          live
        </span>
      </div>

      <div className="max-h-[350px] space-y-3 overflow-y-auto pr-1">
        {timeline.map((event, index) => (
          <div key={event.id} className="relative flex gap-3 text-xs">
            <div className="flex flex-col items-center">
              <CheckCircle2 className="h-4 w-4 text-cyan-300" />

              {index !== timeline.length - 1 && (
                <div className="mt-1 h-8 w-px bg-cyan-500/30" />
              )}
            </div>

            <div className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 transition hover:border-cyan-500/30 hover:bg-cyan-500/10">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium">{event.title}</p>
                <p className="text-[11px] text-slate-500">{event.time}</p>
              </div>

              <p className="mt-1 text-[11px] leading-4 text-slate-500">
                {event.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}