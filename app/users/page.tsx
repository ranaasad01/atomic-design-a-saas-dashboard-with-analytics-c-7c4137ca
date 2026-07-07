"use client";

import { useState, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { Search, ChevronUp, ChevronDown, ArrowUpDown, Users, UserCheck, UserPlus, Filter } from 'lucide-react';
import { PLAN_COLORS } from "@/lib/data";
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useTranslations } from "next-intl";

const MOCK_USERS = [
  { id: "u1", name: "Sophia Carter", email: "sophia.carter@example.com", plan: "Pro", status: "active", joined: "2024-01-12", avatar: "SC" },
  { id: "u2", name: "Liam Nguyen", email: "liam.nguyen@example.com", plan: "Starter", status: "active", joined: "2024-02-03", avatar: "LN" },
  { id: "u3", name: "Amara Osei", email: "amara.osei@example.com", plan: "Enterprise", status: "active", joined: "2023-11-28", avatar: "AO" },
  { id: "u4", name: "James Whitfield", email: "james.whitfield@example.com", plan: "Business", status: "inactive", joined: "2024-03-15", avatar: "JW" },
  { id: "u5", name: "Priya Sharma", email: "priya.sharma@example.com", plan: "Pro", status: "active", joined: "2024-04-01", avatar: "PS" },
  { id: "u6", name: "Carlos Mendez", email: "carlos.mendez@example.com", plan: "Starter", status: "pending", joined: "2024-05-20", avatar: "CM" },
  { id: "u7", name: "Elena Volkov", email: "elena.volkov@example.com", plan: "Enterprise", status: "active", joined: "2023-09-07", avatar: "EV" },
  { id: "u8", name: "Marcus Bell", email: "marcus.bell@example.com", plan: "Business", status: "active", joined: "2024-05-30", avatar: "MB" },
  { id: "u9", name: "Yuki Tanaka", email: "yuki.tanaka@example.com", plan: "Pro", status: "inactive", joined: "2024-01-25", avatar: "YT" },
  { id: "u10", name: "Fatima Al-Hassan", email: "fatima.alhassan@example.com", plan: "Starter", status: "active", joined: "2024-06-01", avatar: "FA" },
  { id: "u11", name: "Noah Patel", email: "noah.patel@example.com", plan: "Pro", status: "active", joined: "2024-06-03", avatar: "NP" },
  { id: "u12", name: "Isla MacGregor", email: "isla.macgregor@example.com", plan: "Business", status: "active", joined: "2024-03-22", avatar: "IM" },
  { id: "u13", name: "Kwame Asante", email: "kwame.asante@example.com", plan: "Enterprise", status: "active", joined: "2023-12-14", avatar: "KA" },
  { id: "u14", name: "Zoe Hartmann", email: "zoe.hartmann@example.com", plan: "Starter", status: "pending", joined: "2024-05-28", avatar: "ZH" },
  { id: "u15", name: "Ravi Krishnan", email: "ravi.krishnan@example.com", plan: "Pro", status: "active", joined: "2024-02-18", avatar: "RK" },
];

const PLAN_DISTRIBUTION = [
  { name: "Starter", value: 4, color: PLAN_COLORS["Starter"] },
  { name: "Pro", value: 5, color: PLAN_COLORS["Pro"] },
  { name: "Business", value: 3, color: PLAN_COLORS["Business"] },
  { name: "Enterprise", value: 3, color: PLAN_COLORS["Enterprise"] },
];

type SortKey = "name" | "email" | "plan" | "status" | "joined";
type SortDir = "asc" | "desc";

const STATUS_CONFIG: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  active: { label: "Active", dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-400/10" },
  inactive: { label: "Inactive", dot: "bg-slate-500", text: "text-slate-400", bg: "bg-slate-500/10" },
  pending: { label: "Pending", dot: "bg-amber-400", text: "text-amber-400", bg: "bg-amber-400/10" },
};

const PLAN_TEXT: Record<string, string> = {
  Starter: "text-indigo-400",
  Pro: "text-cyan-400",
  Business: "text-amber-400",
  Enterprise: "text-emerald-400",
};

const PLAN_BG: Record<string, string> = {
  Starter: "bg-indigo-400/10 border-indigo-400/20",
  Pro: "bg-cyan-400/10 border-cyan-400/20",
  Business: "bg-amber-400/10 border-amber-400/20",
  Enterprise: "bg-emerald-400/10 border-emerald-400/20",
};

const AVATAR_COLORS = [
  "from-indigo-500 to-purple-500",
  "from-cyan-500 to-blue-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-pink-500 to-rose-500",
];

function getAvatarGradient(id: string): string {
  const index = id.charCodeAt(1) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index] ?? AVATAR_COLORS[0];
}

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        <p className="text-lg font-semibold text-white">{payload[0]?.value ?? 0} users</p>
      </div>
    );
  }
  return null;
};

