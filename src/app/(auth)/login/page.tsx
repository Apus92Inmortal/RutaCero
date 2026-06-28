import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/components/forms/login-form";
import { Card, CardContent } from "@/components/ui/card";
import { BRAND_ASSETS } from "@/lib/brand-assets";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

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
          <h1 className="mt-8 text-center text-2xl font-black text-primary">Inicia sesión en Ruta Cero</h1>
          <p className="mt-2 text-center text-sm leading-6 text-muted">
            Entra a tu cuenta para continuar con tu plan financiero.
          </p>
          {params.error === "config" ? (
            <p className="mt-4 rounded-lg bg-danger/10 p-3 text-sm font-medium text-danger">
              No pudimos cargar el inicio de sesión. Inténtalo de nuevo más tarde.
            </p>
          ) : null}
          <div className="mt-6">
            <LoginForm />
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            ¿Aún no tienes cuenta?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Obtener acceso
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
