import { GoalForm } from "@/components/forms/goal-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getFinancialSnapshot } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

export default async function GoalsPage() {
  const { goals } = await getFinancialSnapshot();

  return (
    <div className="space-y-6">
      <PageHeader title="Metas" description="Define objetivos como eliminar una deuda, bajar deuda total o completar meses sin mora." />
      <Card>
        <CardHeader title="Crear meta" />
        <CardContent>
          <GoalForm />
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {goals.map((goal) => {
          const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
          return (
            <Card key={goal.id}>
              <CardContent>
                <h2 className="text-lg font-black text-primary">{goal.title}</h2>
                <p className="mt-2 text-sm text-muted">
                  {formatCurrency(goal.current_amount)} de {formatCurrency(goal.target_amount)}
                </p>
                <div className="mt-4">
                  <ProgressBar value={progress} />
                </div>
                <p className="mt-4 text-xs font-semibold text-muted">
                  Fecha objetivo: {goal.target_date ?? "Sin fecha definida"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

