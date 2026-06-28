import { NextResponse, type NextRequest } from "next/server";
import { getSessionProfile } from "@/lib/auth";
import { BRAND } from "@/lib/constants";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getServiceSupabaseClient } from "@/lib/supabase/service";

export async function POST(request: NextRequest) {
  const { user, profile, isConfigured } = await getSessionProfile();
  if (!isConfigured) return NextResponse.json({ error: "Supabase no está configurado." }, { status: 500 });
  if (!user) return NextResponse.json({ error: "Debes iniciar sesión." }, { status: 401 });

  if (profile?.access_status === "active" && profile.access_type === "lifetime") {
    return NextResponse.json({ checkoutUrl: "/payment-success" });
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  const provider = process.env.PAYMENT_PROVIDER || "prepared";
  const providerPaymentId = `prepared_${crypto.randomUUID()}`;
  const checkoutUrl = `${origin}/payment-pending`;

  // TODO: Conectar aquí Bold, Wompi, PayU u otra pasarela.
  // La pasarela real debe devolver una URL de checkout y luego confirmar por /api/payments/webhook.
  const payload = {
    user_id: user.id,
    provider,
    provider_payment_id: providerPaymentId,
    amount: BRAND.price,
    currency: BRAND.currency,
    product_name: BRAND.productName,
    checkout_url: checkoutUrl,
  };

  const service = getServiceSupabaseClient();
  const supabase = service ?? (await createServerSupabaseClient());
  const { error } = await supabase!.from("access_payments").insert(payload);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase!
    .from("profiles")
    .update({ access_status: "pending_payment", access_type: null })
    .eq("id", user.id);

  return NextResponse.json({
    checkoutUrl,
    provider,
    providerPaymentId,
    message: "Checkout preparado. La activación ocurre cuando el webhook confirme el pago aprobado.",
  });
}
