import { resources } from "../resources";

export default function AlertBanner() {
  const shortages = resources.filter(
    (resource) => resource.required > resource.available
  );

  if (shortages.length === 0) return null;

  return (
    <div
      className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs"
      title="These resources have demand greater than available quantity."
    >
      <div className="flex items-center justify-between gap-4">
        <p className="font-semibold text-red-300">
          ⚠ Critical shortage detected
        </p>

        <p className="text-slate-300">
          {shortages.map((resource) => resource.name).join(" • ")}
        </p>
      </div>
    </div>
  );
}