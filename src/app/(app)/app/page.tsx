import { redirect } from "next/navigation";
import { ChartNoAxesCombined, CircleDollarSign, Gauge, WalletCards } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RecommendationCard } from "@/components/dashboard/recommendation-card";
import { DebtBalanceChart } from "@/components/charts/debt-charts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export default async function AppDashboardPage() {
  const { profile, debts, isDemo } = await getFinancialSnapshot();
  if (!profile.onboarding_completed) redirect("/app/onboarding");

  const totalDebt = calculateTotalDebt(debts);
  const totalPayments = calculateTotalMonthlyPayments(debts);
  const debtRatio = calculateDebtToIncomeRatio(totalDebt, profile.monthly_income);
  const paymentRatio = calculatePaymentToIncomeRatio(totalPayments, profile.monthly_income);
  const bestStrategy = compareStrategies(profile, debts)[0];
  const recommendation = generateMonthlyRecommendation(profile, debts);
  const score = Math.max(28, Math.round(100 - paymentRatio - debtRatio / 18));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tu ruta hacia cero deudas"
        description="Ruta Cero analiza tus deudas, ingresos y gastos para priorizar decisiones con impacto real."
        action={isDemo ? <Badge variant="info">Datos demo</Badge> : null}
      />

      <RecommendationCard {...recommendation} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard title="Total adeudado" value={formatCurrency(totalDebt)} icon={<WalletCards className="h-5 w-5" />} />
        <MetricCard
          title="Total cuotas mensuales"
          value={formatCurrency(totalPayments)}
          helper={`${formatPercent(paymentRatio)} de tus ingresos`}
          icon={<CircleDollarSign className="h-5 w-5" />}
        />
        <MetricCard title="Ingresos mensuales" value={formatCurrency(profile.monthly_income)} />
        <MetricCard title="Capacidad disponible" value={formatCurrency(profile.extra_payment_capacity)} />
        <MetricCard
          title="Fecha estimada de salida de deudas"
          value={estimateDebtFreeDate(bestStrategy.estimatedMonths)}
          helper={`${bestStrategy.estimatedMonths} meses con el ritmo actual`}
          icon={<ChartNoAxesCombined className="h-5 w-5" />}
        />
        <MetricCard title="Score de salud financiera" value={`${score}/100`} icon={<Gauge className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader title="Saldo por deuda" description="Visualiza dónde está concentrado el mayor peso financiero." />
          <CardContent>
            <DebtBalanceChart debts={debts} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Presión sobre ingresos" description="Mantener la cuota bajo control reduce riesgo de mora." />
          <CardContent className="space-y-6">
            <ProgressBar value={paymentRatio} label={`Cuotas: ${formatPercent(paymentRatio)}`} tone={paymentRatio > 50 ? "danger" : paymentRatio > 35 ? "warning" : "success"} />
            <ProgressBar value={Math.min(100, debtRatio / 4)} label={`Deuda/ingreso: ${formatPercent(debtRatio)}`} tone={debtRatio > 600 ? "danger" : debtRatio > 350 ? "warning" : "success"} />
            <p className="text-sm leading-6 text-muted">
              El objetivo es cubrir mínimos sin ahogar tu flujo y usar abonos extra con intención.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

