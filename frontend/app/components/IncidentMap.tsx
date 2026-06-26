import { MapPin } from "lucide-react";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
};

const positions: Record<string, string> = {
  Delhi: "left-[43%] top-[30%]",
  Jaipur: "left-[34%] top-[38%]",
  Chennai: "left-[52%] top-[82%]",
  Pune: "left-[38%] top-[63%]",
  Bhubaneshwar: "left-[62%] top-[58%]",
  Guwahati: "left-[78%] top-[36%]",
  Gurgaon: "left-[41%] top-[33%]",
};

function markerColor(severity: string) {
  if (severity.toLowerCase() === "critical") return "text-red-400";
  if (severity.toLowerCase() === "high") return "text-orange-400";
  if (severity.toLowerCase() === "medium") return "text-yellow-400";
  return "text-green-400";
}

export default function IncidentMap({ incidents }: { incidents: Incident[] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <h2 className="text-sm font-semibold">Incident Map</h2>
      <p className="text-xs text-slate-500">Approximate incident locations across India.</p>

      <div className="relative mt-4 h-72 rounded-xl border border-white/10 bg-black/30 overflow-hidden">
        <div className="absolute inset-6 rounded-[45%] border border-slate-700 bg-slate-900/80" />

        {incidents.map((incident) => (
          <div
            key={incident.id}
            className={`absolute ${positions[incident.location] || "left-1/2 top-1/2"} group`}
          >
            <MapPin className={`h-5 w-5 ${markerColor(incident.severity)} animate-pulse`} />

            <div className="absolute left-5 top-0 hidden w-40 rounded-lg border border-white/10 bg-[#0f172a] p-2 text-[11px] shadow-xl group-hover:block">
              <p className="font-semibold">{incident.type}</p>
              <p className="text-slate-400">{incident.location}</p>
              <p className={markerColor(incident.severity)}>{incident.severity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}