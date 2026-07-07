import { Activity, CheckCircle2 } from "lucide-react";

export default function OperationsTimeline() {
  const events = [
    "Incident created",
    "Priority calculated",
    "Resources assigned",
    "Broadcast sent",
    "Route checked",
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-cyan-300" />
        <h2 className="text-sm font-semibold">Animated Timeline</h2>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={event} className="relative flex gap-3 text-xs">
            <div className="flex flex-col items-center">
              <CheckCircle2 className="h-4 w-4 animate-pulse text-cyan-300" />
              {index !== events.length - 1 && (
                <div className="mt-1 h-8 w-px bg-cyan-500/30" />
              )}
            </div>

            <div>
              <p>{event}</p>
              <p className="text-[11px] text-slate-500">
                {new Date().toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}