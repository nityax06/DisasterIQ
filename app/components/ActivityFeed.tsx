"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import type { AppNotification } from "./appEvents";

export default function ActivityFeed() {
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

  return (
    <div className="h-[430px] rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.05]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-orange-300" />
          <h2 className="text-sm font-semibold">Activity Feed</h2>
        </div>

        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-slate-400">
          {events.length} events
        </span>
      </div>

      <div className="max-h-[350px] space-y-2 overflow-y-auto pr-1">
        {events.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-black/30 p-4 text-xs text-slate-500">
            Activity will appear here as actions are used.
          </div>
        ) : (
          events.map((event, index) => (
            <div
              key={event.id}
              className="group flex items-start gap-3 rounded-lg border border-white/10 bg-black/30 p-3 text-xs transition hover:border-orange-500/30 hover:bg-orange-500/10"
            >
              <div className="mt-1 h-2 w-2 rounded-full bg-orange-400 transition group-hover:scale-125" />

              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-3">
                  <p className="font-medium">{event.title}</p>
                  <p className="shrink-0 text-[11px] text-slate-500">
                    {event.time}
                  </p>
                </div>

                <p className="mt-1 text-[11px] leading-4 text-slate-500">
                  {event.detail}
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-600">
                  Event #{events.length - index}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}