import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  getHighestInterestDebt,
  getMostUrgentDebt,
  getSmallestDebt,
} from "@/lib/financial-engine";
import { formatCurrency } from "@/lib/format";
import type { Debt, DebtStatus } from "@/lib/types";

const statusBadge: Record<DebtStatus, { label: string; variant: "success" | "warning" | "danger" | "default" }> = {
  current: { label: "Al día", variant: "success" },
  due_soon: { label: "Próxima a vencer", variant: "warning" },
  late: { label: "En mora", variant: "danger" },
  collections: { label: "Cobranza", variant: "danger" },
};

function interestLabel(debt: Debt) {
  if (debt.interest_rate_type === "unknown") return "No definida";
  return `${debt.interest_rate}% ${debt.interest_rate_type === "annual" ? "anual" : "mensual"}`;
}

function dueDayLabel(debt: Debt) {
  return debt.due_day ? `Día ${debt.due_day}` : "Sin fecha";
}

export function DebtTable({ debts, isDemo = false }: { debts: Debt[]; isDemo?: boolean }) {
  const urgent = getMostUrgentDebt(debts);
  const expensive = getHighestInterestDebt(debts);
  const smallest = getSmallestDebt(debts);

  function priority(debt: Debt) {
    if (urgent?.id === debt.id && (debt.status === "late" || debt.status === "collections")) return "Urgente";
    if (expensive?.id === debt.id) return "Tasa alta";
    if (smallest?.id === debt.id) return "Cierre rápido";
    return "Seguimiento";
  }

  if (isDemo || debts.length === 0) {
    return (
      <EmptyState
        title="Aún no has agregado deudas"
        description="Agrega tu primera deuda para empezar a construir tu plan financiero."
        action={
          <ButtonLink href="/app/debts/new">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Agregar mi primera deuda
          </ButtonLink>
        }
      />
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-line bg-white shadow-sm" aria-labelledby="debts-list-title">
      <div className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="debts-list-title" className="text-base font-semibold text-foreground">
            Deudas registradas
          </h2>
          <p className="mt-1 text-sm text-muted">Revisa saldo, cuota, vencimiento y prioridad para decidir el siguiente paso.</p>
        </div>
        <ButtonLink href="/app/debts/new" size="sm" className="w-full sm:w-auto">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Agregar deuda
        </ButtonLink>
      </div>

      <div className="grid gap-4 p-4 md:hidden">
        {debts.map((debt) => (
          <article key={debt.id} className="rounded-lg border border-line bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-bold text-primary">{debt.name}</h3>
                <p className="mt-1 text-sm text-muted">{debt.entity ?? "Sin entidad"}</p>
              </div>
              <Badge variant={statusBadge[debt.status].variant}>{statusBadge[debt.status].label}</Badge>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <DebtFact label="Saldo" value={formatCurrency(debt.balance)} strong />
              <DebtFact label="Cuota mensual" value={formatCurrency(debt.monthly_payment)} />
              <DebtFact label="Fecha de pago" value={dueDayLabel(debt)} />
              <DebtFact label="Tasa" value={interestLabel(debt)} />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
              <Badge variant={priority(debt) === "Urgente" ? "danger" : "default"}>{priority(debt)}</Badge>
              <Link href={`/app/debts/${debt.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                Ver detalle <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-5 py-3">Nombre</th>
              <th className="px-5 py-3">Saldo</th>
              <th className="px-5 py-3">Cuota</th>
              <th className="px-5 py-3">Tasa</th>
              <th className="px-5 py-3">Pago</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3">Prioridad</th>
              <th className="px-5 py-3">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {debts.map((debt) => (
              <tr key={debt.id} className="hover:bg-surface">
                <td className="px-5 py-4">
                  <div className="font-semibold text-foreground">{debt.name}</div>
                  <div className="text-xs text-muted">{debt.entity ?? "Sin entidad"}</div>
                </td>
                <td className="px-5 py-4 font-semibold text-primary">{formatCurrency(debt.balance)}</td>
                <td className="px-5 py-4 text-foreground">{formatCurrency(debt.monthly_payment)}</td>
                <td className="px-5 py-4 text-foreground">{interestLabel(debt)}</td>
                <td className="px-5 py-4 text-foreground">{dueDayLabel(debt)}</td>
                <td className="px-5 py-4">
                  <Badge variant={statusBadge[debt.status].variant}>{statusBadge[debt.status].label}</Badge>
                </td>
                <td className="px-5 py-4">
                  <Badge variant={priority(debt) === "Urgente" ? "danger" : "default"}>{priority(debt)}</Badge>
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/app/debts/${debt.id}`}
                    className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                    aria-label={`Ver detalle de ${debt.name}`}
                  >
                    Ver <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DebtFact({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className={strong ? "mt-1 font-black text-primary" : "mt-1 font-semibold text-foreground"}>{value}</p>
    </div>
  );
}
