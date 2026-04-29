"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getServiceSupabaseClient } from "@/lib/supabase/service";
import { accessRedirect } from "@/lib/auth";
import { normalizeProfile } from "@/lib/normalizers";
import { loginSchema, registerSchema, type FormState } from "@/lib/validations";

async function ensurePendingProfile(userId: string, fullName: string) {
  const service = getServiceSupabaseClient();
  const payload = {
    id: userId,
    full_name: fullName,
    access_status: "pending_payment",
    access_type: null,
    onboarding_completed: false,
  };

  if (service) {
    await service.from("profiles").upsert(payload, { onConflict: "id" });
    return;
  }

  const supabase = await createServerSupabaseClient();
  if (supabase) {
    await supabase.from("profiles").upsert(payload, { onConflict: "id" });
  }
}

export async function registerAction(_state: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Revisa los datos." };

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: "Configura Supabase para crear cuentas." };

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.full_name },
    },
  });

  if (error) return { error: error.message };
  if (data.user) await ensurePendingProfile(data.user.id, parsed.data.full_name);

  redirect("/checkout");
}

export async function loginAction(_state: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Revisa los datos." };

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: "Configura Supabase para iniciar sesión." };

  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: error.message };

  const { data: profileRow } = await supabase.from("profiles").select("*").eq("id", data.user.id).maybeSingle();
  if (!profileRow) await ensurePendingProfile(data.user.id, data.user.user_metadata.full_name ?? "");

  const profile = profileRow ? normalizeProfile(profileRow as Record<string, unknown>, data.user.id) : null;
  const paymentRedirect = accessRedirect(profile);

  if (paymentRedirect) redirect(paymentRedirect);
  redirect(profile?.onboarding_completed ? "/app" : "/app/onboarding");
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase?.auth.signOut();
  redirect("/login");
}

