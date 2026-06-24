import { Activity } from "lucide-react";

export default function OperationsTimeline() {
  const events = [
    "Incident data synced from Supabase",
    "Priority scores recalculated",
    "Resource allocation generated",
    "Volunteer deployment updated",
    "Route optimization checked",
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Activity className="h-4 w-4 text-cyan-300" />
        <h2 className="text-sm font-semibold">Operations Timeline</h2>
      </div>

      <div className="space-y-3">
        {events.map((event, index) => (
          <div key={event} className="flex gap-3 text-xs">
            <div className="mt-1 h-2 w-2 rounded-full bg-cyan-400" />
            <div>
              <p>{event}</p>
              <p className="text-[11px] text-slate-500">
                T+{index + 1} min
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}