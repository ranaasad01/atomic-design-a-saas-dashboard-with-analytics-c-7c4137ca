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
  views: number;
  unique: number;
  bounce: string;
  duration: string;
  change: number;
}

const topPages: PageRow[] = [
  { id: "p1", path: "/dashboard", views: 48320, unique: 31200, bounce: "28%", duration: "4m 12s", change: 12.4 },
  { id: "p2", path: "/analytics", views: 31540, unique: 22800, bounce: "31%", duration: "3m 48s", change: 8.7 },
  { id: "p3", path: "/settings", views: 22180, unique: 18400, bounce: "42%", duration: "2m 55s", change: -3.2 },
  { id: "p4", path: "/users", views: 18960, unique: 14200, bounce: "35%", duration: "3m 22s", change: 21.5 },
  { id: "p5", path: "/billing", views: 14230, unique: 11800, bounce: "38%", duration: "2m 41s", change: 5.1 },
  { id: "p6", path: "/reports", views: 9870, unique: 8100, bounce: "44%", duration: "2m 18s", change: 18.3 },
  { id: "p7", path: "/integrations", views: 7640, unique: 6300, bounce: "51%", duration: "1m 58s", change: -1.8 },
];

const trafficSources = [
  { source: "Organic Search", sessions: 28400, share: 38, color: "#6366F1" },
  { source: "Direct", sessions: 18200, share: 24, color: "#22D3EE" },
  { source: "Paid Search", sessions: 13500, share: 18, color: "#F59E0B" },
  { source: "Referral", sessions: 9800, share: 13, color: "#10B981" },
  { source: "Social", sessions: 5300, share: 7, color: "#EC4899" },
];

const PERIODS: { label: string; value: ChartPeriod }[] = [
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "90D", value: "90d" },
  { label: "1Y", value: "1y" },
];

// ─── Tooltip style ────────────────────────────────────────────────────────────

