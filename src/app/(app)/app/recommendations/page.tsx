import { RecommendationCard } from "@/components/dashboard/recommendation-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getFinancialSnapshot } from "@/lib/data";
import { generateMonthlyRecommendation, getHighestInterestDebt, getMostUrgentDebt } from "@/lib/financial-engine";

export default async function RecommendationsPage() {
  const { profile, debts } = await getFinancialSnapshot();
  const recommendation = generateMonthlyRecommendation(profile, debts);
  const urgent = getMostUrgentDebt(debts);
  const expensive = getHighestInterestDebt(debts);
  const items = [
    ["Qué deuda pagar primero", recommendation.targetDebt?.name ?? "Agrega una deuda para calcular prioridad"],
    ["Qué deuda renegociar", urgent?.status === "late" || urgent?.status === "collections" ? urgent.name : "Ninguna con urgencia crítica"],
    ["Qué deuda no consolidar", expensive?.prepayment_penalty ? expensive.name : "Evita consolidar si la tasa nueva no baja el costo total"],
    ["Qué error evitar", "No uses cupos liberados después de consolidar o cerrar una deuda."],
    ["Qué hacer este mes", recommendation.body],
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recomendaciones automáticas"
        description="No tienes que adivinar. Estas son las acciones que más impacto tienen en tu situación actual."
      />
      <RecommendationCard {...recommendation} />
      <div className="grid gap-4 lg:grid-cols-2">
        {items.map(([title, text]) => (
          <Card key={title}>
            <CardContent>
              <Badge variant="info">{title}</Badge>
              <p className="mt-4 text-sm leading-6 text-muted">{text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

