import {
  volunteerTeams,
  assignVolunteerTeams,
} from "../volunteers";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

type VolunteerPanelProps = {
  incidents: Incident[];
};

export default function VolunteerPanel({
  incidents,
}: VolunteerPanelProps) {
  if (incidents.length === 0) {
    return (
      <div className="mt-10 bg-slate-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">
          Volunteer Deployment
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

  const requiredVolunteers = Math.max(
    10,
    Math.round(
      highestPriorityIncident.population * 0.02 +
      highestPriorityIncident.casualties * 5
    )
  );

  const assignedTeams =
    assignVolunteerTeams(requiredVolunteers);

  return (
    <div className="mt-10 bg-slate-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">
        Volunteer Deployment
      </h2>

      <p className="text-slate-400 mb-2">
        Incident
      </p>

      <p className="text-xl font-bold mb-4">
        {highestPriorityIncident.type} -
        {" "}
        {highestPriorityIncident.location}
      </p>

      <p className="mb-4">
        Required Volunteers:
        {" "}
        <span className="font-bold">
          {requiredVolunteers}
        </span>
      </p>

      <table className="w-full text-left">
        <thead>
          <tr className="text-slate-400 border-b border-slate-700">
            <th className="pb-3">Assigned Team</th>
            <th className="pb-3">Members</th>
          </tr>
        </thead>

        <tbody>
          {assignedTeams.map((team) => (
            <tr
              key={team.id}
              className="border-b border-slate-700"
            >
              <td className="py-3">
                {team.name}
              </td>

              <td className="py-3">
                {team.members}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}