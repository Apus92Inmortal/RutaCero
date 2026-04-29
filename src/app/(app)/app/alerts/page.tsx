import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getFinancialSnapshot } from "@/lib/data";

export default async function AlertsPage() {
  const { alerts } = await getFinancialSnapshot();

  return (
    <div className="space-y-6">
      <PageHeader title="Alertas inteligentes" description="Señales para anticiparte a vencimientos, mora y oportunidades de abono." />
      <div className="grid gap-4">
        {alerts.map((alert) => (
          <Card key={alert.id}>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-black text-primary">{alert.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{alert.message}</p>
              </div>
              <Badge variant={alert.severity === "danger" ? "danger" : alert.severity === "warning" ? "warning" : alert.severity === "success" ? "success" : "info"}>
                {alert.severity}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

