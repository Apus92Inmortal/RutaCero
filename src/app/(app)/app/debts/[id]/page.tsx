import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getFinancialSnapshot } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import type { DebtStatus } from "@/lib/types";

const statusLabel: Record<DebtStatus, string> = {
  current: "Al día",
  due_soon: "Próxima a vencer",
  late: "En mora",
  collections: "Cobranza",
};

export default async function DebtDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { debts } = await getFinancialSnapshot();
  const debt = debts.find((item) => item.id === id);
  if (!debt) notFound();

  const progress = debt.remaining_months ? Math.max(5, 100 - (debt.remaining_months / 60) * 100) : 30;
  const badgeVariant = debt.status === "current" ? "success" : debt.status === "due_soon" ? "warning" : "danger";

  return (
    <div className="space-y-6">
      <PageHeader title={debt.name} description={debt.entity ?? "Detalle de deuda"} />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader title="Estado financiero" description="Datos clave para entender esta deuda." />
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <DebtDetail label="Saldo actual" value={formatCurrency(debt.balance)} prominent />
            <DebtDetail label="Cuota mensual" value={formatCurrency(debt.monthly_payment)} prominent />
            <DebtDetail
              label="Tasa de interés"
              value={debt.interest_rate_type === "unknown" ? "No definida" : `${debt.interest_rate}% ${debt.interest_rate_type}`}
            />
            <DebtDetail label="Fecha de pago" value={debt.due_day ? `Día ${debt.due_day}` : "Sin fecha"} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Lectura rápida" description="Señales para decidir el siguiente paso." />
          <CardContent className="space-y-4">
            <Badge variant={badgeVariant}>{statusLabel[debt.status]}</Badge>
            <ProgressBar value={progress} label="Avance estimado" tone={debt.status === "late" ? "danger" : "success"} />
            <p className="rounded-lg border border-line bg-surface p-3 text-sm leading-6 text-muted">
              {debt.allows_extra_payments
                ? "Esta deuda permite abonos extra. Puede ser una buena candidata si coincide con tu estrategia."
                : "Antes de abonar extra, revisa restricciones o costos por prepago."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DebtDetail({ label, value, prominent = false }: { label: string; value: string; prominent?: boolean }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className={prominent ? "mt-1 text-2xl font-black text-primary" : "mt-1 font-bold text-foreground"}>{value}</p>
    </div>
  );
}
