export function formatCurrency(value: number, currency = "COP") {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatPercent(value: number) {
  return `${Number.isFinite(value) ? value.toFixed(1) : "0.0"}%`;
}

export function monthLabel(months: number) {
  if (months <= 0) return "Sin deuda";
  if (months === 1) return "1 mes";
  const years = Math.floor(months / 12);
  const remaining = months % 12;
  if (years === 0) return `${months} meses`;
  if (remaining === 0) return `${years} ${years === 1 ? "año" : "años"}`;
  return `${years} ${years === 1 ? "año" : "años"} y ${remaining} meses`;
}

export function estimateDebtFreeDate(months: number, from = new Date()) {
  const result = new Date(from);
  result.setMonth(result.getMonth() + Math.max(0, months));
  return new Intl.DateTimeFormat("es-CO", {
    month: "long",
    year: "numeric",
  }).format(result);
}
