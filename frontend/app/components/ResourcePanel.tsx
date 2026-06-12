import { resources } from "../resources";

export default function ResourcePanel() {
  return (
    <div className="mt-10 bg-slate-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">
        Resource Summary
      </h2>

      <table className="w-full text-left">
        <thead>
          <tr className="text-slate-400 border-b border-slate-700">
            <th className="pb-3">Resource</th>
            <th className="pb-3">Available</th>
            <th className="pb-3">Required</th>
            <th className="pb-3">Gap</th>
          </tr>
        </thead>

        <tbody>
          {resources.map((resource) => {
            const gap =
              resource.required - resource.available;

            return (
              <tr
                key={resource.id}
                className="border-b border-slate-700"
              >
                <td className="py-3">
                  {resource.name}
                </td>

                <td className="py-3">
                  {resource.available}
                </td>

                <td className="py-3">
                  {resource.required}
                </td>

                <td
                  className={`py-3 font-bold ${
                    gap > 0
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {gap}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}