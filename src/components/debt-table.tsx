import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import {
  getHighestInterestDebt,
  getMostUrgentDebt,
  getSmallestDebt,
} from "@/lib/financial-engine";
import { formatCurrency } from "@/lib/format";
import type { Debt, DebtStatus } from "@/lib/types";

const statusBadge: Record<DebtStatus, { label: string; variant: "success" | "warning" | "danger" | "default" }> = {
  current: { label: "Al día", variant: "success" },
  due_soon: { label: "Próxima", variant: "warning" },
  late: { label: "En mora", variant: "danger" },
  collections: { label: "Cobranza", variant: "danger" },
};

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

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Deudas registradas</h2>
          <p className="mt-1 text-sm text-muted">
            {isDemo ? "Vista con datos demo hasta que agregues tu primera deuda." : "Ordenadas para decidir con calma."}
          </p>
        </div>
        <ButtonLink href="/app/debts/new" size="sm">
          Agregar deuda
        </ButtonLink>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[840px] w-full border-collapse text-left text-sm">
          <thead className="bg-[#f7fafc] text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-5 py-3">Nombre</th>
              <th className="px-5 py-3">Saldo</th>
              <th className="px-5 py-3">Cuota</th>
              <th className="px-5 py-3">Tasa</th>
              <th className="px-5 py-3">Vence</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3">Prioridad</th>
              <th className="px-5 py-3">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {debts.map((debt) => (
              <tr key={debt.id} className="hover:bg-[#f9fbfd]">
                <td className="px-5 py-4">
                  <div className="font-semibold text-foreground">{debt.name}</div>
                  <div className="text-xs text-muted">{debt.entity ?? "Sin entidad"}</div>
                </td>
                <td className="px-5 py-4 font-semibold text-primary">{formatCurrency(debt.balance)}</td>
                <td className="px-5 py-4">{formatCurrency(debt.monthly_payment)}</td>
                <td className="px-5 py-4">
                  {debt.interest_rate_type === "unknown" ? "No definida" : `${debt.interest_rate}%`}
                </td>
                <td className="px-5 py-4">{debt.due_day ? `Día ${debt.due_day}` : "Sin fecha"}</td>
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
                  >
                    Ver <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

