import { NextResponse, type NextRequest } from "next/server";
import { getServiceSupabaseClient } from "@/lib/supabase/service";

type PaymentWebhookBody = {
  user_id?: string;
  provider_payment_id?: string;
  status?: "pending" | "approved" | "failed" | "cancelled" | "refunded";
  amount?: number;
  currency?: string;
};

function mapAccessStatus(status: PaymentWebhookBody["status"]) {
  if (status === "approved") return "active";
  if (status === "failed" || status === "cancelled") return "payment_failed";
  if (status === "refunded") return "refunded";
  return "pending_payment";
}

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.PAYMENT_WEBHOOK_SECRET;
  const receivedSecret = request.headers.get("x-payment-webhook-secret");

  if (expectedSecret && receivedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Firma de webhook inválida." }, { status: 401 });
  }

  const body = (await request.json()) as PaymentWebhookBody;
  const service = getServiceSupabaseClient();
  if (!service) return NextResponse.json({ error: "Falta SUPABASE_SERVICE_ROLE_KEY." }, { status: 500 });
  if (!body.user_id || !body.status) {
    return NextResponse.json({ error: "Webhook incompleto." }, { status: 400 });
  }

  const paymentStatus = body.status;
  const accessStatus = mapAccessStatus(paymentStatus);

  if (body.provider_payment_id) {
    await service
      .from("access_payments")
      .update({
        payment_status: paymentStatus,
        paid_at: paymentStatus === "approved" ? new Date().toISOString() : null,
      })
      .eq("provider_payment_id", body.provider_payment_id)
      .eq("user_id", body.user_id);
  }

  const profileUpdate =
    paymentStatus === "approved"
      ? {
          access_status: "active",
          access_type: "lifetime",
          lifetime_access_granted_at: new Date().toISOString(),
        }
      : {
          access_status: accessStatus,
        };

  const { error } = await service.from("profiles").update(profileUpdate).eq("id", body.user_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ received: true, accessStatus });
}

