"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { resources } from "../resources";

export default function ResourceChart() {
  const data = resources.map((resource) => ({
    name: resource.name,
    available: resource.available,
    required: resource.required,
  }));

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3">
        <h2 className="text-sm font-semibold">Resource Availability</h2>
        <p className="text-xs text-slate-500">
          Available vs required emergency supplies.
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={90}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <Tooltip />

            <Bar dataKey="required" fill="#334155" radius={[4, 4, 4, 4]} />
            <Bar dataKey="available" fill="#3b82f6" radius={[4, 4, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}