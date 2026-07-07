export default function SystemMetrics() {
  const metrics = [
    {
      name: "Response Efficiency",
      value: 92,
      color: "bg-green-500",
    },
    {
      name: "Volunteer Capacity",
      value: 65,
      color: "bg-blue-500",
    },
    {
      name: "Resource Utilization",
      value: 78,
      color: "bg-purple-500",
    },
    {
      name: "System Readiness",
      value: 96,
      color: "bg-cyan-500",
    },
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-4">
        <h2 className="text-sm font-semibold">System Metrics</h2>
        <p className="text-xs text-slate-500">
          Simulated operational readiness indicators.
        </p>
      </div>

      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.name}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-slate-300">{metric.name}</span>
              <span className="text-slate-400">{metric.value}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-2 rounded-full ${metric.color} transition-all duration-700`}
                style={{
                  width: `${metric.value}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}