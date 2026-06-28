import type { ReactNode } from "react";
import { CircleDollarSign, RefreshCw, ShieldCheck, TrendingUp, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { requireActiveUser } from "@/lib/auth";
import { URGENCY_LEVELS } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import type { Intensity } from "@/lib/types";

function urgencyLabel(value: Intensity | null) {
  return URGENCY_LEVELS.find((level) => level.value === value)?.label ?? "Media";
}

function formatAccessDate(value: string | null) {
  if (!value) return "Activo";
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default async function ProfilePage() {
  const { profile, user } = await requireActiveUser();
  const netCashFlow = profile.monthly_income - profile.fixed_expenses - profile.variable_expenses;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Perfil"
        description="Tu informacion base para que Ruta Cero ajuste el plan cuando cambien tus ingresos, gastos o capacidad de pago."
        action={<Badge variant="success">Acceso vitalicio</Badge>}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader
            title="Plan financiero"
            description="Estos datos alimentan tus recomendaciones, simulaciones y fecha estimada de salida de deudas."
            action={
              <ButtonLink href="/app/profile/financial-plan" size="sm">
                <RefreshCw className="h-4 w-4" />
                Actualizar mi plan financiero
              </ButtonLink>
            }
          />
          <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <ProfileMetric
              label="Ingresos mensuales"
              value={formatCurrency(profile.monthly_income, profile.currency)}
              icon={<CircleDollarSign className="h-5 w-5" />}
            />
            <ProfileMetric
              label="Gastos fijos"
              value={formatCurrency(profile.fixed_expenses, profile.currency)}
              icon={<WalletCards className="h-5 w-5" />}
            />
            <ProfileMetric
              label="Gastos variables"
              value={formatCurrency(profile.variable_expenses, profile.currency)}
              icon={<WalletCards className="h-5 w-5" />}
            />
            <ProfileMetric
              label="Flujo disponible estimado"
              value={formatCurrency(netCashFlow, profile.currency)}
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <ProfileMetric
              label="Dinero para deudas"
              value={formatCurrency(profile.debt_budget, profile.currency)}
              icon={<CircleDollarSign className="h-5 w-5" />}
            />
            <ProfileMetric
              label="Abono extra"
              value={formatCurrency(profile.extra_payment_capacity, profile.currency)}
              icon={<TrendingUp className="h-5 w-5" />}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Cuenta" description={user.email ?? "Correo no disponible"} />
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-muted">Nombre</p>
                <p className="mt-1 text-lg font-bold text-primary">{profile.full_name}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Pago unico activo
                </Badge>
                <Badge>{profile.currency}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Estado del plan" />
            <CardContent className="space-y-4">
              <ProfileRow label="Urgencia financiera" value={urgencyLabel(profile.urgency_level)} />
              <ProfileRow label="Plan inicial" value={profile.onboarding_completed ? "Completado" : "Pendiente"} />
              <ProfileRow label="Acceso concedido" value={formatAccessDate(profile.lifetime_access_granted_at)} />
              <div className="rounded-lg bg-[#eef4f8] p-4 text-sm leading-6 text-muted">
                Cuando cambie tu salario, trabajo o presupuesto, actualiza este plan antes de tomar decisiones sobre abonos extra.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProfileMetric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="min-h-28 rounded-lg border border-line bg-[#f8fbfd] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-muted">{label}</p>
        <div className="rounded-lg bg-white p-2 text-primary ring-1 ring-line">{icon}</div>
      </div>
      <p className="mt-3 text-xl font-black text-primary">{value}</p>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-right text-sm font-bold text-primary">{value}</span>
    </div>
  );
}
