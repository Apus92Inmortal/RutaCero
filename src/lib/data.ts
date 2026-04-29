import { demoAlerts, demoDebts, demoGoals, demoProfile } from "@/lib/demo-data";
import { getSessionProfile } from "@/lib/auth";
import { normalizeAlert, normalizeDebt, normalizeGoal, normalizeProfile } from "@/lib/normalizers";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getFinancialSnapshot() {
  const session = await getSessionProfile();
  const supabase = await createServerSupabaseClient();

  if (!supabase || !session.user) {
    return {
      profile: demoProfile,
      debts: demoDebts,
      goals: demoGoals,
      alerts: demoAlerts,
      isDemo: true,
    };
  }

  const [debtsResult, goalsResult, alertsResult] = await Promise.all([
    supabase.from("debts").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }),
    supabase.from("goals").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }),
    supabase.from("alerts").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }),
  ]);

  const realDebts = (debtsResult.data ?? []).map((row) => normalizeDebt(row as Record<string, unknown>));
  const goals = (goalsResult.data ?? []).map((row) => normalizeGoal(row as Record<string, unknown>));
  const alerts = (alertsResult.data ?? []).map((row) => normalizeAlert(row as Record<string, unknown>));
  const profile = session.profile ? normalizeProfile(session.profile as unknown as Record<string, unknown>) : demoProfile;
  const hasRealDebts = realDebts.length > 0;

  return {
    profile,
    debts: hasRealDebts ? realDebts : demoDebts.map((debt) => ({ ...debt, user_id: session.user!.id })),
    goals: goals.length > 0 ? goals : demoGoals.map((goal) => ({ ...goal, user_id: session.user!.id })),
    alerts: alerts.length > 0 ? alerts : demoAlerts.map((alert) => ({ ...alert, user_id: session.user!.id })),
    isDemo: !hasRealDebts,
  };
}

