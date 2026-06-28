import Image from "next/image";
import {
  BarChart3,
  CalendarDays,
  CircleGauge,
  CreditCard,
  Home,
  Lightbulb,
  Settings,
  SlidersHorizontal,
  WalletCards,
} from "lucide-react";
import { BRAND_ASSETS } from "@/lib/brand-assets";

const navigation = [
  { icon: Home, label: "Resumen", active: true },
  { icon: CreditCard, label: "Deudas", active: false },
  { icon: CalendarDays, label: "Plan de pago", active: false },
  { icon: SlidersHorizontal, label: "Simulador", active: false },
  { icon: BarChart3, label: "Progreso", active: false },
  { icon: Settings, label: "Ajustes", active: false },
] as const;

const metrics = [
  {
    label: "Total adeudado",
    value: "$12.400.000",
    icon: WalletCards,
    tone: "navy",
  },
  {
    label: "Salida estimada",
    value: "18 meses",
    icon: CalendarDays,
    tone: "green",
  },
  {
    label: "Score financiero",
    value: "74/100",
    icon: CircleGauge,
    tone: "green",
  },
] as const;

function DebtProjectionChart() {
  return (
    <div className="min-w-0 rounded-lg border border-line bg-white p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-bold text-primary sm:text-xs">Proyección de deuda</p>
        <div className="flex items-center gap-3 text-[8px] text-muted sm:text-[9px]">
          <span className="flex items-center gap-1.5">
            <span className="h-px w-4 bg-primary" /> Deuda proyectada
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-px w-4 border-t border-dashed border-success" /> Con tu plan
          </span>
        </div>
      </div>

      <svg viewBox="0 0 500 170" role="img" aria-label="La deuda disminuye durante dieciocho meses en datos demo" className="mt-2 w-full">
        <g stroke="var(--border)" strokeWidth="1">
          <path d="M42 20H490" />
          <path d="M42 63H490" />
          <path d="M42 106H490" />
          <path d="M42 149H490" />
        </g>
        <g fill="var(--secondary-text)" fontSize="10" fontFamily="Inter, sans-serif">
          <text x="2" y="24">$15M</text>
          <text x="6" y="67">$10M</text>
          <text x="12" y="110">$5M</text>
          <text x="24" y="153">$0</text>
          <text x="42" y="166">0</text>
          <text x="117" y="166">3</text>
          <text x="192" y="166">6</text>
          <text x="267" y="166">9</text>
          <text x="337" y="166">12</text>
          <text x="411" y="166">15</text>
          <text x="472" y="166">18</text>
        </g>
        <path
          d="M44 41 C92 49 119 52 156 55 S225 58 256 68 S308 75 329 87 S374 94 392 109 S433 117 450 131 S476 139 488 145"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M44 43 C83 56 118 75 156 90 S226 117 266 129 S340 142 385 147 S452 149 488 149"
          fill="none"
          stroke="var(--success)"
          strokeWidth="2.5"
          strokeDasharray="7 7"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function ProductPreview() {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white shadow-xl shadow-primary/10">
      <div className="grid min-h-[540px] sm:grid-cols-[116px_minmax(0,1fr)]">
        <aside className="hidden border-r border-line bg-white p-3 sm:block" aria-label="Vista previa de navegación">
          <Image
            src={BRAND_ASSETS.rutaCero.appIcon}
            alt="Ruta Cero by INTRA"
            width={48}
            height={48}
            className="mx-auto h-12 w-12 rounded-xl object-contain"
          />
          <div className="mt-5 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-[10px] font-semibold ${
                    item.active ? "bg-primary text-white" : "text-muted"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </aside>

        <div className="min-w-0 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="text-xl font-black tracking-normal text-primary sm:text-2xl lg:text-[1.7rem]">
              Tu ruta hacia cero deudas
            </h2>
            <span className="rounded-full border border-line bg-surface px-3 py-1 text-[10px] font-bold text-primary">
              Datos demo
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              const isGreen = metric.tone === "green";

              return (
                <div key={metric.label} className="flex min-h-24 items-center justify-between gap-2 rounded-lg border border-line p-3">
                  <div className="min-w-0">
                    <p className="text-[9px] font-medium text-muted sm:text-[10px]">{metric.label}</p>
                    <p className="mt-2 whitespace-nowrap text-lg font-black text-primary">
                      {metric.value}
                    </p>
                  </div>
                  <div className={`hidden rounded-full p-2 2xl:block ${isGreen ? "bg-success/15 text-success" : "bg-surface text-primary"}`}>
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-[205px_minmax(0,1fr)]">
            <div className="rounded-lg bg-primary p-4 text-white">
              <Lightbulb className="h-8 w-8 text-success" strokeWidth={1.7} />
              <p className="mt-5 text-[11px] font-medium text-white/80">Tu recomendación</p>
              <p className="mt-3 text-lg font-black leading-tight">Prioriza la deuda de mayor tasa</p>
              <span className="mt-4 inline-flex rounded-md border border-success/35 bg-success px-3 py-1 text-[10px] font-semibold text-primary">
                Avalancha
              </span>
            </div>

            <DebtProjectionChart />
          </div>

          <div className="mt-3 rounded-lg border border-line bg-white px-4 py-3">
            <div className="flex items-center justify-between gap-4 text-[10px]">
              <span className="font-bold text-primary">Progreso del plan</span>
              <span className="font-semibold text-primary">42% completado</span>
            </div>
            <div className="mt-2 flex items-center gap-4">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                <div className="h-full w-[42%] rounded-full bg-success" />
              </div>
              <span className="whitespace-nowrap text-[9px] text-muted">7 de 18 meses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
