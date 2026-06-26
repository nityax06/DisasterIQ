"use client";

import { useEffect, useState } from "react";
import SeverityBadge from "./SeverityBadge";
import { calculatePriorityScore } from "../priority";
import { calculateAllocation } from "../allocation";
import { reliefCenters } from "../reliefCenters";
import { findShortestRoute } from "../routes";
import { supabase } from "../supabaseClient";
import { showToast } from "./ToastHost";
import {
  Filter,
  Search,
  X,
  Eye,
  Pencil,
  Trash2,
  Brain,
  Clock3,
  AlertTriangle,
} from "lucide-react";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

type IncidentTableProps = {
  incidents: Incident[];
  setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>;
};

const filters = ["All", "Critical", "High", "Medium", "Low"];
const statuses = ["Reported", "Investigating", "Responding", "Resolved"];

export default function IncidentTable({
  incidents,
  setIncidents,
}: IncidentTableProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [deleteIncident, setDeleteIncident] = useState<Incident | null>(null);
  const [incidentStatuses, setIncidentStatuses] = useState<Record<number, string>>({});

  const [editType, setEditType] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editSeverity, setEditSeverity] = useState("");
  const [editPopulation, setEditPopulation] = useState("");
  const [editCasualties, setEditCasualties] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("disasteriq-incident-statuses");
    if (saved) {
      setIncidentStatuses(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "disasteriq-incident-statuses",
      JSON.stringify(incidentStatuses)
    );
  }, [incidentStatuses]);

  function highlight(text: string) {
    if (!search.trim()) return text;

    const lower = text.toLowerCase();
    const query = search.toLowerCase();

    if (!lower.includes(query)) return text;

    const start = lower.indexOf(query);
    const end = start + query.length;

    return (
      <>
        {text.slice(0, start)}
        <span className="rounded bg-yellow-400/20 px-1 text-yellow-200">
          {text.slice(start, end)}
        </span>
        {text.slice(end)}
      </>
    );
  }

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSeverity =
      activeFilter === "All" ||
      incident.severity.toLowerCase() === activeFilter.toLowerCase();

    const matchesSearch =
      incident.type.toLowerCase().includes(search.toLowerCase()) ||
      incident.location.toLowerCase().includes(search.toLowerCase()) ||
      incident.severity.toLowerCase().includes(search.toLowerCase());

    return matchesSeverity && matchesSearch;
  });

  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    const scoreA = calculatePriorityScore(a.severity, a.population, a.casualties);
    const scoreB = calculatePriorityScore(b.severity, b.population, b.casualties);
    return scoreB - scoreA;
  });

  function getStatus(id: number) {
    return incidentStatuses[id] || "Reported";
  }

  function updateStatus(id: number, status: string) {
    setIncidentStatuses((previous) => ({
      ...previous,
      [id]: status,
    }));

    showToast(`Incident status changed to ${status}`);
  }

  function statusClass(status: string) {
    if (status === "Resolved") return "border-green-500/30 bg-green-500/10 text-green-300";
    if (status === "Responding") return "border-blue-500/30 bg-blue-500/10 text-blue-300";
    if (status === "Investigating") return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
    return "border-slate-500/30 bg-slate-500/10 text-slate-300";
  }

  function openEditModal(incident: Incident) {
    setEditingIncident(incident);
    setEditType(incident.type);
    setEditLocation(incident.location);
    setEditSeverity(incident.severity);
    setEditPopulation(incident.population.toString());
    setEditCasualties(incident.casualties.toString());
  }

  function closeEditModal() {
    setEditingIncident(null);
    setEditType("");
    setEditLocation("");
    setEditSeverity("");
    setEditPopulation("");
    setEditCasualties("");
  }

  async function handleSaveEdit() {
    if (!editingIncident) return;

    if (!editType || !editLocation || !editSeverity || !editPopulation || !editCasualties) {
      showToast("Please fill all fields");
      return;
    }

    const updatedIncident = {
      type: editType,
      location: editLocation,
      severity: editSeverity,
      population: Number(editPopulation),
      casualties: Number(editCasualties),
    };

    const { error } = await supabase
      .from("incidents")
      .update(updatedIncident)
      .eq("id", editingIncident.id);

    if (error) {
      showToast("Could not update incident");
      return;
    }

    setIncidents((previousIncidents) =>
      previousIncidents.map((item) =>
        item.id === editingIncident.id ? { ...item, ...updatedIncident } : item
      )
    );

    showToast("Incident updated successfully");
    closeEditModal();
  }

  async function confirmDelete() {
    if (!deleteIncident) return;

    const { error } = await supabase
      .from("incidents")
      .delete()
      .eq("id", deleteIncident.id);

    if (error) {
      showToast("Could not delete incident");
      return;
    }

    setIncidents((previousIncidents) =>
      previousIncidents.filter((item) => item.id !== deleteIncident.id)
    );

    if (selectedIncident?.id === deleteIncident.id) {
      setSelectedIncident(null);
    }

    showToast("Incident deleted");
    setDeleteIncident(null);
  }

  function getIncidentDetails(incident: Incident) {
    const score = calculatePriorityScore(
      incident.severity,
      incident.population,
      incident.casualties
    );

    const allocation = calculateAllocation(
      incident.severity,
      incident.population,
      incident.casualties
    );

    const center =
      reliefCenters.find((item) => item.capacity >= incident.population) ||
      reliefCenters[0];

    const route =
      incident.location === "Jaipur"
        ? findShortestRoute("Delhi Relief Center", "Jaipur")
        : incident.location === "Gurgaon"
        ? findShortestRoute("Delhi Relief Center", "Gurgaon")
        : {
            path: ["Nearest Relief Center", incident.location],
            distance: "Estimated",
          };

    return { score, allocation, center, route };
  }

  return (
    <>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.045]">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Incident Command Table</h2>
            <p className="text-xs text-slate-500">
              Search highlights matches, filters incidents, and saves workflow status.
            </p>
          </div>

          <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-slate-400">
            {sortedIncidents.length} shown
          </span>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2 transition focus-within:border-blue-500/40">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by type, location or severity..."
              className="w-full bg-transparent text-xs outline-none placeholder:text-slate-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />

            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-3 py-1 text-[11px] transition hover:-translate-y-0.5 ${
                  activeFilter === filter
                    ? "border-blue-500/40 bg-blue-500/10 text-blue-300"
                    : "border-white/10 bg-black/20 text-slate-400 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {sortedIncidents.length === 0 ? (
          <p className="rounded-lg border border-white/10 bg-black/20 p-4 text-xs text-slate-500">
            No incidents match this search or filter.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="min-w-[980px] w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-slate-400">
                <tr>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Location</th>
                  <th className="px-3 py-2 font-medium">Severity</th>
                  <th className="px-3 py-2 font-medium">Score</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Impact</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedIncidents.map((incident) => {
                  const score = calculatePriorityScore(
                    incident.severity,
                    incident.population,
                    incident.casualties
                  );

                  const status = getStatus(incident.id);

                  return (
                    <tr
                      key={incident.id}
                      className="border-t border-white/10 transition hover:bg-blue-500/[0.06]"
                    >
                      <td className="px-3 py-2 font-medium">{highlight(incident.type)}</td>
                      <td className="px-3 py-2 text-slate-300">
                        {highlight(incident.location)}
                      </td>
                      <td className="px-3 py-2">
                        <SeverityBadge severity={incident.severity} />
                      </td>
                      <td className="px-3 py-2 font-semibold text-white">
                        {score}
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={status}
                          onChange={(event) =>
                            updateStatus(incident.id, event.target.value)
                          }
                          className={`rounded-md border px-2 py-1 text-[11px] outline-none ${statusClass(status)}`}
                        >
                          {statuses.map((item) => (
                            <option key={item}>{item}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2 text-slate-400">
                        {incident.population} pop / {incident.casualties} cas.
                      </td>

                      <td className="px-3 py-2">
                        <button
                          onClick={() => setSelectedIncident(incident)}
                          className="mr-2 rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-[11px] font-medium text-cyan-300 transition hover:bg-cyan-500/20"
                        >
                          <Eye className="inline h-3 w-3" /> View
                        </button>

                        <button
                          onClick={() => openEditModal(incident)}
                          className="mr-2 rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-[11px] font-medium text-blue-300 transition hover:bg-blue-500/20"
                        >
                          <Pencil className="inline h-3 w-3" /> Edit
                        </button>

                        <button
                          onClick={() => setDeleteIncident(incident)}
                          className="rounded-md border border-red-500/20 bg-red-500/10 px-2 py-1 text-[11px] font-medium text-red-300 transition hover:bg-red-500/20"
                        >
                          <Trash2 className="inline h-3 w-3" /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedIncident && (
        <div className="fixed inset-0 z-[90] flex justify-end bg-black/40 backdrop-blur-sm">
          <div className="h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-[#0f172a] p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">Incident Detail</h2>
                <p className="text-xs text-slate-500">
                  Decision-support summary for selected incident.
                </p>
              </div>

              <button
                onClick={() => setSelectedIncident(null)}
                className="rounded-md border border-white/10 p-1 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {(() => {
              const { score, allocation, center, route } =
                getIncidentDetails(selectedIncident);

              return (
                <div className="space-y-4">
                  <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                    <p className="text-xs text-slate-500">Incident</p>
                    <p className="text-lg font-semibold">
                      {selectedIncident.type} · {selectedIncident.location}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <SeverityBadge severity={selectedIncident.severity} />
                      <span className={`rounded-full border px-2 py-0.5 text-[11px] ${statusClass(getStatus(selectedIncident.id))}`}>
                        {getStatus(selectedIncident.id)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
                      <p className="text-[11px] text-slate-400">Priority</p>
                      <p className="text-lg font-bold text-blue-300">{score}</p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                      <p className="text-[11px] text-slate-400">Population</p>
                      <p className="text-lg font-bold">
                        {selectedIncident.population}
                      </p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                      <p className="text-[11px] text-slate-400">Casualties</p>
                      <p className="text-lg font-bold">
                        {selectedIncident.casualties}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.06] p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-300" />
                      <h3 className="text-sm font-semibold">
                        AI Response Advisor
                      </h3>
                    </div>

                    <p className="text-xs leading-5 text-slate-300">
                      Prioritize {selectedIncident.location}. Dispatch{" "}
                      {allocation.volunteers} volunteers, allocate{" "}
                      {allocation.medicalKits} medical kits, prepare{" "}
                      {allocation.rescueBoats} rescue units, and coordinate with{" "}
                      {center.name}.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                    <h3 className="mb-3 text-sm font-semibold">
                      Response Package
                    </h3>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="rounded-lg border border-white/10 p-3">
                        Medical: {allocation.medicalKits}
                      </div>
                      <div className="rounded-lg border border-white/10 p-3">
                        Volunteers: {allocation.volunteers}
                      </div>
                      <div className="rounded-lg border border-white/10 p-3">
                        Boats: {allocation.rescueBoats}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                    <h3 className="mb-2 text-sm font-semibold">
                      Route + Relief
                    </h3>
                    <p className="text-xs text-slate-300">
                      Center: {center.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-300">
                      Route: {route.path.join(" → ")}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Distance: {route.distance} km
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-cyan-300" />
                      <h3 className="text-sm font-semibold">
                        Incident Timeline
                      </h3>
                    </div>

                    {[
                      "Incident reported",
                      "Priority calculated",
                      "Resources allocated",
                      "Volunteer teams assigned",
                      "Route checked",
                    ].map((event, index) => (
                      <div key={event} className="mb-3 flex gap-3 text-xs">
                        <div className="mt-1 h-2 w-2 rounded-full bg-cyan-400" />
                        <div>
                          <p>{event}</p>
                          <p className="text-[11px] text-slate-500">
                            T+{index + 1} min
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {editingIncident && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0f172a] p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">Edit Incident</h2>
                <p className="text-xs text-slate-500">
                  Update incident details and Supabase record.
                </p>
              </div>

              <button
                onClick={closeEditModal}
                className="rounded-md border border-white/10 p-1 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                value={editType}
                onChange={(event) => setEditType(event.target.value)}
                placeholder="Incident type"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white outline-none focus:border-blue-500/60"
              />

              <input
                value={editLocation}
                onChange={(event) => setEditLocation(event.target.value)}
                placeholder="Location"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white outline-none focus:border-blue-500/60"
              />

              <select
                value={editSeverity}
                onChange={(event) => setEditSeverity(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white outline-none focus:border-blue-500/60"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>

              <input
                value={editPopulation}
                onChange={(event) => setEditPopulation(event.target.value)}
                placeholder="Population affected"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white outline-none focus:border-blue-500/60"
              />

              <input
                value={editCasualties}
                onChange={(event) => setEditCasualties(event.target.value)}
                placeholder="Casualties"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white outline-none focus:border-blue-500/60"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={closeEditModal}
                className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveEdit}
                className="rounded-lg border border-blue-500/30 bg-blue-500/90 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-400"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteIncident && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-red-500/20 bg-[#0f172a] p-5 shadow-2xl">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-300" />
              <h2 className="text-sm font-semibold">Delete Incident?</h2>
            </div>

            <p className="text-xs leading-5 text-slate-400">
              This will permanently delete{" "}
              <span className="font-semibold text-white">
                {deleteIncident.type} · {deleteIncident.location}
              </span>{" "}
              from Supabase. This action cannot be undone.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDeleteIncident(null)}
                className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="rounded-lg border border-red-500/30 bg-red-500/90 px-3 py-2 text-xs font-semibold text-white hover:bg-red-400"
              >
                Delete Incident
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}