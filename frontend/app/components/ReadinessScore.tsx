import { ShieldCheck } from "lucide-react";

export default function ReadinessScore() {
  const score = 84;

  const checks = [
    "Relief centers available",
    "Volunteer teams online",
    "Resource engine active",
    "Route planner ready",
  ];

  return (
    <div className="rounded-xl border border-green-500/20 bg-green-500/[0.06] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.05]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-green-300" />
          <h2 className="text-sm font-semibold">Emergency Readiness</h2>
        </div>

        <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[11px] text-green-300">
          Ready
        </span>
      </div>

      <div className="grid grid-cols-[110px_1fr] gap-4">
        <div>
          <p className="text-4xl font-bold text-green-300">{score}%</p>

          <div className="mt-3 h-2 rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-green-400"
              style={{ width: `${score}%` }}
            />
          </div>

          <p className="mt-2 text-[11px] text-slate-500">
            Overall operational capacity.
          </p>
        </div>

        <div className="space-y-2">
          {checks.map((check) => (
            <div
              key={check}
              className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-[11px] transition hover:border-green-500/30 hover:text-green-300"
            >
              ✓ {check}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}