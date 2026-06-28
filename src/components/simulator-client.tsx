"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Calculator, Gauge, Plus, TrendingDown, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, Input } from "@/components/ui/field";
import { ProgressBar } from "@/components/ui/progress-bar";
import { compareStrategies, evaluateConsolidation } from "@/lib/financial-engine";
import { estimateDebtFreeDate, formatCurrency, monthLabel } from "@/lib/format";
import type { Debt, Profile, StrategyProjection, StrategyType } from "@/lib/types";

const strategyNames: Record<StrategyType, string> = {
  snowball: "Bola de nieve",
  avalanche: "Avalancha",
  consolidation: "Consolidación",
  refinance: "Refinanciación",
  aggressive: "Plan agresivo",
  balanced: "Plan equilibrado",
  emergency: "Plan de emergencia",
  hybrid: "Plan combinado",
};

const strategyDescriptions: Record<StrategyType, string> = {
  snowball: "Prioriza la deuda de menor saldo para liberar cuotas más rápido.",
  avalanche: "Prioriza la deuda con mayor tasa para reducir intereses estimados.",
  consolidation: "Compara si unir deudas en un solo pago mejora costo y orden.",
  refinance: "Evalúa si renegociar cuota o plazo ayuda a recuperar estabilidad.",
  aggressive: "Usa mayor capacidad de pago para acelerar el avance del plan.",
  balanced: "Combina pagos mínimos y abonos extra sostenibles.",
  emergency: "Atiende primero deudas vencidas o con mayor presión.",
  hybrid: "Combina estabilidad de flujo con pagos dirigidos a la deuda de mayor impacto.",
};

