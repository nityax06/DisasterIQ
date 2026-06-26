import { Zap } from "lucide-react";
import { showToast } from "./ToastHost";

export default function QuickActions() {
  const actions = ["Dispatch", "Notify", "Recalculate", "Escalate"];

  return (
    <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.06] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Zap className="h-4 w-4 text-purple-300" />
        <h2 className="text-sm font-semibold">Quick Actions</h2>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <button
            key={action}
            onClick={() => showToast(`${action} action triggered`)}
            className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs transition hover:border-purple-500/40 hover:text-purple-300"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}