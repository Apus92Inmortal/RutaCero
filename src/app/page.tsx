import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { BRAND } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const benefits = [
  "Deudas ilimitadas",
  "Plan personalizado de salida",
  "Simulador de pagos",
  "Comparador de estrategias",
  "Calendario de pagos",
  "Alertas inteligentes",
  "Recomendaciones automáticas",
  "Reporte mensual",
  "Acceso de por vida",
];

export default function LandingPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="mx-auto grid min-h-[92vh] max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="success" className="mb-6">
              {BRAND.productName}
            </Badge>
            <h1 className="text-4xl font-black leading-tight tracking-normal sm:text-5xl lg:text-6xl">
              Sal de deudas con un plan claro, inteligente y personalizado.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
              Ingresa tus deudas, ingresos y gastos. Ruta Cero analiza tu situación y te dice qué pagar primero,
              cuánto abonar y cómo salir más rápido.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/register" size="lg" variant="success">
                Obtener acceso vitalicio <ArrowRight className="h-5 w-5" />
              </ButtonLink>
              <ButtonLink href="/login" size="lg" variant="secondary">
                Ya tengo cuenta
              </ButtonLink>
            </div>
            <p className="mt-4 text-sm font-semibold text-white/70">
              Un solo pago. Sin suscripciones. Sin cobros mensuales.
            </p>
          </div>

          <div className="pb-10 lg:pb-0">
            <div className="rounded-lg border border-white/15 bg-white p-4 text-primary shadow-2xl">
              <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Vista de producto</p>
                  <p className="mt-1 text-lg font-black">Tu ruta hacia cero deudas</p>
                </div>
                <Badge variant="success">Pago único</Badge>
              </div>
              <div className="grid gap-3 py-4 sm:grid-cols-2">
                <div className="rounded-lg bg-[#f4f7fa] p-4">
                  <BarChart3 className="h-5 w-5 text-success" />
                  <p className="mt-4 text-xs font-semibold text-muted">Total adeudado</p>
                  <p className="mt-1 text-2xl font-black">{formatCurrency(12400000)}</p>
                </div>
                <div className="rounded-lg bg-[#f4f7fa] p-4">
                  <Target className="h-5 w-5 text-danger" />
                  <p className="mt-4 text-xs font-semibold text-muted">Deuda objetivo</p>
                  <p className="mt-1 text-lg font-black">Tarjeta principal</p>
                </div>
              </div>
              <div className="rounded-lg bg-primary p-4 text-white">
                <p className="text-sm font-semibold text-white/70">Tu recomendación de este mes</p>
                <p className="mt-2 text-xl font-black">Prioriza la deuda de mayor tasa</p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Reducirás intereses y podrás adelantar tu fecha estimada de salida.
                </p>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  ["Score", "74/100"],
                  ["Salida", "18 meses"],
                  ["Ahorro", "$820.000"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-line p-3">
                    <p className="text-xs text-muted">{label}</p>
                    <p className="mt-1 font-black">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
        {[
          {
            icon: Sparkles,
            title: "Recomendación automática",
            text: "Ruta Cero ordena tus deudas por urgencia, tasa, saldo y capacidad de pago.",
          },
          {
            icon: CalendarDays,
            title: "Calendario accionable",
            text: "Visualiza próximos pagos y registra avances sin perder el hilo de tu plan.",
          },
          {
            icon: ShieldCheck,
            title: "Diseñado para decidir",
            text: "Compara bola de nieve, avalancha, consolidación y refinanciación con contexto real.",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-lg border border-line bg-white p-6 shadow-sm">
              <Icon className="h-7 w-7 text-success" />
              <h2 className="mt-5 text-lg font-black text-primary">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{item.text}</p>
            </div>
          );
        })}
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1fr] lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-success">Acceso vitalicio</p>
            <h2 className="mt-4 text-3xl font-black tracking-normal text-primary sm:text-4xl">
              Paga una vez y empieza con un plan financiero personal.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted">{BRAND.commercialCopy}</p>
          </div>
          <div className="rounded-lg border border-line bg-background p-6 shadow-sm">
            <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-2xl font-black text-primary">Acceso vitalicio</h3>
                <p className="mt-1 text-sm text-muted">Precio de lanzamiento por tiempo limitado.</p>
              </div>
              <div className="text-4xl font-black text-primary">{formatCurrency(BRAND.price)}</div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {benefit}
                </div>
              ))}
            </div>
            <ButtonLink href="/register" className="mt-7 w-full" size="lg">
              Pagar una vez y empezar
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}

