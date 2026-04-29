import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { OnboardingForm } from "@/components/forms/onboarding-form";
import { getSessionProfile } from "@/lib/auth";

export default async function OnboardingPage() {
  const { profile } = await getSessionProfile();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Crea tu plan financiero"
        description="Completa tu punto de partida. Con estos datos Ruta Cero calcula capacidad, urgencia y estrategia recomendada."
      />
      <Card>
        <CardHeader title="Información inicial" />
        <CardContent>
          {profile ? <OnboardingForm profile={profile} /> : null}
        </CardContent>
      </Card>
    </div>
  );
}

