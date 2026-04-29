import type {
  ConsolidationOffer,
  Debt,
  Profile,
  StrategyProjection,
  StrategyType,
} from "@/lib/types";

const MAX_SIMULATION_MONTHS = 600;

function monthlyRate(debt: Debt) {
  if (debt.interest_rate_type === "unknown") return 0;
  if (debt.interest_rate_type === "annual") return debt.interest_rate / 100 / 12;
  return debt.interest_rate / 100;
}

function paymentCapacity(profile: Profile, debts: Debt[]) {
  const minimums = calculateTotalMonthlyPayments(debts);
  return Math.max(minimums, profile.debt_budget || minimums) + Math.max(0, profile.extra_payment_capacity);
}

function estimateWithOrder(profile: Profile, debts: Debt[], orderedIds: string[]) {
  const active = debts.map((debt) => ({ ...debt }));
  let months = 0;
  let interest = 0;
  const totalAvailable = Math.max(1, paymentCapacity(profile, debts));

  while (active.some((debt) => debt.balance > 1) && months < MAX_SIMULATION_MONTHS) {
    months += 1;
    let available = totalAvailable;

    for (const debt of active) {
      if (debt.balance <= 0) continue;
      const accrued = debt.balance * monthlyRate(debt);
      debt.balance += accrued;
      interest += accrued;
    }

    for (const debt of active) {
      if (debt.balance <= 0) continue;
      const minimum = Math.min(debt.balance, debt.monthly_payment);
      debt.balance -= minimum;
      available -= minimum;
    }

    for (const debtId of orderedIds) {
      const debt = active.find((item) => item.id === debtId && item.balance > 0);
      if (!debt || available <= 0) continue;
      const extra = Math.min(debt.balance, available);
      debt.balance -= extra;
      available -= extra;
    }
  }

  return {
    estimatedMonths: months,
    estimatedInterest: Math.round(interest),
    totalPayment: calculateTotalDebt(debts) + Math.round(interest),
  };
}

export function calculateTotalDebt(debts: Debt[]) {
  return debts.reduce((total, debt) => total + Math.max(0, debt.balance), 0);
}

export function calculateTotalMonthlyPayments(debts: Debt[]) {
  return debts.reduce((total, debt) => total + Math.max(0, debt.monthly_payment), 0);
}

export function calculateDebtToIncomeRatio(totalDebt: number, monthlyIncome: number) {
  if (monthlyIncome <= 0) return 0;
  return (totalDebt / monthlyIncome) * 100;
}

export function calculatePaymentToIncomeRatio(totalPayments: number, monthlyIncome: number) {
  if (monthlyIncome <= 0) return 0;
  return (totalPayments / monthlyIncome) * 100;
}

export function getSmallestDebt(debts: Debt[]) {
  return [...debts].filter((debt) => debt.balance > 0).sort((a, b) => a.balance - b.balance)[0];
}

export function getHighestInterestDebt(debts: Debt[]) {
  return [...debts]
    .filter((debt) => debt.balance > 0)
    .sort((a, b) => monthlyRate(b) - monthlyRate(a))[0];
}

export function getMostUrgentDebt(debts: Debt[]) {
  const statusWeight: Record<Debt["status"], number> = {
    collections: 4,
    late: 3,
    due_soon: 2,
    current: 1,
  };
  const stressWeight: Record<Debt["stress_level"], number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  return [...debts]
    .filter((debt) => debt.balance > 0)
    .sort((a, b) => {
      const urgentA = statusWeight[a.status] * 10 + stressWeight[a.stress_level] + a.days_past_due;
      const urgentB = statusWeight[b.status] * 10 + stressWeight[b.stress_level] + b.days_past_due;
      return urgentB - urgentA;
    })[0];
}

export function recommendStrategy(profile: Profile, debts: Debt[]): StrategyType {
  const totalPayments = calculateTotalMonthlyPayments(debts);
  const paymentRatio = calculatePaymentToIncomeRatio(totalPayments, profile.monthly_income);
  const hasLateDebt = debts.some((debt) => debt.status === "late" || debt.status === "collections");
  const canPayMinimums = profile.debt_budget >= totalPayments || profile.monthly_income === 0;
  const extraCapacityRatio =
    profile.monthly_income > 0 ? (profile.extra_payment_capacity / profile.monthly_income) * 100 : 0;

  if (hasLateDebt || paymentRatio > 50 || profile.urgency_level === "critical") return "emergency";
  if (!canPayMinimums || profile.urgency_level === "high") return "refinance";
  if (extraCapacityRatio >= 12) return "aggressive";
  if (canPayMinimums && profile.extra_payment_capacity > 0) return "balanced";
  if (getHighestInterestDebt(debts)?.interest_rate) return "avalanche";
  return "snowball";
}

