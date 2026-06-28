import Link from "next/link";
import Image from "next/image";
import { Calculator, ChartNoAxesCombined, Target } from "lucide-react";
import { ProductPreview } from "@/components/landing/product-preview";
import { ButtonLink } from "@/components/ui/button";
import { BRAND_ASSETS } from "@/lib/brand-assets";

const features = [
  {
    icon: Target,
    title: "Prioridad inteligente",
    description: "Identificamos qué deuda pagar primero para ahorrar más.",
  },
  {
    icon: Calculator,
    title: "Simula tu salida",
    description: "Prueba escenarios y descubre cuánto tardarás en salir de deudas.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Progreso visible",
    description: "Sigue tu avance mes a mes con claridad y motivación.",
  },
] as const;

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-foreground">
      <header className="sticky top-0 z-50 border-b border-line/90 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-20 max-w-[1780px] items-center justify-between px-5 sm:h-[90px] sm:px-8 xl:px-12">
          <Link href="/" aria-label="Ruta Cero by INTRA, inicio" className="flex items-center">
            <Image
              src={BRAND_ASSETS.rutaCero.appIcon}
              alt="Ruta Cero by INTRA"
              width={48}
              height={48}
              priority
              className="h-11 w-11 rounded-xl object-contain sm:h-12 sm:w-12"
            />
          </Link>

          <nav aria-label="Navegación principal" className="hidden items-center gap-10 lg:flex xl:gap-14">
            <Link className="text-base font-medium text-foreground hover:text-primary" href="#como-funciona">
              Cómo funciona
            </Link>
            <Link className="text-base font-medium text-foreground hover:text-primary" href="#beneficios">
              Beneficios
            </Link>
            <Link className="text-base font-medium text-foreground hover:text-primary" href="#acceso-vitalicio">
              Acceso vitalicio
            </Link>
          </nav>

          <div className="flex items-center gap-3 sm:gap-6">
            <Link className="hidden text-base font-medium text-foreground hover:text-primary sm:inline" href="/login">
              Iniciar sesión
            </Link>
            <ButtonLink href="/register" variant="success" className="h-12 px-4 text-sm text-white sm:px-6 sm:text-base">
              Obtener acceso
            </ButtonLink>
          </div>
        </div>
      </header>

      <section className="overflow-hidden border-b border-line/70 bg-[#f4f8fb]" aria-labelledby="landing-heading">
        <div className="mx-auto grid max-w-[1780px] items-center gap-12 px-5 py-14 sm:px-8 sm:py-16 xl:min-h-[612px] xl:grid-cols-[minmax(430px,0.6fr)_minmax(680px,1fr)] xl:gap-14 xl:px-12 xl:py-8">
          <div className="relative z-10 max-w-[620px] xl:translate-y-3 xl:pl-4">
            <Image
              src={BRAND_ASSETS.rutaCero.logoPrimary}
              alt="Ruta Cero by INTRA"
              width={320}
              height={80}
              priority
              className="h-auto w-64 max-w-full object-contain sm:w-80"
            />
            <p className="mt-8 text-xs font-extrabold uppercase tracking-[0.14em] text-[#14994f] sm:text-sm">
              Ruta Cero — Acceso vitalicio
            </p>
            <h1
              id="landing-heading"
              className="mt-7 text-[clamp(3rem,4.3vw,4rem)] font-black leading-[1.04] tracking-normal text-primary"
            >
              <span className="block">Sal de deudas</span>
              <span className="block">con un plan claro.</span>
            </h1>
            <p className="mt-6 max-w-[525px] text-lg leading-8 text-muted sm:text-2xl sm:leading-10">
              Organiza tus deudas, descubre qué pagar primero y avanza con una ruta hecha para ti.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/register" size="lg" variant="success" className="h-16 min-w-64 text-lg text-white">
                Crear mi plan
              </ButtonLink>
              <ButtonLink href="#como-funciona" size="lg" variant="secondary" className="h-16 min-w-64 text-lg">
                Ver cómo funciona
              </ButtonLink>
            </div>

            <p id="acceso-vitalicio" className="mt-8 text-sm font-medium text-muted sm:text-lg">
              Pago único de $49.900 COP · Sin suscripciones
            </p>
          </div>

          <div id="como-funciona" className="w-full max-w-[920px] scroll-mt-28">
            <ProductPreview />
          </div>
        </div>
      </section>

      <section id="beneficios" className="scroll-mt-24 px-5 pt-5 pb-14 sm:px-8 sm:pt-5 sm:pb-16" aria-labelledby="benefits-heading">
        <div className="mx-auto max-w-[1480px]">
          <h2 id="benefits-heading" className="text-center text-3xl font-black tracking-normal text-primary sm:text-4xl">
            Decisiones claras, mes a mes
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-3 lg:gap-7">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="flex min-h-36 items-center gap-5 rounded-xl border border-line bg-white p-6 shadow-sm"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-line/80 text-primary">
                    <Icon className="h-8 w-8" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold tracking-normal text-primary">{feature.title}</h3>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-muted">{feature.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
