import { markDebtPaidAction } from "@/lib/actions/debts";
import { getFinancialSnapshot } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

export default async function CalendarPage() {
  const { debts, isDemo } = await getFinancialSnapshot();
  const upcoming = [...debts].sort((a, b) => (a.due_day ?? 31) - (b.due_day ?? 31));

  return (
    <div className="space-y-6">
      <PageHeader title="Calendario de pagos" description="Revisa próximos vencimientos y registra pagos realizados." />
      <div className="grid gap-4">
        {upcoming.map((debt) => (
          <Card key={debt.id}>
            <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-black text-primary">{debt.name}</p>
                <p className="mt-1 text-sm text-muted">
                  Vence día {debt.due_day ?? "sin definir"} · Cuota {formatCurrency(debt.monthly_payment)}
                </p>
              </div>
              <form action={markDebtPaidAction} className="flex flex-col gap-2 sm:flex-row">
                <input type="hidden" name="debt_id" value={debt.id} />
                <input type="hidden" name="amount" value={debt.monthly_payment} />
                <input type="hidden" name="payment_type" value="minimum" />
                <Button disabled={isDemo} variant={isDemo ? "secondary" : "primary"}>
                  {isDemo ? "Demo" : "Marcar como pagada"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

