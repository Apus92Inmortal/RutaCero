import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  CalendarDays,
  CircleDollarSign,
  Gauge,
  Lightbulb,
  ListChecks,
  Target,
  UserRound,
  WalletCards,
} from "lucide-react";

export const BRAND = {
  name: "Ruta Cero",
  slogan: "Tu plan inteligente para salir de deudas",
  productName: "Ruta Cero - Acceso de por vida",
  price: 49900,
  currency: "COP",
  commercialCopy: "Pago único de $49.900 COP con acceso de por vida.",
};

export const APP_NAV_ITEMS = [
  { href: "/app", label: "Resumen", icon: BarChart3 },
  { href: "/app/debts", label: "Tus deudas", icon: WalletCards },
  { href: "/app/simulator", label: "Simulador", icon: Gauge },
  { href: "/app/strategies", label: "Estrategia", icon: ListChecks },
  { href: "/app/calendar", label: "Calendario", icon: CalendarDays },
  { href: "/app/alerts", label: "Alertas", icon: AlertTriangle },
  { href: "/app/recommendations", label: "Recomendaciones", icon: Lightbulb },
  { href: "/app/education", label: "Educación", icon: BookOpen },
  { href: "/app/goals", label: "Metas", icon: Target },
  { href: "/app/reports", label: "Reporte", icon: CircleDollarSign },
  { href: "/app/profile", label: "Perfil", icon: UserRound },
];

export const MOBILE_NAV_ITEMS = APP_NAV_ITEMS.filter((item) =>
  ["/app", "/app/debts", "/app/simulator", "/app/alerts", "/app/profile"].includes(item.href),
);

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
