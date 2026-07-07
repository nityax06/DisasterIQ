"use client";

import {
  X,
  Brain,
  Clock3,
  Route,
  Building2,
  PackageCheck,
  Radio,
  CheckCircle2,
  Download,
} from "lucide-react";
import jsPDF from "jspdf";
import SeverityBadge from "./SeverityBadge";
import { calculatePriorityScore } from "../priority";
import { calculateAllocation } from "../allocation";
import { reliefCenters } from "../reliefCenters";
import { showToast } from "./ToastHost";
import { addNotification } from "./appEvents";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

type Props = {
  incident: Incident | null;
  onClose: () => void;
  status?: string;
  onResolve?: (id: number) => void;
};

export default function IncidentDetailDrawer({
  incident,
  onClose,
  status = "Reported",
  onResolve,
}: Props) {
  if (!incident) return null;

  const activeIncident: Incident = incident;

  const score = calculatePriorityScore(
    activeIncident.severity,
    activeIncident.population,
    activeIncident.casualties
  );

  const allocation = calculateAllocation(
    activeIncident.severity,
    activeIncident.population,
    activeIncident.casualties
  );

  const center =
    reliefCenters.find((item) => item.capacity >= activeIncident.population) ||
    reliefCenters[0];

  const eta =
    score >= 130 ? "25-35 min" : score >= 100 ? "35-50 min" : "45-60 min";

  const route = {
    path: ["Nearest Relief Center", center.name, activeIncident.location],
    distance:
      activeIncident.location === "Delhi"
        ? 18
        : activeIncident.location === "Pune"
        ? 148
        : activeIncident.location === "Chennai"
        ? 22
        : activeIncident.location === "Guwahati"
        ? 19
        : 45,
  };

  function broadcastIncident() {
    addNotification(
      "Incident broadcast sent",
      `${activeIncident.type} in ${activeIncident.location} sent to Police, Hospital, Fire Dept, NDRF and Ambulance units.`,
      "broadcast"
    );

    showToast("Incident broadcast sent");
  }

  function exportIncident() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("DisasterIQ Incident Report", 20, 20);

    doc.setFontSize(11);
    doc.text(`Incident: ${activeIncident.type}`, 20, 40);
    doc.text(`Location: ${activeIncident.location}`, 20, 50);
    doc.text(`Severity: ${activeIncident.severity}`, 20, 60);
    doc.text(`Status: ${status}`, 20, 70);
    doc.text(`Priority Score: ${score}`, 20, 80);
    doc.text(`Population Affected: ${activeIncident.population}`, 20, 90);
    doc.text(`Casualties: ${activeIncident.casualties}`, 20, 100);

    doc.text(`Medical Kits: ${allocation.medicalKits}`, 20, 120);
    doc.text(`Volunteers: ${allocation.volunteers}`, 20, 130);
    doc.text(`Rescue Units: ${allocation.rescueBoats}`, 20, 140);
    doc.text(`Relief Center: ${center.name}`, 20, 150);
    doc.text(`Route: ${route.path.join(" -> ")}`, 20, 160, { maxWidth: 170 });
    doc.text(`Distance: ${route.distance} km`, 20, 175);
    doc.text(`ETA: ${eta}`, 20, 185);

    doc.save(`${activeIncident.type}_${activeIncident.location}_Report.pdf`);

    addNotification(
      "Incident report exported",
      `${activeIncident.type} in ${activeIncident.location} report downloaded.`,
      "export"
    );

    showToast("Incident report exported");
  }

  function resolveIncident() {
    onResolve?.(activeIncident.id);

    addNotification(
      "Incident resolved",
      `${activeIncident.type} in ${activeIncident.location} marked as Resolved.`,
      "workflow"
    );

    showToast("Incident marked resolved");
  }

  return (
    <div className="fixed inset-0 z-[999999] flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="h-full w-full max-w-lg overflow-y-auto border-l border-white/10 bg-[#0f172a] p-5 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Incident Detail Center</h2>
            <p className="text-xs text-slate-500">
              Full operational view for selected incident.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-md border border-white/10 p-1 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs text-slate-500">Incident</p>
            <p className="mt-1 text-xl font-semibold">
              {activeIncident.type} · {activeIncident.location}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <SeverityBadge severity={activeIncident.severity} />
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-slate-300">
                {status}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-slate-300">
                Priority {score}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-white/10 bg-black/30 p-3">
              <p className="text-[11px] text-slate-400">Population</p>
              <p className="text-lg font-bold">{activeIncident.population}</p>
            </div>

            <div className="rounded-lg border border-white/10 bg-black/30 p-3">
              <p className="text-[11px] text-slate-400">Casualties</p>
              <p className="text-lg font-bold">{activeIncident.casualties}</p>
            </div>

            <div className="rounded-lg border border-white/10 bg-black/30 p-3">
              <p className="text-[11px] text-slate-400">ETA</p>
              <p className="text-lg font-bold">{eta}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={broadcastIncident}
              className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3 text-xs text-yellow-300 transition hover:bg-yellow-500/20"
            >
              <Radio className="mx-auto mb-1 h-4 w-4" />
              Broadcast
            </button>

            <button
              onClick={resolveIncident}
              className="rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-xs text-green-300 transition hover:bg-green-500/20"
            >
              <CheckCircle2 className="mx-auto mb-1 h-4 w-4" />
              Resolve
            </button>

            <button
              onClick={exportIncident}
              className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-xs text-slate-200 transition hover:bg-white/[0.08]"
            >
              <Download className="mx-auto mb-1 h-4 w-4" />
              Export
            </button>
          </div>

          <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.06] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-300" />
              <h3 className="text-sm font-semibold">AI Response Advisor</h3>
            </div>

            <p className="text-xs leading-5 text-slate-300">
              Prioritize {activeIncident.location}. Deploy{" "}
              {allocation.volunteers} volunteers, allocate{" "}
              {allocation.medicalKits} medical kits, prepare{" "}
              {allocation.rescueBoats} rescue units, and coordinate with{" "}
              {center.name}.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <PackageCheck className="h-4 w-4 text-slate-300" />
              <h3 className="text-sm font-semibold">Recommended Resources</h3>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-lg border border-white/10 p-3">
                Medical
                <p className="mt-1 font-semibold">{allocation.medicalKits}</p>
              </div>

              <div className="rounded-lg border border-white/10 p-3">
                Volunteers
                <p className="mt-1 font-semibold">{allocation.volunteers}</p>
              </div>

              <div className="rounded-lg border border-white/10 p-3">
                Rescue
                <p className="mt-1 font-semibold">{allocation.rescueBoats}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-green-300" />
              <h3 className="text-sm font-semibold">Relief Assignment</h3>
            </div>

            <p className="text-xs text-slate-300">
              Assigned Center: {center.name}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Capacity: {center.capacity}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Route className="h-4 w-4 text-cyan-300" />
              <h3 className="text-sm font-semibold">Route Visualization</h3>
            </div>

            <div className="space-y-2">
              {route.path.map((point) => (
                <div key={point} className="flex items-center gap-2 text-xs">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Distance: {route.distance} km · ETA: {eta}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-orange-300" />
              <h3 className="text-sm font-semibold">Status History</h3>
            </div>

            {[
              "Incident reported",
              "Priority calculated",
              "Resources assigned",
              "Relief center selected",
              status === "Resolved" ? "Incident resolved" : "Route generated",
            ].map((item, index) => (
              <div key={item} className="mb-3 flex gap-3 text-xs">
                <div className="mt-1 h-2 w-2 rounded-full bg-orange-400" />
                <div>
                  <p>{item}</p>
                  <p className="text-[11px] text-slate-500">
                    T+{index + 1} min
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}