export function generateMonthlyRecommendation(profile: Profile, debts: Debt[]) {
  if (debts.length === 0) {
    return {
      title: "Empieza registrando tu primera deuda",
      body: "Agrega tus deudas una por una. Mientras más exacta sea la información, más preciso será tu plan.",
      targetDebt: undefined,
      strategy: "balanced" as StrategyType,
      impact: "Ruta Cero podrá calcular tu fecha estimada de salida cuando ingreses tus datos.",
    };
  }

  const strategy = recommendStrategy(profile, debts);
  const urgent = getMostUrgentDebt(debts);
  const avalanche = getHighestInterestDebt(debts);
  const snowball = getSmallestDebt(debts);
  const targetDebt =
    strategy === "emergency" || strategy === "refinance"
      ? urgent
      : strategy === "avalanche" || strategy === "aggressive"
        ? avalanche
        : snowball;

  const reasonByStrategy: Record<StrategyType, string> = {
    emergency:
      "hay señales de mora o presión alta sobre tus ingresos. Primero hay que estabilizar el riesgo.",
    refinance:
      "la cuota actual puede estar comprometiendo tu flujo. Negociar plazo o tasa puede darte oxígeno.",
    aggressive:
      "tienes capacidad de abono extra. Usarla sobre la deuda más costosa acelera la salida.",
    balanced:
      "puedes cubrir mínimos y sumar abonos extra sin tensionar todo tu presupuesto.",
    avalanche:
      "la tasa más alta encarece tu deuda cada mes. Atacarla reduce intereses futuros.",
    snowball:
      "cerrar una deuda pequeña rápido libera cuota y aumenta motivación.",
    consolidation:
      "podría simplificar pagos si la tasa nueva realmente baja el costo total.",
    hybrid:
      "combina alivio de flujo con ataques puntuales a las deudas de mayor impacto.",
  };

  const projection = compareStrategies(profile, debts)[0];

  return {
    title: targetDebt ? `Prioriza ${targetDebt.name}` : "Define tu primera prioridad",
    body: `Este mes conviene enfocarte en esta deuda porque ${reasonByStrategy[strategy]}`,
    targetDebt,
    strategy,
    impact: `Con este ritmo, la salida estimada sería en ${projection.estimatedMonths} meses aproximadamente.`,
  };
}

export function simulateSnowball(profile: Profile, debts: Debt[]): StrategyProjection {
  const ordered = [...debts].sort((a, b) => a.balance - b.balance);
  const estimate = estimateWithOrder(
    profile,
    debts,
    ordered.map((debt) => debt.id),
  );
  const targetDebt = ordered[0];

  return {
    strategyType: "snowball",
    title: "Bola de nieve",
    description: "Prioriza la deuda con menor saldo para liberar cuotas rápido.",
    targetDebt,
    advantages: ["Crea victorias tempranas", "Libera flujo de caja", "Reduce carga mental"],
    risks: ["Puede pagar más intereses si la deuda cara no es la más pequeña"],
    whenItWorks: "Conviene cuando necesitas impulso y orden antes que optimización matemática.",
    recommendation: targetDebt ? `Empieza por ${targetDebt.name}.` : "Agrega deudas para simular.",
    ...estimate,
  };
}

export function simulateAvalanche(profile: Profile, debts: Debt[]): StrategyProjection {
  const ordered = [...debts].sort((a, b) => monthlyRate(b) - monthlyRate(a));
  const estimate = estimateWithOrder(
    profile,
    debts,
    ordered.map((debt) => debt.id),
  );
  const targetDebt = ordered[0];

  return {
    strategyType: "avalanche",
    title: "Avalancha",
    description: "Prioriza la deuda con tasa más alta para reducir intereses.",
    targetDebt,
    advantages: ["Optimiza costo financiero", "Ataca intereses caros", "Suele ahorrar más dinero"],
    risks: ["Puede sentirse lenta si la deuda prioritaria es grande"],
    whenItWorks: "Conviene cuando puedes sostener disciplina y quieres ahorrar intereses.",
    recommendation: targetDebt ? `Ataca primero ${targetDebt.name}.` : "Agrega tasas para comparar.",
    ...estimate,
  };
}

