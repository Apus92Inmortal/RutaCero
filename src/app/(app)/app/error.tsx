"use client";

import { Button } from "@/components/ui/button";

export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="rounded-lg border border-line bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-primary">Algo no cargó bien</h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        Intenta de nuevo. Si el problema persiste, vuelve a revisar en unos minutos.
      </p>
      <Button className="mt-5" onClick={() => reset()}>
        Reintentar
      </Button>
    </div>
  );
}
