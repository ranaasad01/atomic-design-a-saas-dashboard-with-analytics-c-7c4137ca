"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ArrowRight, ArrowUp, ArrowDown, Sparkles, Activity, Users, Star, Check, ChevronRight, Zap, Shield, BarChart as BarChartIcon, Bell, Clock } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn, slideInLeft, slideInRight } from "@/lib/motion";
import { APP_NAME, APP_TAGLINE, APP_ACCENT, APP_ACCENT_SECONDARY, PLAN_COLORS } from "@/lib/data";
import { useTranslations } from "next-intl";

// ─── Mock data ────────────────────────────────────────────────────────────────

const revenueData = [
  { month: "Jan", revenue: 42000, users: 1200 },
  { month: "Feb", revenue: 51000, users: 1450 },
  { month: "Mar", revenue: 47000, users: 1380 },
  { month: "Apr", revenue: 63000, users: 1820 },
  { month: "May", revenue: 71000, users: 2100 },
  { month: "Jun", revenue: 68000, users: 2050 },
  { month: "Jul", revenue: 84000, users: 2480 },
  { month: "Aug", revenue: 92000, users: 2760 },
  { month: "Sep", revenue: 88000, users: 2640 },
  { month: "Oct", revenue: 107000, users: 3100 },
  { month: "Nov", revenue: 118000, users: 3420 },
  { month: "Dec", revenue: 134000, users: 3890 },
];

const planData = [
  { name: "Starter", value: 38, color: PLAN_COLORS["Starter"] },
  { name: "Pro", value: 31, color: PLAN_COLORS["Pro"] },
  { name: "Business", value: 20, color: PLAN_COLORS["Business"] },
  { name: "Enterprise", value: 11, color: PLAN_COLORS["Enterprise"] },
];

const weeklyActivity = [
  { day: "Mon", sessions: 3200 },
  { day: "Tue", sessions: 4100 },
  { day: "Wed", sessions: 3800 },
  { day: "Thu", sessions: 5200 },
  { day: "Fri", sessions: 4700 },
  { day: "Sat", sessions: 2900 },
  { day: "Sun", sessions: 2400 },
];

const kpis = [
  { label: "Monthly Revenue", value: "$134,200", change: 13.8, prefix: "", suffix: "" },
  { label: "Active Users", value: "3,890", change: 12.1, prefix: "", suffix: "" },
  { label: "Churn Rate", value: "1.8%", change: -0.4, prefix: "", suffix: "" },
  { label: "Avg. Session", value: "4m 32s", change: 8.5, prefix: "", suffix: "" },
];

const features = [
  {
    icon: Activity,
    title: "Real-Time Streaming",
    description: "Watch your metrics update live as events flow in. No refresh needed — your dashboard breathes with your product.",
    accent: "#6366F1",
  },
  {
    icon: BarChartIcon,
    title: "Cohort Analysis",
    description: "Understand retention by grouping users into cohorts. Spot drop-off points and double down on what keeps people engaged.",
    accent: "#22D3EE",
  },
  {
    icon: Users,
    title: "User Segmentation",
    description: "Slice your audience by plan, geography, behavior, or custom attributes. Build segments in seconds, not SQL.",
    accent: "#F59E0B",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Set thresholds on any metric and get notified via Slack, email, or webhook the moment something needs your attention.",
    accent: "#10B981",
  },
  {
    icon: Shield,
    title: "SOC 2 Compliant",
    description: "Your data is encrypted at rest and in transit. Role-based access, audit logs, and SSO keep your team secure.",
    accent: "#6366F1",
  },
  {
    icon: Zap,
    title: "One-Line Install",
    description: "Drop a single script tag or npm package into your app. Full event tracking starts in under five minutes.",
    accent: "#22D3EE",
  },
];

