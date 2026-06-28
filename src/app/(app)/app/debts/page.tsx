import { Plus } from "lucide-react";
import { DebtTable } from "@/components/debt-table";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { getFinancialSnapshot } from "@/lib/data";

export default async function DebtsPage() {
  const { debts, isDemo } = await getFinancialSnapshot();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tus deudas"
        description="Registra y actualiza tus deudas para que Ruta Cero pueda ayudarte a priorizar mejor."
        action={
          <ButtonLink href="/app/debts/new" className="w-full sm:w-auto">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Agregar deuda
          </ButtonLink>
        }
      />
      <DebtTable debts={debts} isDemo={isDemo} />
    </div>
  );
}
