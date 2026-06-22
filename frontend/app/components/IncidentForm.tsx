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
    <div className="mt-10 bg-slate-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Report New Incident</h2>

      <div className="grid grid-cols-2 gap-4">
        <input
          className="bg-slate-900 p-3 rounded"
          placeholder="Incident Type"
          value={type}
          onChange={(event) => setType(event.target.value)}
        />

        <input
          className="bg-slate-900 p-3 rounded"
          placeholder="Location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />

        <select
          className="bg-slate-900 p-3 rounded"
          value={severity}
          onChange={(event) => setSeverity(event.target.value)}
        >
          <option value="">Select Severity</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>

        <input
          className="bg-slate-900 p-3 rounded"
          placeholder="Population Affected"
          value={population}
          onChange={(event) => setPopulation(event.target.value)}
        />

        <input
          className="bg-slate-900 p-3 rounded"
          placeholder="Casualties"
          value={casualties}
          onChange={(event) => setCasualties(event.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 rounded p-3 font-bold"
        >
          Submit Incident
        </button>
      </div>
    </div>
  );
}