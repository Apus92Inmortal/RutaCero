import { ArrowRight, CheckCircle2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { getFinancialSnapshot } from "@/lib/data";
import { compareStrategies } from "@/lib/financial-engine";
import { formatCurrency, monthLabel } from "@/lib/format";
import type { Debt, StrategyProjection, StrategyType } from "@/lib/types";

const strategyCopy: Record<
  StrategyType,
  {
    label: string;
    meaning: string;
    why: string;
    firstAction: string;
  }
> = {
  avalanche: {
    label: "Avalancha",
    meaning: "Prioriza la deuda con mayor tasa o mayor impacto financiero.",
    why: "Puede ayudarte a reducir intereses estimados cuando puedes sostener el pago mensual.",
    firstAction: "Revisa la deuda prioritaria y dirige cualquier abono extra hacia ella.",
  },
  snowball: {
    label: "Bola de nieve",
    meaning: "Prioriza la deuda con menor saldo para cerrar compromisos más rápido.",
    why: "Puede liberar cuotas y darte avance visible sin cambiar la disciplina de pago.",
    firstAction: "Elige la deuda más pequeña y evita sumar nuevas compras mientras la cierras.",
  },
  balanced: {
    label: "Pago mínimo + abono extra",
    meaning: "Cubre tus pagos mínimos y suma abonos extra sostenibles.",
    why: "Puede ayudarte a avanzar sin tensionar todo tu presupuesto mensual.",
    firstAction: "Agenda tus pagos mínimos y define un abono extra realista para este mes.",
  },
  aggressive: {
    label: "Plan agresivo",
    meaning: "Dirige la mayor capacidad disponible a la deuda de mayor impacto.",
    why: "Puede acelerar la salida si tus gastos básicos y fondo mínimo están cubiertos.",
    firstAction: "Confirma tu capacidad de pago antes de subir el abono extra.",
  },
  consolidation: {
    label: "Consolidación",
    meaning: "Evalúa unir varias deudas en un solo pago si mejora tasa, plazo o control.",
    why: "Puede simplificar pagos, pero solo conviene si no aumenta el costo total.",
    firstAction: "Compara tasa, cuota y costo total antes de aceptar una oferta.",
  },
  refinance: {
    label: "Refinanciación",
    meaning: "Busca renegociar cuota, tasa o plazo cuando el flujo está presionado.",
    why: "Puede darte estabilidad si hoy no alcanzas a cubrir los pagos mínimos.",
    firstAction: "Contacta al acreedor de mayor urgencia y pide opciones por escrito.",
  },
  emergency: {
    label: "Plan de emergencia",
    meaning: "Atiende primero deudas en mora, cobranza o con riesgo inmediato.",
    why: "Puede ayudarte a estabilizar la situación antes de optimizar intereses.",
    firstAction: "Ponte al día con la deuda más urgente o acuerda un plan de normalización.",
  },
  hybrid: {
    label: "Plan combinado",
    meaning: "Combina estabilidad de flujo con pagos dirigidos a deudas de mayor impacto.",
    why: "Puede ser útil cuando necesitas orden y flexibilidad al mismo tiempo.",
    firstAction: "Separa pagos obligatorios, deuda prioritaria y margen para abonos extra.",
  },
};

export default async function StrategiesPage() {
  const { profile, debts, isDemo } = await getFinancialSnapshot();
  const strategies = compareStrategies(profile, debts);
  const recommended = strategies[0];

  if (isDemo || debts.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Tu estrategia de pago"
          description="Revisa la ruta recomendada para priorizar tus deudas y avanzar con mayor claridad."
        />
        <EmptyState
          title="No hay datos suficientes para crear una estrategia"
          description="Agrega tus deudas y completa tu información financiera para recibir una ruta recomendada."
          action={
            <ButtonLink href="/app/debts/new">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Agregar deuda
            </ButtonLink>
          }
        />
      </div>
    );
  }

  const priorityDebt = recommended.targetDebt;
  const suggestedMonthlyPayment = profile.debt_budget + profile.extra_payment_capacity;
  const estimatedSavings = Math.max(0, strategies[strategies.length - 1].totalPayment - recommended.totalPayment);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tu estrategia de pago"
        description="Revisa la ruta recomendada para priorizar tus deudas y avanzar con mayor claridad."
      />

      <Card>
        <CardContent className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <section aria-labelledby="recommended-strategy-title">
            <Badge variant="success">Estrategia recomendada</Badge>
            <h2 id="recommended-strategy-title" className="mt-4 text-2xl font-black tracking-normal text-primary">
              {strategyCopy[recommended.strategyType].label}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">{strategyCopy[recommended.strategyType].meaning}</p>
            <div className="mt-5 rounded-lg border border-line bg-surface p-4">
              <p className="text-sm font-semibold text-primary">Por qué puede servir</p>
              <p className="mt-2 text-sm leading-6 text-muted">{strategyCopy[recommended.strategyType].why}</p>
            </div>
            <div className="mt-4 rounded-lg border border-line bg-surface p-4">
              <p className="text-sm font-semibold text-primary">Primer paso recomendado</p>
              <p className="mt-2 text-sm leading-6 text-muted">{strategyCopy[recommended.strategyType].firstAction}</p>
            </div>
          </section>

          <aside className="rounded-lg border border-line bg-surface p-4" aria-label="Resumen de deuda prioritaria">
            <p className="text-sm font-semibold text-muted">Deuda prioritaria</p>
            <h3 className="mt-2 text-xl font-black text-primary">{priorityDebt?.name ?? "Sin deuda prioritaria"}</h3>
            <p className="mt-1 text-sm text-muted">{priorityDebt?.entity ?? "Según la estrategia recomendada."}</p>
            {priorityDebt ? (
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <ResultFact label="Saldo" value={formatCurrency(priorityDebt.balance)} />
                <ResultFact label="Cuota" value={formatCurrency(priorityDebt.monthly_payment)} />
              </div>
            ) : null}
            <ButtonLink href={priorityDebt ? `/app/debts/${priorityDebt.id}` : "/app/debts"} className="mt-5 w-full" variant="secondary">
              Revisar deuda
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </aside>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Métricas de apoyo">
        <MetricCard label="Tiempo estimado" value={monthLabel(recommended.estimatedMonths)} description="Estimación según tus datos actuales." />
        <MetricCard label="Ahorro estimado" value={formatCurrency(estimatedSavings)} description="Frente al escenario de mayor costo estimado." />
        <MetricCard label="Pago mensual sugerido" value={formatCurrency(suggestedMonthlyPayment)} description="Capacidad registrada para deudas y abonos." />
        <MetricCard label="Próximo pago" value={priorityDebt?.due_day ? `Día ${priorityDebt.due_day}` : "Por definir"} description="Confirma esta fecha con tu acreedor." />
      </section>

      <Card>
        <CardHeader title="Próximos pasos" description="Acciones concretas para avanzar sin tratar la estrategia como una promesa garantizada." />
        <CardContent>
          <ol className="grid gap-3 md:grid-cols-2">
            {[
              "Revisa tu deuda prioritaria y confirma saldo, cuota y fecha de pago.",
              "Paga al menos la cuota mínima para evitar mora o cargos adicionales.",
              "Aplica el abono extra si tu capacidad de pago lo permite este mes.",
              "Actualiza tus pagos para que Ruta Cero recalcule tu ruta.",
            ].map((step, index) => (
              <li key={step} className="flex gap-3 rounded-lg border border-line bg-surface p-4 text-sm leading-6 text-muted">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-sm font-black text-primary">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Comparación de estrategias" description="Compara posibilidades con etiquetas claras. Los valores son estimaciones." />
        <CardContent className="grid gap-4 lg:grid-cols-2">
          {strategies.map((strategy, index) => (
            <StrategyCard
              key={strategy.strategyType}
              strategy={strategy}
              debt={strategy.targetDebt}
              isRecommended={index === 0}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <Card>
      <CardContent>
        <p className="text-sm font-semibold text-muted">{label}</p>
        <p className="mt-3 text-2xl font-black text-primary">{value}</p>
        <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
      </CardContent>
    </Card>
  );
}

function StrategyCard({
  strategy,
  debt,
  isRecommended,
}: {
  strategy: StrategyProjection;
  debt?: Debt;
  isRecommended: boolean;
}) {
  const copy = strategyCopy[strategy.strategyType];

  return (
    <article className="rounded-lg border border-line bg-surface p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge variant={isRecommended ? "success" : strategy.strategyType === "emergency" ? "warning" : "default"}>
            {isRecommended ? "Recomendada" : copy.label}
          </Badge>
          <h3 className="mt-3 text-lg font-black text-primary">{copy.label}</h3>
        </div>
        <Badge variant="info">{monthLabel(strategy.estimatedMonths)}</Badge>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted">{copy.meaning}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <ResultFact label="Total estimado" value={formatCurrency(strategy.totalPayment)} />
        <ResultFact label="Intereses estimados" value={formatCurrency(strategy.estimatedInterest)} />
        <ResultFact label="Deuda prioritaria" value={debt?.name ?? "Por definir"} />
        <ResultFact label="Primera acción" value={copy.firstAction} />
      </div>

      <div className="mt-4 rounded-lg border border-line bg-white p-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-primary">
          <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
          Cuándo puede servir
        </p>
        <p className="mt-2 text-sm leading-6 text-muted">{copy.why}</p>
      </div>
    </article>
  );
}

function ResultFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className="mt-1 text-sm font-black leading-6 text-foreground">{value}</p>
    </div>
  );
}
