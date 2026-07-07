"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

import { resources } from "../resources";

export default function ResourceChart() {
  const data = resources.map((resource) => {
    const gap = resource.required - resource.available;
    const utilization = Math.min(
      100,
      Math.round((resource.available / resource.required) * 100)
    );

    return {
      name: resource.name,
      available: resource.available,
      required: resource.required,
      gap,
      utilization,
    };
  });

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.05]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Resource Availability</h2>
          <p className="text-xs text-slate-500">
            Available vs required emergency supplies with shortage priority.
          </p>
        </div>

        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-slate-400">
          live stock
        </span>
      </div>

      <div className="mb-3 grid grid-cols-4 gap-2 text-[11px]">
        {data.map((item) => (
          <div
            key={item.name}
            className="rounded-lg border border-white/10 bg-black/30 p-2 transition hover:border-white/30 hover:bg-white/[0.05]"
          >
            <p className="truncate text-slate-500">{item.name}</p>
            <p
              className={`mt-1 font-semibold ${
                item.gap > 0 ? "text-red-300" : "text-green-300"
              }`}
            >
              {item.gap > 0 ? `${item.gap} short` : "stable"}
            </p>
          </div>
        ))}
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Legend />
            <Bar dataKey="required" name="Required" radius={[4, 4, 4, 4]}>
              {data.map((entry) => (
                <Cell key={`required-${entry.name}`} fill="#334155" />
              ))}
            </Bar>
            <Bar dataKey="available" name="Available" radius={[4, 4, 4, 4]}>
              {data.map((entry) => (
                <Cell
                  key={`available-${entry.name}`}
                  fill={entry.gap > 0 ? "#ef4444" : "#22c55e"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}