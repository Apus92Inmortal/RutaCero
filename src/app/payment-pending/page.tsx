import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentPendingPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <Card className="w-full max-w-lg text-center">
        <CardContent>
          <h1 className="text-3xl font-black text-primary">Estamos confirmando tu pago</h1>
          <p className="mt-4 text-sm leading-6 text-muted">
            Tu pago está pendiente de confirmación. Cuando sea aprobado, tu acceso se activará automáticamente.
          </p>
          <ButtonLink href="/checkout" className="mt-7" variant="secondary">
            Ver estado del acceso
          </ButtonLink>
        </CardContent>
      </Card>
    </main>
  );
}

