"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Globe, Users, Eye, Clock, ChevronUp, ChevronDown, BarChart as BarChartIcon } from 'lucide-react';
import { useTranslations } from "next-intl";
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { type ChartPeriod } from "@/lib/data";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const acquisitionData = [
  { month: "Jan", Organic: 4200, Paid: 2800, Referral: 1600, Social: 900 },
  { month: "Feb", Organic: 3800, Paid: 3200, Referral: 1900, Social: 1100 },
  { month: "Mar", Organic: 5100, Paid: 2600, Referral: 2100, Social: 1400 },
  { month: "Apr", Organic: 4700, Paid: 3500, Referral: 1800, Social: 1700 },
  { month: "May", Organic: 5600, Paid: 4100, Referral: 2400, Social: 2000 },
  { month: "Jun", Organic: 6200, Paid: 3800, Referral: 2700, Social: 2300 },
  { month: "Jul", Organic: 5900, Paid: 4400, Referral: 3100, Social: 2600 },
  { month: "Aug", Organic: 6800, Paid: 4900, Referral: 2900, Social: 2800 },
  { month: "Sep", Organic: 7200, Paid: 5200, Referral: 3400, Social: 3100 },
  { month: "Oct", Organic: 6900, Paid: 5600, Referral: 3200, Social: 3400 },
  { month: "Nov", Organic: 7800, Paid: 6100, Referral: 3700, Social: 3700 },
  { month: "Dec", Organic: 8400, Paid: 6800, Referral: 4100, Social: 4200 },
];

const revenueExpenseData = [
  { month: "Jan", Revenue: 48000, Expenses: 31000 },
  { month: "Feb", Revenue: 52000, Expenses: 33000 },
  { month: "Mar", Revenue: 61000, Expenses: 35000 },
  { month: "Apr", Revenue: 58000, Expenses: 34000 },
  { month: "May", Revenue: 67000, Expenses: 37000 },
  { month: "Jun", Revenue: 74000, Expenses: 39000 },
  { month: "Jul", Revenue: 71000, Expenses: 38000 },
  { month: "Aug", Revenue: 83000, Expenses: 41000 },
  { month: "Sep", Revenue: 91000, Expenses: 44000 },
  { month: "Oct", Revenue: 88000, Expenses: 43000 },
  { month: "Nov", Revenue: 97000, Expenses: 46000 },
  { month: "Dec", Revenue: 112000, Expenses: 49000 },
];

const sparklineData: Record<string, { v: number }[]> = {
  sessions: [
    { v: 3200 }, { v: 3800 }, { v: 3500 }, { v: 4100 }, { v: 3900 },
    { v: 4600 }, { v: 4400 }, { v: 5100 }, { v: 4900 }, { v: 5600 },
    { v: 5400 }, { v: 6200 },
  ],
  bounce: [
    { v: 52 }, { v: 49 }, { v: 51 }, { v: 47 }, { v: 45 },
    { v: 43 }, { v: 44 }, { v: 41 }, { v: 39 }, { v: 38 },
    { v: 36 }, { v: 34 },
  ],
  duration: [
    { v: 142 }, { v: 155 }, { v: 148 }, { v: 162 }, { v: 171 },
    { v: 168 }, { v: 179 }, { v: 185 }, { v: 192 }, { v: 188 },
    { v: 201 }, { v: 214 },
  ],
  conversion: [
    { v: 2.1 }, { v: 2.4 }, { v: 2.2 }, { v: 2.7 }, { v: 2.9 },
    { v: 3.1 }, { v: 3.0 }, { v: 3.4 }, { v: 3.6 }, { v: 3.5 },
    { v: 3.8 }, { v: 4.1 },
  ],
};

interface MetricCard {
  id: string;
  label: string;
  value: string;
  change: number;
  unit: string;
  color: string;
  icon: React.ElementType;
  sparkKey: string;
}

const metricCards: MetricCard[] = [
  {
    id: "sessions",
    label: "Total Sessions",
    value: "6,200",
    change: 14.8,
    unit: "",
    color: "#6366F1",
    icon: Eye,
    sparkKey: "sessions",
  },
  {
    id: "bounce",
    label: "Bounce Rate",
    value: "34%",
    change: -5.6,
    unit: "%",
    color: "#F59E0B",
    icon: TrendingDown,
    sparkKey: "bounce",
  },
  {
    id: "duration",
    label: "Avg. Session",
    value: "3m 34s",
    change: 6.5,
    unit: "s",
    color: "#22D3EE",
    icon: Clock,
    sparkKey: "duration",
  },
  {
    id: "conversion",
    label: "Conversion Rate",
    value: "4.1%",
    change: 7.9,
    unit: "%",
    color: "#10B981",
    icon: Users,
    sparkKey: "conversion",
  },
];

interface PageRow {
  id: string;
  path: string;
  title: string;
  views: number;
  uniqueVisitors: number;
  avgTime: string;
  bounceRate: number;
  trend: number;
}

