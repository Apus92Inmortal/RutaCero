import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentFailedPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <Card className="w-full max-w-lg text-center">
        <CardContent>
          <h1 className="text-3xl font-black text-primary">No pudimos confirmar tu pago</h1>
          <p className="mt-4 text-sm leading-6 text-muted">
            Puedes intentarlo nuevamente para activar tu acceso vitalicio.
          </p>
          <ButtonLink href="/checkout" className="mt-7">
            Reintentar pago
          </ButtonLink>
        </CardContent>
      </Card>
    </main>
  );
}

