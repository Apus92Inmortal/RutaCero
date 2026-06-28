import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { AccessActivationCard } from "@/components/payments/access-activation-card";

export default function PaymentSuccessPage() {
  return (
    <AccessActivationCard
      title="Acceso activado"
      description="Tu acceso a Ruta Cero quedó activo. Ya puedes continuar con tu plan financiero."
    >
      <div className="mx-auto mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
        <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
      </div>
      <ButtonLink href="/app/onboarding" className="mt-7 w-full" size="lg">
        Continuar
      </ButtonLink>
    </AccessActivationCard>
  );
}
