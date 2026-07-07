export function calculatePriorityScore(
  severity: string,
  population: number,
  casualties: number
) {
  let severityScore = 0;

  if (severity === "Low") severityScore = 20;
  if (severity === "Medium") severityScore = 40;
  if (severity === "High") severityScore = 70;
  if (severity === "Critical") severityScore = 90;

  const populationScore = Math.min(population / 500, 30);
  const casualtyScore = Math.min(casualties * 2, 40);

  return Math.round(severityScore + populationScore + casualtyScore);
}