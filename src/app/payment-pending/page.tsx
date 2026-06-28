import { Clock3 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { AccessActivationCard, CommercialPromise } from "@/components/payments/access-activation-card";

export default function PaymentPendingPage() {
  return (
    <AccessActivationCard
      title="Estamos confirmando tu pago"
      description="La confirmación puede tardar unos minutos. Te avisaremos cuando tu acceso esté activo."
    >
      <div className="mx-auto mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-warning/20 text-warning">
        <Clock3 className="h-6 w-6" aria-hidden="true" />
      </div>
      <CommercialPromise />
      <ButtonLink href="/checkout" className="mt-7 w-full" size="lg" variant="secondary">
        Revisar estado
      </ButtonLink>
    </AccessActivationCard>
  );
}
