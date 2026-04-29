import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";
import { Card, CardContent } from "@/components/ui/card";
import { BRAND } from "@/lib/constants";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardContent>
          <Link href="/" className="text-xl font-black text-primary">
            {BRAND.name}
          </Link>
          <h1 className="mt-6 text-2xl font-black text-primary">Inicia sesión</h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Entra a tu acceso vitalicio para continuar tu ruta hacia cero deudas.
          </p>
          {params.error === "config" ? (
            <p className="mt-4 rounded-lg bg-[#fdecea] p-3 text-sm font-medium text-danger">
              Faltan variables de Supabase. Revisa el archivo `.env.local`.
            </p>
          ) : null}
          <div className="mt-6">
            <LoginForm />
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Obtener acceso vitalicio
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

