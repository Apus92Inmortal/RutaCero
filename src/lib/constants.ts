import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  CalendarDays,
  CircleDollarSign,
  Gauge,
  Home,
  Lightbulb,
  ListChecks,
  Target,
  WalletCards,
} from "lucide-react";

export const BRAND = {
  name: "Ruta Cero",
  slogan: "Tu plan inteligente para salir de deudas",
  productName: "Ruta Cero - Acceso Vitalicio",
  price: 49900,
  currency: "COP",
  commercialCopy:
    "Paga una sola vez y recibe acceso de por vida. Sin suscripciones. Sin cobros mensuales.",
};

export const APP_NAV_ITEMS = [
  { href: "/app", label: "Dashboard", icon: Home },
  { href: "/app/debts", label: "Deudas", icon: WalletCards },
  { href: "/app/summary", label: "Resumen", icon: BarChart3 },
  { href: "/app/simulator", label: "Simulador", icon: Gauge },
  { href: "/app/strategies", label: "Estrategias", icon: ListChecks },
  { href: "/app/calendar", label: "Calendario", icon: CalendarDays },
  { href: "/app/alerts", label: "Alertas", icon: AlertTriangle },
  { href: "/app/recommendations", label: "Recomendaciones", icon: Lightbulb },
  { href: "/app/education", label: "Educación", icon: BookOpen },
  { href: "/app/goals", label: "Metas", icon: Target },
  { href: "/app/reports", label: "Reporte", icon: CircleDollarSign },
];

export const DEBT_TYPES = [
  { value: "credit_card", label: "Tarjeta de crédito" },
  { value: "personal_loan", label: "Crédito personal" },
  { value: "payroll_loan", label: "Crédito de libranza" },
  { value: "installment_purchase", label: "Compra a cuotas" },
  { value: "vehicle_loan", label: "Crédito de vehículo" },
  { value: "mortgage", label: "Hipoteca" },
  { value: "informal_loan", label: "Préstamo informal" },
  { value: "other", label: "Otra deuda" },
] as const;

export const DEBT_STATUS = [
  { value: "current", label: "Al día" },
  { value: "due_soon", label: "Próxima a vencer" },
  { value: "late", label: "En mora" },
  { value: "collections", label: "Cobranza" },
] as const;

export const STRESS_LEVELS = [
  { value: "low", label: "Bajo" },
  { value: "medium", label: "Medio" },
  { value: "high", label: "Alto" },
  { value: "critical", label: "Crítico" },
] as const;

export const URGENCY_LEVELS = [
  { value: "low", label: "Baja" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
  { value: "critical", label: "Crítica" },
] as const;
