import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentSuccessPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <Card className="w-full max-w-lg text-center">
        <CardContent>
          <h1 className="text-3xl font-black text-primary">Pago aprobado</h1>
          <p className="mt-4 text-sm leading-6 text-muted">
            Tu acceso vitalicio ya está activo. Ahora puedes crear tu plan financiero personalizado.
          </p>
          <ButtonLink href="/app/onboarding" className="mt-7">
            Crear mi plan financiero
          </ButtonLink>
        </CardContent>
      </Card>
    </main>
  );
}

