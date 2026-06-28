"use client";

import { startTransition, useActionState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { completeOnboardingAction } from "@/lib/actions/profile";
import { URGENCY_LEVELS } from "@/lib/constants";
import { onboardingSchema, type FormState } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import type { Profile } from "@/lib/types";

export function OnboardingForm({
  profile,
  submitLabel = "Crear mi plan",
  pendingLabel = "Creando plan...",
  redirectTo = "/app",
}: {
  profile: Profile;
  submitLabel?: string;
  pendingLabel?: string;
  redirectTo?: "/app" | "/app/profile";
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<FormState, FormData>(completeOnboardingAction, {});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      full_name: profile.full_name ?? "",
      monthly_income: profile.monthly_income,
      fixed_expenses: profile.fixed_expenses,
      variable_expenses: profile.variable_expenses,
      debt_budget: profile.debt_budget,
      extra_payment_capacity: profile.extra_payment_capacity,
      urgency_level: profile.urgency_level ?? "medium",
    },
  });

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit(() => {
          startTransition(() => formAction(new FormData(formRef.current!)));
        })(event);
      }}
      className="space-y-6"
    >
      <input type="hidden" name="redirect_to" value={redirectTo} />

      <fieldset className="space-y-4">
        <legend className="text-base font-black text-primary">Datos básicos</legend>
        <p className="text-sm leading-6 text-muted">Puedes ajustar estos datos cuando tu situación cambie.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nombre" error={errors.full_name?.message}>
            <Input autoComplete="name" placeholder="Tu nombre" {...register("full_name")} />
          </Field>
          <Field label="Nivel de urgencia financiera" error={errors.urgency_level?.message}>
            <Select {...register("urgency_level")}>
              {URGENCY_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-black text-primary">Presupuesto mensual</legend>
        <p className="text-sm leading-6 text-muted">Usa valores aproximados. No necesitas tener todo perfecto hoy.</p>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Ingresos mensuales" error={errors.monthly_income?.message}>
            <Input
              type="number"
              min="0"
              step="1000"
              inputMode="numeric"
              placeholder="Ej. 2500000"
              {...register("monthly_income")}
            />
          </Field>
          <Field label="Gastos fijos aproximados" error={errors.fixed_expenses?.message}>
            <Input
              type="number"
              min="0"
              step="1000"
              inputMode="numeric"
              placeholder="Ej. 1200000"
              {...register("fixed_expenses")}
            />
          </Field>
          <Field label="Gastos variables aproximados" error={errors.variable_expenses?.message}>
            <Input
              type="number"
              min="0"
              step="1000"
              inputMode="numeric"
              placeholder="Ej. 500000"
              {...register("variable_expenses")}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-black text-primary">Capacidad de pago</legend>
        <p className="text-sm leading-6 text-muted">
          Esta información ayuda a calcular recomendaciones más realistas para tu plan.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Capacidad de pago para deudas" error={errors.debt_budget?.message}>
            <Input
              type="number"
              min="0"
              step="1000"
              inputMode="numeric"
              placeholder="Ej. 600000"
              {...register("debt_budget")}
            />
          </Field>
          <Field label="Meta mensual de abono extra" error={errors.extra_payment_capacity?.message}>
            <Input
              type="number"
              min="0"
              step="1000"
              inputMode="numeric"
              placeholder="Ej. 100000"
              {...register("extra_payment_capacity")}
            />
          </Field>
        </div>
      </fieldset>

      {state.error ? (
        <p className="rounded-lg bg-danger/10 p-3 text-sm font-medium text-danger" aria-live="polite">
          {state.error}
        </p>
      ) : null}

      <div className="border-t border-line pt-5">
        <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
          {pending ? pendingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
