import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  title,
  value,
  helper,
  icon,
}: {
  title: string;
  value: string;
  helper?: string;
  icon?: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex min-h-32 items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-muted">{title}</p>
          <p className="mt-3 break-words text-2xl font-black tracking-normal text-primary sm:text-3xl">{value}</p>
          {helper ? <p className="mt-2 text-xs leading-5 text-muted">{helper}</p> : null}
        </div>
        {icon ? <div className="shrink-0 rounded-lg border border-line bg-surface p-3 text-primary">{icon}</div> : null}
      </CardContent>
    </Card>
  );
}