export default function UsersPage() {
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("joined");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [planFilter, setPlanFilter] = useState("All");

  const totalUsers = MOCK_USERS.length;
  const activeUsers = MOCK_USERS.filter((u) => u.status === "active").length;
  const newThisMonth = MOCK_USERS.filter((u) => u.joined >= "2024-05-01").length;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let rows = [...MOCK_USERS];
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.plan.toLowerCase().includes(q)
      );
    }
    if (planFilter !== "All") {
      rows = rows.filter((u) => u.plan === planFilter);
    }
    rows.sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [search, sortKey, sortDir, planFilter]);

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-600" />;
    return sortDir === "asc"
      ? <ChevronUp className="w-3.5 h-3.5 text-indigo-400" />
      : <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />;
  };

  return (
    <main className="min-h-screen bg-[#0B1120] text-[#F8FAFC] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Page Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="space-y-1"
        >
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {t("users.title")}
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            {t("users.subtitle")}
          </p>
        </motion.div>

        {/* KPI Summary Strip */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            {
              icon: Users,
              label: t("users.kpi.total"),
              value: totalUsers,
              color: "text-indigo-400",
              bg: "bg-indigo-400/10",
              glow: "shadow-[0_0_24px_rgba(99,102,241,0.15)]",
            },
            {
              icon: UserCheck,
              label: t("users.kpi.active"),
              value: activeUsers,
              color: "text-emerald-400",
              bg: "bg-emerald-400/10",
              glow: "shadow-[0_0_24px_rgba(16,185,129,0.15)]",
            },
            {
              icon: UserPlus,
              label: t("users.kpi.new"),
              value: newThisMonth,
              color: "text-cyan-400",
              bg: "bg-cyan-400/10",
              glow: "shadow-[0_0_24px_rgba(34,211,238,0.15)]",
            },
          ].map((kpi) => (
            <motion.div
              key={kpi.label}
              variants={scaleIn}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className={`flex items-center gap-4 rounded-2xl border border-white/8 bg-[#111827]/80 backdrop-blur-sm px-5 py-4 ${kpi.glow}`}
            >
              <div className={`w-11 h-11 rounded-xl ${kpi.bg} flex items-center justify-center flex-shrink-0`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{kpi.label}</p>
                <p className={`text-2xl font-bold ${kpi.color} mt-0.5`}>{kpi.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Plan Distribution Chart */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeIn}
          className="rounded-2xl border border-white/8 bg-[#111827]/80 backdrop-blur-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-white">{t("users.chart.title")}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{t("users.chart.subtitle")}</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {PLAN_DISTRIBUTION.map((p) => (
                <span key={p.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  {p.name}
                </span>
              ))}
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PLAN_DISTRIBUTION} barSize={40} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#94A3B8", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#94A3B8", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {PLAN_DISTRIBUTION.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Table Controls */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
        >
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("users.search.placeholder")}
              className="w-full bg-[#111827] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-500 mr-1">{t("users.filter.plan")}</span>
            {["All", "Starter", "Pro", "Business", "Enterprise"].map((p) => (
              <button
                key={p}
                onClick={() => setPlanFilter(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  planFilter === p
                    ? "bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/8"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </motion.div>

        {/* User Table */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={fadeIn}
          className="rounded-2xl border border-white/8 bg-[#111827]/80 backdrop-blur-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  {(
                    [
                      { key: "name" as SortKey, label: t("users.table.name") },
                      { key: "email" as SortKey, label: t("users.table.email") },
                      { key: "plan" as SortKey, label: t("users.table.plan") },
                      { key: "status" as SortKey, label: t("users.table.status") },
                      { key: "joined" as SortKey, label: t("users.table.joined") },
                    ] as Array<{ key: SortKey; label: string }>
                  ).map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors duration-150 select-none"
                    >
                      <span className="flex items-center gap-1.5">
                        {col.label}
                        <SortIcon col={col.key} />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
                {(filtered ?? []).map((user) => {
                  const status = STATUS_CONFIG[user.status] ?? STATUS_CONFIG["inactive"];
                  const planText = PLAN_TEXT[user.plan] ?? "text-slate-400";
                  const planBg = PLAN_BG[user.plan] ?? "bg-white/5 border-white/10";
                  const avatarGrad = getAvatarGradient(user.id);
                  return (
                    <motion.tr
                      key={user.id}
                      variants={rowVariants}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                      className="border-b border-white/5 last:border-0 transition-colors duration-150"
                    >
                      {/* Name + Avatar */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarGrad} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.3)]`}
                          >
                            {user.avatar}
                          </div>
                          <span className="font-medium text-white whitespace-nowrap">{user.name}</span>
                        </div>
                      </td>
                      {/* Email */}
                      <td className="px-5 py-4 text-slate-400 whitespace-nowrap">{user.email}</td>
                      {/* Plan Badge */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${planBg} ${planText}`}
                        >
                          {user.plan}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${status.bg} ${status.text}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>
                      {/* Join Date */}
                      <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                        {user.joined}
                      </td>
                    </motion.tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center text-slate-500 text-sm">
                      {t("users.table.empty")}
                    </td>
                  </tr>
                )}
              </motion.tbody>
            </table>
          </div>
          {/* Table Footer */}
          <div className="px-5 py-3.5 border-t border-white/8 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              {t("users.table.showing")} <span className="text-slate-300 font-medium">{filtered.length}</span> {t("users.table.of")} <span className="text-slate-300 font-medium">{totalUsers}</span> {t("users.table.users")}
            </p>
            <div className="flex items-center gap-1">
              {[...Array(Math.ceil(filtered.length / 10))].map((_, i) => (
                <button
                  key={i}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-all duration-200 ${
                    i === 0
                      ? "bg-indigo-500 text-white"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}