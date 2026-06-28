"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/format";
import type { Debt } from "@/lib/types";

const colors = [
  "var(--primary)",
  "var(--success)",
  "var(--danger)",
  "var(--warning)",
  "var(--secondary-text)",
  "var(--border)",
];

export function DebtBalanceChart({ debts }: { debts: Debt[] }) {
  const data = debts.map((debt) => ({ name: debt.name, saldo: debt.balance }));

  return (
    <div className="h-72 w-full" role="img" aria-label="Gráfico de barras con el saldo de cada deuda registrada.">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 0, right: 8, top: 12, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${Math.round(Number(value) / 1000000)}M`} />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Bar dataKey="saldo" radius={[6, 6, 0, 0]} fill="var(--primary)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DebtDistributionChart({ debts }: { debts: Debt[] }) {
  const data = debts.map((debt) => ({ name: debt.name, value: debt.balance }));

  return (
    <div className="h-72 w-full" role="img" aria-label="Gráfico circular con la distribución del saldo por deuda.">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={2}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
