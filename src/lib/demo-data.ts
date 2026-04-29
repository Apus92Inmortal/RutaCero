import type { Alert, Debt, Goal, Profile } from "@/lib/types";

export const demoProfile: Profile = {
  id: "demo-user",
  full_name: "Usuario Ruta Cero",
  currency: "COP",
  monthly_income: 4200000,
  fixed_expenses: 1850000,
  variable_expenses: 820000,
  debt_budget: 1150000,
  extra_payment_capacity: 260000,
  urgency_level: "medium",
  onboarding_completed: true,
  access_status: "active",
  access_type: "lifetime",
  lifetime_access_granted_at: new Date().toISOString(),
};

export const demoDebts: Debt[] = [
  {
    id: "demo-card",
    user_id: "demo-user",
    name: "Tarjeta principal",
    entity: "Entidad demo",
    debt_type: "credit_card",
    balance: 3900000,
    monthly_payment: 390000,
    interest_rate: 2.6,
    interest_rate_type: "monthly",
    remaining_months: 14,
    due_day: 8,
    status: "due_soon",
    days_past_due: 0,
    allows_extra_payments: true,
    prepayment_penalty: false,
    stress_level: "high",
  },
  {
    id: "demo-loan",
    user_id: "demo-user",
    name: "Crédito personal",
    entity: "Entidad demo",
    debt_type: "personal_loan",
    balance: 7200000,
    monthly_payment: 610000,
    interest_rate: 27,
    interest_rate_type: "annual",
    remaining_months: 16,
    due_day: 18,
    status: "current",
    days_past_due: 0,
    allows_extra_payments: true,
    prepayment_penalty: false,
    stress_level: "medium",
  },
  {
    id: "demo-informal",
    user_id: "demo-user",
    name: "Préstamo familiar",
    entity: "Acuerdo personal",
    debt_type: "informal_loan",
    balance: 1300000,
    monthly_payment: 150000,
    interest_rate: 0,
    interest_rate_type: "unknown",
    remaining_months: 9,
    due_day: 25,
    status: "current",
    days_past_due: 0,
    allows_extra_payments: true,
    prepayment_penalty: false,
    stress_level: "low",
  },
];

export const demoGoals: Goal[] = [
  {
    id: "demo-goal-1",
    user_id: "demo-user",
    title: "Eliminar tarjeta principal",
    target_amount: 3900000,
    current_amount: 900000,
    target_date: new Date(new Date().getFullYear(), new Date().getMonth() + 7, 1)
      .toISOString()
      .slice(0, 10),
    status: "active",
  },
];

export const demoAlerts: Alert[] = [
  {
    id: "demo-alert-1",
    user_id: "demo-user",
    debt_id: "demo-card",
    type: "due_date",
    title: "Pago próximo",
    message: "Tu tarjeta principal vence pronto. Programa el pago mínimo y dirige el abono extra a esa deuda.",
    severity: "warning",
    is_read: false,
  },
  {
    id: "demo-alert-2",
    user_id: "demo-user",
    debt_id: null,
    type: "opportunity",
    title: "Oportunidad de abono extra",
    message: "Tienes capacidad extra disponible. Usarla este periodo puede recortar tu fecha estimada de salida.",
    severity: "success",
    is_read: false,
  },
];

