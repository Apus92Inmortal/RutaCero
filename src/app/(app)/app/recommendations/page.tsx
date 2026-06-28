import { ArrowRight, CalendarDays, CheckCircle2, Lightbulb, PencilLine } from "lucide-react";
import { RecommendationCard } from "@/components/dashboard/recommendation-card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { getFinancialSnapshot } from "@/lib/data";
import { generateMonthlyRecommendation, getHighestInterestDebt, getMostUrgentDebt } from "@/lib/financial-engine";
import type { Debt } from "@/lib/types";

type RecommendationItem = {
  label: "Prioridad alta" | "Dato pendiente" | "Siguiente acción" | "Mejora sugerida";
  title: string;
  body: string;
  actionLabel: string;
  actionHref: string;
  variant: "danger" | "warning" | "success" | "info" | "default";
};

export default async function RecommendationsPage() {
  const { profile, debts, isDemo } = await getFinancialSnapshot();

  if (isDemo || debts.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Recomendaciones para tu ruta"
          description="Revisa sugerencias prácticas para mejorar tu plan y avanzar con más claridad."
        />
        <EmptyState
          title="No hay recomendaciones pendientes"
          description="Tu plan está actualizado por ahora. Sigue registrando tus pagos y revisando tu calendario."
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

  const recommendation = generateMonthlyRecommendation(profile, debts);
  const urgent = getMostUrgentDebt(debts);
  const expensive = getHighestInterestDebt(debts);
  const incompleteDebt = debts.find((debt) => debt.interest_rate_type === "unknown" || !debt.due_day);
  const items = buildRecommendationItems({
    targetDebt: recommendation.targetDebt,
    urgent,
    expensive,
    incompleteDebt,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recomendaciones para tu ruta"
        description="Revisa sugerencias prácticas para mejorar tu plan y avanzar con más claridad."
      />

      <RecommendationCard {...recommendation} />

      <section className="grid gap-4 md:grid-cols-3" aria-label="Resumen de recomendaciones">
        <SummaryCard label="Prioridad actual" value={recommendation.targetDebt?.name ?? "Por definir"} description="Deuda sugerida para revisar primero." />
        <SummaryCard label="Datos pendientes" value={String(incompleteDebt ? 1 : 0)} description="Información que puede mejorar la ruta." />
        <SummaryCard label="Acciones sugeridas" value={String(items.length)} description="Siguientes pasos disponibles." />
      </section>

      <Card>
        <CardHeader
          title="Siguientes recomendaciones"
          description="Cada sugerencia explica qué hacer, por qué importa y dónde continuar."
        />
        <CardContent className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <RecommendationItemCard key={`${item.label}-${item.title}`} item={item} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function buildRecommendationItems({
  targetDebt,
  urgent,
  expensive,
  incompleteDebt,
}: {
  targetDebt?: Debt;
  urgent?: Debt;
  expensive?: Debt;
  incompleteDebt?: Debt;
}): RecommendationItem[] {
  const items: RecommendationItem[] = [];

  if (targetDebt) {
    items.push({
      label: "Prioridad alta",
      title: `Revisa ${targetDebt.name}`,
      body: "Esta deuda concentra el siguiente paso recomendado. Revisarla te ayuda a confirmar saldo, cuota y fecha antes de actuar.",
      actionLabel: "Revisar deuda",
      actionHref: `/app/debts/${targetDebt.id}`,
      variant: "warning",
    });
  }

  if (incompleteDebt) {
    items.push({
      label: "Dato pendiente",
      title: "Completa información de una deuda",
      body: "Agregar tasa de interés o día de pago puede mejorar la priorización y el calendario de Ruta Cero.",
      actionLabel: "Agregar información",
      actionHref: `/app/debts/${incompleteDebt.id}`,
      variant: "info",
    });
  }

  if (urgent?.status === "late" || urgent?.status === "collections") {
    items.push({
      label: "Prioridad alta",
      title: "Revisa una deuda con atención",
      body: "Hay una deuda con señales de mora o cobranza. Conviene revisarla con calma para definir el próximo paso.",
      actionLabel: "Revisar deuda",
      actionHref: `/app/debts/${urgent.id}`,
      variant: "danger",
    });
  }

  if (expensive) {
    items.push({
      label: "Mejora sugerida",
      title: "Evalúa el impacto de intereses",
      body: "Si tienes margen, considera aplicar un abono extra a una deuda de mayor costo antes de tomar nuevas decisiones.",
      actionLabel: "Ver estrategia",
      actionHref: "/app/strategies",
      variant: "success",
    });
  }

  items.push({
    label: "Siguiente acción",
    title: "Actualiza tus pagos recientes",
    body: "Registrar avances ayuda a recalcular el progreso y mantener tu calendario alineado con la realidad.",
    actionLabel: "Ver calendario",
    actionHref: "/app/calendar",
    variant: "default",
  });

  return items;
}

function RecommendationItemCard({ item }: { item: RecommendationItem }) {
  return (
    <article className="rounded-lg border border-line bg-surface p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-primary">
            {itemIcon(item.label)}
          </span>
          <div>
            <Badge variant={item.variant}>{item.label}</Badge>
            <h2 className="mt-3 text-lg font-black text-primary">{item.title}</h2>
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-lg border border-line bg-white p-3">
        <p className="text-sm font-semibold text-primary">Por qué importa</p>
        <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
      </div>
      <div className="mt-4 flex justify-end border-t border-line pt-4">
        <ButtonLink href={item.actionHref} variant="secondary" size="sm" className="w-full sm:w-auto">
          {item.actionLabel}
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
        <p className="mt-3 truncate text-2xl font-black text-primary">{value}</p>
        <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
      </CardContent>
    </Card>
  );
}

function itemIcon(label: RecommendationItem["label"]) {
  if (label === "Prioridad alta") return <Lightbulb className="h-5 w-5" aria-hidden="true" />;
  if (label === "Dato pendiente") return <PencilLine className="h-5 w-5" aria-hidden="true" />;
  if (label === "Mejora sugerida") return <CheckCircle2 className="h-5 w-5" aria-hidden="true" />;
  return <CalendarDays className="h-5 w-5" aria-hidden="true" />;
}
