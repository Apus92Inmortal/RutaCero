import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      {children}
      {error ? <span className="block text-xs font-medium text-danger">{error}</span> : null}
    </label>
  );
}

export function inputClassName(className?: string) {
  return cn(
    "h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-foreground outline-none placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/10",
    className,
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputClassName(props.className)} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={inputClassName(props.className)} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-24 w-full rounded-lg border border-line bg-white px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/10",
        props.className,
      )}
    />
  );
}
