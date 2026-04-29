import type { Alert, Debt, Goal, Profile } from "@/lib/types";

type Row = Record<string, unknown>;

function asNumber(value: unknown, fallback = 0) {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function asString<T extends string>(value: unknown, fallback: T) {
  return typeof value === "string" && value ? (value as T) : fallback;
}

export function normalizeProfile(row: Row | null | undefined, id = "demo-user"): Profile {
  return {
    id: String(row?.id ?? id),
    full_name: typeof row?.full_name === "string" ? row.full_name : null,
    currency: String(row?.currency ?? "COP"),
    monthly_income: asNumber(row?.monthly_income),
    fixed_expenses: asNumber(row?.fixed_expenses),
    variable_expenses: asNumber(row?.variable_expenses),
    debt_budget: asNumber(row?.debt_budget),
    extra_payment_capacity: asNumber(row?.extra_payment_capacity),
    urgency_level: asString(row?.urgency_level, "medium"),
    onboarding_completed: Boolean(row?.onboarding_completed),
    access_status: asString(row?.access_status, "pending_payment"),
    access_type: row?.access_type === "lifetime" ? "lifetime" : null,
    lifetime_access_granted_at:
      typeof row?.lifetime_access_granted_at === "string" ? row.lifetime_access_granted_at : null,
    created_at: typeof row?.created_at === "string" ? row.created_at : undefined,
    updated_at: typeof row?.updated_at === "string" ? row.updated_at : undefined,
  };
}

export function normalizeDebt(row: Row): Debt {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    name: String(row.name ?? "Deuda"),
    entity: typeof row.entity === "string" ? row.entity : null,
    debt_type: asString(row.debt_type, "other"),
    balance: asNumber(row.balance),
    monthly_payment: asNumber(row.monthly_payment),
    interest_rate: asNumber(row.interest_rate),
    interest_rate_type: asString(row.interest_rate_type, "unknown"),
    remaining_months: row.remaining_months == null ? null : asNumber(row.remaining_months),
    due_day: row.due_day == null ? null : asNumber(row.due_day),
    status: asString(row.status, "current"),
    days_past_due: asNumber(row.days_past_due),
    allows_extra_payments: row.allows_extra_payments !== false,
    prepayment_penalty: Boolean(row.prepayment_penalty),
    stress_level: asString(row.stress_level, "medium"),
    created_at: typeof row.created_at === "string" ? row.created_at : undefined,
    updated_at: typeof row.updated_at === "string" ? row.updated_at : undefined,
  };
}

export function normalizeGoal(row: Row): Goal {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    title: String(row.title ?? "Meta"),
    target_amount: asNumber(row.target_amount),
    current_amount: asNumber(row.current_amount),
    target_date: typeof row.target_date === "string" ? row.target_date : null,
    status: asString(row.status, "active"),
    created_at: typeof row.created_at === "string" ? row.created_at : undefined,
  };
}

export function normalizeAlert(row: Row): Alert {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    debt_id: typeof row.debt_id === "string" ? row.debt_id : null,
    type: asString(row.type, "education"),
    title: String(row.title ?? "Alerta"),
    message: String(row.message ?? ""),
    severity: asString(row.severity, "info"),
    is_read: Boolean(row.is_read),
    created_at: typeof row.created_at === "string" ? row.created_at : undefined,
  };
}

