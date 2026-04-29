"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createCheckout() {
    setLoading(true);
    setError(null);
    const response = await fetch("/api/payments/create-checkout", { method: "POST" });
    const data = (await response.json()) as { checkoutUrl?: string; error?: string };
    setLoading(false);

    if (!response.ok || !data.checkoutUrl) {
      setError(data.error ?? "No pudimos iniciar el pago.");
      return;
    }

    window.location.href = data.checkoutUrl;
  }

  return (
    <div className="space-y-3">
      <Button type="button" className="w-full" size="lg" onClick={createCheckout} disabled={loading}>
        <CreditCard className="h-5 w-5" />
        {loading ? "Preparando pago..." : "Pagar y activar mi cuenta"}
      </Button>
      {error ? <p className="text-center text-sm font-medium text-danger">{error}</p> : null}
    </div>
  );
}
