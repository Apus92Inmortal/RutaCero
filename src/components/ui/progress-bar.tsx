import { cn } from "@/lib/cn";

export function ProgressBar({
  value,
  label,
  tone = "success",
}: {
  value: number;
  label?: string;
  tone?: "success" | "warning" | "danger" | "primary";
}) {
  const safeValue = Math.max(0, Math.min(100, value));
  const color = {
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
    primary: "bg-primary",
  }[tone];

  return (
    <div className="space-y-2">
      {label ? <div className="text-xs font-semibold text-muted">{label}</div> : null}
      <div className="h-2 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}
