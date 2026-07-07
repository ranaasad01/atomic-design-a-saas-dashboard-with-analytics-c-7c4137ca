"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight, ChevronDown, Check, Clock, AlertCircle } from 'lucide-react';
import { useTranslations } from "next-intl";
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { PLAN_COLORS } from "@/lib/data";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const kpiCards = [
  {
    id: "revenue",
    label: "Total Revenue",
    value: 128450,
    prefix: "$",
    suffix: "",
    change: 12.4,
    changeLabel: "vs last period",
    icon: DollarSign,
    color: "#6366F1",
    glow: "rgba(99,102,241,0.25)",
  },
  {
    id: "users",
    label: "Active Users",
    value: 8_312,
    prefix: "",
    suffix: "",
    change: 8.1,
    changeLabel: "vs last period",
    icon: Users,
    color: "#22D3EE",
    glow: "rgba(34,211,238,0.25)",
  },
  {
    id: "churn",
    label: "Churn Rate",
    value: 2.4,
    prefix: "",
    suffix: "%",
    change: -0.6,
    changeLabel: "vs last period",
    icon: Activity,
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.25)",
  },
  {
    id: "mrr",
    label: "MRR",
    value: 42_816,
    prefix: "$",
    suffix: "",
    change: 5.3,
    changeLabel: "vs last period",
    icon: TrendingUp,
    color: "#10B981",
    glow: "rgba(16,185,129,0.25)",
  },
];

const activeUsersData7d = [
  { date: "Mon", users: 6200 },
  { date: "Tue", users: 6850 },
  { date: "Wed", users: 7100 },
  { date: "Thu", users: 6900 },
  { date: "Fri", users: 7400 },
  { date: "Sat", users: 7800 },
  { date: "Sun", users: 8312 },
];

const activeUsersData30d = [
  { date: "Jan 1", users: 5100 },
  { date: "Jan 5", users: 5400 },
  { date: "Jan 10", users: 5900 },
  { date: "Jan 15", users: 6200 },
  { date: "Jan 20", users: 6700 },
  { date: "Jan 25", users: 7100 },
  { date: "Jan 30", users: 7600 },
  { date: "Feb 4", users: 7900 },
  { date: "Feb 9", users: 8100 },
  { date: "Feb 14", users: 8312 },
];

const activeUsersData90d = [
  { date: "Nov", users: 4200 },
  { date: "Nov 15", users: 4800 },
  { date: "Dec 1", users: 5300 },
  { date: "Dec 15", users: 5900 },
  { date: "Jan 1", users: 6400 },
  { date: "Jan 15", users: 7000 },
  { date: "Feb 1", users: 7600 },
  { date: "Feb 15", users: 8312 },
];

const activeUsersData1y = [
  { date: "Mar", users: 2800 },
  { date: "Apr", users: 3200 },
  { date: "May", users: 3700 },
  { date: "Jun", users: 4100 },
  { date: "Jul", users: 4600 },
  { date: "Aug", users: 5200 },
  { date: "Sep", users: 5800 },
  { date: "Oct", users: 6300 },
  { date: "Nov", users: 6900 },
  { date: "Dec", users: 7400 },
  { date: "Jan", users: 7900 },
  { date: "Feb", users: 8312 },
];

const revenueData7d = [
  { date: "Mon", revenue: 3200 },
  { date: "Tue", revenue: 4100 },
  { date: "Wed", revenue: 3800 },
  { date: "Thu", revenue: 4600 },
  { date: "Fri", revenue: 5100 },
  { date: "Sat", revenue: 4800 },
  { date: "Sun", revenue: 5400 },
];

const revenueData30d = [
  { date: "Jan 1", revenue: 28000 },
  { date: "Jan 8", revenue: 31000 },
  { date: "Jan 15", revenue: 29500 },
  { date: "Jan 22", revenue: 34000 },
  { date: "Jan 29", revenue: 37500 },
  { date: "Feb 5", revenue: 36000 },
  { date: "Feb 12", revenue: 40200 },
  { date: "Feb 19", revenue: 42816 },
];

const revenueData90d = [
  { date: "Nov", revenue: 95000 },
  { date: "Nov 15", revenue: 102000 },
  { date: "Dec 1", revenue: 108000 },
  { date: "Dec 15", revenue: 115000 },
  { date: "Jan 1", revenue: 119000 },
  { date: "Jan 15", revenue: 124000 },
  { date: "Feb 1", revenue: 128450 },
];

const revenueData1y = [
  { date: "Mar", revenue: 62000 },
  { date: "Apr", revenue: 68000 },
  { date: "May", revenue: 74000 },
  { date: "Jun", revenue: 81000 },
  { date: "Jul", revenue: 88000 },
  { date: "Aug", revenue: 95000 },
  { date: "Sep", revenue: 103000 },
  { date: "Oct", revenue: 112000 },
  { date: "Nov", revenue: 118000 },
  { date: "Dec", revenue: 124000 },
  { date: "Jan", revenue: 128450 },
];

