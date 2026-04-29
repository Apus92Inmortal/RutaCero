import { DebtForm } from "@/components/forms/debt-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

export default function NewDebtPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Agregar nueva deuda" description="Registra el saldo, tasa, cuota y nivel de presión de esta deuda." />
      <Card>
        <CardHeader title="Datos de la deuda" />
        <CardContent>
          <DebtForm />
        </CardContent>
      </Card>
    </div>
  );
}

