import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const variants = {
  default: "bg-[#e8f0f6] text-primary",
  success: "bg-[#e8f9ef] text-[#14753b]",
  warning: "bg-[#fff6d8] text-[#806100]",
  danger: "bg-[#fdecea] text-danger",
  info: "bg-[#e9f5ff] text-[#0c5c93]",
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

