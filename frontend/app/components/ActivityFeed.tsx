import { Clock3 } from "lucide-react";

export default function ActivityFeed() {
  const events = [
    "Volunteer Team Alpha dispatched",
    "Medical kit request approved",
    "Relief center assigned",
    "Route recalculated",
    "Priority score updated",
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.05]">
      <div className="mb-4 flex items-center gap-2">
        <Clock3 className="h-4 w-4 text-orange-300" />
        <h2 className="text-sm font-semibold">Activity Feed</h2>
      </div>

      <div className="space-y-2">
        {events.map((event, index) => (
          <div
            key={event}
            className="group flex items-center gap-3 rounded-lg border border-white/10 bg-black/30 p-3 text-xs transition hover:border-orange-500/30 hover:bg-orange-500/10"
          >
            <div className="h-2 w-2 rounded-full bg-orange-400 transition group-hover:scale-125" />
            <div>
              <p>{event}</p>
              <p className="mt-1 text-[11px] text-slate-500">
                T+{index + 1} min
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}