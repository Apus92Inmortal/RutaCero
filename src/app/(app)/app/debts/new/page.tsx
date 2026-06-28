import { DebtForm } from "@/components/forms/debt-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

export default function NewDebtPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Agregar deuda"
        description="Registra los datos principales para que Ruta Cero pueda priorizarla dentro de tu plan."
      />
      <Card className="max-w-4xl">
        <CardHeader
          title="Datos de la deuda"
          description="Empieza con valores aproximados si no tienes toda la información a la mano."
        />
        <CardContent>
          <DebtForm />
        </CardContent>
      </Card>
    </div>
  );
}
