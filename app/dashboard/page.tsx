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
  { date: "Jun", revenue: 80000 },
  { date: "Jul", revenue: 87000 },
  { date: "Aug", revenue: 93000 },
  { date: "Sep", revenue: 99000 },
  { date: "Oct", revenue: 107000 },
  { date: "Nov", revenue: 114000 },
  { date: "Dec", revenue: 120000 },
  { date: "Jan", revenue: 125000 },
  { date: "Feb", revenue: 128450 },
];

const planBreakdown = [
  { name: "Starter", value: 38 },
  { name: "Pro", value: 31 },
  { name: "Business", value: 20 },
  { name: "Enterprise", value: 11 },
];

const transactions = [
  {
    id: "txn_001",
    user: "Sophia Carter",
    email: "sophia@acmecorp.io",
    plan: "Pro",
    amount: 79,
    status: "paid" as const,
    date: "Feb 19, 2025",
  },
  {
    id: "txn_002",
    user: "Marcus Lee",
    email: "marcus@brightwave.co",
    plan: "Business",
    amount: 199,
    status: "paid" as const,
    date: "Feb 19, 2025",
  },
  {
    id: "txn_003",
    user: "Priya Nair",
    email: "priya@stacklabs.dev",
    plan: "Starter",
    amount: 29,
    status: "pending" as const,
    date: "Feb 18, 2025",
  },
  {
    id: "txn_004",
    user: "James Okafor",
    email: "james@novafin.com",
    plan: "Enterprise",
    amount: 499,
    status: "paid" as const,
    date: "Feb 18, 2025",
  },
  {
    id: "txn_005",
    user: "Elena Vasquez",
    email: "elena@loopcraft.io",
    plan: "Pro",
    amount: 79,
    status: "failed" as const,
    date: "Feb 17, 2025",
  },
  {
    id: "txn_006",
    user: "Daniel Kim",
    email: "daniel@pixelshift.co",
    plan: "Business",
    amount: 199,
    status: "paid" as const,
    date: "Feb 17, 2025",
  },
  {
    id: "txn_007",
    user: "Aisha Mensah",
    email: "aisha@cloudnine.ai",
    plan: "Starter",
    amount: 29,
    status: "paid" as const,
    date: "Feb 16, 2025",
  },
  {
    id: "txn_008",
    user: "Tom Eriksson",
    email: "tom@nordicdev.se",
    plan: "Pro",
    amount: 79,
    status: "pending" as const,
    date: "Feb 16, 2025",
  },
];

type Period = "7d" | "30d" | "90d" | "1y";

const periodLabels: Record<Period, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "1y": "Last 12 months",
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
  prefix = "",
  suffix = "",
}: {
  active?: boolean;
  payload?: Array<{ value: number; color?: string }>;
  label?: string;
  prefix?: string;
  suffix?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const val = payload[0]?.value ?? 0;
  return (
    <div className="bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-white">
        {prefix}
        {val.toLocaleString("en-US")}
        {suffix}
      </p>
    </div>
  );
}

// ─── Period Picker ────────────────────────────────────────────────────────────

