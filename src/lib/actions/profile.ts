"use server";

import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { onboardingSchema, type FormState } from "@/lib/validations";

export async function completeOnboardingAction(_state: FormState, formData: FormData): Promise<FormState> {
  const redirectTo = formData.get("redirect_to") === "/app/profile" ? "/app/profile" : "/app";
  const parsed = onboardingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Revisa los datos." };

  const supabase = await createServerSupabaseClient();
  const { user } = await getSessionProfile();
  if (!supabase || !user) return { error: "Debes iniciar sesión." };

  const { error } = await supabase
    .from("profiles")
    .update({
      ...parsed.data,
      onboarding_completed: true,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };
  redirect(redirectTo);
}
