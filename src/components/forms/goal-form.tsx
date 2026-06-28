"use client";

import { startTransition, useActionState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createGoalAction } from "@/lib/actions/goals";
import { goalSchema, type FormState } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export function GoalForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<FormState, FormData>(createGoalAction, {});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(goalSchema),
    defaultValues: { title: "", target_amount: 0, current_amount: 0, target_date: "" },
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
      className="space-y-5"
    >
      <p className="rounded-lg border border-line bg-surface p-3 text-sm leading-6 text-muted">
        Puedes ajustar esta meta más adelante.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nombre de la meta" error={errors.title?.message}>
          <Input placeholder="Ej. Fondo de emergencia" {...register("title")} />
        </Field>
        <Field label="Monto objetivo" error={errors.target_amount?.message}>
          <Input type="number" min="0" step="1000" inputMode="numeric" placeholder="Ej. 2000000" {...register("target_amount")} />
        </Field>
        <Field label="Progreso acumulado" error={errors.current_amount?.message}>
          <Input type="number" min="0" step="1000" inputMode="numeric" placeholder="Ej. 300000" {...register("current_amount")} />
        </Field>
        <Field label="Fecha objetivo" error={errors.target_date?.message}>
          <Input type="date" {...register("target_date")} />
        </Field>
      </div>

      {state.error ? (
        <p className="rounded-lg bg-danger/10 p-3 text-sm font-medium text-danger" aria-live="polite">
          No pudimos guardar la meta. Revisa los datos e inténtalo de nuevo.
        </p>
      ) : null}

      <div className="border-t border-line pt-5">
        <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
          {pending ? "Guardando..." : "Crear meta"}
        </Button>
      </div>
    </form>
  );
}
