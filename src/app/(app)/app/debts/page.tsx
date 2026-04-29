import { DebtTable } from "@/components/debt-table";
import { PageHeader } from "@/components/ui/page-header";
import { getFinancialSnapshot } from "@/lib/data";

export default async function DebtsPage() {
  const { debts, isDemo } = await getFinancialSnapshot();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deudas"
        description="Agrega tus deudas una por una. Mientras más exacta sea la información, más preciso será tu plan."
      />
      <DebtTable debts={debts} isDemo={isDemo} />
    </div>
  );
}

