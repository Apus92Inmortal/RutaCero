import { PageHeader } from "@/components/ui/page-header";
import { SimulatorClient } from "@/components/simulator-client";
import { getFinancialSnapshot } from "@/lib/data";

export default async function SimulatorPage() {
  const { profile, debts } = await getFinancialSnapshot();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Simulador de pagos"
        description="Cambia los valores y descubre cómo cada decisión afecta tu fecha de salida de deudas."
      />
      <SimulatorClient profile={profile} debts={debts} />
    </div>
  );
}

