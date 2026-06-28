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
  submitLabel = "Crear mi plan financiero",
  pendingLabel = "Guardando...",
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
      className="grid gap-4 md:grid-cols-2"
    >
      <input type="hidden" name="redirect_to" value={redirectTo} />
      <Field label="Nombre" error={errors.full_name?.message}>
        <Input {...register("full_name")} />
      </Field>
      <Field label="Ingresos mensuales">
        <Input type="number" min="0" step="1000" {...register("monthly_income")} />
      </Field>
      <Field label="Gastos fijos">
        <Input type="number" min="0" step="1000" {...register("fixed_expenses")} />
      </Field>
      <Field label="Gastos variables">
        <Input type="number" min="0" step="1000" {...register("variable_expenses")} />
      </Field>
      <Field label="Dinero disponible para pagar deudas">
        <Input type="number" min="0" step="1000" {...register("debt_budget")} />
      </Field>
      <Field label="Capacidad de abono extra">
        <Input type="number" min="0" step="1000" {...register("extra_payment_capacity")} />
      </Field>
      <Field label="Nivel de urgencia financiera">
        <Select {...register("urgency_level")}>
          {URGENCY_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </Select>
      </Field>
      <div className="flex items-end">
        <Button className="w-full" disabled={pending}>
          {pending ? pendingLabel : submitLabel}
        </Button>
      </div>
      {state.error ? <p className="md:col-span-2 text-sm font-medium text-danger">{state.error}</p> : null}
    </form>
  );
}
