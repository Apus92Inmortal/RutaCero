import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getFinancialSnapshot } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

export default async function DebtDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { debts } = await getFinancialSnapshot();
  const debt = debts.find((item) => item.id === id);
  if (!debt) notFound();

  const progress = debt.remaining_months ? Math.max(5, 100 - (debt.remaining_months / 60) * 100) : 30;

  return (
    <div className="space-y-6">
      <PageHeader title={debt.name} description={debt.entity ?? "Detalle de deuda"} />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader title="Estado financiero" />
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted">Saldo pendiente</p>
              <p className="mt-1 text-2xl font-black text-primary">{formatCurrency(debt.balance)}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Cuota mensual</p>
              <p className="mt-1 text-2xl font-black text-primary">{formatCurrency(debt.monthly_payment)}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Tasa</p>
              <p className="mt-1 font-bold text-foreground">
                {debt.interest_rate_type === "unknown" ? "No definida" : `${debt.interest_rate}% ${debt.interest_rate_type}`}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted">Vence</p>
              <p className="mt-1 font-bold text-foreground">{debt.due_day ? `Día ${debt.due_day}` : "Sin fecha"}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Lectura rápida" />
          <CardContent className="space-y-4">
            <Badge variant={debt.status === "current" ? "success" : debt.status === "due_soon" ? "warning" : "danger"}>
              {debt.status}
            </Badge>
            <ProgressBar value={progress} label="Avance estimado" tone={debt.status === "late" ? "danger" : "success"} />
            <p className="text-sm leading-6 text-muted">
              {debt.allows_extra_payments
                ? "Esta deuda permite abonos extra, ideal para acelerar tu estrategia."
                : "Antes de abonar extra, revisa restricciones o costos por prepago."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

