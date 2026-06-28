import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getSessionProfile } from "@/lib/auth";
import { CheckoutButton } from "@/components/payments/checkout-button";
import {
  AccessActivationCard,
  CommercialPromise,
  accessPriceLabel,
} from "@/components/payments/access-activation-card";

export const dynamic = "force-dynamic";

const accessDetails = [
  `Pago único de ${accessPriceLabel()}`,
  "Acceso de por vida",
] as const;

export default async function CheckoutPage() {
  const { user, profile, isConfigured } = await getSessionProfile();
  if (!isConfigured) redirect("/login?error=config");
  if (!user) redirect("/login");

  if (profile?.access_status === "active" && profile.access_type === "lifetime") {
    redirect(profile.onboarding_completed ? "/app" : "/app/onboarding");
  }

  if (profile?.access_status === "blocked" || profile?.access_status === "refunded") {
    redirect("/payment-required");
  }

  return (
    <AccessActivationCard
      title="Activa tu acceso a Ruta Cero"
      description="Completa el pago único para desbloquear tu plan financiero y continuar."
    >
      <CommercialPromise />
      <div className="mt-6 rounded-lg border border-line bg-surface p-4 text-left">
        <p className="text-sm font-semibold text-muted">Resumen de activación</p>
        <div className="mt-4 space-y-3">
          {accessDetails.map((detail) => (
            <div key={detail} className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
              <span>{detail}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <CheckoutButton />
      </div>
    </AccessActivationCard>
  );
}
