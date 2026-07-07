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
    quote: "The cohort charts alone saved us from a bad pricing decision. We saw exactly where users were dropping off and fixed it in a week.",
    name: "Marcus Webb",
    role: "CEO, Orbit Systems",
    avatar: "/images/marcus-webb-ceo.jpg",
    stars: 5,
  },
  {
    quote: "Setup took literally four minutes. I pasted the script, refreshed, and my first events were already flowing in. Incredible DX.",
    name: "Priya Nair",
    role: "Lead Engineer, Cascade",
    avatar: "/images/priya-nair-lead-engineer.jpg",
    stars: 5,
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: 49,
    description: "Perfect for indie hackers and early-stage startups.",
    features: [
      "Up to 50k events/month",
      "5 dashboards",
      "7-day data retention",
      "Email support",
      "Core charts",
    ],
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Pro",
    price: 149,
    description: "For growing teams that need deeper insights.",
    features: [
      "Up to 1M events/month",
      "Unlimited dashboards",
      "90-day data retention",
      "Slack + email alerts",
      "Cohort & funnel analysis",
      "Custom segments",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Business",
    price: 499,
    description: "For scaling companies with advanced needs.",
    features: [
      "Up to 10M events/month",
      "Unlimited dashboards",
      "1-year data retention",
      "Priority support",
      "SSO & audit logs",
      "Custom integrations",
      "Dedicated CSM",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRevenue(v: number) {
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
  return `$${v}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<"revenue" | "users">("revenue");

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1B18]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-indigo-200/30 blur-[120px]" />
          <div className="absolute bottom-[-5%] right-[10%] w-[500px] h-[500px] rounded-full bg-cyan-200/25 blur-[100px]" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="flex justify-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Sparkles className="w-3.5 h-3.5" />
                Now with AI-powered anomaly detection
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]"
            >
              <span className="text-[#1E1B18]">Analytics that</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                move with you
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={fadeInUp}
              className="max-w-2xl mx-auto text-lg sm:text-xl text-[#6B6560] leading-relaxed"
            >
              {APP_TAGLINE} Track revenue, retention, and growth in one
              beautifully designed workspace — no data team required.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
            >
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold text-sm shadow-[0_4px_24px_rgba(99,102,241,0.4)] hover:shadow-[0_6px_32px_rgba(99,102,241,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Get started free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/analytics"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-black/15 text-[#1E1B18] font-semibold text-sm hover:bg-black/5 transition-all duration-200"
              >
                View live demo
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.p variants={fadeInUp} className="text-sm text-[#6B6560]">
              Trusted by{" "}
              <span className="text-[#1E1B18] font-semibold">2,400+</span> SaaS
              teams worldwide
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── KPI Cards ────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {kpis.map((kpi) => (
            <motion.div
              key={kpi.label}
              variants={scaleIn}
              className="bg-white border border-black/8 shadow-sm rounded-2xl p-5"
            >
              <p className="text-xs font-medium text-[#6B6560] uppercase tracking-wider mb-2">
                {kpi.label}
              </p>
              <p className="text-2xl font-bold text-[#1E1B18] mb-2">{kpi.value}</p>
              <div
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  kpi.change >= 0
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {kpi.change >= 0 ? (
                  <ArrowUp className="w-3 h-3" />
                ) : (
                  <ArrowDown className="w-3 h-3" />
                )}
                {Math.abs(kpi.change)}%
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Charts Preview ───────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Tab switcher */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="text-xl font-bold text-[#1E1B18]">Performance Overview</h2>
            <div className="flex items-center gap-1 bg-[#F3EFE8] rounded-xl p-1">
              {(["revenue", "users"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-white text-[#1E1B18] shadow-sm"
                      : "text-[#6B6560] hover:text-[#1E1B18]"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Area chart */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
            className="bg-white border border-black/8 rounded-2xl p-6 mb-6"
          >
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6B6560", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6B6560", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={activeTab === "revenue" ? formatRevenue : (v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: "12px",
                    color: "#1E1B18",
                    fontSize: 13,
                  }}
                  labelStyle={{ color: "#1E1B18", fontWeight: 600 }}
                  itemStyle={{ color: "#6B6560" }}
                />
                {activeTab === "revenue" ? (
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366F1"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                    dot={false}
                  />
                ) : (
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#22D3EE"
                    strokeWidth={2}
                    fill="url(#colorUsers)"
                    dot={false}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bottom row: bar + pie */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar chart */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInLeft}
              className="bg-white border border-black/8 rounded-2xl p-6"
            >
              <h3 className="text-sm font-semibold text-[#1E1B18] mb-4">Weekly Sessions</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyActivity} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#6B6560", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#6B6560", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#FFFFFF",
                      border: "1px solid rgba(0,0,0,0.08)",
                      borderRadius: "12px",
                      color: "#1E1B18",
                      fontSize: 13,
                    }}
                    labelStyle={{ color: "#1E1B18", fontWeight: 600 }}
                    itemStyle={{ color: "#6B6560" }}
                  />
                  <Bar dataKey="sessions" fill="#6366F1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Pie chart */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInRight}
              className="bg-white border border-black/8 rounded-2xl p-6"
            >
              <h3 className="text-sm font-semibold text-[#1E1B18] mb-4">Plan Distribution</h3>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie
                      data={planData}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={72}
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
                        borderRadius: "12px",
                        color: "#1E1B18",
                        fontSize: 13,
                      }}
                      labelStyle={{ color: "#1E1B18", fontWeight: 600 }}
                      itemStyle={{ color: "#6B6560" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2.5">
                  {planData.map((p) => (
                    <div key={p.name} className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: p.color }}
                      />
                      <span className="text-sm text-[#6B6560]">{p.name}</span>
                      <span className="text-sm font-semibold text-[#1E1B18] ml-auto pl-4">
                        {p.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-[#F3EFE8]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 mb-4">
              <Zap className="w-3.5 h-3.5" />
              Everything you need
            </span>
            <h2 className="text-4xl font-extrabold text-[#1E1B18] mb-4">
              Built for modern SaaS teams
            </h2>
            <p className="text-lg text-[#6B6560] max-w-2xl mx-auto">
              From real-time event streaming to enterprise-grade security, Pulse
              has every layer covered.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeInUp}
                className="bg-white border border-black/8 shadow-sm rounded-2xl p-6 group hover:shadow-md transition-shadow duration-200"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${f.accent}18` }}
                >
                  <f.icon className="w-5 h-5" style={{ color: f.accent }} />
                </div>
                <h3 className="text-base font-semibold text-[#1E1B18] mb-2">{f.title}</h3>
                <p className="text-sm text-[#6B6560] leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-[#FAF7F2]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-extrabold text-[#1E1B18] mb-4">
              Loved by growth teams
            </h2>
            <p className="text-lg text-[#6B6560]">
              Don&apos;t take our word for it.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeInUp}
                className="bg-white border border-black/8 shadow-sm rounded-2xl p-6 flex flex-col gap-4"
              >
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-[#6B6560] leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-black/8">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1E1B18]">{t.name}</p>
                    <p className="text-xs text-[#6B6560]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-[#F3EFE8]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Simple pricing
            </span>
            <h2 className="text-4xl font-extrabold text-[#1E1B18] mb-4">
              Start free, scale as you grow
            </h2>
            <p className="text-lg text-[#6B6560]">
              No hidden fees. Cancel anytime.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
          >
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={scaleIn}
                className={`rounded-2xl p-7 flex flex-col gap-5 ${
                  plan.highlighted
                    ? "bg-gradient-to-b from-indigo-600 to-indigo-700 text-white shadow-[0_8px_40px_rgba(99,102,241,0.4)] scale-[1.03]"
                    : "bg-white border border-black/8 shadow-sm"
                }`}
              >
                <div>
                  <p
                    className={`text-xs font-semibold uppercase tracking-widest mb-1 ${
                      plan.highlighted ? "text-indigo-200" : "text-[#6B6560]"
                    }`}
                  >
                    {plan.name}
                  </p>
                  <div className="flex items-end gap-1">
                    <span
                      className={`text-4xl font-extrabold ${
                        plan.highlighted ? "text-white" : "text-[#1E1B18]"
                      }`}
                    >
                      ${plan.price}
                    </span>
                    <span
                      className={`text-sm mb-1.5 ${
                        plan.highlighted ? "text-indigo-200" : "text-[#6B6560]"
                      }`}
                    >
                      /mo
                    </span>
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      plan.highlighted ? "text-indigo-100" : "text-[#6B6560]"
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                <ul className="flex flex-col gap-2.5">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <Check
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          plan.highlighted ? "text-indigo-200" : "text-indigo-500"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          plan.highlighted ? "text-indigo-100" : "text-[#6B6560]"
                        }`}
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/dashboard"
                  className={`mt-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    plan.highlighted
                      ? "bg-white text-indigo-600 hover:bg-indigo-50"
                      : "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-[0_4px_16px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_24px_rgba(99,102,241,0.5)] hover:scale-[1.02]"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-[#FAF7F2]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scaleIn}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1E1B18] mb-5">
            Ready to see the full picture?
          </h2>
          <p className="text-lg text-[#6B6560] mb-8">
            Join thousands of SaaS teams who use Pulse to make faster, smarter
            decisions every day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold text-base shadow-[0_4px_24px_rgba(99,102,241,0.4)] hover:shadow-[0_6px_32px_rgba(99,102,241,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Start for free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/analytics"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-black/15 text-[#1E1B18] font-semibold text-base hover:bg-black/5 transition-all duration-200"
            >
              Explore analytics
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
