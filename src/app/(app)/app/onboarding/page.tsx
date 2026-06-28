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
        description="Cuéntanos lo básico sobre tus ingresos y capacidad de pago para personalizar tu ruta."
      />
      <Card className="max-w-4xl">
        <CardHeader
          title="Información inicial"
          description="Esta información ayuda a calcular y organizar tu primer plan financiero."
        />
        <CardContent className="space-y-5">
          <p className="rounded-lg border border-line bg-surface p-3 text-sm leading-6 text-muted">
            Puedes ajustar estos datos más adelante desde tu perfil.
          </p>
          {profile ? <OnboardingForm profile={profile} /> : null}
        </CardContent>
      </Card>
    </div>
  );
}
