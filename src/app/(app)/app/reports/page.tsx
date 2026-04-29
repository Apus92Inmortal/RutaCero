import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getFinancialSnapshot } from "@/lib/data";
import { calculateTotalDebt, generateMonthlyRecommendation } from "@/lib/financial-engine";
import { formatCurrency } from "@/lib/format";

export default async function ReportsPage() {
  const { profile, debts } = await getFinancialSnapshot();
  const debtCurrent = calculateTotalDebt(debts);
  const estimatedInitial = Math.round(debtCurrent * 1.08);
  const recommendation = generateMonthlyRecommendation(profile, debts);

  return (
    <div className="space-y-6">
      <PageHeader title="Reporte mensual" description="Resumen preparado para descargar cuando se implemente la generación de PDF." />
      <Card>
        <CardHeader
          title="Resumen del periodo"
          action={
            <Button variant="secondary" type="button">
              <FileDown className="h-4 w-4" />
              Descargar PDF
            </Button>
          }
        />
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["Deuda inicial", formatCurrency(estimatedInitial)],
            ["Deuda actual", formatCurrency(debtCurrent)],
            ["Pagos realizados", "Preparado para registros"],
            ["Abonos extra", formatCurrency(profile.extra_payment_capacity)],
            ["Progreso mensual", `${Math.max(0, Math.round(((estimatedInitial - debtCurrent) / estimatedInitial) * 100))}%`],
            ["Recomendación del próximo mes", recommendation.title],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-line bg-background p-4">
              <p className="text-sm font-semibold text-muted">{label}</p>
              <p className="mt-2 text-lg font-black text-primary">{value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
