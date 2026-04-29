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
      className="grid gap-4 md:grid-cols-4"
    >
      <Field label="Meta" error={errors.title?.message}>
        <Input {...register("title")} />
      </Field>
      <Field label="Monto objetivo">
        <Input type="number" min="0" step="1000" {...register("target_amount")} />
      </Field>
      <Field label="Avance actual">
        <Input type="number" min="0" step="1000" {...register("current_amount")} />
      </Field>
      <Field label="Fecha objetivo">
        <Input type="date" {...register("target_date")} />
      </Field>
      {state.error ? <p className="md:col-span-4 text-sm font-medium text-danger">{state.error}</p> : null}
      <div className="md:col-span-4">
        <Button disabled={pending}>{pending ? "Guardando..." : "Crear meta"}</Button>
      </div>
    </form>
  );
}
