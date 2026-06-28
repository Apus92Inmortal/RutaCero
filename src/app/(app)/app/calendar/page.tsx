import { ArrowRight, CalendarDays, CheckCircle2, Clock, Plus } from "lucide-react";
import { markDebtPaidAction } from "@/lib/actions/debts";
import { getFinancialSnapshot } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import type { Alert, Debt } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

type PaymentStatus = {
  label: "Próximo" | "Pendiente" | "Vencido";
  variant: "success" | "warning" | "danger" | "default";
};

export default async function CalendarPage() {
  const { debts, alerts, isDemo } = await getFinancialSnapshot();

  if (isDemo || debts.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Calendario de pagos"
          description="Consulta tus próximos vencimientos y organiza tus pagos para no perder el ritmo de tu plan."
        />
        <EmptyState
          title="Aún no tienes pagos programados"
          description="Agrega tus deudas para construir tu calendario de pagos."
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

  const today = startOfDay(new Date());
  const upcoming = debts
    .map((debt) => ({
      debt,
      dueDate: getNextDueDate(debt.due_day, today),
      status: getPaymentStatus(debt, today),
    }))
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  const nextPayment = upcoming[0];
  const importantAlerts = alerts
    .filter((alert) => alert.severity === "danger" || alert.severity === "warning")
    .slice(0, 3);
  const monthTotal = upcoming.reduce((sum, item) => sum + item.debt.monthly_payment, 0);
  const paymentsWithDate = upcoming.filter((item) => item.debt.due_day);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendario de pagos"
        description="Consulta tus próximos vencimientos y organiza tus pagos para no perder el ritmo de tu plan."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          label="Próximo pago"
          value={nextPayment ? shortDate(nextPayment.dueDate) : "Por definir"}
          description={nextPayment?.debt.name ?? "Agrega deudas para ver fechas."}
        />
        <SummaryCard
          label="Pagos programados"
          value={String(paymentsWithDate.length)}
          description="Deudas con día de pago definido."
        />
        <SummaryCard
          label="Cuotas estimadas del mes"
          value={formatCurrency(monthTotal)}
          description="Suma de cuotas registradas."
        />
      </div>

      {nextPayment ? (
        <Card>
          <CardContent className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <section aria-labelledby="next-payment-title">
              <div className="flex items-center gap-2 text-primary">
                <Clock className="h-5 w-5" aria-hidden="true" />
                <p className="text-sm font-semibold text-muted">Pago más cercano</p>
              </div>
              <h2 id="next-payment-title" className="mt-4 text-2xl font-black text-primary">
                {nextPayment.debt.name}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Vence el {longDate(nextPayment.dueDate)} · Cuota estimada {formatCurrency(nextPayment.debt.monthly_payment)}.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant={nextPayment.status.variant}>{nextPayment.status.label}</Badge>
                <Badge variant={nextPayment.debt.stress_level === "critical" || nextPayment.debt.stress_level === "high" ? "warning" : "default"}>
                  {priorityLabel(nextPayment.debt)}
                </Badge>
              </div>
            </section>

            <div className="rounded-lg border border-line bg-surface p-4">
              <p className="text-sm font-semibold text-primary">Organiza este pago</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Revisa saldo y cuota antes de marcarlo como pagado. Si cambió el valor, actualiza la deuda.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <ButtonLink href={`/app/debts/${nextPayment.debt.id}`} variant="secondary" className="w-full">
                  Revisar deuda
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
                <PaymentForm debt={nextPayment.debt} />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader
            title="Próximos pagos"
            description="Fechas y valores ordenados por el vencimiento más cercano."
          />
          <CardContent className="grid gap-4">
            {upcoming.map(({ debt, dueDate, status }) => (
              <PaymentCard key={debt.id} debt={debt} dueDate={dueDate} status={status} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Alertas importantes" description="Señales útiles para anticiparte sin presión." />
          <CardContent className="space-y-3">
            {importantAlerts.length > 0 ? (
              importantAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
            ) : (
              <div className="rounded-lg border border-line bg-surface p-4">
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />
                  <p className="text-sm font-semibold">Sin alertas urgentes</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Mantén tus fechas al día para que Ruta Cero pueda ayudarte a organizar el mes.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PaymentCard({ debt, dueDate, status }: { debt: Debt; dueDate: Date; status: PaymentStatus }) {
  return (
    <article className="rounded-lg border border-line bg-surface p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
            <h3 className="font-black">{debt.name}</h3>
          </div>
          <p className="mt-1 text-sm text-muted">{debt.entity ?? "Sin entidad registrada"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={status.variant}>{status.label}</Badge>
          <Badge variant={debt.stress_level === "critical" || debt.stress_level === "high" ? "warning" : "default"}>
            {priorityLabel(debt)}
          </Badge>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <PaymentFact label="Vence el" value={debt.due_day ? longDate(dueDate) : "Sin fecha definida"} />
        <PaymentFact label="Cuota estimada" value={formatCurrency(debt.monthly_payment)} />
        <PaymentFact label="Saldo actual" value={formatCurrency(debt.balance)} />
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
        <ButtonLink href={`/app/debts/${debt.id}`} variant="secondary" size="sm" className="w-full sm:w-auto">
          Revisar deuda
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </ButtonLink>
        <PaymentForm debt={debt} compact />
      </div>
    </article>
  );
}

function PaymentForm({ debt, compact = false }: { debt: Debt; compact?: boolean }) {
  return (
    <form action={markDebtPaidAction}>
      <input type="hidden" name="debt_id" value={debt.id} />
      <input type="hidden" name="amount" value={debt.monthly_payment} />
      <input type="hidden" name="payment_type" value="minimum" />
      <Button className={compact ? "w-full sm:w-auto" : "w-full"} size={compact ? "sm" : "md"}>
        Marcar como pagado
      </Button>
    </form>
  );
}

function AlertCard({ alert }: { alert: Alert }) {
  const variant = alert.severity === "danger" ? "danger" : alert.severity === "warning" ? "warning" : "info";
  const label = alert.severity === "danger" ? "Vencido" : alert.severity === "warning" ? "Pendiente" : "Próximo";

  return (
    <article className="rounded-lg border border-line bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-black text-primary">{cleanText(alert.title)}</h3>
        <Badge variant={variant}>{label}</Badge>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted">{cleanText(alert.message)}</p>
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

function PaymentFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className="mt-1 text-sm font-black leading-6 text-foreground">{value}</p>
    </div>
  );
}

function getPaymentStatus(debt: Debt, today: Date): PaymentStatus {
  if (debt.status === "late" || debt.status === "collections" || debt.days_past_due > 0) {
    return { label: "Vencido", variant: "danger" };
  }

  const dueDate = getNextDueDate(debt.due_day, today);
  const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / 86_400_000);
  if (debt.status === "due_soon" || daysUntilDue <= 7) {
    return { label: "Próximo", variant: "warning" };
  }

  return { label: "Pendiente", variant: "default" };
}

function getNextDueDate(dueDay: number | null, today: Date) {
  if (!dueDay) return new Date(today.getFullYear(), today.getMonth(), daysInMonth(today.getFullYear(), today.getMonth()));
  const safeDay = Math.min(Math.max(dueDay, 1), daysInMonth(today.getFullYear(), today.getMonth()));
  const date = new Date(today.getFullYear(), today.getMonth(), safeDay);
  if (date < today) {
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const nextSafeDay = Math.min(dueDay, daysInMonth(nextMonth.getFullYear(), nextMonth.getMonth()));
    return new Date(nextMonth.getFullYear(), nextMonth.getMonth(), nextSafeDay);
  }
  return date;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function shortDate(date: Date) {
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short" }).format(date);
}

function longDate(date: Date) {
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long" }).format(date);
}

function priorityLabel(debt: Debt) {
  if (debt.status === "late" || debt.status === "collections") return "Prioridad alta";
  if (debt.stress_level === "critical" || debt.stress_level === "high") return "Atención";
  return "Seguimiento";
}

function cleanText(value: string) {
  const hasMojibake = value.includes(String.fromCharCode(195)) || value.includes(String.fromCharCode(194));
  if (!hasMojibake) return value;

  const bytes = Uint8Array.from(value, (character) => character.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}
