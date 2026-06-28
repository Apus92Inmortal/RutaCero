import { CalendarDays, CheckCircle2, Plus, Target } from "lucide-react";
import { GoalForm } from "@/components/forms/goal-form";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { getFinancialSnapshot } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import type { Goal } from "@/lib/types";

export default async function GoalsPage() {
  const { goals, isDemo } = await getFinancialSnapshot();
  const visibleGoals = isDemo ? [] : goals.filter((goal) => !goal.id.startsWith("demo-"));
  const completedGoals = visibleGoals.filter((goal) => goalStatus(goal).label === "Completada").length;
  const activeGoals = visibleGoals.filter((goal) => goalStatus(goal).label === "En progreso").length;
  const totalTarget = visibleGoals.reduce((sum, goal) => sum + goal.target_amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tus metas financieras"
        description="Define objetivos claros y sigue tu avance paso a paso dentro de tu plan."
        action={
          <ButtonLink href="#crear-meta" className="w-full sm:w-auto">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Crear meta
          </ButtonLink>
        }
      />

      {visibleGoals.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-3" aria-label="Resumen de metas">
          <SummaryCard label="Metas en progreso" value={String(activeGoals)} description="Objetivos activos dentro de tu plan." />
          <SummaryCard label="Metas completadas" value={String(completedGoals)} description="Avances cerrados o alcanzados." />
          <SummaryCard label="Objetivo total" value={formatCurrency(totalTarget)} description="Suma de montos objetivo registrados." />
        </section>
      ) : (
        <EmptyState
          title="Aún no tienes metas creadas"
          description="Crea una meta para medir tu avance y mantener claro tu próximo objetivo financiero."
          action={
            <ButtonLink href="#crear-meta">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Crear mi primera meta
            </ButtonLink>
          }
        />
      )}

      {visibleGoals.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-2" aria-label="Listado de metas financieras">
          {visibleGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </section>
      ) : null}

      <Card id="crear-meta">
        <CardHeader
          title="Crear meta"
          description="Define un objetivo realista para medir tu avance sin presión."
        />
        <CardContent>
          <GoalForm />
        </CardContent>
      </Card>
    </div>
  );
}

function GoalCard({ goal }: { goal: Goal }) {
  const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
  const safeProgress = Math.max(0, Math.min(100, progress));
  const status = goalStatus(goal);
  const remaining = Math.max(0, goal.target_amount - goal.current_amount);

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-primary">
              <Target className="h-5 w-5" aria-hidden="true" />
              <h2 className="text-lg font-black">{goal.title}</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">
              {formatCurrency(goal.current_amount)} de {formatCurrency(goal.target_amount)}
            </p>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        <div className="mt-5">
          <AccessibleProgress value={safeProgress} label={`Avance de ${goal.title}`} />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <GoalFact label="Avance" value={`${Math.round(safeProgress)}%`} />
          <GoalFact label="Falta" value={formatCurrency(remaining)} />
          <GoalFact label="Fecha objetivo" value={formatGoalDate(goal.target_date)} />
        </div>

        <div className="mt-5 rounded-lg border border-line bg-surface p-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary">
            {status.label === "Completada" ? (
              <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
            ) : (
              <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
            )}
            Siguiente paso
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">{nextStepText(status.label, remaining)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function AccessibleProgress({ value, label }: { value: number; label: string }) {
  const rounded = Math.round(value);

  return (
    <div
      className="space-y-2"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={rounded}
    >
      <div className="flex items-center justify-between gap-3 text-xs font-semibold text-muted">
        <span>Progreso acumulado</span>
        <span>{rounded}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-success" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
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

function GoalFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className="mt-1 text-sm font-black leading-6 text-foreground">{value}</p>
    </div>
  );
}

function goalStatus(goal: Goal): { label: "En progreso" | "Completada" | "Pendiente" | "Atrasada"; variant: "success" | "warning" | "default" | "danger" } {
  const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
  const targetDate = goal.target_date ? new Date(`${goal.target_date}T00:00:00`) : null;
  const today = new Date();
  const isPastTarget = targetDate ? targetDate < new Date(today.getFullYear(), today.getMonth(), today.getDate()) : false;

  if (goal.status === "completed" || progress >= 100) return { label: "Completada", variant: "success" };
  if (isPastTarget) return { label: "Atrasada", variant: "danger" };
  if (goal.status === "paused") return { label: "Pendiente", variant: "warning" };
  return { label: "En progreso", variant: "default" };
}

function formatGoalDate(value: string | null) {
  if (!value) return "Sin fecha definida";
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(`${value}T00:00:00`),
  );
}

function nextStepText(status: ReturnType<typeof goalStatus>["label"], remaining: number) {
  if (status === "Completada") return "Celebra el avance y define si quieres crear una nueva meta.";
  if (status === "Atrasada") return "Revisa si la fecha o el monto siguen siendo realistas para tu situación actual.";
  if (remaining <= 0) return "Actualiza el avance para reflejar que esta meta ya está lista.";
  return "Define una meta mensual alcanzable y actualiza el avance cuando hagas un aporte.";
}
