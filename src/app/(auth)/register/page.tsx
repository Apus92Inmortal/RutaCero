import Link from "next/link";
import Image from "next/image";
import { RegisterForm } from "@/components/forms/register-form";
import { Card, CardContent } from "@/components/ui/card";
import { BRAND_ASSETS } from "@/lib/brand-assets";
import { BRAND } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardContent>
          <Link href="/" aria-label="Ruta Cero by INTRA, inicio" className="inline-flex">
            <Image
              src={BRAND_ASSETS.rutaCero.logoCompact}
              alt="Ruta Cero by INTRA"
              width={180}
              height={60}
              priority
              className="h-12 w-auto object-contain"
            />
          </Link>
          <h1 className="mt-6 text-2xl font-black text-primary">Crea tu cuenta</h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Primero creamos tu cuenta en estado pendiente de pago. Luego podrás activar el acceso vitalicio por{" "}
            {formatCurrency(BRAND.price)}.
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
