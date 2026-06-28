import { ButtonLink } from "@/components/ui/button";
import { AccessActivationCard, CommercialPromise } from "@/components/payments/access-activation-card";

export default function PaymentRequiredPage() {
  return (
    <AccessActivationCard
      title="Activa tu acceso para continuar"
      description="Tu cuenta está creada. Completa el pago único para entrar a Ruta Cero."
    >
      <CommercialPromise />
      <ButtonLink href="/checkout" className="mt-7 w-full" size="lg">
        Activar acceso
      </ButtonLink>
    </AccessActivationCard>
  );
}
