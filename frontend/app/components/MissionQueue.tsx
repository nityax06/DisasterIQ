"use client";

import { useEffect, useState } from "react";
import { ClipboardList, CheckCircle2, PlayCircle } from "lucide-react";
import type { Mission } from "./appEvents";
import { addNotification } from "./appEvents";
import { showToast } from "./ToastHost";

export default function MissionQueue() {
  const [missions, setMissions] = useState<Mission[]>([]);

  function loadMissions() {
    const saved = localStorage.getItem("disasteriq-missions");
    setMissions(saved ? JSON.parse(saved) : []);
  }

  useEffect(() => {
    loadMissions();

    window.addEventListener("disasteriq-mission", loadMissions);

    return () => {
      window.removeEventListener("disasteriq-mission", loadMissions);
    };
  }, []);

  function updateMission(id: number, status: Mission["status"]) {
    const updated = missions.map((mission) =>
      mission.id === id ? { ...mission, status } : mission
    );

    setMissions(updated);
    localStorage.setItem("disasteriq-missions", JSON.stringify(updated));

    addNotification(
      "Mission status updated",
      `Mission moved to ${status}.`,
      "mission"
    );

    showToast(`Mission moved to ${status}`);
  }

  function statusClass(status: string) {
    if (status === "Completed") {
      return "border-green-500/30 bg-green-500/10 text-green-300";
    }

    if (status === "Running") {
      return "border-blue-500/30 bg-blue-500/10 text-blue-300";
    }

    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.05]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-slate-300" />
          <h2 className="text-sm font-semibold">Mission Queue</h2>
        </div>

        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-slate-400">
          {missions.length} missions
        </span>
      </div>

      {missions.length === 0 ? (
        <p className="rounded-lg border border-white/10 bg-black/30 p-4 text-xs text-slate-500">
          No missions yet. Generate a plan from Command Center.
        </p>
      ) : (
        <div className="space-y-2">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className="rounded-lg border border-white/10 bg-black/30 p-3 text-xs transition hover:border-white/30 hover:bg-white/[0.05]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{mission.title}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {mission.detail}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-600">
                    Created {mission.createdAt}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] ${statusClass(
                    mission.status
                  )}`}
                >
                  {mission.status}
                </span>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => updateMission(mission.id, "Running")}
                  disabled={mission.status !== "Waiting Approval"}
                  className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-[11px] text-blue-300 transition hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <PlayCircle className="mr-1 inline h-3 w-3" />
                  Approve
                </button>

                <button
                  onClick={() => updateMission(mission.id, "Completed")}
                  disabled={mission.status === "Completed"}
                  className="rounded-md border border-green-500/20 bg-green-500/10 px-2 py-1 text-[11px] text-green-300 transition hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <CheckCircle2 className="mr-1 inline h-3 w-3" />
                  Complete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}