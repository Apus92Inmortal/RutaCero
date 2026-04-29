import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentRequiredPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <Card className="w-full max-w-lg text-center">
        <CardContent>
          <h1 className="text-3xl font-black text-primary">Activa tu acceso vitalicio</h1>
          <p className="mt-4 text-sm leading-6 text-muted">
            Tu cuenta ya fue creada. Para usar Ruta Cero, completa el pago único y recibe acceso de por vida.
          </p>
          <ButtonLink href="/checkout" className="mt-7">
            Finalizar pago
          </ButtonLink>
        </CardContent>
      </Card>
    </main>
  );
}

