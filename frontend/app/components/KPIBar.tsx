type Props = {
  incidents: number;
};

export default function KPIBar({ incidents }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
        <p className="text-[11px] text-slate-400">Critical Events</p>
        <p className="text-xl font-bold">2</p>
      </div>

      <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
        <p className="text-[11px] text-slate-400">Total Incidents</p>
        <p className="text-xl font-bold">{incidents}</p>
      </div>

      <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3">
        <p className="text-[11px] text-slate-400">Teams Active</p>
        <p className="text-xl font-bold">4</p>
      </div>

      <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-3">
        <p className="text-[11px] text-slate-400">Centers Ready</p>
        <p className="text-xl font-bold">4</p>
      </div>
    </div>
  );
}