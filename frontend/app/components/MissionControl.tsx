"use client";

import { Shield, Siren, Send, RefreshCw } from "lucide-react";
import { showToast } from "./ToastHost";

export default function MissionControl() {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4">
      <div className="mb-4 flex items-center gap-2">
        <Shield className="h-4 w-4 text-red-300" />
        <h2 className="text-sm font-semibold">Mission Control</h2>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => showToast("Emergency response activated")}
          className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-3 text-xs hover:bg-red-500/20"
        >
          <Siren className="mx-auto mb-1 h-4 w-4" />
          Activate Response
        </button>

        <button
          onClick={() => showToast("Broadcast sent")}
          className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-3 text-xs hover:bg-blue-500/20"
        >
          <Send className="mx-auto mb-1 h-4 w-4" />
          Broadcast Alert
        </button>

        <button
          onClick={() => showToast("Resources redeployed")}
          className="rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-3 text-xs hover:bg-green-500/20"
        >
          <RefreshCw className="mx-auto mb-1 h-4 w-4" />
          Reallocate Resources
        </button>

        <button
          onClick={() => showToast("Command review completed")}
          className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-3 text-xs hover:bg-purple-500/20"
        >
          <Shield className="mx-auto mb-1 h-4 w-4" />
          Review Command
        </button>
      </div>
    </div>
  );
}