"use client";
import { useState } from "react";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

type IncidentFormProps = {
  setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>;
};

export default function IncidentForm({ setIncidents }: IncidentFormProps) {
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [severity, setSeverity] = useState("");
  const [population, setPopulation] = useState("");
  const [casualties, setCasualties] = useState("");
function handleSubmit() {
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

  setIncidents((previousIncidents) => [
    ...previousIncidents,
    {
      id: Date.now(),
      ...newIncident,
    },
  ]);

  console.log(newIncident);
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

      <div className="mt-4 text-slate-400">
        <p>Type: {type}</p>
        <p>Location: {location}</p>
        <p>Severity: {severity}</p>
        <p>Population: {population}</p>
        <p>Casualties: {casualties}</p>
        </div>
    </div>
  );
}