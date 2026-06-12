import { resources } from "../resources";

export default function AlertBanner() {
  const shortages = resources.filter(
    (resource) => resource.required > resource.available
  );

  if (shortages.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-600 text-white p-4 rounded-xl mb-6">
      <p className="font-bold">
        ⚠️ Critical shortages detected:
      </p>

      <p>
        {shortages
          .map((resource) => resource.name)
          .join(", ")}
      </p>
    </div>
  );
}