const topPages: PageRow[] = [
  {
    id: "1",
    path: "/dashboard",
    title: "Main Dashboard",
    views: 48320,
    uniqueVisitors: 31200,
    avgTime: "4m 12s",
    bounceRate: 28,
    trend: 12.4,
  },
  {
    id: "2",
    path: "/pricing",
    title: "Pricing Plans",
    views: 36710,
    uniqueVisitors: 28900,
    avgTime: "3m 47s",
    bounceRate: 34,
    trend: 8.1,
  },
  {
    id: "3",
    path: "/features",
    title: "Features Overview",
    views: 29840,
    uniqueVisitors: 22100,
    avgTime: "5m 02s",
    bounceRate: 22,
    trend: 15.7,
  },
  {
    id: "4",
    path: "/blog/analytics-guide",
    title: "Analytics Guide",
    views: 24560,
    uniqueVisitors: 19800,
    avgTime: "6m 38s",
    bounceRate: 18,
    trend: 31.2,
  },
  {
    id: "5",
    path: "/integrations",
    title: "Integrations Hub",
    views: 18920,
    uniqueVisitors: 14300,
    avgTime: "3m 21s",
    bounceRate: 41,
    trend: -3.4,
  },
  {
    id: "6",
    path: "/docs/getting-started",
    title: "Getting Started",
    views: 16740,
    uniqueVisitors: 13100,
    avgTime: "7m 15s",
    bounceRate: 15,
    trend: 5.8,
  },
  {
    id: "7",
    path: "/changelog",
    title: "Product Changelog",
    views: 12380,
    uniqueVisitors: 9600,
    avgTime: "2m 54s",
    bounceRate: 47,
    trend: -1.2,
  },
];

const PERIODS: { label: string; value: ChartPeriod }[] = [
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "90D", value: "90d" },
  { label: "1Y", value: "1y" },
];

