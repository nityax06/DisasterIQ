export const volunteerTeams = [
  {
    id: 1,
    name: "Team Alpha",
    members: 25,
  },
  {
    id: 2,
    name: "Team Bravo",
    members: 18,
  },
  {
    id: 3,
    name: "Team Charlie",
    members: 32,
  },
  {
    id: 4,
    name: "Team Delta",
    members: 15,
  },
];

export function assignVolunteerTeams(
  requiredVolunteers: number
) {
  const assignedTeams = [];

  let remaining = requiredVolunteers;

  for (const team of volunteerTeams) {
    if (remaining <= 0) break;

    assignedTeams.push(team);

    remaining -= team.members;
  }

  return assignedTeams;
}