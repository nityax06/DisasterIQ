type SeverityBadgeProps = {
  severity: string;
};

export default function SeverityBadge({
  severity,
}: SeverityBadgeProps) {
  const colors = {
    Critical: "bg-red-600",
    High: "bg-orange-500",
    Medium: "bg-yellow-500",
    Low: "bg-green-600",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-white text-sm ${
        colors[severity as keyof typeof colors]
      }`}
    >
      {severity}
    </span>
  );
}