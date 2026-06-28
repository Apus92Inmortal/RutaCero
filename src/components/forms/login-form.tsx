"use client";

import { startTransition, useActionState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginAction } from "@/lib/actions/auth";
import { loginSchema, type FormState } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

function getLoginErrorMessage(error?: string) {
  if (!error) return null;

  const normalized = error.toLowerCase();
  if (normalized.includes("invalid login credentials")) {
    return "El email o la contraseña no coinciden. Revisa los datos e intenta de nuevo.";
  }
  if (normalized.includes("email not confirmed")) {
    return "Confirma tu correo antes de iniciar sesión.";
  }
  if (normalized.includes("supabase")) {
    return "No pudimos iniciar sesión por configuración. Inténtalo de nuevo más tarde.";
  }

  return error;
}

export function LoginForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<FormState, FormData>(loginAction, {});
  const loginError = getLoginErrorMessage(state.error);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
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
      <Field label="Email" error={errors.email?.message}>
        <Input type="email" autoComplete="email" placeholder="tu@email.com" {...register("email")} />
      </Field>
      <Field label="Contraseña" error={errors.password?.message}>
        <Input
          type="password"
          autoComplete="current-password"
          placeholder="Tu contraseña"
          {...register("password")}
        />
      </Field>
      {loginError ? (
        <p className="rounded-lg bg-danger/10 p-3 text-sm font-medium text-danger" aria-live="polite">
          {loginError}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Ingresando..." : "Iniciar sesión"}
      </Button>
    </form>
  );
}
