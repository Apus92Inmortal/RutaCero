import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { BRAND_ASSETS } from "@/lib/brand-assets";
import { BRAND } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";

export function accessPriceLabel() {
  return `${formatCurrency(BRAND.price).replace(/\s/g, "")} ${BRAND.currency}`;
}

export function AccessActivationCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-8 sm:py-10">
      <Card className="w-full max-w-lg">
        <CardContent className="p-6 text-center sm:p-8">
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
          <h1 className="mt-8 text-2xl font-black text-primary">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
          {children}
        </CardContent>
      </Card>
    </main>
  );
}

export function CommercialPromise() {
  return (
    <p className="mt-5 rounded-lg border border-line bg-surface p-3 text-center text-sm font-semibold leading-6 text-foreground">
      Pago único de {accessPriceLabel()} · Acceso de por vida
    </p>
  );
}
