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
  active: { label: "Active", dot: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50" },
  inactive: { label: "Inactive", dot: "bg-slate-400", text: "text-slate-500", bg: "bg-slate-100" },
  pending: { label: "Pending", dot: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-50" },
};

const PLAN_TEXT: Record<string, string> = {
  Starter: "text-indigo-600",
  Pro: "text-cyan-600",
  Business: "text-amber-600",
  Enterprise: "text-emerald-600",
};

const PLAN_BG: Record<string, string> = {
  Starter: "bg-indigo-50 border-indigo-200",
  Pro: "bg-cyan-50 border-cyan-200",
  Business: "bg-amber-50 border-amber-200",
  Enterprise: "bg-emerald-50 border-emerald-200",
};

const AVATAR_COLORS = [
  "from-indigo-500 to-purple-500",
  "from-cyan-500 to-blue-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-pink-500 to-rose-500",
];

const PAGE_SIZE = 8;

const kpiSummary = [
  { label: "Total Users", value: "15", icon: Users, color: "#6366F1" },
  { label: "Active", value: "11", icon: UserCheck, color: "#10B981" },
  { label: "New This Month", value: "4", icon: UserPlus, color: "#22D3EE" },
];

export default function UsersPage() {
  const t = useTranslations();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("joined");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = [...MOCK_USERS];
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") rows = rows.filter((u) => u.status === statusFilter);
    if (planFilter !== "all") rows = rows.filter((u) => u.plan === planFilter);
    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [search, statusFilter, planFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col)
      return <ArrowUpDown className="w-3.5 h-3.5 text-[#9C9590]" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3.5 h-3.5 text-indigo-500" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-indigo-500" />
    );
  }

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
            Users
          </h1>
          <p className="mt-1 text-sm text-[#6B6560]">
            Manage and monitor all registered users across your platform.
          </p>
        </motion.div>

        {/* KPI Summary Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          {kpiSummary.map((kpi) => (
            <motion.div
              key={kpi.label}
              variants={scaleIn}
              className="bg-white border border-black/8 shadow-sm rounded-2xl p-5 flex items-center gap-4"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: kpi.color + "18" }}
              >
                <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
              </div>
              <div>
                <p className="text-xs font-medium text-[#6B6560] uppercase tracking-wider">
                  {kpi.label}
                </p>
                <p className="text-2xl font-bold text-[#1E1B18] mt-0.5">
                  {kpi.value}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-white border border-black/8 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C9590]" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-[#FAF7F2] border border-black/10 text-[#1E1B18] placeholder-[#9C9590] rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all duration-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#9C9590] flex-shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="bg-white border border-black/8 text-[#1E1B18] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all duration-200 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <select
              value={planFilter}
              onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
              className="bg-white border border-black/8 text-[#1E1B18] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all duration-200 cursor-pointer"
            >
              <option value="all">All Plans</option>
              <option value="Starter">Starter</option>
              <option value="Pro">Pro</option>
              <option value="Business">Business</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>
        </motion.div>

        {/* User Table */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="bg-white border border-black/8 shadow-sm rounded-2xl overflow-hidden mb-8"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F3EFE8] border-b border-black/5">
                  {([
                    { key: "name", label: "User" },
                    { key: "email", label: "Email" },
                    { key: "plan", label: "Plan" },
                    { key: "status", label: "Status" },
                    { key: "joined", label: "Joined" },
                  ] as { key: SortKey; label: string }[]).map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="px-5 py-3.5 text-left text-xs font-semibold text-[#6B6560] uppercase tracking-wider cursor-pointer select-none hover:text-[#1E1B18] transition-colors duration-150"
                    >
                      <span className="flex items-center gap-1.5">
                        {col.label}
                        <SortIcon col={col.key} />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-[#6B6560]">
                      No users match your filters.
                    </td>
                  </tr>
                ) : (
                  paginated.map((user, idx) => {
                    const status = STATUS_CONFIG[user.status];
                    const avatarGradient =
                      AVATAR_COLORS[user.id.charCodeAt(1) % AVATAR_COLORS.length];
                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.3 }}
                        className="border-b border-black/5 hover:bg-[#FAF7F2] transition-colors duration-150"
                      >
                        {/* User */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center flex-shrink-0`}
                            >
                              <span className="text-xs font-semibold text-white">
                                {user.avatar}
                              </span>
                            </div>
                            <span className="font-medium text-[#1E1B18]">
                              {user.name}
                            </span>
                          </div>
                        </td>
                        {/* Email */}
                        <td className="px-5 py-4 text-[#6B6560]">
                          {user.email}
                        </td>
                        {/* Plan */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                              PLAN_BG[user.plan]
                            } ${PLAN_TEXT[user.plan]}`}
                          >
                            {user.plan}
                          </span>
                        </td>
                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                          </span>
                        </td>
                        {/* Joined */}
                        <td className="px-5 py-4 text-[#6B6560]">
                          {new Date(user.joined).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-black/8">
            <p className="text-xs text-[#6B6560]">
              Showing{" "}
              <span className="font-medium text-[#1E1B18]">
                {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
                {Math.min(page * PAGE_SIZE, filtered.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-[#1E1B18]">{filtered.length}</span>{" "}
              users
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-black/8 text-[#6B6560] hover:bg-[#F3EFE8] hover:text-[#1E1B18] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all duration-150 ${
                    p === page
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "bg-white border border-black/8 text-[#6B6560] hover:bg-[#F3EFE8] hover:text-[#1E1B18]"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-black/8 text-[#6B6560] hover:bg-[#F3EFE8] hover:text-[#1E1B18] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
              >
                Next
              </button>
            </div>
          </div>
        </motion.div>

        {/* Plan Distribution Chart */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-white border border-black/8 shadow-sm rounded-2xl p-6"
        >
          <h2 className="text-base font-semibold text-[#1E1B18] mb-1">
            Plan Distribution
          </h2>
          <p className="text-xs text-[#6B6560] mb-6">
            Number of users per subscription plan
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={PLAN_DISTRIBUTION}
              margin={{ top: 4, right: 16, left: -16, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,0,0,0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "#9C9590", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#9C9590", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: "12px",
                  color: "#1E1B18",
                  fontSize: 13,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                }}
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={56}>
                {PLAN_DISTRIBUTION.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
