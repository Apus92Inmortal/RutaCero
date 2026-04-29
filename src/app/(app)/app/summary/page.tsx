import { DebtBalanceChart, DebtDistributionChart } from "@/components/charts/debt-charts";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getFinancialSnapshot } from "@/lib/data";
import {
  calculateTotalDebt,
  calculateTotalMonthlyPayments,
  compareStrategies,
} from "@/lib/financial-engine";
import { estimateDebtFreeDate, formatCurrency } from "@/lib/format";

export default async function SummaryPage() {
  const { profile, debts } = await getFinancialSnapshot();
  const totalDebt = calculateTotalDebt(debts);
  const totalPayments = calculateTotalMonthlyPayments(debts);
  const best = compareStrategies(profile, debts)[0];

  return (
    <div className="space-y-6">
      <PageHeader title="Resumen financiero" description="Una vista ejecutiva de tu deuda, presión de pagos y salida estimada." />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Deuda total" value={formatCurrency(totalDebt)} />
        <MetricCard title="Cuotas mensuales" value={formatCurrency(totalPayments)} />
        <MetricCard title="Salida estimada" value={estimateDebtFreeDate(best.estimatedMonths)} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Distribución de deuda" />
          <CardContent>
            <DebtDistributionChart debts={debts} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Saldo por deuda" />
          <CardContent>
            <DebtBalanceChart debts={debts} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

