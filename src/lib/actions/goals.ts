"use server";

import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { goalSchema, type FormState } from "@/lib/validations";

export async function createGoalAction(_state: FormState, formData: FormData): Promise<FormState> {
  const parsed = goalSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Revisa los datos." };

  const supabase = await createServerSupabaseClient();
  const { user } = await getSessionProfile();
  if (!supabase || !user) return { error: "Debes iniciar sesión." };

  const { error } = await supabase.from("goals").insert({
    ...parsed.data,
    target_date: parsed.data.target_date || null,
    user_id: user.id,
  });

  if (error) return { error: error.message };
  redirect("/app/goals");
}
