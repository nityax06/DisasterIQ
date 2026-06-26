"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, FileText, Radio, Wand2, CheckCircle2 } from "lucide-react";
import { calculatePriorityScore } from "../priority";
import { calculateAllocation } from "../allocation";
import { reliefCenters } from "../reliefCenters";
import { showToast } from "./ToastHost";
import { addMission, addNotification } from "./appEvents";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

type CommandCenterProps = {
  incidents: Incident[];
};

type CommandLog = {
  id: number;
  label: string;
  detail: string;
  time: string;
};

function getRisk(score: number) {
  if (score >= 130) {
    return {
      label: "CRITICAL",
      color: "text-red-300",
      border: "border-red-500/30",
      bg: "bg-red-500/10",
    };
  }

  if (score >= 100) {
    return {
      label: "HIGH",
      color: "text-orange-300",
      border: "border-orange-500/30",
      bg: "bg-orange-500/10",
    };
  }

  if (score >= 70) {
    return {
      label: "MEDIUM",
      color: "text-yellow-300",
      border: "border-yellow-500/30",
      bg: "bg-yellow-500/10",
    };
  }

  return {
    label: "LOW",
    color: "text-green-300",
    border: "border-green-500/30",
    bg: "bg-green-500/10",
  };
}

function getTime() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CommandCenter({ incidents }: CommandCenterProps) {
  const [generatedPlan, setGeneratedPlan] = useState<string[]>([]);
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [commandLog, setCommandLog] = useState<CommandLog[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("disasteriq-command-log");

    if (saved) {
      setCommandLog(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("disasteriq-command-log", JSON.stringify(commandLog));
  }, [commandLog]);

  const topIncident = [...incidents].sort((a, b) => {
    const scoreA = calculatePriorityScore(a.severity, a.population, a.casualties);
    const scoreB = calculatePriorityScore(b.severity, b.population, b.casualties);
    return scoreB - scoreA;
  })[0];

  if (!topIncident) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/30 hover:bg-white/[0.05]">
        <h2 className="text-sm font-semibold">Command Center</h2>
        <p className="mt-2 text-xs text-slate-500">No active incidents.</p>
      </div>
    );
  }

  const score = calculatePriorityScore(
    topIncident.severity,
    topIncident.population,
    topIncident.casualties
  );

  const allocation = calculateAllocation(
    topIncident.severity,
    topIncident.population,
    topIncident.casualties
  );

  const center =
    reliefCenters.find((item) => item.capacity >= topIncident.population) ||
    reliefCenters[0];

  const risk = getRisk(score);
  const confidence = 87;
  const eta = score >= 130 ? "25–35 min" : score >= 100 ? "35–50 min" : "45–60 min";

  function addLog(label: string, detail: string) {
    const entry = {
      id: Date.now(),
      label,
      detail,
      time: getTime(),
    };

    setCommandLog((previous) => [entry, ...previous].slice(0, 5));
  }

  function copySummary() {
    const summary = `
DISASTERIQ INCIDENT REPORT

Incident: ${topIncident.type}
Location: ${topIncident.location}
Severity: ${topIncident.severity}
Priority Score: ${score}
Risk Level: ${risk.label}

Medical Kits: ${allocation.medicalKits}
Volunteers: ${allocation.volunteers}
Rescue Units: ${allocation.rescueBoats}

Assigned Relief Center: ${center.name}
Estimated Deployment: ${eta}
`;

    navigator.clipboard.writeText(summary);

    addLog("Summary Copied", `${topIncident.type} · ${topIncident.location}`);
    addNotification(
      "Command summary copied",
      `${topIncident.type} in ${topIncident.location} copied to clipboard.`,
      "workflow"
    );
    showToast("Professional command summary copied");
  }

  function generatePlan() {
    const plan = [
      `Prioritize ${topIncident.location} because risk level is ${risk.label}.`,
      `Dispatch ${allocation.volunteers} volunteers to the incident zone.`,
      `Allocate ${allocation.medicalKits} medical kits for field support.`,
      `Prepare ${allocation.rescueBoats} rescue boat units if terrain requires.`,
      `Activate ${center.name} for relief coordination.`,
      `Estimated deployment window: ${eta}.`,
    ];

    setGeneratedPlan(plan);

    addMission(
      `${topIncident.type} response mission`,
      `${topIncident.location} · Priority ${score} · ${allocation.volunteers} volunteers`
    );

    addLog("Mission Plan Generated", `${plan.length} actions created`);
    addNotification(
      "Mission plan generated",
      `${topIncident.type} in ${topIncident.location} added to Mission Queue.`,
      "mission"
    );
    showToast("Mission created in Mission Queue");
  }

  function broadcast() {
    setBroadcastSent(true);
    addLog(
      "Broadcast Sent",
      `${topIncident.type} in ${topIncident.location} sent to regional centers`
    );
    addNotification(
      "Emergency broadcast sent",
      `${topIncident.type} in ${topIncident.location} sent to Police, Hospital, Fire Dept, NDRF and Ambulance units.`,
      "broadcast"
    );
    showToast(`Broadcast sent for ${topIncident.type} in ${topIncident.location}`);
  }

  return (
    <div
      className={`rounded-xl border ${risk.border} ${risk.bg} p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.05]`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-slate-300" />
          <h2 className="text-sm font-semibold">Command Center</h2>
        </div>

        <span
          className={`rounded-full border ${risk.border} ${risk.bg} px-2 py-0.5 text-[11px] font-semibold ${risk.color}`}
        >
          Risk {risk.label}
        </span>
      </div>

      <p className="text-xs text-slate-400">Current Highest Risk</p>

      <p className="mt-1 text-lg font-semibold">
        {topIncident.type} · {topIncident.location}
      </p>

      <p className="mt-2 text-xs text-slate-400">
        Command actions generate missions, notifications, broadcasts and a
        persistent decision timeline.
      </p>

      <div className="mt-4 grid grid-cols-4 gap-3 text-xs">
        {[
          ["Priority", score, risk.color],
          ["Medical", allocation.medicalKits, "text-white"],
          ["Volunteers", allocation.volunteers, "text-white"],
          ["ETA", eta, "text-slate-300"],
        ].map(([label, value, color]) => (
          <div
            key={label}
            className="rounded-lg border border-white/10 bg-black/30 p-3 transition hover:border-white/30 hover:bg-white/[0.04]"
          >
            <p className="text-slate-500">{label}</p>
            <p className={`mt-1 text-lg font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-white/10 bg-black/30 p-3 transition hover:border-white/30">
        <div className="mb-1 flex justify-between text-[11px] text-slate-400">
          <span>AI Confidence</span>
          <span>{confidence}%</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-2 rounded-full bg-slate-300 transition-all duration-700"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      {generatedPlan.length > 0 && (
        <div className="mt-4 rounded-lg border border-white/10 bg-black/30 p-3">
          <p className="mb-2 text-xs font-semibold">Generated Response Plan</p>

          <div className="space-y-2">
            {generatedPlan.map((step, index) => (
              <div
                key={step}
                className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-xs transition hover:border-white/30 hover:bg-white/[0.06]"
              >
                {index + 1}. {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {broadcastSent && (
        <div className="mt-3 rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs text-green-300">
          <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />
          Broadcast active for {topIncident.location}.
        </div>
      )}

      {commandLog.length > 0 && (
        <div className="mt-4 rounded-lg border border-white/10 bg-black/30 p-3">
          <p className="mb-2 text-xs font-semibold">Command Timeline</p>

          <div className="space-y-2">
            {commandLog.map((log) => (
              <div
                key={log.id}
                className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-xs transition hover:border-white/30 hover:bg-white/[0.06]"
              >
                <div className="flex justify-between">
                  <span>{log.label}</span>
                  <span className="text-[11px] text-slate-500">{log.time}</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">{log.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button
          onClick={copySummary}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-200 transition hover:bg-white/[0.08]"
        >
          <FileText className="h-3.5 w-3.5" />
          Copy Summary
        </button>

        <button
          onClick={generatePlan}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-200 transition hover:bg-white/[0.08]"
        >
          <Wand2 className="h-3.5 w-3.5" />
          Generate Plan
        </button>

        <button
          onClick={broadcast}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-200 transition hover:bg-white/[0.08]"
        >
          <Radio className="h-3.5 w-3.5" />
          Broadcast
        </button>
      </div>
    </div>
  );
}