export function getRecommendations(
  severity: string
) {
  if (severity === "Critical") {
    return [
      "500 Medical Kits",
      "200 Volunteers",
      "12 Rescue Boats",
    ];
  }

  if (severity === "High") {
    return [
      "250 Medical Kits",
      "100 Volunteers",
    ];
  }

  if (severity === "Medium") {
    return [
      "50 Medical Kits",
      "25 Volunteers",
    ];
  }

  return ["Monitor Situation"];
}