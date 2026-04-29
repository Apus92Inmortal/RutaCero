import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getSessionProfile } from "@/lib/auth";
import { BRAND } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckoutButton } from "@/components/payments/checkout-button";

export const dynamic = "force-dynamic";

const checkoutBenefits = [
  "Pago único",
  "Sin mensualidades",
  "Acceso de por vida",
  "Deudas ilimitadas",
  "Plan personalizado",
  "Simulador y comparador de estrategias",
];

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
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <Card className="w-full max-w-3xl">
        <CardContent className="grid gap-8 md:grid-cols-[1fr_320px]">
          <div>
            <Badge variant="success">{BRAND.productName}</Badge>
            <h1 className="mt-5 text-3xl font-black tracking-normal text-primary">Activa tu acceso vitalicio</h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              Tu cuenta ya fue creada. Para usar Ruta Cero, completa el pago único y recibe acceso de por vida.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {checkoutBenefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {benefit}
                </div>
              ))}
            </div>
            <p className="mt-6 rounded-lg bg-[#eef4f8] p-4 text-sm leading-6 text-muted">
              Esta versión deja listo el endpoint de checkout y el webhook para conectar Bold, Wompi, PayU u otra
              pasarela. La confirmación real debe llegar por webhook antes de activar el perfil.
            </p>
          </div>
          <div className="rounded-lg border border-line bg-background p-5">
            <p className="text-sm font-semibold text-muted">Resumen del producto</p>
            <h2 className="mt-3 text-xl font-black text-primary">{BRAND.productName}</h2>
            <div className="mt-5 text-4xl font-black text-primary">{formatCurrency(BRAND.price)}</div>
            <div className="mt-5 space-y-2 text-sm font-semibold text-foreground">
              <p>Pago único</p>
              <p>Sin mensualidades</p>
              <p>Acceso de por vida</p>
            </div>
            <div className="mt-6">
              <CheckoutButton />
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
