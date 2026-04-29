import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { normalizeProfile } from "@/lib/normalizers";

export type SessionProfile = {
  user: User | null;
  profile: Profile | null;
  isConfigured: boolean;
};

export function accessRedirect(profile: Profile | null) {
  if (!profile) return "/checkout";
  if (profile.access_status === "pending_payment") return "/checkout";
  if (profile.access_status === "payment_failed") return "/payment-failed";
  if (profile.access_status === "active" && profile.access_type === "lifetime") return null;
  return "/payment-required";
}

export async function getSessionProfile(): Promise<SessionProfile> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { user: null, profile: null, isConfigured: false };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null, isConfigured: true };
  }

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

  return {
    user,
    profile: data ? normalizeProfile(data as Record<string, unknown>, user.id) : null,
    isConfigured: true,
  };
}

export async function requireActiveUser() {
  const session = await getSessionProfile();

  if (!session.isConfigured) {
    redirect("/login?error=config");
  }

  if (!session.user) {
    redirect("/login");
  }

  const paymentRedirect = accessRedirect(session.profile);
  if (paymentRedirect) redirect(paymentRedirect);

  return session as SessionProfile & { user: User; profile: Profile };
}

