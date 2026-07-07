type Graph = {
  [key: string]: { node: string; distance: number }[];
};

const graph: Graph = {
  "Delhi Relief Center": [
    { node: "Gurgaon", distance: 28 },
    { node: "Jaipur", distance: 270 },
  ],
  Gurgaon: [
    { node: "Delhi Relief Center", distance: 28 },
    { node: "Jaipur", distance: 240 },
  ],
  Jaipur: [
    { node: "Delhi Relief Center", distance: 270 },
    { node: "Gurgaon", distance: 240 },
    { node: "Chennai", distance: 2100 },
  ],
  Chennai: [
    { node: "Jaipur", distance: 2100 },
  ],
};

export function findShortestRoute(start: string, end: string) {
  const distances: { [key: string]: number } = {};
  const previous: { [key: string]: string | null } = {};
  const unvisited = new Set(Object.keys(graph));

  for (const node of unvisited) {
    distances[node] = Infinity;
    previous[node] = null;
  }

  distances[start] = 0;

  while (unvisited.size > 0) {
    const current = [...unvisited].reduce((a, b) =>
      distances[a] < distances[b] ? a : b
    );

    if (current === end) break;

    unvisited.delete(current);

    for (const neighbor of graph[current] || []) {
      const newDistance =
        distances[current] + neighbor.distance;

      if (newDistance < distances[neighbor.node]) {
        distances[neighbor.node] = newDistance;
        previous[neighbor.node] = current;
      }
    }
  }

  const path = [];
  let current: string | null = end;

  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  return {
    path,
    distance: distances[end],
  };
}