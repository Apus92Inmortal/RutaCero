import { AlertCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { AccessActivationCard, CommercialPromise } from "@/components/payments/access-activation-card";

export default function PaymentFailedPage() {
  return (
    <AccessActivationCard
      title="No pudimos confirmar el pago"
      description="Puedes intentarlo de nuevo o revisar el método de pago."
    >
      <div className="mx-auto mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
        <AlertCircle className="h-6 w-6" aria-hidden="true" />
      </div>
      <CommercialPromise />
      <ButtonLink href="/checkout" className="mt-7 w-full" size="lg">
        Intentar de nuevo
      </ButtonLink>
    </AccessActivationCard>
  );
}
