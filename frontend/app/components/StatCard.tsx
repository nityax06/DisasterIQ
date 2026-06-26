type StatCardProps = {
  title: string;
  value: string;
  icon?: string;
  accent?: string;
};

const descriptions: Record<string, string> = {
  "Active Disasters": "Live incidents currently loaded from Supabase.",
  Resources: "Total available emergency supply count.",
  Volunteers: "Available volunteer responders.",
  "Relief Centers": "Configured relief centers ready for assignment.",
};

export default function StatCard({ title, value, icon, accent }: StatCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.035] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.06] ${accent}`}
    >
      <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-white/[0.04] blur-2xl transition group-hover:bg-blue-500/10" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {value}
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            {descriptions[title]}
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-base transition group-hover:border-blue-500/30">
          {icon}
        </div>
      </div>
    </div>
  );
}