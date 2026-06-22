import { findShortestRoute } from "../routes";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

type RoutePanelProps = {
  incidents: Incident[];
};

export default function RoutePanel({
  incidents,
}: RoutePanelProps) {
  if (incidents.length === 0) {
    return (
      <div className="mt-10 bg-slate-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">
          Route Optimization
        </h2>

        <p className="text-slate-400">
          No active incidents.
        </p>
      </div>
    );
  }

  const highestPriorityIncident = [...incidents].sort(
    (a, b) => b.casualties - a.casualties
  )[0];

  const destination =
    highestPriorityIncident.location;

  let route;

  if (destination === "Jaipur") {
    route = findShortestRoute(
      "Delhi Relief Center",
      "Jaipur"
    );
  } else if (destination === "Gurgaon") {
    route = findShortestRoute(
      "Delhi Relief Center",
      "Gurgaon"
    );
  } else {
    route = {
      path: ["Delhi Relief Center", destination],
      distance: "Unknown",
    };
  }

  return (
    <div className="mt-10 bg-slate-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">
        Route Optimization
      </h2>

      <p className="text-slate-400 mb-2">
        Destination
      </p>

      <p className="text-xl font-bold mb-4">
        {destination}
      </p>

      <p className="text-slate-400 mb-2">
        Optimized Route
      </p>

      <p className="text-xl font-bold mb-4">
        {route.path.join(" → ")}
      </p>

      <p>
        Total Distance:
        {" "}
        <span className="font-bold">
          {route.distance}
          {" "}
          km
        </span>
      </p>
    </div>
  );
}