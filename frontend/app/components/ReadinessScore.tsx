export default function ReadinessScore() {
  const score = 84;

  return (
    <div className="rounded-xl border border-green-500/20 bg-green-500/[0.06] p-4">
      <p className="text-xs text-slate-400">Emergency Readiness</p>

      <p className="mt-2 text-3xl font-bold text-green-300">
        {score}%
      </p>

      <div className="mt-3 h-2 rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-green-400"
          style={{ width: `${score}%` }}
        />
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Based on resources, volunteers, and relief-center availability.
      </p>
    </div>
  );
}