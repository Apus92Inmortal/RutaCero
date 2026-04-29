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
      className="grid gap-4 md:grid-cols-2"
    >
      <Field label="Nombre de deuda" error={errors.name?.message}>
        <Input {...register("name")} />
      </Field>
      <Field label="Entidad">
        <Input {...register("entity")} />
      </Field>
      <Field label="Tipo de deuda">
        <Select {...register("debt_type")}>
          {DEBT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Saldo pendiente">
        <Input type="number" min="0" step="1000" {...register("balance")} />
      </Field>
      <Field label="Cuota mensual">
        <Input type="number" min="0" step="1000" {...register("monthly_payment")} />
      </Field>
      <Field label="Tasa de interés">
        <Input type="number" min="0" step="0.01" {...register("interest_rate")} />
      </Field>
      <Field label="Tipo de tasa">
        <Select {...register("interest_rate_type")}>
          <option value="monthly">Mensual</option>
          <option value="annual">Anual</option>
          <option value="unknown">No la sé</option>
        </Select>
      </Field>
      <Field label="Plazo restante">
        <Input type="number" min="0" {...register("remaining_months")} />
      </Field>
      <Field label="Fecha de pago">
        <Input type="number" min="1" max="31" {...register("due_day")} />
      </Field>
      <Field label="Estado">
        <Select {...register("status")}>
          {DEBT_STATUS.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Días de mora">
        <Input type="number" min="0" {...register("days_past_due")} />
      </Field>
      <Field label="Nivel de estrés">
        <Select {...register("stress_level")}>
          {STRESS_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </Select>
      </Field>
      <label className="flex items-center gap-3 rounded-lg border border-line bg-white px-4 py-3 text-sm font-semibold text-foreground">
        <input type="checkbox" className="h-4 w-4 accent-primary" {...register("allows_extra_payments")} />
        Permite abonos extra
      </label>
      <label className="flex items-center gap-3 rounded-lg border border-line bg-white px-4 py-3 text-sm font-semibold text-foreground">
        <input type="checkbox" className="h-4 w-4 accent-primary" {...register("prepayment_penalty")} />
        Penalidad por pago anticipado
      </label>
      {state.error ? <p className="md:col-span-2 text-sm font-medium text-danger">{state.error}</p> : null}
      <div className="md:col-span-2">
        <Button disabled={pending}>{pending ? "Guardando..." : "Agregar deuda"}</Button>
      </div>
    </form>
  );
}
