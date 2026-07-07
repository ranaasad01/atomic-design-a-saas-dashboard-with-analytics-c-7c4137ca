"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight, MoreHorizontal, Eye, ShoppingCart, Zap, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useTranslations } from "next-intl";
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { PLAN_COLORS } from "@/lib/data";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const revenueData = [
  { month: "Jan", revenue: 42000, expenses: 28000, profit: 14000 },
  { month: "Feb", revenue: 47500, expenses: 30000, profit: 17500 },
  { month: "Mar", revenue: 44200, expenses: 27500, profit: 16700 },
  { month: "Apr", revenue: 53800, expenses: 32000, profit: 21800 },
  { month: "May", revenue: 61200, expenses: 35000, profit: 26200 },
  { month: "Jun", revenue: 58900, expenses: 33500, profit: 25400 },
  { month: "Jul", revenue: 67400, expenses: 37000, profit: 30400 },
  { month: "Aug", revenue: 72100, expenses: 39500, profit: 32600 },
  { month: "Sep", revenue: 69800, expenses: 38000, profit: 31800 },
  { month: "Oct", revenue: 78500, expenses: 42000, profit: 36500 },
  { month: "Nov", revenue: 84200, expenses: 44500, profit: 39700 },
  { month: "Dec", revenue: 91600, expenses: 47000, profit: 44600 },
];

const userGrowthData = [
  { week: "W1", active: 3200, new: 420, churned: 85 },
  { week: "W2", active: 3540, new: 510, churned: 92 },
  { week: "W3", active: 3890, new: 480, churned: 78 },
  { week: "W4", active: 4210, new: 560, churned: 110 },
  { week: "W5", active: 4580, new: 620, churned: 95 },
  { week: "W6", active: 4920, new: 590, churned: 88 },
  { week: "W7", active: 5340, new: 680, churned: 102 },
  { week: "W8", active: 5710, new: 720, churned: 115 },
];

const planData = [
  { name: "Starter", value: 38, color: PLAN_COLORS["Starter"] },
  { name: "Pro", value: 29, color: PLAN_COLORS["Pro"] },
  { name: "Business", value: 21, color: PLAN_COLORS["Business"] },
  { name: "Enterprise", value: 12, color: PLAN_COLORS["Enterprise"] },
];

const recentTransactions = [
  { id: "TXN-001", customer: "Acme Corp", plan: "Enterprise", amount: 2400, status: "paid", date: "Dec 18, 2024" },
  { id: "TXN-002", customer: "Bright Labs", plan: "Pro", amount: 149, status: "paid", date: "Dec 18, 2024" },
  { id: "TXN-003", customer: "Nova Studio", plan: "Business", amount: 499, status: "pending", date: "Dec 17, 2024" },
  { id: "TXN-004", customer: "Orbit Systems", plan: "Starter", amount: 49, status: "paid", date: "Dec 17, 2024" },
  { id: "TXN-005", customer: "Zenith AI", plan: "Enterprise", amount: 2400, status: "failed", date: "Dec 16, 2024" },
  { id: "TXN-006", customer: "Pixel Works", plan: "Pro", amount: 149, status: "paid", date: "Dec 16, 2024" },
  { id: "TXN-007", customer: "Cascade Inc", plan: "Business", amount: 499, status: "paid", date: "Dec 15, 2024" },
];

const topPages = [
  { path: "/dashboard", views: 48320, change: 12.4 },
  { path: "/analytics", views: 31540, change: 8.7 },
  { path: "/settings", views: 22180, change: -3.2 },
  { path: "/users", views: 18960, change: 21.5 },
  { path: "/billing", views: 14230, change: 5.1 },
];