export function SimulatorClient({
  profile,
  debts,
  isDemo = false,
}: {
  profile: Profile;
  debts: Debt[];
  isDemo?: boolean;
}) {
  const [extra, setExtra] = useState(profile.extra_payment_capacity);
  const [rate, setRate] = useState(1.45);
  const [term, setTerm] = useState(36);
  const [oneTimePayment, setOneTimePayment] = useState(0);

  const adjustedDebts = useMemo(() => {
    if (!oneTimePayment) return debts;
    let remaining = oneTimePayment;
    return [...debts]
      .sort((a, b) => b.interest_rate - a.interest_rate)
      .map((debt) => {
        const applied = Math.min(debt.balance, remaining);
        remaining -= applied;
        return { ...debt, balance: debt.balance - applied };
      });
  }, [debts, oneTimePayment]);

  if (isDemo || debts.length === 0) {
    return (
      <EmptyState
        title="Agrega tus deudas para simular"
        description="Necesitamos conocer tus deudas para construir escenarios útiles."
        action={
          <ButtonLink href="/app/debts/new">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Agregar deuda
          </ButtonLink>
        }
      />
    );
  }

  const adjustedProfile = { ...profile, extra_payment_capacity: extra };
  const strategies = compareStrategies(adjustedProfile, adjustedDebts);
  const best = strategies[0];
  const baseline = compareStrategies(profile, debts)[0];
  const higherExtra = Math.max(100000, Math.round(Math.max(extra, profile.extra_payment_capacity) * 1.25));
  const higherExtraScenario = compareStrategies({ ...adjustedProfile, extra_payment_capacity: higherExtra }, adjustedDebts)[0];
  const consolidation = evaluateConsolidation(adjustedDebts, {
    amount: adjustedDebts.reduce((sum, debt) => sum + debt.balance, 0),
    monthlyRate: rate / 100,
    termMonths: term,
  });
  const effort = Math.min(100, ((extra + oneTimePayment / Math.max(term, 1)) / Math.max(profile.monthly_income, 1)) * 100);
  const effortTone = effort > 18 ? "danger" : effort > 10 ? "warning" : "success";
  const savedMonths = Math.max(0, baseline.estimatedMonths - best.estimatedMonths);
  const estimatedSavings = Math.max(0, baseline.totalPayment - best.totalPayment);
  const consolidationMessage = consolidation.recommended
    ? "Puede convenir si la nueva tasa baja el costo total y mantienes cerrados los cupos liberados."
    : "Revisa tasa, plazo y costo total antes de aceptar una consolidación.";

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-line bg-surface p-4 text-sm leading-6 text-muted shadow-sm">
        Los resultados son estimaciones y pueden cambiar según tus pagos reales, tasas y nuevos movimientos.
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader
            title="Variables del escenario"
            description="Ajusta los valores para comparar posibilidades sin cambiar tu plan actual."
          />
          <CardContent className="space-y-5">
            <Field label="Abono extra mensual">
              <Input
                value={extra}
                min="0"
                step="10000"
                type="number"
                inputMode="numeric"
                onChange={(event) => setExtra(Number(event.target.value))}
              />
            </Field>
            <HelperText>Valor actual: {formatCurrency(profile.extra_payment_capacity)}.</HelperText>

            <Field label="Tasa mensual de consolidación">
              <Input
                value={rate}
                min="0"
                step="0.05"
                type="number"
                inputMode="decimal"
                onChange={(event) => setRate(Number(event.target.value))}
              />
            </Field>

            <Field label="Plazo de consolidación en meses">
              <Input
                value={term}
                min="1"
                type="number"
                inputMode="numeric"
                onChange={(event) => setTerm(Number(event.target.value))}
              />
            </Field>

            <Field label="Pago único extraordinario">
              <Input
                value={oneTimePayment}
                min="0"
                step="10000"
                type="number"
                inputMode="numeric"
                onChange={(event) => setOneTimePayment(Number(event.target.value))}
              />
            </Field>
            <HelperText>Los cambios se recalculan automáticamente.</HelperText>
          </CardContent>
        </Card>

        <section className="space-y-6" aria-labelledby="simulator-results-title">
          <div>
            <h2 id="simulator-results-title" className="text-base font-black text-primary">
              Resultados estimados
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              Compara tiempo, costo y deuda prioritaria antes de decidir el siguiente paso.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <MetricCard
              icon={<Gauge className="h-7 w-7" aria-hidden="true" />}
              label="Tiempo estimado"
              value={estimateDebtFreeDate(best.estimatedMonths)}
              description={monthLabel(best.estimatedMonths)}
            />
            <MetricCard
              icon={<WalletCards className="h-7 w-7" aria-hidden="true" />}
              label="Total a pagar"
              value={formatCurrency(best.totalPayment)}
              description="Capital más intereses estimados."
            />
            <MetricCard
              icon={<TrendingDown className="h-7 w-7" aria-hidden="true" />}
              label="Ahorro estimado"
              value={formatCurrency(estimatedSavings)}
              description={`${savedMonths} meses menos frente al escenario actual.`}
            />
            <MetricCard
              icon={<Calculator className="h-7 w-7" aria-hidden="true" />}
              label="Deuda prioritaria"
              value={best.targetDebt?.name ?? "Sin deuda prioritaria"}
              description={best.targetDebt?.entity ?? "Según el escenario optimizado."}
            />
          </div>

          <Card>
            <CardHeader
              title="Comparación de escenarios"
              description="Cada escenario usa tus datos actuales y los valores ajustados arriba."
            />
            <CardContent className="grid gap-4 lg:grid-cols-3">
              <ScenarioCard
                label="Escenario actual"
                projection={baseline}
                referenceMonths={baseline.estimatedMonths}
                variant="default"
              />
              <ScenarioCard label="Escenario optimizado" projection={best} referenceMonths={baseline.estimatedMonths} variant="success" />
              <ScenarioCard
                label="Escenario con mayor abono"
                projection={higherExtraScenario}
                referenceMonths={baseline.estimatedMonths}
                variant="warning"
                note={`Referencia con ${formatCurrency(higherExtra)} de abono extra mensual.`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Nivel de esfuerzo" description="Ayuda a revisar si el escenario luce sostenible para tu flujo." />
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-2xl font-black text-primary">{Math.round(effort)}%</p>
                  <p className="mt-1 text-sm text-muted">Del ingreso mensual estimado.</p>
                </div>
                <Badge variant={effortTone}>{effort > 18 ? "Alto" : effort > 10 ? "Medio" : "Sostenible"}</Badge>
              </div>
              <ProgressBar value={effort} tone={effortTone} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Riesgo de consolidación" description={consolidationMessage} />
            <CardContent className="grid gap-4 md:grid-cols-3">
              <ResultFact label="Costo actual aproximado" value={formatCurrency(consolidation.currentApproxCost)} />
              <ResultFact label="Costo nuevo aproximado" value={formatCurrency(consolidation.estimatedNewCost)} />
              <div>
                <p className="text-sm text-muted">Resultado</p>
                <Badge className="mt-2" variant={consolidation.recommended ? "success" : "warning"}>
                  {consolidation.recommended ? "Puede convenir" : "Revisar antes de aceptar"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

function HelperText({ children }: { children: ReactNode }) {
  return <p className="-mt-2 text-xs leading-5 text-muted">{children}</p>;
}

function MetricCard({
  icon,
  label,
  value,
  description,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-muted">{label}</p>
            <p className="mt-3 text-2xl font-black text-primary">{value}</p>
          </div>
          <div className="text-success">{icon}</div>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted">{description}</p>
      </CardContent>
    </Card>
  );
}

function ScenarioCard({
  label,
  projection,
  referenceMonths,
  variant,
  note,
}: {
  label: string;
  projection: StrategyProjection;
  referenceMonths: number;
  variant: "default" | "success" | "warning";
  note?: string;
}) {
  const monthDifference = referenceMonths - projection.estimatedMonths;

  return (
    <article className="rounded-lg border border-line bg-surface p-4">
      <Badge variant={variant}>{label}</Badge>
      <h3 className="mt-4 text-base font-black text-primary">{strategyNames[projection.strategyType]}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{strategyDescriptions[projection.strategyType]}</p>
      <div className="mt-4 space-y-3">
        <ResultFact label="Tiempo estimado" value={monthLabel(projection.estimatedMonths)} />
        <ResultFact label="Total a pagar" value={formatCurrency(projection.totalPayment)} />
        <ResultFact
          label="Diferencia"
          value={monthDifference > 0 ? `${monthDifference} meses menos` : monthDifference < 0 ? `${Math.abs(monthDifference)} meses más` : "Sin cambio"}
        />
      </div>
      {note ? <p className="mt-4 text-xs leading-5 text-muted">{note}</p> : null}
    </article>
  );
}

function ResultFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 font-black text-foreground">{value}</p>
    </div>
  );
}
