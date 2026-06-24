"use client";

import { useState } from "react";
import { supabase } from "../supabaseClient";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

type IncidentFormProps = {
  incidents: Incident[];
  setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>;
};

const inputClass =
  "rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500/60 focus:bg-black/50";

export default function IncidentForm({
  incidents,
  setIncidents,
}: IncidentFormProps) {
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [severity, setSeverity] = useState("");
  const [population, setPopulation] = useState("");
  const [casualties, setCasualties] = useState("");

  async function handleSubmit() {
    if (!type || !location || !severity || !population || !casualties) {
      alert("Please fill all fields before submitting.");
      return;
    }

    const newIncident = {
      type,
      location,
      severity,
      population: Number(population),
      casualties: Number(casualties),
    };

    const { data, error } = await supabase
      .from("incidents")
      .insert([newIncident])
      .select();

    if (error) {
      console.error("Error adding incident:", error);
      alert("Could not save incident to database.");
      return;
    }

    if (data) {
      setIncidents([...incidents, data[0]]);
    }

    setType("");
    setLocation("");
    setSeverity("");
    setPopulation("");
    setCasualties("");
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Report New Incident</h2>
          <p className="text-xs text-slate-500">
            Create a live disaster record in Supabase.
          </p>
        </div>

        <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-[11px] text-blue-300">
          Database Write
        </span>
      </div>

      <div className="grid grid-cols-6 gap-3">
        <input
          className={inputClass}
          placeholder="Type"
          value={type}
          onChange={(event) => setType(event.target.value)}
        />

        <input
          className={inputClass}
          placeholder="Location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />

        <select
          className={inputClass}
          value={severity}
          onChange={(event) => setSeverity(event.target.value)}
        >
          <option value="">Severity</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>

        <input
          className={inputClass}
          placeholder="Population"
          value={population}
          onChange={(event) => setPopulation(event.target.value)}
        />

        <input
          className={inputClass}
          placeholder="Casualties"
          value={casualties}
          onChange={(event) => setCasualties(event.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="rounded-lg border border-blue-400/30 bg-blue-500/90 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-400 hover:shadow-lg hover:shadow-blue-500/20"
          title="Save this incident to Supabase"
        >
          Submit
        </button>
      </div>
    </div>
  );
}