const planData = [
  { name: "Starter", value: 38, color: PLAN_COLORS["Starter"] },
  { name: "Pro", value: 31, color: PLAN_COLORS["Pro"] },
  { name: "Business", value: 20, color: PLAN_COLORS["Business"] },
  { name: "Enterprise", value: 11, color: PLAN_COLORS["Enterprise"] },
];

const transactions = [
  {
    id: "TXN-4821",
    user: "Acme Corp",
    email: "billing@acme.com",
    plan: "Enterprise",
    amount: 2400,
    status: "paid" as const,
    date: "Feb 14, 2024",
  },
  {
    id: "TXN-4820",
    user: "Bright Labs",
    email: "admin@brightlabs.io",
    plan: "Pro",
    amount: 149,
    status: "paid" as const,
    date: "Feb 14, 2024",
  },
  {
    id: "TXN-4819",
    user: "Nova Studio",
    email: "finance@novastudio.co",
    plan: "Business",
    amount: 499,
    status: "pending" as const,
    date: "Feb 13, 2024",
  },
  {
    id: "TXN-4818",
    user: "Orbit Systems",
    email: "ops@orbitsys.com",
    plan: "Starter",
    amount: 49,
    status: "paid" as const,
    date: "Feb 13, 2024",
  },
  {
    id: "TXN-4817",
    user: "Zenith AI",
    email: "accounts@zenith.ai",
    plan: "Enterprise",
    amount: 2400,
    status: "failed" as const,
    date: "Feb 12, 2024",
  },
  {
    id: "TXN-4816",
    user: "Pixel Works",
    email: "hello@pixelworks.design",
    plan: "Pro",
    amount: 149,
    status: "paid" as const,
    date: "Feb 12, 2024",
  },
  {
    id: "TXN-4815",
    user: "Cascade Inc",
    email: "billing@cascade.inc",
    plan: "Business",
    amount: 499,
    status: "paid" as const,
    date: "Feb 11, 2024",
  },
];

type Period = "7d" | "30d" | "90d" | "1y";

const PERIODS: Period[] = ["7d", "30d", "90d", "1y"];

const activeUsersMap: Record<Period, typeof activeUsersData7d> = {
  "7d": activeUsersData7d,
  "30d": activeUsersData30d,
  "90d": activeUsersData90d,
  "1y": activeUsersData1y,
};

const revenueMap: Record<Period, typeof revenueData7d> = {
  "7d": revenueData7d,
  "30d": revenueData30d,
  "90d": revenueData90d,
  "1y": revenueData1y,
};

const statusConfig = {
  paid: {
    label: "Paid",
    icon: Check,
    className: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-50 text-amber-600 border border-amber-100",
  },
  failed: {
    label: "Failed",
    icon: AlertCircle,
    className: "bg-red-50 text-red-600 border border-red-100",
  },
};

