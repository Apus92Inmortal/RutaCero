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
import type { Debt } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

const colors = ["#0B2C4A", "#2ECC71", "#E74C3C", "#F1C40F", "#52616B", "#7FB3D5"];

export function DebtBalanceChart({ debts }: { debts: Debt[] }) {
  const data = debts.map((debt) => ({ name: debt.name, saldo: debt.balance }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 0, right: 8, top: 12, bottom: 0 }}>
          <CartesianGrid stroke="#d9e2ec" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${Math.round(Number(value) / 1000000)}M`} />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Bar dataKey="saldo" radius={[6, 6, 0, 0]} fill="#0B2C4A" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DebtDistributionChart({ debts }: { debts: Debt[] }) {
  const data = debts.map((debt) => ({ name: debt.name, value: debt.balance }));

  return (
    <div className="h-72 w-full">
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