const CHANNEL_COLORS: Record<string, string> = {
  Organic: "#6366F1",
  Paid: "#22D3EE",
  Referral: "#F59E0B",
  Social: "#10B981",
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
  prefix = "",
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
  prefix?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-sm">
      <p className="text-slate-400 text-xs mb-2 font-medium">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: entry.color }}
          />
          <span className="text-slate-300">{entry.name}:</span>
          <span className="text-white font-semibold">
            {prefix}
            {(entry.value ?? 0).toLocaleString("en-US")}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ data, color }: { data: { v: number }[]; color: string }) {
  return (
    <ResponsiveContainer width="100%" height={48}>
      <LineChart data={data ?? []} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const t = useTranslations();
  const [acqPeriod, setAcqPeriod] = useState<ChartPeriod>("1y");
  const [revPeriod, setRevPeriod] = useState<ChartPeriod>("1y");
  const [sortKey, setSortKey] = useState<keyof PageRow>("views");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const handleSort = (key: keyof PageRow) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortedPages = [...(topPages ?? [])].sort((a, b) => {
    const av = a[sortKey] ?? 0;
    const bv = b[sortKey] ?? 0;
    if (typeof av === "number" && typeof bv === "number") {
      return sortDir === "desc" ? bv - av : av - bv;
    }
    return sortDir === "desc"
      ? String(bv).localeCompare(String(av))
      : String(av).localeCompare(String(bv));
  });

  return (
    <main className="min-h-screen bg-[#0F172A] text-[#F8FAFC] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* ── Header ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <motion.div variants={fadeInUp}>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide">
                <BarChartIcon className="w-3 h-3" />
                {t("analytics.badge")}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              {t("analytics.title")}
            </h1>
            <p className="mt-1.5 text-slate-400 text-base leading-relaxed">
              {t("analytics.subtitle")}
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {t("analytics.liveLabel")}
          </motion.div>
        </motion.div>

        {/* ── Metric Cards with Sparklines ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {metricCards.map((card) => {
            const isPositive = card.change >= 0;
            const isBounce = card.id === "bounce";
            const good = isBounce ? !isPositive : isPositive;
            return (
              <motion.div
                key={card.id}
                variants={scaleIn}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="bg-[#1E293B]/80 border border-white/[0.07] rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.2)] flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">{card.label}</p>
                    <p className="text-2xl font-bold text-white tracking-tight">{card.value}</p>
                  </div>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${card.color}18` }}
                  >
                    <card.icon className="w-4 h-4" style={{ color: card.color }} />
                  </div>
                </div>
                <Sparkline data={sparklineData[card.sparkKey] ?? []} color={card.color} />
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
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
                    {Math.abs(card.change).toFixed(1)}%
                  </span>
                  <span className="text-xs text-slate-500">{t("analytics.vsLastMonth")}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Acquisition Bar Chart ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="bg-[#1E293B]/80 border border-white/[0.07] rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.2)]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white tracking-tight">
                {t("analytics.acqTitle")}
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">{t("analytics.acqSubtitle")}</p>
            </div>
            <div className="flex items-center gap-1 bg-[#0F172A]/60 border border-white/[0.07] rounded-xl p-1">
              {PERIODS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setAcqPeriod(p.value)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                    acqPeriod === p.value
                      ? "bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            {Object.entries(CHANNEL_COLORS).map(([name, color]) => (
              <div key={name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                <span className="text-xs text-slate-400">{name}</span>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={acquisitionData}
              margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
              barCategoryGap="28%"
              barGap={3}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "#64748B", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748B", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              {Object.entries(CHANNEL_COLORS).map(([name, color]) => (
                <Bar key={name} dataKey={name} fill={color} radius={[4, 4, 0, 0]} maxBarSize={18} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ── Revenue vs Expenses Area Chart ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="bg-[#1E293B]/80 border border-white/[0.07] rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.2)]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white tracking-tight">
                {t("analytics.revTitle")}
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">{t("analytics.revSubtitle")}</p>
            </div>
            <div className="flex items-center gap-1 bg-[#0F172A]/60 border border-white/[0.07] rounded-xl p-1">
              {PERIODS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setRevPeriod(p.value)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                    revPeriod === p.value
                      ? "bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-0.5 rounded-full bg-indigo-500" />
              <span className="text-xs text-slate-400">{t("analytics.revenue")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-0.5 rounded-full bg-amber-400" />
              <span className="text-xs text-slate-400">{t("analytics.expenses")}</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={revenueExpenseData}
              margin={{ top: 4, right: 4, left: -8, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "#64748B", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748B", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip prefix="$" />} cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="Revenue"
                stroke="#6366F1"
                strokeWidth={2.5}
                fill="url(#gradRevenue)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="Expenses"
                stroke="#F59E0B"
                strokeWidth={2}
                fill="url(#gradExpenses)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Summary row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-white/[0.06]">
            {[
              { label: t("analytics.totalRevenue"), value: "$902K", good: true },
              { label: t("analytics.totalExpenses"), value: "$470K", good: false },
              { label: t("analytics.netProfit"), value: "$432K", good: true },
              { label: t("analytics.margin"), value: "47.9%", good: true },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                <p className={`text-lg font-bold ${item.good ? "text-white" : "text-amber-400"}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Top Pages Table ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="bg-[#1E293B]/80 border border-white/[0.07] rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.2)]"
        >
          <div className="px-6 py-5 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white tracking-tight">
                {t("analytics.pagesTitle")}
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">{t("analytics.pagesSubtitle")}</p>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-500">{t("analytics.allRegions")}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  {(
                    [
                      { key: "title", label: t("analytics.colPage") },
                      { key: "views", label: t("analytics.colViews") },
                      { key: "uniqueVisitors", label: t("analytics.colUnique") },
                      { key: "avgTime", label: t("analytics.colAvgTime") },
                      { key: "bounceRate", label: t("analytics.colBounce") },
                      { key: "trend", label: t("analytics.colTrend") },
                    ] as { key: keyof PageRow; label: string }[]
                  ).map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors duration-150 select-none whitespace-nowrap"
                    >
                      <span className="flex items-center gap-1">
                        {col.label}
                        {sortKey === col.key ? (
                          sortDir === "desc" ? (
                            <ChevronDown className="w-3 h-3 text-indigo-400" />
                          ) : (
                            <ChevronUp className="w-3 h-3 text-indigo-400" />
                          )
                        ) : (
                          <span className="w-3 h-3" />
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedPages.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.05, ease: "easeOut" }}
                    className="border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors duration-150 group"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-white font-medium group-hover:text-indigo-300 transition-colors duration-150">
                          {row.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 font-mono">{row.path}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-300 font-medium tabular-nums">
                      {(row.views ?? 0).toLocaleString("en-US")}
                    </td>
                    <td className="px-5 py-4 text-slate-400 tabular-nums">
                      {(row.uniqueVisitors ?? 0).toLocaleString("en-US")}
                    </td>
                    <td className="px-5 py-4 text-slate-400">{row.avgTime}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${row.bounceRate ?? 0}%`,
                              background:
                                (row.bounceRate ?? 0) < 25
                                  ? "#10B981"
                                  : (row.bounceRate ?? 0) < 40
                                  ? "#F59E0B"
                                  : "#EF4444",
                            }}
                          />
                        </div>
                        <span className="text-slate-400 text-xs tabular-nums">
                          {row.bounceRate ?? 0}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${
                          (row.trend ?? 0) >= 0
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {(row.trend ?? 0) >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {(row.trend ?? 0) >= 0 ? "+" : ""}
                        {(row.trend ?? 0).toFixed(1)}%
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-white/[0.05] flex items-center justify-between">
            <p className="text-xs text-slate-500">
              {t("analytics.showingRows", { count: sortedPages.length })}
            </p>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-150">
              {t("analytics.viewAll")}
            </button>
          </div>
        </motion.div>

      </div>
    </main>
  );
}