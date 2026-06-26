"use client";

import { useState } from "react";
import { Wand2 } from "lucide-react";
import { calculatePriorityScore } from "../priority";
import { calculateAllocation } from "../allocation";

export default function WhatIfSimulator() {
  const [severity, setSeverity] = useState("High");
  const [population, setPopulation] = useState("8000");
  const [casualties, setCasualties] = useState("20");

  const score = calculatePriorityScore(
    severity,
    Number(population),
    Number(casualties)
  );

  const allocation = calculateAllocation(
    severity,
    Number(population),
    Number(casualties)
  );

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-4 flex items-center gap-2">
        <Wand2 className="h-4 w-4 text-purple-300" />
        <div>
          <h2 className="text-sm font-semibold">What-If Simulator</h2>
          <p className="text-xs text-slate-500">
            Simulate priority and resource allocation before reporting.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>

        <input
          value={population}
          onChange={(e) => setPopulation(e.target.value)}
          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs"
          placeholder="Population"
        />

        <input
          value={casualties}
          onChange={(e) => setCasualties(e.target.value)}
          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs"
          placeholder="Casualties"
        />
      </div>

      <div className="mt-4 grid grid-cols-4 gap-3 text-xs">
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
          <p className="text-slate-400">Priority</p>
          <p className="text-lg font-bold text-blue-300">{score}</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/30 p-3">
          <p className="text-slate-400">Medical</p>
          <p className="text-lg font-bold">{allocation.medicalKits}</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/30 p-3">
          <p className="text-slate-400">Volunteers</p>
          <p className="text-lg font-bold">{allocation.volunteers}</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/30 p-3">
          <p className="text-slate-400">Boats</p>
          <p className="text-lg font-bold">{allocation.rescueBoats}</p>
        </div>
      </div>
    </div>
  );
}