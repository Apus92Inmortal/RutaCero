import { ArrowRight, BookOpen, CalendarDays, Landmark, Percent, PiggyBank, Route, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

type EducationModule = {
  title: string;
  description: string;
  category: "Deudas" | "Pagos" | "Intereses" | "Hábitos" | "Uso de Ruta Cero";
  actionLabel: string;
  href: string;
  icon: typeof BookOpen;
};

const modules: EducationModule[] = [
  {
    title: "Cómo priorizar una deuda",
    description: "Aprende a mirar saldo, tasa, urgencia y cuota para decidir qué revisar primero.",
    category: "Deudas",
    actionLabel: "Ver deudas",
    href: "/app/debts",
    icon: WalletCards,
  },
  {
    title: "Qué significa tasa de interés",
    description: "La tasa muestra cuánto puede crecer una deuda con el tiempo. Entenderla mejora tus decisiones.",
    category: "Intereses",
    actionLabel: "Ver estrategia",
    href: "/app/strategies",
    icon: Percent,
  },
  {
    title: "Cuota mínima y abono extra",
    description: "Un abono extra puede ayudarte a reducir intereses si lo aplicas con estrategia.",
    category: "Pagos",
    actionLabel: "Simular escenario",
    href: "/app/simulator",
    icon: PiggyBank,
  },
  {
    title: "Cómo usar el calendario de pagos",
    description: "Organiza fechas y cuotas para anticiparte sin depender de la memoria.",
    category: "Uso de Ruta Cero",
    actionLabel: "Ver calendario",
    href: "/app/calendar",
    icon: CalendarDays,
  },
  {
    title: "Mantén actualizado tu plan",
    description: "Actualizar tus pagos permite que Ruta Cero calcule mejor tu progreso.",
    category: "Uso de Ruta Cero",
    actionLabel: "Ver recomendaciones",
    href: "/app/recommendations",
    icon: Route,
  },
  {
    title: "Si tu capacidad de pago cambia",
    description: "No tienes que saberlo todo de una vez. Ajusta tus datos cuando tu realidad cambie.",
    category: "Hábitos",
    actionLabel: "Actualizar plan",
    href: "/app/profile/financial-plan",
    icon: Landmark,
  },
];

const categories = ["Deudas", "Pagos", "Intereses", "Hábitos", "Uso de Ruta Cero"];

export default function EducationPage() {
  if (modules.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Educación financiera"
          description="Aprende conceptos simples para tomar mejores decisiones y avanzar con más claridad en tu plan."
        />
        <EmptyState
          title="Pronto tendrás más contenido educativo"
          description="Estamos preparando guías simples para ayudarte a entender mejor tu ruta financiera."
          action={
            <ButtonLink href="/app" variant="secondary">
              Volver al dashboard
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Educación financiera"
        description="Aprende conceptos simples para tomar mejores decisiones y avanzar con más claridad en tu plan."
      />

      <Card>
        <CardContent className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section aria-labelledby="education-featured-title">
            <Badge variant="success">Empieza por lo básico</Badge>
            <h2 id="education-featured-title" className="mt-4 text-2xl font-black tracking-normal text-primary">
              Entiende tu ruta antes de decidir
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
              Ruta Cero funciona mejor cuando tus datos están al día y entiendes qué significa cada movimiento. Avanza paso a
              paso: deuda, pago, interés y hábito.
            </p>
          </section>
          <div className="rounded-lg border border-line bg-surface p-4">
            <p className="text-sm font-semibold text-primary">Consejo rápido</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Un abono extra puede ayudar, pero primero confirma que cubres tus pagos mínimos y gastos básicos.
            </p>
            <ButtonLink href="/app/simulator" variant="secondary" size="sm" className="mt-4 w-full">
              Simular escenario
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Categorías" description="Elige un tema para ubicar mejor qué quieres aprender." />
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category} variant="default">
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Guías educativas">
        {modules.map((module) => (
          <EducationCard key={module.title} module={module} />
        ))}
      </section>
    </div>
  );
}

function EducationCard({ module }: { module: EducationModule }) {
  const Icon = module.icon;

  return (
    <Card>
      <CardContent className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <Badge variant="info">{module.category}</Badge>
        </div>
        <h2 className="mt-5 text-lg font-black text-primary">{module.title}</h2>
        <p className="mt-3 flex-1 text-sm leading-6 text-muted">{module.description}</p>
        <div className="mt-5 border-t border-line pt-4">
          <ButtonLink href={module.href} variant="secondary" size="sm" className="w-full">
            {module.actionLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </CardContent>
    </Card>
  );
}
