import { GitBranch } from "lucide-react";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
};

export default function StatusWorkflowBoard({ incidents }: { incidents: Incident[] }) {
  const columns = [
    {
      title: "Reported",
      items: incidents.slice(0, 2),
    },
    {
      title: "Investigating",
      items: incidents.slice(2, 3),
    },
    {
      title: "Responding",
      items: incidents.slice(3, 4),
    },
    {
      title: "Resolved",
      items: incidents.slice(4, 5),
    },
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center gap-2">
        <GitBranch className="h-4 w-4 text-blue-300" />
        <h2 className="text-sm font-semibold">Incident Workflow</h2>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {columns.map((column) => (
          <div key={column.title} className="rounded-lg border border-white/10 bg-black/30 p-3">
            <p className="mb-2 text-xs font-semibold text-slate-300">{column.title}</p>

            <div className="space-y-2">
              {column.items.length === 0 ? (
                <p className="text-[11px] text-slate-600">No incidents</p>
              ) : (
                column.items.map((incident) => (
                  <div
                    key={incident.id}
                    className="rounded-md border border-white/10 bg-white/[0.03] p-2 text-[11px]"
                  >
                    <p>{incident.type}</p>
                    <p className="text-slate-500">{incident.location}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}