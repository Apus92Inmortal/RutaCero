import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const variants = {
  default: "bg-surface text-primary ring-1 ring-line",
  success: "bg-success/15 text-primary ring-1 ring-success/25",
  warning: "bg-warning/20 text-primary ring-1 ring-warning/30",
  danger: "bg-danger/10 text-danger ring-1 ring-danger/20",
  info: "bg-primary/10 text-primary ring-1 ring-primary/15",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
