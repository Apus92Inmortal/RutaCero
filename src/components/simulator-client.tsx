"use client";

import { useMemo, useState } from "react";
import { Gauge } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { compareStrategies, evaluateConsolidation } from "@/lib/financial-engine";
import { estimateDebtFreeDate, formatCurrency, monthLabel } from "@/lib/format";
import type { Debt, Profile } from "@/lib/types";

export function SimulatorClient({ profile, debts }: { profile: Profile; debts: Debt[] }) {
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

  const adjustedProfile = { ...profile, extra_payment_capacity: extra };
  const strategies = compareStrategies(adjustedProfile, adjustedDebts);
  const best = strategies[0];
  const baseline = compareStrategies(profile, debts)[0];
  const consolidation = evaluateConsolidation(adjustedDebts, {
    amount: adjustedDebts.reduce((sum, debt) => sum + debt.balance, 0),
    monthlyRate: rate / 100,
    termMonths: term,
  });
  const effort = Math.min(100, ((extra + oneTimePayment / Math.max(term, 1)) / Math.max(profile.monthly_income, 1)) * 100);

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card>
        <CardHeader
          title="Variables"
          description="Cambia los valores y descubre cómo cada decisión afecta tu fecha de salida de deudas."
        />
        <CardContent className="space-y-4">
          <Field label="Abono extra mensual">
            <Input value={extra} min="0" step="10000" type="number" onChange={(event) => setExtra(Number(event.target.value))} />
          </Field>
          <Field label="Nueva tasa de consolidación">
            <Input value={rate} min="0" step="0.05" type="number" onChange={(event) => setRate(Number(event.target.value))} />
          </Field>
          <Field label="Nuevo plazo">
            <Input value={term} min="1" type="number" onChange={(event) => setTerm(Number(event.target.value))} />
          </Field>
          <Field label="Pago único extraordinario">
            <Input
              value={oneTimePayment}
              min="0"
              step="10000"
              type="number"
              onChange={(event) => setOneTimePayment(Number(event.target.value))}
            />
          </Field>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-muted">Nueva fecha estimada de salida</p>
                <p className="mt-3 text-2xl font-black text-primary">{estimateDebtFreeDate(best.estimatedMonths)}</p>
              </div>
              <Gauge className="h-8 w-8 text-success" />
            </div>
            <p className="mt-4 text-sm text-muted">Tiempo estimado: {monthLabel(best.estimatedMonths)}.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm font-semibold text-muted">Intereses aproximados</p>
            <p className="mt-3 text-2xl font-black text-primary">{formatCurrency(best.estimatedInterest)}</p>
            <p className="mt-4 text-sm text-muted">Proyección según tasa y ritmo de pago actuales.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm font-semibold text-muted">Meses ahorrados</p>
            <p className="mt-3 text-2xl font-black text-primary">
              {Math.max(0, baseline.estimatedMonths - best.estimatedMonths)}
            </p>
            <p className="mt-4 text-sm text-muted">Frente al escenario base de Ruta Cero.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-muted">Nivel de esfuerzo</p>
              <Badge variant={effort > 18 ? "danger" : effort > 10 ? "warning" : "success"}>
                {effort > 18 ? "Alto" : effort > 10 ? "Medio" : "Sostenible"}
              </Badge>
            </div>
            <div className="mt-5">
              <ProgressBar value={effort} tone={effort > 18 ? "danger" : effort > 10 ? "warning" : "success"} />
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader title="Riesgo de consolidación" description={consolidation.message} />
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted">Costo actual aproximado</p>
              <p className="mt-1 text-lg font-black text-primary">{formatCurrency(consolidation.currentApproxCost)}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Costo nuevo aproximado</p>
              <p className="mt-1 text-lg font-black text-primary">{formatCurrency(consolidation.estimatedNewCost)}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Resultado</p>
              <Badge className="mt-2" variant={consolidation.recommended ? "success" : "warning"}>
                {consolidation.recommended ? "Puede convenir" : "Revisar antes de aceptar"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

