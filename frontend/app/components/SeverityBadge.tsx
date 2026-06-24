type SeverityBadgeProps = {
  severity: string;
};

export default function SeverityBadge({ severity }: SeverityBadgeProps) {
  const styles = {
    Critical:
      "border-red-500/30 bg-red-500/10 text-red-300",
    High:
      "border-orange-500/30 bg-orange-500/10 text-orange-300",
    Medium:
      "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
    Low:
      "border-green-500/30 bg-green-500/10 text-green-300",
  };

  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${
        styles[severity as keyof typeof styles] ||
        "border-slate-500/30 bg-slate-500/10 text-slate-300"
      }`}
      title={`Severity level: ${severity}`}
    >
      {severity}
    </span>
  );
}