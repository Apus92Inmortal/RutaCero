import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getFinancialSnapshot } from "@/lib/data";
import { compareStrategies } from "@/lib/financial-engine";
import { formatCurrency, monthLabel } from "@/lib/format";

export default async function StrategiesPage() {
  const { profile, debts } = await getFinancialSnapshot();
  const strategies = compareStrategies(profile, debts);

  return (
    <div className="space-y-6">
      <PageHeader title="Comparador de estrategias" description="Compara rutas posibles y elige con contexto, no con intuición suelta." />
      <div className="grid gap-4 lg:grid-cols-2">
        {strategies.map((strategy) => (
          <Card key={strategy.strategyType}>
            <CardContent>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-black text-primary">{strategy.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{strategy.description}</p>
                </div>
                <Badge variant={strategy.strategyType === "emergency" ? "danger" : "success"}>
                  {monthLabel(strategy.estimatedMonths)}
                </Badge>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">Ventajas</p>
                  <ul className="mt-2 space-y-1 text-sm text-muted">
                    {strategy.advantages.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Riesgos</p>
                  <ul className="mt-2 space-y-1 text-sm text-muted">
                    {strategy.risks.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-5 rounded-lg bg-[#f4f7fa] p-4">
                <p className="text-sm font-semibold text-primary">Cuándo conviene</p>
                <p className="mt-1 text-sm leading-6 text-muted">{strategy.whenItWorks}</p>
                <p className="mt-3 text-sm font-semibold text-foreground">
                  Resultado estimado: {formatCurrency(strategy.totalPayment)} en {monthLabel(strategy.estimatedMonths)}.
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

