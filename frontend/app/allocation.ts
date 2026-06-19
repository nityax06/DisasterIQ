export function calculateAllocation(
  severity: string,
  population: number,
  casualties: number
) {
  const severityMultiplier = {
    Low: 1,
    Medium: 2,
    High: 3,
    Critical: 5,
  };

  const multiplier =
    severityMultiplier[
      severity as keyof typeof severityMultiplier
    ] || 1;

  return {
    medicalKits:
      Math.round(population * 0.05) +
      casualties * 10 * multiplier,

    volunteers:
      Math.round(population * 0.02) +
      casualties * multiplier,

    rescueBoats:
      Math.max(
        1,
        Math.round(population / 2000) * multiplier
      ),
  };
}