import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

const modules = [
  ["Bola de nieve", "Paga primero la deuda de menor saldo para liberar cuotas y ganar impulso psicológico."],
  ["Avalancha", "Paga primero la deuda de mayor tasa para reducir intereses y optimizar el costo total."],
  ["Consolidación", "Une deudas solo si la tasa baja, el plazo no infla el costo y no vuelves a usar cupos liberados."],
  ["Refinanciación", "Renegocia cuando necesitas bajar cuota para evitar incumplimiento y recuperar flujo."],
  ["Cómo negociar con bancos", "Llega con cifras claras: ingreso, cuota posible, saldo, tasa actual y propuesta concreta."],
  ["Cómo evitar volver a endeudarse", "Cierra fugas de gasto, separa fondo de emergencia y define reglas antes de liberar cupos."],
];

export default function EducationPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Educación financiera" description="Conceptos prácticos para tomar mejores decisiones de deuda." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map(([title, text]) => (
          <Card key={title}>
            <CardContent>
              <h2 className="text-lg font-black text-primary">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

