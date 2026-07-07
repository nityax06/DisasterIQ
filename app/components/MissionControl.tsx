"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { addNotification } from "./appEvents";
import { showToast } from "./ToastHost";

type MissionState = "Idle" | "Running" | "Paused" | "Completed" | "Aborted";

export default function MissionControl() {
  const [missionState, setMissionState] = useState<MissionState>("Idle");
  const [progress, setProgress] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("disasteriq-mission-control");

    if (saved) {
      const parsed = JSON.parse(saved);
      setMissionState(parsed.missionState || "Idle");
      setProgress(parsed.progress || 0);
      setSeconds(parsed.seconds || 0);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "disasteriq-mission-control",
      JSON.stringify({ missionState, progress, seconds })
    );
  }, [missionState, progress, seconds]);

  useEffect(() => {
    if (missionState !== "Running") return;

    const timer = setInterval(() => {
      setSeconds((value) => value + 1);
      setProgress((value) => Math.min(100, value + 2));
    }, 1000);

    return () => clearInterval(timer);
  }, [missionState]);

  function updateMission(state: MissionState, message: string) {
    setMissionState(state);

    if (state === "Running" && progress === 0) {
      setProgress(12);
    }

    if (state === "Completed") {
      setProgress(100);
    }

    if (state === "Aborted") {
      setProgress(0);
      setSeconds(0);
    }

    addNotification("Mission control updated", message, "mission");
    showToast(message);
  }

  const actions = [
    {
      label: "Start",
      icon: PlayCircle,
      disabled: missionState === "Running",
      action: () => updateMission("Running", "Mission started"),
    },
    {
      label: "Pause",
      icon: PauseCircle,
      disabled: missionState !== "Running",
      action: () => updateMission("Paused", "Mission paused"),
    },
    {
      label: "Resume",
      icon: RotateCcw,
      disabled: missionState !== "Paused",
      action: () => updateMission("Running", "Mission resumed"),
    },
    {
      label: "Complete",
      icon: CheckCircle2,
      disabled: missionState === "Completed" || missionState === "Idle",
      action: () => updateMission("Completed", "Mission completed"),
    },
    {
      label: "Abort",
      icon: XCircle,
      disabled: missionState === "Idle" || missionState === "Completed",
      action: () => updateMission("Aborted", "Mission aborted"),
    },
  ];

  function stateClass() {
    if (missionState === "Running") return "text-green-300 border-green-500/30 bg-green-500/10";
    if (missionState === "Paused") return "text-yellow-300 border-yellow-500/30 bg-yellow-500/10";
    if (missionState === "Completed") return "text-blue-300 border-blue-500/30 bg-blue-500/10";
    if (missionState === "Aborted") return "text-red-300 border-red-500/30 bg-red-500/10";
    return "text-slate-300 border-white/10 bg-white/[0.04]";
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.05]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-slate-300" />
          <h2 className="text-sm font-semibold">Mission Control</h2>
        </div>

        <span className={`rounded-full border px-2 py-0.5 text-[11px] ${stateClass()}`}>
          {missionState}
        </span>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-lg border border-white/10 bg-black/30 p-3">
          <p className="text-slate-500">Progress</p>
          <p className="mt-1 text-lg font-semibold">{progress}%</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/30 p-3">
          <p className="text-slate-500">Timer</p>
          <p className="mt-1 text-lg font-semibold">{seconds}s</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/30 p-3">
          <p className="text-slate-500">Mode</p>
          <p className="mt-1 text-lg font-semibold">Live</p>
        </div>
      </div>

      <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-white transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-5 gap-2">
        {actions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={item.action}
              disabled={item.disabled}
              className="rounded-lg border border-white/10 bg-black/30 px-2 py-3 text-xs transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-35"
            >
              <Icon className="mx-auto mb-1 h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}