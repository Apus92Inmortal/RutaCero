import { Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import type { Debt, StrategyType } from "@/lib/types";

const strategyLabels: Record<StrategyType, string> = {
  snowball: "Bola de nieve",
  avalanche: "Avalancha",
  consolidation: "Consolidación",
  refinance: "Refinanciación",
  aggressive: "Plan agresivo",
  balanced: "Plan equilibrado",
  emergency: "Plan de emergencia",
  hybrid: "Plan híbrido",
};

export function RecommendationCard({
  title,
  body,
  impact,
  targetDebt,
  strategy,
}: {
  title: string;
  body: string;
  impact: string;
  targetDebt?: Debt;
  strategy: StrategyType;
}) {
  return (
    <Card className="border-primary/20 bg-primary text-white">
      <CardContent className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-success" />
            <p className="text-sm font-semibold text-white/75">Tu recomendación de este mes</p>
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-normal">{title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/80">{body}</p>
          <p className="mt-4 rounded-lg bg-white/10 px-4 py-3 text-sm font-semibold text-white">{impact}</p>
        </div>
        <div className="rounded-lg bg-white p-4 text-primary">
          <Badge variant="success">{strategyLabels[strategy]}</Badge>
          {targetDebt ? (
            <div className="mt-5 space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Deuda objetivo</p>
                <p className="mt-1 text-lg font-black">{targetDebt.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted">Saldo</p>
                  <p className="font-bold">{formatCurrency(targetDebt.balance)}</p>
                </div>
                <div>
                  <p className="text-muted">Cuota</p>
                  <p className="font-bold">{formatCurrency(targetDebt.monthly_payment)}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-5 text-sm leading-6 text-muted">Agrega tus deudas para activar recomendaciones precisas.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

