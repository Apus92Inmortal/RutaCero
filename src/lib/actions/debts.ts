"use server";

import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { debtPaymentSchema, debtSchema, type FormState } from "@/lib/validations";

export async function createDebtAction(_state: FormState, formData: FormData): Promise<FormState> {
  const raw = Object.fromEntries(formData);
  const parsed = debtSchema.safeParse({
    ...raw,
    allows_extra_payments: formData.get("allows_extra_payments") === "on",
    prepayment_penalty: formData.get("prepayment_penalty") === "on",
  });

  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Revisa los datos." };

  const supabase = await createServerSupabaseClient();
  const { user } = await getSessionProfile();
  if (!supabase || !user) return { error: "Debes iniciar sesión." };

  const { error } = await supabase.from("debts").insert({
    ...parsed.data,
    entity: parsed.data.entity || null,
    remaining_months: parsed.data.remaining_months || null,
    due_day: parsed.data.due_day || null,
    user_id: user.id,
  });

  if (error) return { error: error.message };
  redirect("/app/debts");
}

export async function markDebtPaidAction(formData: FormData) {
  const parsed = debtPaymentSchema.safeParse(Object.fromEntries(formData));
  const supabase = await createServerSupabaseClient();
  const { user } = await getSessionProfile();
  if (!parsed.success || !supabase || !user) redirect("/app/calendar");

  const { data: debt } = await supabase
    .from("debts")
    .select("balance")
    .eq("id", parsed.data.debt_id)
    .eq("user_id", user.id)
    .single();

  await supabase.from("debt_payments").insert({
    user_id: user.id,
    debt_id: parsed.data.debt_id,
    amount: parsed.data.amount,
    payment_type: parsed.data.payment_type,
    notes: parsed.data.notes || null,
  });

  if (debt) {
    const nextBalance = Math.max(0, Number((debt as { balance: number | string }).balance) - parsed.data.amount);
    await supabase
      .from("debts")
      .update({ balance: nextBalance, status: "current", days_past_due: 0 })
      .eq("id", parsed.data.debt_id)
      .eq("user_id", user.id);
  }

  redirect("/app/calendar");
}

