import { Severity } from "./types";

const config: Record<Severity, { label: string; className: string; bg: string }> = {
  high: { label: "HIGH", className: "text-loss", bg: "bg-loss/15" },
  medium: { label: "MEDIUM", className: "text-warning", bg: "bg-warning/12" },
  low: { label: "LOW", className: "text-profit", bg: "bg-profit/12" },
};

const SeverityBadge = ({ severity }: { severity: Severity }) => {
  const c = config[severity];
  return (
    <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded ${c.className} ${c.bg}`}>
      {c.label}
    </span>
  );
};

export default SeverityBadge;
