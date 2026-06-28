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

const howItWorksSteps = [
  {
    title: "Registra tus deudas",
    description: "Agrega saldo, cuota, fecha de pago y tasa cuando la conozcas.",
  },
  {
    title: "Compara tu ruta",
    description: "Ruta Cero identifica prioridades y te muestra escenarios posibles.",
  },
  {
    title: "Avanza mes a mes",
    description: "Sigue tu progreso, revisa alertas y ajusta tu plan cuando cambie tu situación.",
  },
] as const;

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-foreground">
      <header className="sticky top-0 z-50 border-b border-line/90 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-[72px] max-w-[1780px] items-center justify-between gap-3 px-4 sm:h-[90px] sm:px-8 xl:px-12">
          <Link href="/" aria-label="Ruta Cero by INTRA, inicio" className="flex items-center">
            <Image
              src={BRAND_ASSETS.rutaCero.appIcon}
              alt="Ruta Cero by INTRA"
              width={48}
              height={48}
              priority
              className="h-10 w-10 rounded-xl object-contain sm:h-12 sm:w-12"
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

          <div className="flex items-center gap-2 sm:gap-6">
            <Link className="whitespace-nowrap text-sm font-semibold text-foreground hover:text-primary sm:text-base" href="/login">
              Iniciar sesión
            </Link>
            <ButtonLink href="/register" variant="success" className="h-10 whitespace-nowrap px-2.5 text-[11px] sm:h-12 sm:px-6 sm:text-base">
              Obtener acceso
            </ButtonLink>
          </div>
        </div>
      </header>

      <section className="overflow-hidden border-b border-line/70 bg-background" aria-labelledby="landing-heading">
        <div className="mx-auto grid max-w-[1780px] items-center gap-12 px-5 py-12 sm:px-8 sm:py-16 xl:min-h-[612px] xl:grid-cols-[minmax(560px,0.7fr)_minmax(560px,1fr)] xl:gap-10 xl:px-12 xl:py-8">
          <div className="relative z-10 max-w-[620px] xl:translate-y-3 xl:pl-4">
            <Image
              src={BRAND_ASSETS.rutaCero.logoPrimary}
              alt="Ruta Cero by INTRA"
              width={320}
              height={80}
              priority
              className="h-auto w-72 max-w-full object-contain sm:w-96 lg:w-[420px]"
            />
            <h1
              id="landing-heading"
              className="mt-8 text-4xl font-black leading-tight tracking-normal text-primary sm:text-5xl sm:leading-[1.05] lg:text-6xl"
            >
              <span className="block">Sal de deudas</span>
              <span className="block">con un plan claro.</span>
            </h1>
            <p className="mt-6 max-w-[560px] text-base leading-7 text-muted sm:text-xl sm:leading-8">
              Organiza tus deudas, identifica qué pagar primero y toma decisiones mes a mes con una ruta clara.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/register" size="lg" variant="success" className="min-h-12 w-full px-5 text-base sm:w-auto sm:min-w-64">
                Obtener acceso
              </ButtonLink>
            </div>

            <p id="acceso-vitalicio" className="mt-5 max-w-[560px] text-sm font-semibold leading-6 text-muted sm:text-base">
              Pago único de $49.900 COP · Acceso de por vida
            </p>
          </div>

          <div className="w-full max-w-[920px]">
            <ProductPreview />
          </div>
        </div>
      </section>

      <section id="como-funciona" className="scroll-mt-24 bg-white px-5 py-14 sm:px-8 sm:py-16" aria-labelledby="how-it-works-heading">
        <div className="mx-auto max-w-[1480px]">
          <div className="max-w-5xl">
            <h2 id="how-it-works-heading" className="text-3xl font-black tracking-normal text-primary sm:text-4xl">
              Cómo funciona
            </h2>
            <p className="mt-3 text-base leading-7 text-muted lg:whitespace-nowrap">
              Una forma simple de ordenar tus deudas, comparar escenarios y seguir tu avance sin complicar tu presupuesto.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3 lg:gap-7">
            {howItWorksSteps.map((step, index) => (
              <article key={step.title} className="rounded-lg border border-line bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success text-sm font-black text-primary">
                  {index + 1}
                </div>
                <h3 className="mt-5 text-lg font-extrabold tracking-normal text-primary">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="beneficios" className="scroll-mt-24 bg-background px-5 py-14 sm:px-8 sm:py-16" aria-labelledby="benefits-heading">
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
                  className="flex min-h-36 items-center gap-5 rounded-lg border border-line bg-white p-6 shadow-sm"
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
