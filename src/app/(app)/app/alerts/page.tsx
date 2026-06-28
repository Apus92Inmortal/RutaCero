import { ArrowRight, Bell, CheckCircle2, CircleAlert, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { getFinancialSnapshot } from "@/lib/data";
import type { Alert } from "@/lib/types";

type AlertPresentation = {
  label: "Atención" | "Próximo" | "Pendiente" | "Completado" | "Información faltante";
  variant: "danger" | "warning" | "success" | "info" | "default";
  actionLabel: string;
  actionHref: string;
  explanation: string;
};

export default async function AlertsPage() {
  const { alerts, isDemo } = await getFinancialSnapshot();
  const visibleAlerts = isDemo ? [] : [...alerts].sort((a, b) => alertWeight(b) - alertWeight(a));
  const criticalCount = visibleAlerts.filter((alert) => alert.severity === "danger").length;
  const warningCount = visibleAlerts.filter((alert) => alert.severity === "warning").length;
  const pendingCount = visibleAlerts.filter((alert) => !alert.is_read).length;

  if (visibleAlerts.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Alertas y recordatorios"
          description="Revisa los puntos que necesitan atención para mantener tu plan financiero al día."
        />
        <EmptyState
          title="Todo está en orden"
          description="No tienes alertas importantes por ahora. Sigue revisando tu calendario y actualiza tus pagos cuando avances."
          action={
            <ButtonLink href="/app/calendar" variant="secondary">
              Ver calendario
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alertas y recordatorios"
        description="Revisa los puntos que necesitan atención para mantener tu plan financiero al día."
      />

      <section className="grid gap-4 md:grid-cols-3" aria-label="Resumen de alertas">
        <SummaryCard label="Requieren atención" value={String(criticalCount)} description="Alertas críticas reales." />
        <SummaryCard label="Próximas o pendientes" value={String(warningCount)} description="Señales para revisar pronto." />
        <SummaryCard label="Sin leer" value={String(pendingCount)} description="Recordatorios nuevos o pendientes." />
      </section>

      <Card>
        <CardHeader
          title="Puntos que necesitan atención"
          description="Ordenadas por prioridad para que puedas actuar con calma."
        />
        <CardContent className="grid gap-4">
          {visibleAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function AlertCard({ alert }: { alert: Alert }) {
  const presentation = getAlertPresentation(alert);

  return (
    <article className="rounded-lg border border-line bg-surface p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-primary">
            {alertIcon(alert)}
            <h2 className="text-lg font-black">{cleanText(alert.title)}</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted">{cleanText(alert.message)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={presentation.variant}>{presentation.label}</Badge>
          {!alert.is_read ? <Badge variant="default">Pendiente</Badge> : null}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-line bg-white p-3">
        <p className="text-sm font-semibold text-primary">Por qué importa</p>
        <p className="mt-2 text-sm leading-6 text-muted">{presentation.explanation}</p>
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">{typeLabel(alert.type)}</p>
        <ButtonLink href={presentation.actionHref} variant="secondary" size="sm" className="w-full sm:w-auto">
          {presentation.actionLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </ButtonLink>
      </div>
    </article>
  );
}

function SummaryCard({ label, value, description }: { label: string; value: string; description: string }) {
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

function getAlertPresentation(alert: Alert): AlertPresentation {
  if (alert.severity === "danger") {
    return {
      label: "Atención",
      variant: "danger",
      actionLabel: alert.debt_id ? "Revisar deuda" : "Ver calendario",
      actionHref: alert.debt_id ? `/app/debts/${alert.debt_id}` : "/app/calendar",
      explanation: "Conviene revisarla primero para evitar que afecte el ritmo de tu plan.",
    };
  }

  if (alert.type === "due_date") {
    return {
      label: "Próximo",
      variant: "warning",
      actionLabel: "Ver calendario",
      actionHref: "/app/calendar",
      explanation: "Tu próximo pago está cerca. Organizarlo a tiempo ayuda a mantener el plan al día.",
    };
  }

  if (alert.type === "risk") {
    return {
      label: "Pendiente",
      variant: "warning",
      actionLabel: alert.debt_id ? "Revisar deuda" : "Actualizar plan",
      actionHref: alert.debt_id ? `/app/debts/${alert.debt_id}` : "/app/profile/financial-plan",
      explanation: "Hay información o señales que pueden cambiar la prioridad de tu ruta.",
    };
  }

  if (alert.type === "strategy") {
    return {
      label: "Pendiente",
      variant: "info",
      actionLabel: "Ver estrategia",
      actionHref: "/app/strategies",
      explanation: "Revisar la recomendación puede ayudarte a decidir el siguiente paso con más contexto.",
    };
  }

  if (alert.severity === "success") {
    return {
      label: "Completado",
      variant: "success",
      actionLabel: "Actualizar plan",
      actionHref: "/app/profile/financial-plan",
      explanation: "Es una señal positiva. Puedes usarla para ajustar tu plan o confirmar tu avance.",
    };
  }

  return {
    label: alert.type === "education" ? "Información faltante" : "Pendiente",
    variant: "info",
    actionLabel: alert.debt_id ? "Agregar información" : "Actualizar plan",
    actionHref: alert.debt_id ? `/app/debts/${alert.debt_id}` : "/app/profile/financial-plan",
    explanation: "Actualizar este dato puede mejorar las recomendaciones de Ruta Cero.",
  };
}

function alertWeight(alert: Alert) {
  const severityWeight: Record<Alert["severity"], number> = {
    danger: 4,
    warning: 3,
    info: 2,
    success: 1,
  };
  const readWeight = alert.is_read ? 0 : 0.5;
  return severityWeight[alert.severity] + readWeight;
}

function typeLabel(type: Alert["type"]) {
  const labels: Record<Alert["type"], string> = {
    due_date: "Pago próximo",
    late: "Pago vencido",
    risk: "Riesgo del plan",
    opportunity: "Oportunidad",
    strategy: "Recomendación pendiente",
    education: "Información faltante",
  };
  return labels[type];
}

function alertIcon(alert: Alert) {
  if (alert.severity === "danger") return <CircleAlert className="h-5 w-5 text-danger" aria-hidden="true" />;
  if (alert.severity === "success") return <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />;
  if (alert.severity === "warning") return <Bell className="h-5 w-5 text-warning" aria-hidden="true" />;
  return <Info className="h-5 w-5 text-primary" aria-hidden="true" />;
}

function cleanText(value: string) {
  const hasMojibake = value.includes(String.fromCharCode(195)) || value.includes(String.fromCharCode(194));
  if (!hasMojibake) return value;

  const bytes = Uint8Array.from(value, (character) => character.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}
