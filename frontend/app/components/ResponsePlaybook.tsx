import { ClipboardList } from "lucide-react";
import { calculatePriorityScore } from "../priority";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

type Props = {
  incidents: Incident[];
};

export default function ResponsePlaybook({ incidents }: Props) {
  const topIncident = [...incidents].sort((a, b) => {
    const scoreA = calculatePriorityScore(a.severity, a.population, a.casualties);
    const scoreB = calculatePriorityScore(b.severity, b.population, b.casualties);
    return scoreB - scoreA;
  })[0];

  if (!topIncident) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="text-sm font-semibold">Response Playbook</h2>
        <p className="mt-2 text-xs text-slate-500">No incident selected.</p>
      </div>
    );
  }

  const playbooks: Record<string, string[]> = {
    Flood: [
      "Evacuate low-lying areas",
      "Deploy boats and medical kits",
      "Open nearby relief centers",
      "Monitor water level alerts",
    ],
    Fire: [
      "Dispatch fire response units",
      "Evacuate surrounding buildings",
      "Send medical support for smoke exposure",
      "Secure nearby fuel/electrical sources",
    ],
    Earthquake: [
      "Dispatch rescue and debris-clearing teams",
      "Set up emergency shelters",
      "Prioritize medical triage",
      "Check road and bridge damage",
    ],
    Cyclone: [
      "Activate shelter centers",
      "Issue evacuation alerts",
      "Prepare food and water supplies",
      "Monitor wind and rainfall updates",
    ],
    Tsunami: [
      "Move population to higher ground",
      "Block coastal access zones",
      "Deploy search and rescue teams",
      "Coordinate emergency broadcasts",
    ],
  };

  const steps = playbooks[topIncident.type] || [
    "Assess incident severity",
    "Dispatch emergency response teams",
    "Allocate medical and relief resources",
    "Monitor situation updates",
  ];

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/[0.06] p-4">
      <div className="mb-3 flex items-center gap-2">
        <ClipboardList className="h-4 w-4 text-cyan-300" />
        <h2 className="text-sm font-semibold">Response Playbook</h2>
      </div>

      <p className="mb-3 text-xs text-slate-400">
        Suggested protocol for {topIncident.type} in {topIncident.location}.
      </p>

      <div className="space-y-2">
        {steps.map((step, index) => (
          <div
            key={step}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs"
          >
            <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[11px] text-cyan-300">
              {index + 1}
            </span>
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}