import { PageHeader } from "@/components/ui/page-header";
import { SimulatorClient } from "@/components/simulator-client";
import { getFinancialSnapshot } from "@/lib/data";

export default async function SimulatorPage() {
  const { profile, debts, isDemo } = await getFinancialSnapshot();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Simula tu salida de deudas"
        description="Compara escenarios y descubre cómo cambiaría tu ruta según tu capacidad de pago."
      />
      <SimulatorClient profile={profile} debts={debts} isDemo={isDemo} />
    </div>
  );
}
