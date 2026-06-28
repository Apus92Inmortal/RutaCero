"use client";

import { startTransition, useActionState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerAction } from "@/lib/actions/auth";
import { registerSchema, type FormState } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

function getRegisterErrorMessage(error?: string) {
  if (!error) return null;

  const normalized = error.toLowerCase();
  if (normalized.includes("already registered") || normalized.includes("already exists")) {
    return "Ya existe una cuenta con este email. Inicia sesión para continuar.";
  }
  if (normalized.includes("password")) {
    return "Usa una contraseña de al menos 6 caracteres.";
  }
  if (normalized.includes("email")) {
    return "Revisa que el email esté escrito correctamente.";
  }
  if (normalized.includes("supabase")) {
    return "No pudimos crear la cuenta por configuración. Inténtalo de nuevo más tarde.";
  }

  return error;
}

export function RegisterForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<FormState, FormData>(registerAction, {});
  const registerError = getRegisterErrorMessage(state.error);
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
        <Input autoComplete="name" placeholder="Tu nombre" {...register("full_name")} />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <Input type="email" autoComplete="email" placeholder="tu@email.com" {...register("email")} />
      </Field>
      <Field label="Contraseña" error={errors.password?.message}>
        <Input type="password" autoComplete="new-password" placeholder="Mínimo 6 caracteres" {...register("password")} />
      </Field>
      {registerError ? (
        <p className="rounded-lg bg-danger/10 p-3 text-sm font-medium text-danger" aria-live="polite">
          {registerError}
        </p>
      ) : null}
      {state.success ? (
        <p className="rounded-lg bg-success/10 p-3 text-sm font-medium leading-6 text-foreground" aria-live="polite">
          Cuenta creada. Revisa tu correo para confirmar la cuenta y luego continúa con la activación.
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creando cuenta..." : "Crear cuenta"}
      </Button>
    </form>
  );
}
