import { findShortestRoute } from "../routes";

export default function RoutePanel() {
  const route = findShortestRoute(
    "Delhi Relief Center",
    "Jaipur"
  );

  return (
    <div className="mt-10 bg-slate-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Route Optimization</h2>

      <p className="text-slate-400 mb-2">Optimized Route</p>

      <p className="text-xl font-bold mb-4">
        {route.path.join(" → ")}
      </p>

      <p>
        Total Distance:{" "}
        <span className="font-bold">{route.distance} km</span>
      </p>
    </div>
  );
}