export function compareStrategies(profile: Profile, debts: Debt[]): StrategyProjection[] {
  const snowball = simulateSnowball(profile, debts);
  const avalanche = simulateAvalanche(profile, debts);
  const totalDebt = calculateTotalDebt(debts);
  const baseMonths = Math.max(snowball.estimatedMonths, avalanche.estimatedMonths, 1);

  const projections: StrategyProjection[] = [
    snowball,
    avalanche,
    {
      strategyType: "consolidation",
      title: "Consolidación",
      description: "Une varias deudas en un solo crédito si la tasa baja y el costo total no sube demasiado.",
      estimatedMonths: Math.round(baseMonths * 0.95),
      estimatedInterest: Math.round(avalanche.estimatedInterest * 0.92),
      totalPayment: Math.round(totalDebt + avalanche.estimatedInterest * 0.92),
      advantages: ["Simplifica pagos", "Puede bajar tasa", "Reduce olvidos de vencimiento"],
      risks: ["Puede extender el plazo", "No conviene si aumenta el costo total", "Exige no volver a usar cupos liberados"],
      whenItWorks: "Conviene si la nueva tasa es menor y el pago total no aumenta demasiado.",
      recommendation: "Evalúa una oferta solo si mejora tasa y plazo sin subir el costo total.",
    },
    {
      strategyType: "refinance",
      title: "Refinanciación",
      description: "Renegocia cuota o plazo cuando hay riesgo de incumplimiento.",
      estimatedMonths: Math.round(baseMonths * 1.2),
      estimatedInterest: Math.round(avalanche.estimatedInterest * 1.18),
      totalPayment: Math.round(totalDebt + avalanche.estimatedInterest * 1.18),
      advantages: ["Baja presión de caja", "Ayuda a evitar mora", "Ordena pagos críticos"],
      risks: ["Puede aumentar intereses", "Puede alargar la salida", "Requiere disciplina posterior"],
      whenItWorks: "Conviene cuando la prioridad es evitar incumplimientos y recuperar estabilidad.",
      recommendation: "Úsala como puente de estabilidad, no como excusa para aumentar deuda.",
    },
    {
      strategyType: "aggressive",
      title: "Plan agresivo",
      description: "Dirige toda la capacidad extra posible a la deuda más costosa.",
      estimatedMonths: Math.max(1, Math.round(avalanche.estimatedMonths * 0.72)),
      estimatedInterest: Math.round(avalanche.estimatedInterest * 0.7),
      totalPayment: Math.round(totalDebt + avalanche.estimatedInterest * 0.7),
      advantages: ["Acelera la salida", "Reduce intereses", "Convierte ingresos extra en progreso real"],
      risks: ["Exige alto esfuerzo", "No debe dejarte sin fondo de emergencia"],
      whenItWorks: "Conviene si tus gastos básicos están cubiertos y tienes margen extra.",
      recommendation: "Mantén un fondo mínimo antes de subir el abono extra.",
    },
    {
      strategyType: "balanced",
      title: "Plan equilibrado",
      description: "Cubre mínimos y aplica abonos extra sostenibles sin romper el presupuesto.",
      estimatedMonths: Math.round((snowball.estimatedMonths + avalanche.estimatedMonths) / 2),
      estimatedInterest: Math.round((snowball.estimatedInterest + avalanche.estimatedInterest) / 2),
      totalPayment: Math.round(totalDebt + (snowball.estimatedInterest + avalanche.estimatedInterest) / 2),
      advantages: ["Sostenible", "Flexible", "Reduce riesgo de abandonar el plan"],
      risks: ["No siempre es el más rápido", "Requiere seguimiento mensual"],
      whenItWorks: "Conviene cuando puedes pagar mínimos y sumar algo de abono extra.",
      recommendation: "Automatiza mínimos y programa el abono extra al inicio del periodo.",
    },
    {
      strategyType: "emergency",
      title: "Plan de emergencia",
      description: "Prioriza deudas en mora, cobranza o pagos que amenazan tus ingresos.",
      estimatedMonths: Math.round(baseMonths * 1.1),
      estimatedInterest: Math.round(avalanche.estimatedInterest * 1.1),
      totalPayment: Math.round(totalDebt + avalanche.estimatedInterest * 1.1),
      advantages: ["Reduce riesgo inmediato", "Evita costos por mora", "Enfoca llamadas y renegociación"],
      risks: ["Puede pausar optimización de intereses", "Necesita decisiones rápidas"],
      whenItWorks: "Conviene si tienes deudas vencidas o cuotas por encima del 50% del ingreso.",
      recommendation: "Ponte al día con la deuda más urgente antes de acelerar abonos extra.",
    },
  ];

  return projections.sort((a, b) => a.estimatedMonths - b.estimatedMonths);
}

export function evaluateConsolidation(currentDebts: Debt[], newLoan: ConsolidationOffer) {
  const totalDebt = calculateTotalDebt(currentDebts);
  const weightedMonthlyRate =
    currentDebts.reduce((sum, debt) => sum + monthlyRate(debt) * debt.balance, 0) / Math.max(totalDebt, 1);
  const currentMinimums = calculateTotalMonthlyPayments(currentDebts);
  const newMonthlyPayment =
    newLoan.monthlyPayment ??
    (newLoan.amount * newLoan.monthlyRate) / (1 - (1 + newLoan.monthlyRate) ** -newLoan.termMonths);
  const estimatedNewCost = newMonthlyPayment * newLoan.termMonths + (newLoan.originationCost ?? 0);
  const currentApproxCost = currentMinimums * Math.max(...currentDebts.map((debt) => debt.remaining_months ?? 1), 1);
  const rateImproves = newLoan.monthlyRate < weightedMonthlyRate;
  const costDoesNotGrowTooMuch = estimatedNewCost <= currentApproxCost * 1.08;

  return {
    recommended: rateImproves && costDoesNotGrowTooMuch,
    rateImproves,
    costDoesNotGrowTooMuch,
    estimatedNewCost: Math.round(estimatedNewCost),
    currentApproxCost: Math.round(currentApproxCost),
    message:
      rateImproves && costDoesNotGrowTooMuch
        ? "La consolidación puede convenir si mantienes cerrados los cupos liberados."
        : "No conviene consolidar si la tasa o el costo total empeoran.",
  };
}

