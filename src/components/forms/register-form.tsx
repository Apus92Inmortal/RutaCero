"use client";

import { startTransition, useActionState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerAction } from "@/lib/actions/auth";
import { registerSchema, type FormState } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export function RegisterForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<FormState, FormData>(registerAction, {});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { full_name: "", email: "", password: "" },
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
      className="space-y-4"
    >
      <Field label="Nombre completo" error={errors.full_name?.message}>
        <Input autoComplete="name" {...register("full_name")} />
      </Field>
      <Field label="Correo" error={errors.email?.message}>
        <Input type="email" autoComplete="email" {...register("email")} />
      </Field>
      <Field label="Contraseña" error={errors.password?.message}>
        <Input type="password" autoComplete="new-password" {...register("password")} />
      </Field>
      {state.error ? <p className="text-sm font-medium text-danger">{state.error}</p> : null}
      <Button className="w-full" disabled={pending}>
        {pending ? "Creando cuenta..." : "Crear cuenta y continuar"}
      </Button>
    </form>
  );
}
