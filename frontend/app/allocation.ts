export function calculateAllocation(
  severity: string,
  population: number,
  casualties: number
) {
  const severityMultiplier = {
    Low: 1,
    Medium: 1.5,
    High: 2,
    Critical: 3,
  };

  const multiplier =
    severityMultiplier[
      severity as keyof typeof severityMultiplier
    ] || 1;

  return {
    medicalKits: Math.round(
      population / 100 + casualties * 2 * multiplier
    ),

    volunteers: Math.round(
      population / 250 + casualties * multiplier
    ),

    rescueBoats: Math.max(
      1,
      Math.round((population / 10000) * multiplier)
    ),
  };
}