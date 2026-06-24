import { resources } from "../resources";

export default function ResourcePanel() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Resource Summary</h2>
          <p className="text-xs text-slate-500">
            Live comparison between available and required resources.
          </p>
        </div>

        <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-slate-400">
          {resources.length} resource types
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/[0.03] text-slate-400">
            <tr>
              <th className="px-3 py-2 font-medium">Resource</th>
              <th className="px-3 py-2 font-medium">Available</th>
              <th className="px-3 py-2 font-medium">Required</th>
              <th className="px-3 py-2 font-medium">Gap</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {resources.map((resource) => {
              const gap = resource.required - resource.available;
              const shortage = gap > 0;

              return (
                <tr
                  key={resource.id}
                  className="border-t border-white/10 transition hover:bg-white/[0.04]"
                  title={`${resource.name}: ${shortage ? "Shortage" : "Sufficient"}`}
                >
                  <td className="px-3 py-2 font-medium">
                    {resource.name}
                  </td>

                  <td className="px-3 py-2 text-slate-300">
                    {resource.available}
                  </td>

                  <td className="px-3 py-2 text-slate-300">
                    {resource.required}
                  </td>

                  <td
                    className={`px-3 py-2 font-semibold ${
                      shortage ? "text-red-300" : "text-green-300"
                    }`}
                  >
                    {gap}
                  </td>

                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] ${
                        shortage
                          ? "border-red-500/30 bg-red-500/10 text-red-300"
                          : "border-green-500/30 bg-green-500/10 text-green-300"
                      }`}
                    >
                      {shortage ? "Shortage" : "Stable"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}