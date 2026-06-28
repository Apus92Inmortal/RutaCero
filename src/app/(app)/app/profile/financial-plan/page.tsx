import { ArrowLeft } from "lucide-react";
import { OnboardingForm } from "@/components/forms/onboarding-form";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { requireActiveUser } from "@/lib/auth";

export default async function FinancialPlanPage() {
  const { profile } = await requireActiveUser();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Actualizar mi plan financiero"
        description="Ajusta tus ingresos, gastos y capacidad de pago para recalcular tu ruta hacia cero deudas."
        action={
          <ButtonLink href="/app/profile" variant="secondary" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Volver al perfil
          </ButtonLink>
        }
      />
      <Card>
        <CardHeader
          title="Informacion financiera"
          description="Guarda cambios cada vez que tu salario, presupuesto o urgencia financiera cambie."
        />
        <CardContent>
          <OnboardingForm
            profile={profile}
            submitLabel="Guardar cambios"
            pendingLabel="Actualizando..."
            redirectTo="/app/profile"
          />
        </CardContent>
      </Card>
    </div>
  );
}
