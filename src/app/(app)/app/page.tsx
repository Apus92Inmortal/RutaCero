import { redirect } from "next/navigation";
import {
  CalendarDays,
  ChartNoAxesCombined,
  CircleDollarSign,
  Gauge,
  Plus,
  WalletCards,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RecommendationCard } from "@/components/dashboard/recommendation-card";
import { DebtBalanceChart } from "@/components/charts/debt-charts";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getFinancialSnapshot } from "@/lib/data";
import {
  calculateDebtToIncomeRatio,
  calculatePaymentToIncomeRatio,
  calculateTotalDebt,
  calculateTotalMonthlyPayments,
  compareStrategies,
  generateMonthlyRecommendation,
} from "@/lib/financial-engine";
import { estimateDebtFreeDate, formatCurrency, formatPercent } from "@/lib/format";
import type { Debt } from "@/lib/types";

function getNextPaymentLabel(debts: Debt[]) {
  const upcomingDebt = [...debts]
    .filter((debt) => debt.due_day)
    .sort((a, b) => Number(a.due_day) - Number(b.due_day))[0];

  if (!upcomingDebt?.due_day) return "Por definir";
  return `${upcomingDebt.name} · día ${upcomingDebt.due_day}`;
}

export default async function AppDashboardPage() {
  const { profile, debts, isDemo } = await getFinancialSnapshot();
  if (!profile.onboarding_completed) redirect("/app/onboarding");

  if (isDemo) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Resumen de tu plan"
          description="Consulta el estado de tus deudas y el próximo paso recomendado para avanzar."
        />

        <Card>
          <CardContent className="p-5">
            <EmptyState
              title="Agrega tu primera deuda"
              description="Aún no tienes deudas registradas. Cuando agregues la primera, Ruta Cero podrá calcular prioridades, progreso y próximos pagos."
              action={
                <ButtonLink href="/app/debts/new">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Agregar mi primera deuda
                </ButtonLink>
              }
            />
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <MetricCard
            title="Capacidad de pago"
            value={formatCurrency(profile.debt_budget)}
            helper="Dato tomado de tu plan inicial."
            icon={<CircleDollarSign className="h-5 w-5" aria-hidden="true" />}
          />
          <MetricCard
            title="Meta mensual"
            value={formatCurrency(profile.extra_payment_capacity)}
            helper="Puedes ajustar este valor desde tu perfil."
            icon={<Gauge className="h-5 w-5" aria-hidden="true" />}
          />
        </div>
      </div>
    );
  }

  const totalDebt = calculateTotalDebt(debts);
  const totalPayments = calculateTotalMonthlyPayments(debts);
  const debtRatio = calculateDebtToIncomeRatio(totalDebt, profile.monthly_income);
  const paymentRatio = calculatePaymentToIncomeRatio(totalPayments, profile.monthly_income);
  const bestStrategy = compareStrategies(profile, debts)[0];
  const recommendation = generateMonthlyRecommendation(profile, debts);
  const score = Math.max(28, Math.round(100 - paymentRatio - debtRatio / 18));
  const nextPayment = getNextPaymentLabel(debts);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resumen de tu plan"
        description="Consulta el estado de tus deudas y el próximo paso recomendado para avanzar."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total adeudado"
          value={formatCurrency(totalDebt)}
          helper={`${debts.length} deuda${debts.length === 1 ? "" : "s"} registrada${debts.length === 1 ? "" : "s"}`}
          icon={<WalletCards className="h-5 w-5" aria-hidden="true" />}
        />
        <MetricCard
          title="Capacidad de pago"
          value={formatCurrency(profile.debt_budget)}
          helper={`${formatPercent(paymentRatio)} de tus ingresos ya va a cuotas`}
          icon={<CircleDollarSign className="h-5 w-5" aria-hidden="true" />}
        />
        <MetricCard
          title="Próximo pago"
          value={nextPayment}
          helper="Revisa fechas y montos antes del vencimiento."
          icon={<CalendarDays className="h-5 w-5" aria-hidden="true" />}
        />
        <MetricCard
          title="Progreso del plan"
          value={`${score}/100`}
          helper={`Salida estimada: ${estimateDebtFreeDate(bestStrategy.estimatedMonths)}`}
          icon={<Gauge className="h-5 w-5" aria-hidden="true" />}
        />
      </div>

      <RecommendationCard {...recommendation} />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader title="Saldo por deuda" description="Visualiza dónde está concentrado el mayor peso financiero." />
          <CardContent>
            <DebtBalanceChart debts={debts} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Progreso y presión de pagos" description="Indicadores para decidir con calma el siguiente paso." />
          <CardContent className="space-y-6">
            <ProgressBar
              value={paymentRatio}
              label={`Cuotas sobre ingresos: ${formatPercent(paymentRatio)}`}
              tone={paymentRatio > 50 ? "danger" : paymentRatio > 35 ? "warning" : "success"}
            />
            <ProgressBar
              value={Math.min(100, debtRatio / 4)}
              label={`Deuda total frente a ingresos: ${formatPercent(debtRatio)}`}
              tone={debtRatio > 600 ? "danger" : debtRatio > 350 ? "warning" : "success"}
            />
            <p className="rounded-lg border border-line bg-surface p-3 text-sm leading-6 text-muted">
              La idea es cubrir mínimos sin ahogar tu flujo y usar abonos extra con intención.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader title="Accesos rápidos" description="Continúa con la acción que más te ayude hoy." />
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/app/debts/new" className="w-full sm:w-auto">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Agregar deuda
          </ButtonLink>
          <ButtonLink href="/app/strategies" variant="secondary" className="w-full sm:w-auto">
            <ChartNoAxesCombined className="h-4 w-4" aria-hidden="true" />
            Comparar estrategias
          </ButtonLink>
        </CardContent>
      </Card>
    </div>
  );
}
