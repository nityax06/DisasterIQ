"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

type IncidentChartProps = {
  incidents: Incident[];
};

export default function IncidentChart({
  incidents,
}: IncidentChartProps) {
  const severityCounts = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0,
  };

  incidents.forEach((incident) => {
    const level =
      incident.severity.charAt(0).toUpperCase() +
      incident.severity.slice(1).toLowerCase();

    if (level in severityCounts) {
      severityCounts[level as keyof typeof severityCounts]++;
    }
  });

  const data = [
    {
      name: "Critical",
      value: severityCounts.Critical,
    },
    {
      name: "High",
      value: severityCounts.High,
    },
    {
      name: "Medium",
      value: severityCounts.Medium,
    },
    {
      name: "Low",
      value: severityCounts.Low,
    },
  ];

  const colors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3">
        <h2 className="text-sm font-semibold">
          Incident Severity Distribution
        </h2>

        <p className="text-xs text-slate-500">
          Live breakdown of reported incidents.
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={90}
              innerRadius={50}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={colors[index]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}