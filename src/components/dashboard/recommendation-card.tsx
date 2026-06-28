import { ArrowRight, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card>
      <CardContent className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
        <section aria-labelledby="main-recommendation-title">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-success/10 text-primary">
              <Lightbulb className="h-5 w-5" aria-hidden="true" />
            </span>
            <Badge variant="success">Recomendación principal</Badge>
          </div>
          <h2 id="main-recommendation-title" className="mt-4 text-2xl font-black tracking-normal text-primary">
            {cleanText(title)}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">{cleanText(body)}</p>
          <div className="mt-4 rounded-lg border border-line bg-surface px-4 py-3">
            <p className="text-sm font-semibold text-primary">Por qué importa</p>
            <p className="mt-2 text-sm leading-6 text-muted">{cleanText(impact)}</p>
          </div>
        </section>

        <aside className="rounded-lg border border-line bg-surface p-4 text-primary" aria-label="Resumen de recomendación">
          <Badge variant="default">{strategyLabels[strategy]}</Badge>
          {targetDebt ? (
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Deuda prioritaria</p>
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
              <ButtonLink href={`/app/debts/${targetDebt.id}`} variant="secondary" size="sm" className="w-full">
                Revisar deuda
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              <p className="text-sm leading-6 text-muted">Agrega tus deudas para activar recomendaciones precisas.</p>
              <ButtonLink href="/app/debts/new" variant="secondary" size="sm" className="w-full">
                Agregar deuda
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          )}
        </aside>
      </CardContent>
    </Card>
  );
}

function cleanText(value: string) {
  const hasMojibake = value.includes(String.fromCharCode(195)) || value.includes(String.fromCharCode(194));
  if (!hasMojibake) return value;

  const bytes = Uint8Array.from(value, (character) => character.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}