function PeriodPicker({
  value,
  onChange,
}: {
  value: Period;
  onChange: (p: Period) => void;
}) {
  const [open, setOpen] = useState(false);
  const periods: Period[] = ["7d", "30d", "90d", "1y"];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        {periodLabels[value]}
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-40 bg-[#1E293B] border border-white/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-20 overflow-hidden">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => {
                onChange(p);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors duration-150"
            >
              {periodLabels[p]}
              {value === p && <Check className="w-3.5 h-3.5 text-indigo-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: "paid" | "pending" | "failed" }) {
  const config = {
    paid: {
      label: "Paid",
      icon: Check,
      className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    pending: {
      label: "Pending",
      icon: Clock,
      className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    failed: {
      label: "Failed",
      icon: AlertCircle,
      className: "bg-red-500/10 text-red-400 border-red-500/20",
    },
  };
  const { label, icon: Icon, className } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KPICardWidget({
  card,
}: {
  card: (typeof kpiCards)[number];
}) {
  const isPositive = card.change >= 0;
  const isChurn = card.id === "churn";
  const good = isChurn ? !isPositive : isPositive;

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative bg-[#1E293B]/80 border border-white/8 rounded-2xl p-5 overflow-hidden group cursor-default"
      style={{
        boxShadow: `0 1px 2px rgba(0,0,0,0.08), 0 8px 24px -8px rgba(0,0,0,0.2)`,
      }}
    >
      {/* Glow */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"
        style={{ background: card.glow }}
      />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${card.color}18`, border: `1px solid ${card.color}30` }}
          >
            <card.icon className="w-5 h-5" style={{ color: card.color }} />
          </div>
          <span
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              good
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {good ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {Math.abs(card.change)}
            {card.id === "churn" ? "pp" : "%"}
          </span>
        </div>
        <p className="text-2xl font-bold text-white tracking-tight">
          {card.prefix}
          {card.value.toLocaleString("en-US")}
          {card.suffix}
        </p>
        <p className="text-sm text-slate-400 mt-1">{card.label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{card.changeLabel}</p>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const t = useTranslations();
  const [period, setPeriod] = useState<Period>("30d");

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

  const activeUsersChartData = useMemo(() => activeUsersMap[period], [period]);
  const revenueChartData = useMemo(() => revenueMap[period], [period]);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-8"
        >
          <motion.div variants={fadeInUp} className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                {t("dashboard.title")}
              </h1>
              <p className="text-slate-400 mt-1 text-sm">
                {t("dashboard.subtitle")}
              </p>
            </div>
            <PeriodPicker value={period} onChange={setPeriod} />
          </motion.div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {kpiCards.map((card) => (
            <KPICardWidget key={card.id} card={card} />
          ))}
        </motion.div>

        {/* Active Users Area Chart */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
          className="bg-[#1E293B]/80 border border-white/8 rounded-2xl p-6 mb-6 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.2)]"
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-base font-semibold text-white">
                {t("dashboard.activeUsersTrend")}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t("dashboard.activeUsersDesc")}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-3 h-0.5 rounded-full bg-indigo-400 inline-block" />
              {t("dashboard.activeUsers")}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={activeUsersChartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#64748B", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748B", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) =>
                  v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)
                }
              />
              <Tooltip
                content={
                  <CustomTooltip prefix="" suffix=" users" />
                }
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#6366F1"
                strokeWidth={2}
                fill="url(#usersGrad)"
                dot={false}
                activeDot={{ r: 5, fill: "#6366F1", stroke: "#0F172A", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Revenue + Plan Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          {/* Revenue Line Chart */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={slideInLeft}
            className="lg:col-span-3 bg-[#1E293B]/80 border border-white/8 rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.2)]"
          >
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-base font-semibold text-white">
                  {t("dashboard.revenueOverTime")}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t("dashboard.revenueDesc")}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-3 h-0.5 rounded-full bg-cyan-400 inline-block" />
                {t("dashboard.revenue")}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={revenueChartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#64748B", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748B", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) =>
                    v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
                  }
                />
                <Tooltip
                  content={<CustomTooltip prefix="$" suffix="" />}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22D3EE"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, fill: "#22D3EE", stroke: "#0F172A", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Plan Breakdown Donut */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={slideInRight}
            className="lg:col-span-2 bg-[#1E293B]/80 border border-white/8 rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.2)]"
          >
            <div className="mb-4">
              <h2 className="text-base font-semibold text-white">
                {t("dashboard.planBreakdown")}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t("dashboard.planBreakdownDesc")}
              </p>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={planBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {planBreakdown.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={PLAN_COLORS[entry.name] ?? "#6366F1"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) return null;
                    const item = payload[0];
                    return (
                      <div className="bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                        <p className="text-xs text-slate-400 mb-1">{item?.name}</p>
                        <p className="text-sm font-semibold text-white">
                          {(item?.value as number ?? 0)}%
                        </p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {planBreakdown.map((plan) => (
                <div key={plan.name} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: PLAN_COLORS[plan.name] ?? "#6366F1" }}
                  />
                  <span className="text-xs text-slate-400 truncate">{plan.name}</span>
                  <span className="text-xs font-medium text-white ml-auto">{plan.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Transactions Table */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
          className="bg-[#1E293B]/80 border border-white/8 rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.2)]"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/8 flex-wrap gap-3">
            <div>
              <h2 className="text-base font-semibold text-white">
                {t("dashboard.recentTransactions")}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t("dashboard.transactionsDesc")}
              </p>
            </div>
            <span className="text-xs text-slate-500 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              {transactions.length} {t("dashboard.entries")}
            </span>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    {t("dashboard.colUser")}
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    {t("dashboard.colPlan")}
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    {t("dashboard.colAmount")}
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    {t("dashboard.colStatus")}
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    {t("dashboard.colDate")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {(transactions ?? []).map((tx, i) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, duration: 0.3, ease: "easeOut" }}
                    className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors duration-150 group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/30 to-cyan-500/30 border border-white/10 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
                          {tx.user?.charAt(0) ?? "?"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white leading-tight">
                            {tx.user}
                          </p>
                          <p className="text-xs text-slate-500">{tx.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full border"
                        style={{
                          color: PLAN_COLORS[tx.plan] ?? "#6366F1",
                          background: `${PLAN_COLORS[tx.plan] ?? "#6366F1"}15`,
                          borderColor: `${PLAN_COLORS[tx.plan] ?? "#6366F1"}30`,
                        }}
                      >
                        {tx.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-white">
                        ${(tx.amount ?? 0).toLocaleString("en-US")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-400">{tx.date}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-white/5">
            {(transactions ?? []).map((tx) => (
              <div key={tx.id} className="px-4 py-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/30 to-cyan-500/30 border border-white/10 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
                    {tx.user?.charAt(0) ?? "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{tx.user}</p>
                    <p className="text-xs text-slate-500">{tx.email}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{tx.date}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-sm font-semibold text-white">
                    ${(tx.amount ?? 0).toLocaleString("en-US")}
                  </span>
                  <StatusBadge status={tx.status} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Missing import fix ───────────────────────────────────────────────────────
// slideInLeft / slideInRight used above — import them
import { slideInLeft, slideInRight, staggerContainer } from "@/lib/motion";