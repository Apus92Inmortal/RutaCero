export type AccessStatus =
  | "pending_payment"
  | "active"
  | "payment_failed"
  | "refunded"
  | "blocked";

export type AccessType = "lifetime" | null;

export type DebtType =
  | "credit_card"
  | "personal_loan"
  | "payroll_loan"
  | "installment_purchase"
  | "vehicle_loan"
  | "mortgage"
  | "informal_loan"
  | "other";

export type InterestRateType = "monthly" | "annual" | "unknown";
export type DebtStatus = "current" | "due_soon" | "late" | "collections";
export type Intensity = "low" | "medium" | "high" | "critical";
export type StrategyType =
  | "snowball"
  | "avalanche"
  | "consolidation"
  | "refinance"
  | "aggressive"
  | "balanced"
  | "emergency"
  | "hybrid";

export type Profile = {
  id: string;
  full_name: string | null;
  currency: string;
  monthly_income: number;
  fixed_expenses: number;
  variable_expenses: number;
  debt_budget: number;
  extra_payment_capacity: number;
  urgency_level: Intensity | null;
  onboarding_completed: boolean;
  access_status: AccessStatus;
  access_type: AccessType;
  lifetime_access_granted_at: string | null;
  created_at?: string;
  updated_at?: string;
};

export type Debt = {
  id: string;
  user_id: string;
  name: string;
  entity: string | null;
  debt_type: DebtType;
  balance: number;
  monthly_payment: number;
  interest_rate: number;
  interest_rate_type: InterestRateType;
  remaining_months: number | null;
  due_day: number | null;
  status: DebtStatus;
  days_past_due: number;
  allows_extra_payments: boolean;
  prepayment_penalty: boolean;
  stress_level: Intensity;
  created_at?: string;
  updated_at?: string;
};

export type DebtPayment = {
  id: string;
  user_id: string;
  debt_id: string;
  amount: number;
  payment_type: "minimum" | "extra" | "full";
  paid_at: string;
  notes: string | null;
  created_at?: string;
};

export type Goal = {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  status: "active" | "completed" | "paused";
  created_at?: string;
};

export type Alert = {
  id: string;
  user_id: string;
  debt_id: string | null;
  type: "due_date" | "risk" | "opportunity" | "late" | "strategy" | "education";
  title: string;
  message: string;
  severity: "info" | "warning" | "danger" | "success";
  is_read: boolean;
  created_at?: string;
};

export type StrategyProjection = {
  strategyType: StrategyType;
  title: string;
  description: string;
  estimatedMonths: number;
  estimatedInterest: number;
  totalPayment: number;
  targetDebt?: Debt;
  advantages: string[];
  risks: string[];
  whenItWorks: string;
  recommendation: string;
};

export type ConsolidationOffer = {
  amount: number;
  monthlyRate: number;
  termMonths: number;
  originationCost?: number;
  monthlyPayment?: number;
};