function formatValue(value: number, prefix: string, suffix: string): string {
  if (prefix === "$") {
    return `$${value.toLocaleString("en-US")}`;
  }
  return `${value.toLocaleString("en-US")}${suffix}`;
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 12,
        padding: "10px 14px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}
    >
      <p style={{ color: "#9C9590", fontSize: 11, marginBottom: 6 }}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: "#1E1B18", fontSize: 13, fontWeight: 600 }}>
          <span style={{ color: entry.color, marginRight: 6 }}>●</span>
          {entry.name === "revenue" || entry.name === "Revenue"
            ? `$${entry.value.toLocaleString("en-US")}`
            : entry.value.toLocaleString("en-US")}
        </p>
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const t = useTranslations();
  const [activeUsersPeriod, setActiveUsersPeriod] = useState<Period>("30d");
  const [revenuePeriod, setRevenuePeriod] = useState<Period>("30d");

  const activeUsersChartData = useMemo(
    () => activeUsersMap[activeUsersPeriod],
    [activeUsersPeriod]
  );

  const revenueChartData = useMemo(
    () => revenueMap[revenuePeriod],
    [revenuePeriod]
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-[#1E1B18] tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-[#6B6560]">
            Monitor your key metrics and business performance at a glance.
          </p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {kpiCards.map((card) => {
            const Icon = card.icon;
            const isPositive = card.change >= 0;
            const isChurn = card.id === "churn";
            const goodChange = isChurn ? !isPositive : isPositive;

            return (
              <motion.div
                key={card.id}
                variants={scaleIn}
                className="bg-white border border-black/8 shadow-sm rounded-2xl p-5 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#6B6560] uppercase tracking-wider">
                    {card.label}
                  </span>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${card.color}18` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: card.color }} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#1E1B18] tracking-tight">
                  {formatValue(card.value, card.prefix, card.suffix)}
                </div>
                <div className="flex items-center gap-1.5">
                  {goodChange ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      goodChange ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {Math.abs(card.change)}%
                  </span>
                  <span className="text-xs text-[#6B6560]">{card.changeLabel}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Active Users Area Chart */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="lg:col-span-2 bg-white border border-black/8 shadow-sm rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-[#1E1B18]">Active Users</h2>
                <p className="text-xs text-[#6B6560] mt-0.5">Unique active users over time</p>
              </div>
              <div className="flex items-center gap-1 bg-[#F3EFE8] rounded-lg p-1">
                {PERIODS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setActiveUsersPeriod(p)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                      activeUsersPeriod === p
                        ? "bg-indigo-500 text-white shadow-sm"
                        : "bg-black/5 text-[#6B6560] hover:bg-black/8 hover:text-[#1E1B18]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={activeUsersChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#9C9590", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#9C9590", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#22D3EE"
                  strokeWidth={2}
                  fill="url(#usersGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#22D3EE" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Plan Breakdown Pie */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="bg-white border border-black/8 shadow-sm rounded-2xl p-6"
          >
            <div className="mb-6">
              <h2 className="text-base font-semibold text-[#1E1B18]">Plan Breakdown</h2>
              <p className="text-xs text-[#6B6560] mt-0.5">Subscription distribution</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={planData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {planData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: 10,
                    color: "#1E1B18",
                  }}
                  formatter={(value: number) => [`${value}%`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {planData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: item.color }}
                    />
                    <span className="text-xs text-[#6B6560]">{item.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#1E1B18]">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Line Chart */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="bg-white border border-black/8 shadow-sm rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-[#1E1B18]">Revenue</h2>
                <p className="text-xs text-[#6B6560] mt-0.5">Total revenue over time</p>
              </div>
              <div className="flex items-center gap-1 bg-[#F3EFE8] rounded-lg p-1">
                {PERIODS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setRevenuePeriod(p)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                      revenuePeriod === p
                        ? "bg-indigo-500 text-white shadow-sm"
                        : "bg-black/5 text-[#6B6560] hover:bg-black/8 hover:text-[#1E1B18]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={revenueChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#9C9590", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#9C9590", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366F1"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: "#6366F1" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* MRR Growth Area */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="bg-white border border-black/8 shadow-sm rounded-2xl p-6"
          >
            <div className="mb-6">
              <h2 className="text-base font-semibold text-[#1E1B18]">MRR Growth</h2>
              <p className="text-xs text-[#6B6560] mt-0.5">Monthly recurring revenue trend</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart
                data={[
                  { month: "Mar", mrr: 18200 },
                  { month: "Apr", mrr: 21400 },
                  { month: "May", mrr: 24600 },
                  { month: "Jun", mrr: 27800 },
                  { month: "Jul", mrr: 30200 },
                  { month: "Aug", mrr: 33500 },
                  { month: "Sep", mrr: 36100 },
                  { month: "Oct", mrr: 38700 },
                  { month: "Nov", mrr: 40200 },
                  { month: "Dec", mrr: 41500 },
                  { month: "Jan", mrr: 42100 },
                  { month: "Feb", mrr: 42816 },
                ]}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#9C9590", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#9C9590", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: 10,
                    color: "#1E1B18",
                  }}
                  formatter={(v: number) => [`$${v.toLocaleString("en-US")}`, "MRR"]}
                />
                <Area
                  type="monotone"
                  dataKey="mrr"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#mrrGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#10B981" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Transactions Table */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-white border border-black/8 shadow-sm rounded-2xl overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-black/5">
            <h2 className="text-base font-semibold text-[#1E1B18]">Recent Transactions</h2>
            <p className="text-xs text-[#6B6560] mt-0.5">Latest billing activity across all accounts</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/5">
                  {["Transaction", "Customer", "Plan", "Amount", "Status", "Date"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-semibold text-[#6B6560] uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, i) => {
                  const status = statusConfig[txn.status];
                  const StatusIcon = status.icon;
                  return (
                    <tr
                      key={txn.id}
                      className={`border-b border-black/5 transition-colors hover:bg-black/[0.02] ${
                        i === transactions.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-xs font-mono text-[#6B6560]">{txn.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-[#1E1B18]">{txn.user}</div>
                        <div className="text-xs text-[#6B6560]">{txn.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{
                            background: `${PLAN_COLORS[txn.plan]}18`,
                            color: PLAN_COLORS[txn.plan],
                          }}
                        >
                          {txn.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#1E1B18]">
                        ${txn.amount.toLocaleString("en-US")}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                            status.className
                          }`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#6B6560]">{txn.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
