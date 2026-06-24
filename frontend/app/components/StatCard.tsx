type StatCardProps = {
  title: string;
  value: string;
  icon?: string;
  accent?: string;
};

const descriptions: Record<string, string> = {
  "Active Disasters":
    "Incidents currently stored and tracked by the platform.",
  Resources:
    "Available emergency resources for deployment.",
  Volunteers:
    "Registered volunteers available for assignment.",
  "Relief Centers":
    "Relief centers available for population support.",
};

export default function StatCard({
  title,
  value,
  icon,
  accent,
}: StatCardProps) {
  return (
    <div
      className={`group relative rounded-xl border border-white/10 bg-white/[0.03] p-4 transition duration-200 hover:-translate-y-0.5 hover:bg-white/[0.06] hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] ${accent}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400 group-hover:text-slate-300">
          {title}
        </p>

        <span className="text-lg opacity-70 transition group-hover:scale-110 group-hover:opacity-100">
          {icon}
        </span>
      </div>

      <p className="mt-3 text-2xl font-bold tracking-tight">
        {value}
      </p>

      <div
        className="
        pointer-events-none
        absolute
        left-4
        top-full
        z-50
        mt-2
        hidden
        w-56
        rounded-lg
        border
        border-white/10
        bg-[#0f172a]
        p-3
        text-[11px]
        text-slate-300
        shadow-xl
        group-hover:block
      "
      >
        {descriptions[title]}
      </div>
    </div>
  );
}