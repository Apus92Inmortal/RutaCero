import { z } from "zod";

export const registerSchema = z.object({
  full_name: z.string().min(2, "Escribe tu nombre completo."),
  email: z.string().email("Ingresa un correo válido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
});

export const loginSchema = z.object({
  email: z.string().email("Ingresa un correo válido."),
  password: z.string().min(1, "Ingresa tu contraseña."),
});

export const onboardingSchema = z.object({
  full_name: z.string().min(2, "Escribe tu nombre."),
  monthly_income: z.coerce.number().min(0),
  fixed_expenses: z.coerce.number().min(0),
  variable_expenses: z.coerce.number().min(0),
  debt_budget: z.coerce.number().min(0),
  extra_payment_capacity: z.coerce.number().min(0),
  urgency_level: z.enum(["low", "medium", "high", "critical"]),
});

export const debtSchema = z.object({
  name: z.string().min(2, "Escribe el nombre de la deuda."),
  entity: z.string().optional(),
  debt_type: z.enum([
    "credit_card",
    "personal_loan",
    "payroll_loan",
    "installment_purchase",
    "vehicle_loan",
    "mortgage",
    "informal_loan",
    "other",
  ]),
  balance: z.coerce.number().min(0),
  monthly_payment: z.coerce.number().min(0),
  interest_rate: z.coerce.number().min(0).default(0),
  interest_rate_type: z.enum(["monthly", "annual", "unknown"]),
  remaining_months: z.coerce.number().int().min(0).optional(),
  due_day: z.coerce.number().int().min(1).max(31).optional(),
  status: z.enum(["current", "due_soon", "late", "collections"]),
  days_past_due: z.coerce.number().int().min(0).default(0),
  allows_extra_payments: z.boolean().default(true),
  prepayment_penalty: z.boolean().default(false),
  stress_level: z.enum(["low", "medium", "high", "critical"]),
});

export const goalSchema = z.object({
  title: z.string().min(2, "Escribe una meta."),
  target_amount: z.coerce.number().min(0),
  current_amount: z.coerce.number().min(0).default(0),
  target_date: z.string().optional(),
});

export const debtPaymentSchema = z.object({
  debt_id: z.string().uuid(),
  amount: z.coerce.number().positive(),
  payment_type: z.enum(["minimum", "extra", "full"]).default("minimum"),
  notes: z.string().optional(),
});

export type FormState = {
  error?: string;
  success?: string;
};

