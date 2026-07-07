"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { AlertTriangle, Activity } from "lucide-react";
import IncidentDetailDrawer from "./IncidentDetailDrawer";
import { calculatePriorityScore } from "../priority";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

type Cluster = {
  id: string;
  coordinates: [number, number];
  incidents: Incident[];
};

type GeoItem = {
  rsmKey: string;
  properties: { name?: string };
};

const cityCoordinates: Record<string, [number, number]> = {
  Chandigarh: [76.7794, 30.7333],
  Delhi: [77.1025, 28.7041],
  Gurgaon: [77.0266, 28.4595],
  Jaipur: [75.7873, 26.9124],
  Pune: [73.8567, 18.5204],
  Chennai: [80.2707, 13.0827],
  Bhubaneshwar: [85.8245, 20.2961],
  Guwahati: [91.7362, 26.1445],
};

function severityColor(severity: string) {
  const value = severity.toLowerCase();

  if (value === "critical") {
    return {
      pin: "#f87171",
      bg: "rgba(239,68,68,0.22)",
      border: "rgba(248,113,113,0.45)",
      label: "#fca5a5",
    };
  }

  if (value === "high") {
    return {
      pin: "#fb923c",
      bg: "rgba(249,115,22,0.22)",
      border: "rgba(251,146,60,0.45)",
      label: "#fdba74",
    };
  }

  if (value === "medium") {
    return {
      pin: "#facc15",
      bg: "rgba(234,179,8,0.22)",
      border: "rgba(250,204,21,0.45)",
      label: "#fde047",
    };
  }

  return {
    pin: "#4ade80",
    bg: "rgba(34,197,94,0.22)",
    border: "rgba(74,222,128,0.45)",
    label: "#86efac",
  };
}

function distance(a: [number, number], b: [number, number]) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
}

function buildClusters(incidents: Incident[]) {
  const clusters: Cluster[] = [];

  incidents.forEach((incident) => {
    const coords = cityCoordinates[incident.location];
    if (!coords) return;

    const nearby = clusters.find((cluster) => distance(cluster.coordinates, coords) < 0.85);

    if (nearby) {
      nearby.incidents.push(incident);
      const total = nearby.incidents.length;
      nearby.coordinates = [
        (nearby.coordinates[0] * (total - 1) + coords[0]) / total,
        (nearby.coordinates[1] * (total - 1) + coords[1]) / total,
      ];
    } else {
      clusters.push({
        id: `${incident.location}-${incident.id}`,
        coordinates: coords,
        incidents: [incident],
      });
    }
  });

  return clusters;
}

function clusterSeverity(incidents: Incident[]) {
  const order = ["critical", "high", "medium", "low"];
  return (
    order.find((severity) =>
      incidents.some((incident) => incident.severity.toLowerCase() === severity)
    ) || "low"
  );
}