const testimonials = [
  {
    quote: "Pulse replaced three separate tools for us. Our team finally agrees on the numbers because everyone is looking at the same source of truth.",
    name: "Sarah Chen",
    role: "Head of Growth, Luma",
    avatar: "/images/sarah-chen-head-of-growth.jpg",
    stars: 5,
  },
  {
    quote: "The cohort charts alone saved us from a bad pricing decision. We saw the retention cliff before it became a crisis.",
    name: "Marcus Webb",
    role: "CEO, Stackform",
    avatar: "/images/marcus-webb-ceo-stackform.jpg",
    stars: 5,
  },
  {
    quote: "Setup took eight minutes. I timed it. The dashboard was showing real data before I finished my coffee.",
    name: "Priya Nair",
    role: "CTO, Orbit Labs",
    avatar: "/images/priya-nair-cto-orbit-labs.jpg",
    stars: 5,
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: 29,
    description: "For indie hackers and early-stage products.",
    features: ["Up to 50k events/mo", "7-day data retention", "3 dashboards", "Email alerts", "Community support"],
    cta: "Start free trial",
    highlight: false,
    color: PLAN_COLORS["Starter"],
  },
  {
    name: "Pro",
    price: 99,
    description: "For growing teams that need deeper insight.",
    features: ["Up to 2M events/mo", "90-day retention", "Unlimited dashboards", "Slack + email alerts", "Cohort analysis", "Priority support"],
    cta: "Start free trial",
    highlight: true,
    color: PLAN_COLORS["Pro"],
  },
  {
    name: "Business",
    price: 299,
    description: "For scaling companies with complex needs.",
    features: ["Up to 20M events/mo", "1-year retention", "Custom segments", "Webhook alerts", "SSO + RBAC", "Dedicated CSM"],
    cta: "Start free trial",
    highlight: false,
    color: PLAN_COLORS["Business"],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function KPITile({ label, value, change }: { label: string; value: string; change: number }) {
  const positive = change >= 0;
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.2),0_8px_24px_-8px_rgba(0,0,0,0.3)] flex flex-col gap-3"
    >
      <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
      <span className={`flex items-center gap-1 text-xs font-semibold ${positive ? "text-emerald-400" : "text-rose-400"}`}>
        {positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
        {Math.abs(change)}% vs last month
      </span>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-white font-semibold">
          {p.name === "revenue" ? `$${(p.value ?? 0).toLocaleString("en-US")}` : (p.value ?? 0).toLocaleString("en-US")}
        </p>
      ))}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const t = useTranslations();
  const [activeChart, setActiveChart] = useState<"revenue" | "users">("revenue");

  return (
    <main className="min-h-screen bg-[#0F172A] text-white overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]" />
          <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              {t("hero.badge")}
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-balance leading-[1.08] mb-6"
            >
              {t("hero.headline1")}{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                {t("hero.headline2")}
              </span>{" "}
              {t("hero.headline3")}
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-slate-400 leading-relaxed text-pretty max-w-xl mb-10"
            >
              {t("hero.subtext")}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm transition-all duration-300 shadow-[0_0_24px_rgba(99,102,241,0.4)] hover:shadow-[0_0_36px_rgba(99,102,241,0.6)] hover:-translate-y-0.5"
              >
                {t("hero.cta_primary")}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/analytics"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
              >
                {t("hero.cta_secondary")}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero chart preview */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            className="mt-16 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.3),0_24px_64px_-16px_rgba(0,0,0,0.5)] backdrop-blur-sm"
          >
            {/* Mini KPI row */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
            >
              {kpis.map((k) => (
                <KPITile key={k.label} label={k.label} value={k.value} change={k.change} />
              ))}
            </motion.div>

            {/* Chart toggle */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-300">{t("hero.chart_title")}</h2>
              <div className="flex gap-1 bg-white/5 rounded-lg p-1">
                {(["revenue", "users"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveChart(tab)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
                      activeChart === tab
                        ? "bg-indigo-500 text-white shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {tab === "revenue" ? t("hero.tab_revenue") : t("hero.tab_users")}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                {activeChart === "revenue" ? (
                  <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2} fill="url(#colorRevenue)" dot={false} />
                ) : (
                  <Area type="monotone" dataKey="users" stroke="#22D3EE" strokeWidth={2} fill="url(#colorUsers)" dot={false} />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">
              {t("features.label")}
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-extrabold tracking-tight text-balance mb-4">
              {t("features.title")}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-400 text-lg max-w-xl mx-auto text-pretty">
              {t("features.subtitle")}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeInUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`relative bg-white/5 border border-white/10 rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.2),0_8px_24px_-8px_rgba(0,0,0,0.3)] overflow-hidden group ${
                  i === 0 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                  style={{ background: f.accent }}
                />
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-lg"
                  style={{ background: `${f.accent}22`, border: `1px solid ${f.accent}44` }}
                >
                  <f.icon className="w-5 h-5" style={{ color: f.accent }} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Analytics Preview ─────────────────────────────────────────────── */}
      <section id="analytics" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={slideInLeft}
            >
              <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">
                {t("analytics.label")}
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-balance mb-5">
                {t("analytics.title")}
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed text-pretty mb-8">
                {t("analytics.body")}
              </p>
              <ul className="space-y-3 mb-8">
                {[t("analytics.bullet1"), t("analytics.bullet2"), t("analytics.bullet3"), t("analytics.bullet4")].map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-indigo-400" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href="/analytics"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-200 group"
              >
                {t("analytics.cta")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>

            {/* Right: two mini charts */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={slideInRight}
              className="flex flex-col gap-5"
            >
              {/* Bar chart */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.2),0_8px_24px_-8px_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-slate-300">{t("analytics.chart1_title")}</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {t("analytics.chart1_period")}</span>
                </div>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={weeklyActivity} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="sessions" fill="#6366F1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie chart */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.2),0_8px_24px_-8px_rgba(0,0,0,0.3)]">
                <span className="text-sm font-semibold text-slate-300 block mb-4">{t("analytics.chart2_title")}</span>
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width={120} height={120}>
                    <PieChart>
                      <Pie data={planData} cx="50%" cy="50%" innerRadius={36} outerRadius={56} paddingAngle={3} dataKey="value">
                        {planData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-2">
                    {planData.map((p) => (
                      <div key={p.name} className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
                        <span className="text-slate-300 font-medium">{p.name}</span>
                        <span className="ml-auto pl-4 font-semibold text-white">{p.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section id="about" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">
              {t("testimonials.label")}
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-extrabold tracking-tight text-balance">
              {t("testimonials.title")}
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((t_item) => (
              <motion.div
                key={t_item.name}
                variants={scaleIn}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.2),0_8px_24px_-8px_rgba(0,0,0,0.3)] flex flex-col gap-4"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: t_item.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed flex-1">&ldquo;{t_item.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                  <img
                    src={t_item.avatar}
                    alt={t_item.name}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t_item.name)}&background=6366F1&color=fff&size=36`;
                    }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{t_item.name}</p>
                    <p className="text-xs text-slate-500">{t_item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">
              {t("pricing.label")}
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-extrabold tracking-tight text-balance mb-4">
              {t("pricing.title")}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-400 text-lg max-w-md mx-auto">
              {t("pricing.subtitle")}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
          >
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={scaleIn}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`relative rounded-2xl p-7 flex flex-col gap-5 shadow-[0_1px_2px_rgba(0,0,0,0.2),0_8px_24px_-8px_rgba(0,0,0,0.3)] ${
                  plan.highlight
                    ? "bg-indigo-500/10 border-2 border-indigo-500/50"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-500 text-white text-xs font-bold shadow-[0_0_16px_rgba(99,102,241,0.5)]">
                    {t("pricing.popular")}
                  </span>
                )}
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: plan.color }}>
                    {plan.name}
                  </span>
                  <div className="flex items-end gap-1 mt-2">
                    <span className="text-4xl font-extrabold text-white tracking-tight">${plan.price}</span>
                    <span className="text-slate-400 text-sm mb-1.5">{t("pricing.per_month")}</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{plan.description}</p>
                </div>
                <ul className="flex flex-col gap-2.5 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: plan.color }} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard"
                  className={`mt-2 w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    plan.highlight
                      ? "bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_32px_rgba(99,102,241,0.6)]"
                      : "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeIn}
            className="relative rounded-3xl bg-gradient-to-br from-indigo-600/30 via-indigo-500/10 to-cyan-500/20 border border-indigo-500/20 p-12 md:p-16 text-center overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.3),0_32px_80px_-16px_rgba(99,102,241,0.2)]"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/20 rounded-full blur-[80px]" />
            </div>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative">
              <motion.p variants={fadeInUp} className="text-xs font-semibold text-indigo-300 uppercase tracking-widest mb-4">
                {t("cta.label")}
              </motion.p>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-extrabold tracking-tight text-balance mb-5">
                {t("cta.title")}
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-lg max-w-lg mx-auto mb-10 text-pretty">
                {t("cta.body")}
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm transition-all duration-300 shadow-[0_0_24px_rgba(99,102,241,0.5)] hover:shadow-[0_0_40px_rgba(99,102,241,0.7)] hover:-translate-y-0.5"
                >
                  {t("cta.button_primary")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/analytics"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
                >
                  {t("cta.button_secondary")}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}