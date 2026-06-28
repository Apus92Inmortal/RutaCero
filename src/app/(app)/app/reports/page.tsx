import type { ReactNode } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, ClipboardList, Plus, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { getFinancialSnapshot } from "@/lib/data";
import {
  calculateTotalDebt,
  calculateTotalMonthlyPayments,
  compareStrategies,
  generateMonthlyRecommendation,
} from "@/lib/financial-engine";
import { estimateDebtFreeDate, formatCurrency } from "@/lib/format";
import type { Alert } from "@/lib/types";

export default async function ReportsPage() {
  const { profile, debts, alerts, isDemo } = await getFinancialSnapshot();
  const visibleDebts = isDemo ? [] : debts.filter((debt) => !debt.id.startsWith("demo-"));
  const visibleAlerts = isDemo ? [] : alerts.filter((alert) => !alert.id.startsWith("demo-"));

  if (visibleDebts.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Reporte mensual"
          description="Revisa cómo avanzó tu plan este mes y qué puedes ajustar para seguir mejorando."
        />
        <EmptyState
          title="Aún no hay datos suficientes para tu reporte"
          description="Registra tus deudas y pagos para construir un resumen mensual útil."
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

  const totalDebt = calculateTotalDebt(visibleDebts);
  const monthlyPayments = calculateTotalMonthlyPayments(visibleDebts);
  const activeDebts = visibleDebts.filter((debt) => debt.balance > 0);
  const pendingPayments = activeDebts.length;
  const importantAlerts = visibleAlerts.filter((alert) => alert.severity === "danger" || alert.severity === "warning");
  const bestProjection = compareStrategies(profile, visibleDebts)[0];
  const recommendation = generateMonthlyRecommendation(profile, visibleDebts);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reporte mensual"
        description="Revisa cómo avanzó tu plan este mes y qué puedes ajustar para seguir mejorando."
        action={
          <ButtonLink href="/app/calendar" variant="secondary" className="w-full sm:w-auto">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Ver calendario
          </ButtonLink>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Resumen mensual">
        <MetricCard
          label="Deuda actual"
          value={formatCurrency(totalDebt)}
          description="Saldo registrado en tus deudas activas."
        />
        <MetricCard
          label="Cuotas del mes"
          value={formatCurrency(monthlyPayments)}
          description="Suma de cuotas mensuales registradas."
        />
        <MetricCard
          label="Pagos pendientes"
          value={String(pendingPayments)}
          description="Deudas activas que conviene revisar este mes."
        />
        <MetricCard
          label="Salida estimada"
          value={estimateDebtFreeDate(bestProjection.estimatedMonths)}
          description="Proyección calculada con tu plan actual."
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader
            title="Avance del mes"
            description="Una lectura simple de lo que mejoró, lo que queda pendiente y lo que conviene revisar."
          />
          <CardContent className="grid gap-4">
            <ProgressItem
              icon={<TrendingDown className="h-5 w-5" aria-hidden="true" />}
              title="Qué mejoró"
              body={`Tu plan ya tiene ${visibleDebts.length} ${visibleDebts.length === 1 ? "deuda registrada" : "deudas registradas"} y una cuota mensual estimada de ${formatCurrency(monthlyPayments)}.`}
              variant="success"
            />
            <ProgressItem
              icon={<ClipboardList className="h-5 w-5" aria-hidden="true" />}
              title="Qué queda pendiente"
              body="Registra los pagos realizados del mes para que el reporte refleje mejor tu progreso real."
              variant={importantAlerts.length > 0 ? "warning" : "default"}
            />
            <ProgressItem
              icon={<CheckCircle2 className="h-5 w-5" aria-hidden="true" />}
              title="Qué revisar"
              body={
                importantAlerts.length > 0
                  ? "Revisa las alertas pendientes antes de hacer abonos extra o cambiar tu estrategia."
                  : "Revisa tu calendario para preparar el próximo vencimiento y mantener el plan actualizado."
              }
              variant={importantAlerts.length > 0 ? "warning" : "success"}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Siguiente paso sugerido" description="Una recomendación para continuar sin presión." />
          <CardContent className="space-y-4">
            <Badge variant="success">{cleanText(recommendation.title)}</Badge>
            <p className="text-sm leading-6 text-muted">{cleanText(recommendation.body)}</p>
            <div className="rounded-lg border border-line bg-surface p-4">
              <p className="text-sm font-semibold text-primary">Por qué importa</p>
              <p className="mt-2 text-sm leading-6 text-muted">{cleanText(recommendation.impact)}</p>
            </div>
            {recommendation.targetDebt ? (
              <ButtonLink href={`/app/debts/${recommendation.targetDebt.id}`} variant="secondary" className="w-full">
                Revisar deuda
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            ) : (
              <ButtonLink href="/app/calendar" variant="secondary" className="w-full">
                Ver calendario
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Pendiente por revisar"
          description="Puntos útiles para cerrar el mes con datos más claros."
        />
        <CardContent className="grid gap-4 md:grid-cols-3">
          <ReviewCard label="Pagos realizados" value="Por registrar" description="Marca tus pagos recientes desde el calendario." />
          <ReviewCard
            label="Alertas del mes"
            value={String(importantAlerts.length)}
            description={importantAlerts.length > 0 ? "Hay puntos que requieren atención." : "No tienes alertas críticas registradas."}
            alerts={importantAlerts}
          />
          <ReviewCard
            label="Capacidad extra"
            value={formatCurrency(profile.extra_payment_capacity)}
            description="Monto disponible para evaluar abonos adicionales si tu presupuesto lo permite."
          />
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

function ProgressItem({
  icon,
  title,
  body,
  variant,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  variant: "success" | "warning" | "default";
}) {
  const badgeLabel = variant === "success" ? "Avance" : variant === "warning" ? "Revisar" : "Seguimiento";

  return (
    <article className="rounded-lg border border-line bg-surface p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-2 text-primary">
          {icon}
          <h3 className="font-black">{title}</h3>
        </div>
        <Badge variant={variant}>{badgeLabel}</Badge>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
    </article>
  );
}

function ReviewCard({
  label,
  value,
  description,
  alerts,
}: {
  label: string;
  value: string;
  description: string;
  alerts?: Alert[];
}) {
  return (
    <article className="rounded-lg border border-line bg-surface p-4">
      <p className="text-sm font-semibold text-muted">{label}</p>
      <p className="mt-2 text-xl font-black text-primary">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      {alerts && alerts.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {alerts.slice(0, 2).map((alert) => (
            <Badge key={alert.id} variant={alert.severity === "danger" ? "danger" : "warning"}>
              {alert.severity === "danger" ? "Atención" : "Pendiente"}
            </Badge>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function cleanText(value: string) {
  const hasMojibake = value.includes(String.fromCharCode(195)) || value.includes(String.fromCharCode(194));
  if (!hasMojibake) return value;

  const bytes = Uint8Array.from(value, (character) => character.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}