const tooltipStyle = {
  contentStyle: {
    background: "#FFFFFF",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: "12px",
    color: "#1E1B18",
    fontSize: "12px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
  },
  labelStyle: { color: "#1E1B18", fontWeight: 600 },
  itemStyle: { color: "#1E1B18" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const t = useTranslations();
  const [period, setPeriod] = useState<ChartPeriod>("30d");
  const [sortKey, setSortKey] = useState<keyof PageRow>("views");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sortedPages = [...topPages].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === "number" && typeof bv === "number") {
      return sortDir === "asc" ? av - bv : bv - av;
    }
    return sortDir === "asc"
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  function toggleSort(key: keyof PageRow) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function SortIcon({ col }: { col: keyof PageRow }) {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 text-indigo-400" />
    ) : (
      <ChevronDown className="w-3 h-3 text-indigo-400" />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-8"
        >
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1B18] tracking-tight">
                Analytics
              </h1>
              <p className="mt-1 text-sm text-[#6B6560]">
                Deep-dive into traffic, engagement, and revenue trends.
              </p>
            </div>

            {/* Period Selector */}
            <div className="flex items-center gap-1.5 bg-[#F3EFE8] rounded-xl p-1">
              {PERIODS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    period === p.value
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "bg-black/5 text-[#6B6560] hover:bg-black/8 hover:text-[#1E1B18]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Metric Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {metricCards.map((card) => {
            const isPositive = card.change > 0;
            const isGood = card.id === "bounce" ? !isPositive : isPositive;
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
                    style={{ background: card.color + "22" }}
                  >
                    <card.icon className="w-4 h-4" style={{ color: card.color }} />
                  </div>
                </div>

                <div className="flex items-end justify-between gap-2">
                  <span className="text-2xl font-bold text-[#1E1B18] tracking-tight">
                    {card.value}
                  </span>
                  <span
                    className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isGood
                        ? "text-emerald-600 bg-emerald-50"
                        : "text-red-500 bg-red-50"
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {Math.abs(card.change)}%
                  </span>
                </div>

                {/* Sparkline */}
                <div className="h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparklineData[card.sparkKey]} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`spark-${card.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={card.color} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={card.color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke={card.color}
                        strokeWidth={1.5}
                        fill={`url(#spark-${card.id})`}
                        dot={false}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts Row 1 */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
        >
          {/* User Acquisition by Channel */}
          <motion.div variants={fadeInUp} className="bg-white border border-black/8 shadow-sm rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-[#1E1B18]">User Acquisition</h2>
                <p className="text-xs text-[#6B6560] mt-0.5">By channel over time</p>
              </div>
              <BarChartIcon className="w-4 h-4 text-[#6B6560]" />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={acquisitionData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#9C9590", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9C9590", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Legend
                  wrapperStyle={{ fontSize: "11px", color: "#9C9590", paddingTop: "12px" }}
                />
                <Bar dataKey="Organic" stackId="a" fill="#6366F1" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Paid" stackId="a" fill="#22D3EE" />
                <Bar dataKey="Referral" stackId="a" fill="#F59E0B" />
                <Bar dataKey="Social" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Revenue vs Expenses */}
          <motion.div variants={fadeInUp} className="bg-white border border-black/8 shadow-sm rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-[#1E1B18]">Revenue vs Expenses</h2>
                <p className="text-xs text-[#6B6560] mt-0.5">Monthly comparison</p>
              </div>
              <TrendingUp className="w-4 h-4 text-[#6B6560]" />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={revenueExpenseData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#9C9590", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9C9590", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString("en-US")}`, ""]} />
                <Legend wrapperStyle={{ fontSize: "11px", color: "#9C9590", paddingTop: "12px" }} />
                <Line type="monotone" dataKey="Revenue" stroke="#6366F1" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Expenses" stroke="#F59E0B" strokeWidth={2} dot={false} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* Traffic Sources + Top Pages */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
        >
          {/* Traffic Sources */}
          <motion.div variants={fadeInUp} className="bg-white border border-black/8 shadow-sm rounded-2xl p-6">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-[#1E1B18]">Traffic Sources</h2>
              <p className="text-xs text-[#6B6560] mt-0.5">Session share by origin</p>
            </div>
            <div className="space-y-3">
              {trafficSources.map((src) => (
                <div key={src.source}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5" style={{ color: src.color }} />
                      <span className="text-xs font-medium text-[#1E1B18]">{src.source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#6B6560]">{src.sessions.toLocaleString("en-US")}</span>
                      <span className="text-xs font-semibold text-[#1E1B18]">{src.share}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[#F3EFE8] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${src.share}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ background: src.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Pages Table */}
          <motion.div variants={fadeInUp} className="lg:col-span-2 bg-white border border-black/8 shadow-sm rounded-2xl p-6">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-[#1E1B18]">Top Pages</h2>
              <p className="text-xs text-[#6B6560] mt-0.5">Sorted by {sortKey}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/5">
                    {([
                      { key: "path", label: "Page" },
                      { key: "views", label: "Views" },
                      { key: "unique", label: "Unique" },
                      { key: "bounce", label: "Bounce" },
                      { key: "duration", label: "Duration" },
                      { key: "change", label: "Δ" },
                    ] as { key: keyof PageRow; label: string }[]).map((col) => (
                      <th
                        key={col.key}
                        onClick={() => toggleSort(col.key)}
                        className="text-left pb-3 pr-4 text-xs font-medium text-[#6B6560] uppercase tracking-wider cursor-pointer hover:text-[#1E1B18] transition-colors select-none"
                      >
                        <span className="flex items-center gap-1">
                          {col.label}
                          <SortIcon col={col.key} />
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedPages.map((row, i) => (
                    <tr
                      key={row.id}
                      className={`border-b border-black/5 hover:bg-[#F3EFE8] transition-colors ${
                        i === sortedPages.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="py-3 pr-4">
                        <span className="font-mono text-xs text-[#1E1B18]">{row.path}</span>
                      </td>
                      <td className="py-3 pr-4 text-[#1E1B18] font-medium">
                        {row.views.toLocaleString("en-US")}
                      </td>
                      <td className="py-3 pr-4 text-[#6B6560]">
                        {row.unique.toLocaleString("en-US")}
                      </td>
                      <td className="py-3 pr-4 text-[#6B6560]">{row.bounce}</td>
                      <td className="py-3 pr-4 text-[#6B6560]">{row.duration}</td>
                      <td className="py-3">
                        <span
                          className={`flex items-center gap-0.5 text-xs font-semibold ${
                            row.change >= 0 ? "text-emerald-600" : "text-red-500"
                          }`}
                        >
                          {row.change >= 0 ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {Math.abs(row.change)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-black/8 my-6" />

        {/* Footer note */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center text-xs text-[#6B6560]"
        >
          Data refreshes every 5 minutes · All times in UTC
        </motion.p>
      </div>
    </div>
  );
}
