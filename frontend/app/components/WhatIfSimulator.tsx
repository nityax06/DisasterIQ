"use client";

import { useState } from "react";
import { X, Wand2 } from "lucide-react";
import { calculatePriorityScore } from "../priority";
import { calculateAllocation } from "../allocation";

export default function WhatIfSimulator() {
  const [open, setOpen] = useState(false);
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
    <>
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.06] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.05]">
        <div className="mb-3 flex items-center gap-2">
          <Wand2 className="h-4 w-4 text-purple-300" />
          <h2 className="text-sm font-semibold">What-If Simulator</h2>
        </div>

        <p className="mb-4 text-xs text-slate-500">
          Open a slide-out simulator to test disaster scenarios without saving
          to Supabase.
        </p>

        <button
          onClick={() => setOpen(true)}
          className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-xs text-purple-300 transition hover:bg-purple-500/20"
        >
          Launch Simulator
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[120] flex justify-end bg-black/50 backdrop-blur-sm">
          <div className="h-full w-full max-w-md border-l border-white/10 bg-[#0f172a] p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">What-If Simulator</h2>
                <p className="text-xs text-slate-500">
                  Simulate priority and resource allocation.
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-md border border-white/10 p-1 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <select
                value={severity}
                onChange={(event) => setSeverity(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>

              <input
                value={population}
                onChange={(event) => setPopulation(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs"
                placeholder="Population"
              />

              <input
                value={casualties}
                onChange={(event) => setCasualties(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs"
                placeholder="Casualties"
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
                <p className="text-slate-400">Priority Score</p>
                <p className="mt-2 text-2xl font-bold text-blue-300">
                  {score}
                </p>
              </div>

              <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-4">
                <p className="text-slate-400">Risk Mode</p>
                <p className="mt-2 text-2xl font-bold text-purple-300">
                  {severity}
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-black/30 p-4">
                <p className="text-slate-400">Medical Kits</p>
                <p className="mt-2 text-xl font-bold">
                  {allocation.medicalKits}
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-black/30 p-4">
                <p className="text-slate-400">Volunteers</p>
                <p className="mt-2 text-xl font-bold">
                  {allocation.volunteers}
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-black/30 p-4">
                <p className="text-slate-400">Rescue Boats</p>
                <p className="mt-2 text-xl font-bold">
                  {allocation.rescueBoats}
                </p>
              </div>

              <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
                <p className="text-slate-400">Suggested ETA</p>
                <p className="mt-2 text-xl font-bold text-green-300">
                  30–45m
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}