const kpis = [
  {
    label: "Total Revenue",
    value: "$91,600",
    change: 18.4,
    icon: DollarSign,
    color: "#6366F1",
    glow: "rgba(99,102,241,0.3)",
    sub: "vs last month",
  },
  {
    label: "Active Users",
    value: "5,710",
    change: 7.2,
    icon: Users,
    color: "#22D3EE",
    glow: "rgba(34,211,238,0.3)",
    sub: "vs last week",
  },
  {
    label: "Conversion Rate",
    value: "4.38%",
    change: -1.1,
    icon: Activity,
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.3)",
    sub: "vs last month",
  },
  {
    label: "Avg. Session",
    value: "6m 42s",
    change: 9.3,
    icon: Eye,
    color: "#10B981",
    glow: "rgba(16,185,129,0.3)",
    sub: "vs last month",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    paid: {
      label: "Paid",
      cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      icon: <CheckCircle className="w-3 h-3" />,
    },
    pending: {
      label: "Pending",
      cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      icon: <Clock className="w-3 h-3" />,
    },
    failed: {
      label: "Failed",
      cls: "bg-red-500/10 text-red-400 border-red-500/20",
      icon: <AlertCircle className="w-3 h-3" />,
    },
  };
  const s = map[status] ?? map["pending"];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${s.cls}`}>
      {s.icon}
      {s.label}
    </span>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const color = PLAN_COLORS[plan] ?? "#6366F1";
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border"
      style={{
        backgroundColor: `${color}18`,
        color,
        borderColor: `${color}30`,
      }}
    >
      {plan}
    </span>
  );
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-[#1E293B] border border-white/10 rounded-xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-sm">
      <p className="text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-300 capitalize">{entry.name}:</span>
          <span className="text-white font-semibold">
            {typeof entry.value === "number"
              ? entry.name === "revenue" || entry.name === "expenses" || entry.name === "profit"
                ? `$${(entry.value ?? 0).toLocaleString("en-US")}`
                : (entry.value ?? 0).toLocaleString("en-US")
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DashboardOverviewPage() {
  const t = useTranslations();
  const [activeChart, setActiveChart] = useState<"revenue" | "users">("revenue");
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d" | "1y">("1y");

  const periods: Array<{ key: "7d" | "30d" | "90d" | "1y"; label: string }> = [
    { key: "7d", label: "7D" },
    { key: "30d", label: "30D" },
    { key: "90d", label: "90D" },
    { key: "1y", label: "1Y" },
  ];

  return (
    <main className="min-h-screen bg-[#0A0F1E] text-[#F8FAFC]">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-indigo-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[300px] bg-cyan-500/6 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Page Header ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-10"
        >
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                {t("dashboardOverview.title")}
              </h1>
              <p className="mt-1 text-slate-400 text-sm">
                {t("dashboardOverview.subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                {periods.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setSelectedPeriod(p.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      selectedPeriod === p.key
                        ? "bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold transition-all duration-200 shadow-[0_0_20px_rgba(99,102,241,0.35)]"
              >
                <Zap className="w-3.5 h-3.5" />
                {t("dashboardOverview.exportBtn")}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* ── KPI Cards ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
        >
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            const isPositive = kpi.change >= 0;
            return (
              <motion.div
                key={kpi.label}
                variants={scaleIn}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="relative bg-[#111827]/80 border border-white/8 rounded-2xl p-5 overflow-hidden group cursor-default"
                style={{
                  boxShadow: "0 1px 2px rgba(0,0,0,0.08), 0 8px 24px -8px rgba(0,0,0,0.2)",
                }}
              >
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{
                    background: `radial-gradient(ellipse at top left, ${kpi.glow} 0%, transparent 60%)`,
                  }}
                />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${kpi.color}18`, border: `1px solid ${kpi.color}30` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: kpi.color }} />
                    </div>
                    <span
                      className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${
                        isPositive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {Math.abs(kpi.change)}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white tracking-tight">{kpi.value}</p>
                  <p className="text-sm text-slate-400 mt-0.5">{kpi.label}</p>
                  <p className="text-xs text-slate-600 mt-1">{kpi.sub}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Main Chart + Pie ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          {/* Area / Bar Chart */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeInUp}
            className="xl:col-span-2 bg-[#111827]/80 border border-white/8 rounded-2xl p-6"
            style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 8px 32px -8px rgba(0,0,0,0.25)" }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h2 className="text-base font-semibold text-white">
                  {t("dashboardOverview.chartTitle")}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">{t("dashboardOverview.chartSub")}</p>
              </div>
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                {(["revenue", "users"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveChart(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${
                      activeChart === tab
                        ? "bg-white/10 text-white"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              {activeChart === "revenue" ? (
                <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2} fill="url(#gradRevenue)" dot={false} activeDot={{ r: 5, fill: "#6366F1" }} />
                  <Area type="monotone" dataKey="profit" stroke="#22D3EE" strokeWidth={2} fill="url(#gradProfit)" dot={false} activeDot={{ r: 5, fill: "#22D3EE" }} />
                </AreaChart>
              ) : (
                <BarChart data={userGrowthData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="week" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="active" fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="new" fill="#22D3EE" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              )}
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex items-center gap-5 mt-4">
              {activeChart === "revenue" ? (
                <>
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="w-3 h-0.5 bg-indigo-500 rounded-full inline-block" />
                    Revenue
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="w-3 h-0.5 bg-cyan-400 rounded-full inline-block" />
                    Profit
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="w-3 h-2 bg-indigo-500 rounded-sm inline-block" />
                    Active Users
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="w-3 h-2 bg-cyan-400 rounded-sm inline-block" />
                    New Users
                  </span>
                </>
              )}
            </div>
          </motion.div>

          {/* Pie Chart — Plan Breakdown */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeInUp}
            className="bg-[#111827]/80 border border-white/8 rounded-2xl p-6"
            style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 8px 32px -8px rgba(0,0,0,0.25)" }}
          >
            <h2 className="text-base font-semibold text-white mb-1">
              {t("dashboardOverview.planTitle")}
            </h2>
            <p className="text-xs text-slate-500 mb-5">{t("dashboardOverview.planSub")}</p>

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
                  strokeWidth={0}
                >
                  {planData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "Share"]}
                  contentStyle={{
                    background: "#1E293B",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#F8FAFC",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-2.5 mt-4">
              {planData.map((p) => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-sm text-slate-300">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${p.value}%`, backgroundColor: p.color }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-white w-8 text-right">{p.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Transactions + Top Pages ── */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Transactions Table */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeInUp}
            className="xl:col-span-3 bg-[#111827]/80 border border-white/8 rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 8px 32px -8px rgba(0,0,0,0.25)" }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
              <div>
                <h2 className="text-base font-semibold text-white">{t("dashboardOverview.txTitle")}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{t("dashboardOverview.txSub")}</p>
              </div>
              <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-200">
                {t("dashboardOverview.viewAll")}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">{t("dashboardOverview.colCustomer")}</th>
                    <th className="text-left text-xs font-medium text-slate-500 px-3 py-3 hidden sm:table-cell">{t("dashboardOverview.colPlan")}</th>
                    <th className="text-right text-xs font-medium text-slate-500 px-3 py-3">{t("dashboardOverview.colAmount")}</th>
                    <th className="text-left text-xs font-medium text-slate-500 px-3 py-3 hidden md:table-cell">{t("dashboardOverview.colStatus")}</th>
                    <th className="text-left text-xs font-medium text-slate-500 px-6 py-3 hidden lg:table-cell">{t("dashboardOverview.colDate")}</th>
                  </tr>
                </thead>
                <motion.tbody initial="hidden" animate="visible" variants={staggerContainer}>
                  {(recentTransactions ?? []).map((tx) => (
                    <motion.tr
                      key={tx.id}
                      variants={fadeIn}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                      className="border-b border-white/5 last:border-0 transition-colors duration-150"
                    >
                      <td className="px-6 py-3.5">
                        <div>
                          <p className="font-medium text-white text-sm">{tx.customer}</p>
                          <p className="text-xs text-slate-500">{tx.id}</p>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 hidden sm:table-cell">
                        <PlanBadge plan={tx.plan} />
                      </td>
                      <td className="px-3 py-3.5 text-right">
                        <span className="font-semibold text-white">
                          ${(tx.amount ?? 0).toLocaleString("en-US")}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 hidden md:table-cell">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="px-6 py-3.5 text-xs text-slate-500 hidden lg:table-cell">
                        {tx.date}
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          </motion.div>

          {/* Top Pages */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeInUp}
            className="xl:col-span-2 bg-[#111827]/80 border border-white/8 rounded-2xl p-6"
            style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 8px 32px -8px rgba(0,0,0,0.25)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-white">{t("dashboardOverview.pagesTitle")}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{t("dashboardOverview.pagesSub")}</p>
              </div>
              <ShoppingCart className="w-4 h-4 text-slate-600" />
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-4"
            >
              {(topPages ?? []).map((page, idx) => {
                const isPositive = page.change >= 0;
                const maxViews = topPages[0]?.views ?? 1;
                const pct = Math.round(((page.views ?? 0) / maxViews) * 100);
                return (
                  <motion.div key={page.path} variants={fadeInUp} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-600 w-4">{idx + 1}</span>
                        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors duration-200">
                          {page.path}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">
                          {(page.views ?? 0).toLocaleString("en-US")}
                        </span>
                        <span
                          className={`flex items-center gap-0.5 text-xs font-medium ${
                            isPositive ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {Math.abs(page.change)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: idx * 0.08 }}
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Quick Stats */}
            <div className="mt-6 pt-5 border-t border-white/8 grid grid-cols-2 gap-4">
              <div className="bg-white/3 rounded-xl p-3 border border-white/5">
                <p className="text-xs text-slate-500 mb-1">{t("dashboardOverview.totalViews")}</p>
                <p className="text-lg font-bold text-white">135,230</p>
                <p className="text-xs text-emerald-400 flex items-center gap-0.5 mt-0.5">
                  <TrendingUp className="w-3 h-3" /> 11.2%
                </p>
              </div>
              <div className="bg-white/3 rounded-xl p-3 border border-white/5">
                <p className="text-xs text-slate-500 mb-1">{t("dashboardOverview.bounceRate")}</p>
                <p className="text-lg font-bold text-white">32.4%</p>
                <p className="text-xs text-emerald-400 flex items-center gap-0.5 mt-0.5">
                  <TrendingDown className="w-3 h-3" /> 2.8%
                </p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </main>
  );
}