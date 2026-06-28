"use client";

import { startTransition, useActionState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createDebtAction } from "@/lib/actions/debts";
import { DEBT_STATUS, DEBT_TYPES, STRESS_LEVELS } from "@/lib/constants";
import { debtSchema, type FormState } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";

export function DebtForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<FormState, FormData>(createDebtAction, {});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(debtSchema),
    defaultValues: {
      name: "",
      entity: "",
      debt_type: "credit_card",
      balance: 0,
      monthly_payment: 0,
      interest_rate: 0,
      interest_rate_type: "monthly",
      remaining_months: 0,
      due_day: 1,
      status: "current",
      days_past_due: 0,
      allows_extra_payments: true,
      prepayment_penalty: false,
      stress_level: "medium",
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
      <p className="rounded-lg border border-line bg-surface p-3 text-sm leading-6 text-muted">
        Puedes ajustar esta información más adelante.
      </p>

      <fieldset className="space-y-4">
        <legend className="text-base font-black text-primary">Datos básicos</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nombre de la deuda" error={errors.name?.message}>
            <Input placeholder="Ej. Tarjeta principal" {...register("name")} />
          </Field>
          <Field label="Entidad o acreedor" error={errors.entity?.message}>
            <Input placeholder="Ej. Banco o persona" {...register("entity")} />
          </Field>
          <Field label="Tipo de deuda" error={errors.debt_type?.message}>
            <Select {...register("debt_type")}>
              {DEBT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Estado actual" error={errors.status?.message}>
            <Select {...register("status")}>
              {DEBT_STATUS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-black text-primary">Valores y pago</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Saldo actual" error={errors.balance?.message}>
            <Input type="number" min="0" step="1000" inputMode="numeric" placeholder="Ej. 2500000" {...register("balance")} />
          </Field>
          <Field label="Cuota mensual" error={errors.monthly_payment?.message}>
            <Input
              type="number"
              min="0"
              step="1000"
              inputMode="numeric"
              placeholder="Ej. 250000"
              {...register("monthly_payment")}
            />
          </Field>
          <Field label="Día de pago" error={errors.due_day?.message}>
            <Input type="number" min="1" max="31" inputMode="numeric" placeholder="Ej. 15" {...register("due_day")} />
          </Field>
          <Field label="Plazo restante en meses" error={errors.remaining_months?.message}>
            <Input type="number" min="0" inputMode="numeric" placeholder="Ej. 12" {...register("remaining_months")} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-black text-primary">Intereses y prioridad</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Tasa de interés" error={errors.interest_rate?.message}>
            <Input type="number" min="0" step="0.01" inputMode="decimal" placeholder="Ej. 2.1" {...register("interest_rate")} />
          </Field>
          <Field label="Tipo de tasa" error={errors.interest_rate_type?.message}>
            <Select {...register("interest_rate_type")}>
              <option value="monthly">Mensual</option>
              <option value="annual">Anual</option>
              <option value="unknown">No la sé</option>
            </Select>
          </Field>
          <Field label="Días en mora" error={errors.days_past_due?.message}>
            <Input type="number" min="0" inputMode="numeric" placeholder="0" {...register("days_past_due")} />
          </Field>
          <Field label="Nivel de presión" error={errors.stress_level?.message}>
            <Select {...register("stress_level")}>
              {STRESS_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-base font-black text-primary">Condiciones de pago</legend>
        <label className="flex items-start gap-3 rounded-lg border border-line bg-surface px-4 py-3 text-sm font-semibold text-foreground">
          <input type="checkbox" className="mt-0.5 h-4 w-4 accent-primary" {...register("allows_extra_payments")} />
          <span>
            Permite abonos extra
            <span className="block text-xs font-normal leading-5 text-muted">Marca esto si puedes pagar más de la cuota mensual.</span>
          </span>
        </label>
        <label className="flex items-start gap-3 rounded-lg border border-line bg-surface px-4 py-3 text-sm font-semibold text-foreground">
          <input type="checkbox" className="mt-0.5 h-4 w-4 accent-primary" {...register("prepayment_penalty")} />
          <span>
            Tiene penalidad por pago anticipado
            <span className="block text-xs font-normal leading-5 text-muted">Úsalo si el acreedor cobra por abonar antes de tiempo.</span>
          </span>
        </label>
      </fieldset>

      {state.error ? (
        <p className="rounded-lg bg-danger/10 p-3 text-sm font-medium text-danger" aria-live="polite">
          {state.error}
        </p>
      ) : null}

      <div className="border-t border-line pt-5">
        <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
          {pending ? "Guardando..." : "Agregar deuda"}
        </Button>
      </div>
    </form>
  );
}
