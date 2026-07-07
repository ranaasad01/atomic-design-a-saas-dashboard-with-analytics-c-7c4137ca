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
    value: "4m 12s",
    change: 5.8,
    icon: Clock,
    color: "#10B981",
    glow: "rgba(16,185,129,0.3)",
    sub: "vs last week",
  },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
    paid: { label: "Paid", cls: "bg-emerald-50 text-emerald-600", icon: CheckCircle },
    pending: { label: "Pending", cls: "bg-amber-50 text-amber-600", icon: Clock },
    failed: { label: "Failed", cls: "bg-red-50 text-red-600", icon: AlertCircle },
  };
  const cfg = map[status] ?? map["pending"];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const tooltipStyle = {
  contentStyle: {
    background: "#FFFFFF",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: "12px",
    color: "#1E1B18",
    fontSize: "12px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
  },
  labelStyle: { color: "#1E1B18", fontWeight: 600, marginBottom: 4 },
  itemStyle: { color: "#1E1B18" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardOverviewPage() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<"revenue" | "expenses" | "profit">("revenue");

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
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-[#6B6560]">
            A high-level snapshot of your business performance.
          </p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            const isPositive = kpi.change >= 0;
            return (
              <motion.div
                key={kpi.label}
                variants={scaleIn}
                className="bg-white border border-black/8 shadow-sm rounded-2xl p-5 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#6B6560] uppercase tracking-wider">
                    {kpi.label}
                  </span>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${kpi.color}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: kpi.color }} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#1E1B18] tracking-tight">
                  {kpi.value}
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                      isPositive ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    )}
                    {Math.abs(kpi.change)}%
                  </span>
                  <span className="text-xs text-[#6B6560]">{kpi.sub}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts Row 1: Revenue + User Growth */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
        >
          {/* Revenue Chart */}
          <motion.div
            variants={fadeInUp}
            className="bg-white border border-black/8 shadow-sm rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-[#1E1B18]">Revenue Overview</h2>
                <p className="text-xs text-[#6B6560] mt-0.5">Monthly revenue, expenses & profit</p>
              </div>
              <div className="flex items-center gap-1 bg-[#F3EFE8] rounded-lg p-1">
                {(["revenue", "expenses", "profit"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all duration-200 ${
                      activeTab === tab
                        ? "bg-white text-[#1E1B18] shadow-sm"
                        : "text-[#6B6560] hover:text-[#1E1B18]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
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
                  {...tooltipStyle}
                  formatter={(value: number) => [`$${value.toLocaleString("en-US")}`, ""]}
                />
                {activeTab === "revenue" && (
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366F1"
                    strokeWidth={2}
                    fill="url(#revGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#6366F1" }}
                  />
                )}
                {activeTab === "expenses" && (
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    fill="url(#expGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#F59E0B" }}
                  />
                )}
                {activeTab === "profit" && (
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="url(#profGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#10B981" }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* User Growth Chart */}
          <motion.div
            variants={fadeInUp}
            className="bg-white border border-black/8 shadow-sm rounded-2xl p-6"
          >
            <div className="mb-4">
              <h2 className="text-base font-semibold text-[#1E1B18]">User Growth</h2>
              <p className="text-xs text-[#6B6560] mt-0.5">Weekly active, new & churned users</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={userGrowthData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "#9C9590", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#9C9590", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="active" fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={24} />
                <Bar dataKey="new" fill="#22D3EE" radius={[4, 4, 0, 0]} maxBarSize={24} />
                <Bar dataKey="churned" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3">
              {[
                { label: "Active", color: "#6366F1" },
                { label: "New", color: "#22D3EE" },
                { label: "Churned", color: "#F59E0B" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: item.color }} />
                  <span className="text-xs text-[#6B6560]">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Charts Row 2: Plan Breakdown + Top Pages */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
        >
          {/* Plan Breakdown */}
          <motion.div
            variants={fadeInUp}
            className="bg-white border border-black/8 shadow-sm rounded-2xl p-6"
          >
            <div className="mb-4">
              <h2 className="text-base font-semibold text-[#1E1B18]">Plan Breakdown</h2>
              <p className="text-xs text-[#6B6560] mt-0.5">Subscription distribution by plan</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ResponsiveContainer width={180} height={180}>
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
                    {...tooltipStyle}
                    formatter={(value: number) => [`${value}%`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-3 flex-1">
                {planData.map((plan) => (
                  <div key={plan.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: plan.color }}
                      />
                      <span className="text-sm text-[#6B6560]">{plan.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 rounded-full bg-black/8 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${plan.value}%`, background: plan.color }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-[#1E1B18] w-8 text-right">
                        {plan.value}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Top Pages */}
          <motion.div
            variants={fadeInUp}
            className="bg-white border border-black/8 shadow-sm rounded-2xl p-6"
          >
            <div className="mb-4">
              <h2 className="text-base font-semibold text-[#1E1B18]">Top Pages</h2>
              <p className="text-xs text-[#6B6560] mt-0.5">Most visited pages this month</p>
            </div>
            <div className="space-y-3">
              {topPages.map((page, i) => {
                const isPositive = page.change >= 0;
                const maxViews = topPages[0].views;
                return (
                  <div key={page.path} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-[#6B6560] w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-[#1E1B18] truncate">{page.path}</span>
                        <div className="flex items-center gap-2 ml-2 shrink-0">
                          <span className="text-xs text-[#6B6560]">
                            {page.views.toLocaleString("en-US")}
                          </span>
                          <span
                            className={`text-xs font-semibold ${
                              isPositive ? "text-emerald-600" : "text-red-500"
                            }`}
                          >
                            {isPositive ? "+" : ""}{page.change}%
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-black/8 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                          style={{ width: `${(page.views / maxViews) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Transactions Table */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-white border border-black/8 shadow-sm rounded-2xl overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-black/5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#1E1B18]">Recent Transactions</h2>
                <p className="text-xs text-[#6B6560] mt-0.5">Latest billing activity across all accounts</p>
              </div>
              <button className="text-xs font-medium text-indigo-500 hover:text-indigo-600 transition-colors">
                View all
              </button>
            </div>
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
              <tbody className="divide-y divide-black/5">
                {recentTransactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className="hover:bg-black/[0.02] transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-xs font-mono text-[#6B6560]">{txn.id}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-[#1E1B18]">{txn.customer}</span>
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
                      <StatusBadge status={txn.status} />
                    </td>
                    <td className="px-6 py-4 text-xs text-[#6B6560]">{txn.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