export default function IncidentMap({ incidents }: { incidents: Incident[] }) {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [statusMap, setStatusMap] = useState<Record<number, string>>({});
  const [hoveredCluster, setHoveredCluster] = useState<Cluster | null>(null);

  const clusters = useMemo(() => buildClusters(incidents), [incidents]);

  function loadStatuses() {
    const saved = localStorage.getItem("disasteriq-incident-statuses");
    setStatusMap(saved ? JSON.parse(saved) : {});
  }

  useEffect(() => {
    loadStatuses();
    window.addEventListener("disasteriq-status-update", loadStatuses);
    return () => window.removeEventListener("disasteriq-status-update", loadStatuses);
  }, []);

  function getStatus(id: number) {
    return statusMap[id] || "Reported";
  }

  function resolveIncident(id: number) {
    const updated = { ...statusMap, [id]: "Resolved" };
    setStatusMap(updated);
    localStorage.setItem("disasteriq-incident-statuses", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("disasteriq-status-update"));
  }

  const criticalCount = incidents.filter(
    (item) => item.severity.toLowerCase() === "critical"
  ).length;

  const totalPopulation = incidents.reduce((sum, item) => sum + item.population, 0);

  return (
    <>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Interactive India Incident Map</h2>
            <p className="text-xs text-slate-500">
              Accurate India map with clustering and clickable incident markers.
            </p>
          </div>

          <div className="flex gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-slate-300">
              {incidents.length} incidents
            </span>
            <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[11px] text-red-300">
              {criticalCount} critical
            </span>
          </div>
        </div>

        <div className="relative overflow-visible rounded-xl border border-white/10 bg-[#020617]">
          <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08),transparent_58%)]" />
          <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.11] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:30px_30px]" />

          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ center: [82.5, 21.5], scale: 1150 }}
            style={{ width: "100%", height: "560px", position: "relative", zIndex: 10, overflow: "visible" }}
          >
            <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
              {({ geographies }: { geographies: GeoItem[] }) =>
                geographies
                  .filter((geo) => geo.properties.name === "India")
                  .map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#1e3a2f"
                      stroke="#9ca3af"
                      strokeWidth={0.45}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#264d3b", outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
              }
            </Geographies>

            {clusters.map((cluster) => {
              const severity = clusterSeverity(cluster.incidents);
              const colors = severityColor(severity);
              const isCritical = severity === "critical";
              const isCluster = cluster.incidents.length > 1;
              const topIncident = [...cluster.incidents].sort(
                (a, b) =>
                  calculatePriorityScore(b.severity, b.population, b.casualties) -
                  calculatePriorityScore(a.severity, a.population, a.casualties)
              )[0];

              return (
                <Marker key={cluster.id} coordinates={cluster.coordinates}>
                  <g
                    style={{ cursor: "pointer", pointerEvents: "all" }}
                    onMouseEnter={() => setHoveredCluster(cluster)}
                    onMouseLeave={() => setHoveredCluster(null)}
                    onClick={() => setSelectedIncident(topIncident)}
                  >
                    {isCritical && (
                      <circle r={14} fill={colors.bg} opacity={0.7} pointerEvents="none">
                        <animate attributeName="r" from="10" to="24" dur="1.4s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.7" to="0" dur="1.4s" repeatCount="indefinite" />
                      </circle>
                    )}

                    <circle r={isCluster ? 16 : 14} fill={colors.bg} pointerEvents="none" />
                    <circle
                      r={isCluster ? 11 : 8}
                      fill={colors.pin}
                      stroke="white"
                      strokeWidth={1.5}
                      style={{ pointerEvents: "all" }}
                    />
                    <circle r={28} fill="rgba(255,255,255,0.001)" style={{ pointerEvents: "all" }} />

                    {isCluster && (
                      <text
                        x={0}
                        y={3.5}
                        textAnchor="middle"
                        fontSize={9}
                        fill="black"
                        fontWeight={800}
                        pointerEvents="none"
                      >
                        {cluster.incidents.length}
                      </text>
                    )}

                    {hoveredCluster?.id === cluster.id && (
                      <foreignObject x={-120} y={-150} width={245} height={140} pointerEvents="none">
                        <div className="rounded-xl border border-white/10 bg-[#0f172a]/95 p-3 text-left shadow-2xl backdrop-blur">
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-bold text-white">
                              {isCluster ? `${cluster.incidents.length} Incident Cluster` : topIncident.location}
                            </p>
                            <span
                              className="rounded-full border px-2 py-0.5 text-[10px] capitalize"
                              style={{ borderColor: colors.border, backgroundColor: colors.bg, color: colors.label }}
                            >
                              {severity}
                            </span>
                          </div>

                          <div className="space-y-1 text-[11px] text-slate-400">
                            {cluster.incidents.slice(0, 3).map((incident) => (
                              <p key={incident.id} className="truncate">
                                {incident.location} · {incident.type} · Priority {calculatePriorityScore(incident.severity, incident.population, incident.casualties)}
                              </p>
                            ))}
                            <p className="pt-1 text-slate-500">Click to open highest-priority incident.</p>
                            <p className="text-slate-500">Status: {getStatus(topIncident.id)}</p>
                          </div>
                        </div>
                      </foreignObject>
                    )}
                  </g>
                </Marker>
              );
            })}
          </ComposableMap>

          <div className="pointer-events-none absolute left-4 top-4 z-40 rounded-xl border border-white/10 bg-black/60 p-3 text-[11px] text-slate-400 backdrop-blur">
            <p className="mb-2 font-semibold text-slate-200">Severity</p>
            <p><span className="text-red-400">●</span> Critical</p>
            <p><span className="text-orange-400">●</span> High</p>
            <p><span className="text-yellow-400">●</span> Medium</p>
            <p><span className="text-green-400">●</span> Low</p>
          </div>

          <div className="pointer-events-none absolute bottom-4 left-4 z-40 rounded-xl border border-white/10 bg-black/60 p-3 text-[11px] text-slate-400 backdrop-blur">
            <p className="mb-2 font-semibold text-slate-200">Map Stats</p>
            <p>{incidents.length} total incidents</p>
            <p>{clusters.length} active markers/clusters</p>
            <p>{totalPopulation} affected population</p>
          </div>

          <div className="pointer-events-none absolute right-4 top-4 z-40 rounded-xl border border-white/10 bg-black/60 p-3 text-[11px] text-slate-400 backdrop-blur">
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-red-300" />
              <span className="text-slate-200">Hotspots</span>
            </div>
            {[...incidents]
              .sort(
                (a, b) =>
                  calculatePriorityScore(b.severity, b.population, b.casualties) -
                  calculatePriorityScore(a.severity, a.population, a.casualties)
              )
              .slice(0, 3)
              .map((incident) => (
                <p key={incident.id}>
                  {incident.location} · {calculatePriorityScore(incident.severity, incident.population, incident.casualties)}
                </p>
              ))}
          </div>

          <div className="pointer-events-none absolute bottom-4 right-4 z-40 rounded-xl border border-white/10 bg-black/60 p-3 text-[11px] text-slate-400 backdrop-blur">
            <div className="mb-2 flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-green-300" />
              <span className="text-slate-200">Live Map</span>
            </div>
            <p>Clusters nearby incidents automatically.</p>
            <p>Critical pins pulse automatically.</p>
          </div>
        </div>
      </div>

      <IncidentDetailDrawer
        incident={selectedIncident}
        status={selectedIncident ? getStatus(selectedIncident.id) : "Reported"}
        onResolve={resolveIncident}
        onClose={() => setSelectedIncident(null)}
      />
    </>
  );
}
