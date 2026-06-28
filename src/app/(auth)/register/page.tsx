import Link from "next/link";
import Image from "next/image";
import { RegisterForm } from "@/components/forms/register-form";
import { Card, CardContent } from "@/components/ui/card";
import { BRAND_ASSETS } from "@/lib/brand-assets";
import { BRAND } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";

export default function RegisterPage() {
  const priceLabel = `${formatCurrency(BRAND.price).replace(/\s/g, "")} ${BRAND.currency}`;

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-8 sm:py-10">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 sm:p-8">
          <Link href="/" aria-label="Ruta Cero by INTRA, inicio" className="mx-auto flex w-fit">
            <Image
              src={BRAND_ASSETS.rutaCero.logoPrimary}
              alt="Ruta Cero by INTRA"
              width={220}
              height={55}
              priority
              className="h-auto w-52 max-w-full object-contain"
            />
          </Link>
          <h1 className="mt-8 text-center text-2xl font-black text-primary">Obtén acceso a Ruta Cero</h1>
          <p className="mt-2 text-center text-sm leading-6 text-muted">
            Crea tu cuenta para activar tu plan financiero y continuar con el pago único.
          </p>
          <p className="mt-4 rounded-lg border border-line bg-surface p-3 text-center text-sm font-semibold leading-6 text-foreground">
            Pago único de {priceLabel} · Acceso de por vida
          </p>
          <div className="mt-6">
            <RegisterForm />
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
