import { Bell } from "lucide-react";

export default function NotificationCenter() {
  const alerts = [
    "Critical priority recalculated",
    "Supabase sync completed",
    "Resource shortage detected",
    "Volunteer assignment updated",
  ];

  return (
    <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/[0.06] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-yellow-300" />
          <h2 className="text-sm font-semibold">Notification Center</h2>
        </div>

        <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2 py-0.5 text-[11px] text-yellow-300">
          {alerts.length} alerts
        </span>
      </div>

      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert}
            className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs transition hover:border-yellow-500/40"
          >
            {alert}
          </div>
        ))}
      </div>
    </div>
  );
}