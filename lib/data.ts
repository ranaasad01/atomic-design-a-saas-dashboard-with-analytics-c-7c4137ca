export const APP_NAME = "Pulse Analytics";
export const APP_TAGLINE = "Real-time insights for modern SaaS teams.";
export const APP_ACCENT = "#6366F1";
export const APP_ACCENT_SECONDARY = "#22D3EE";

export interface NavLink {
  label: string;
  href: string;
  type: "route" | "anchor";
  icon?: string;
}

export const navLinks: NavLink[] = [
  { label: "Overview", href: "/", type: "route" },
  { label: "Dashboard", href: "/dashboard", type: "route" },
  { label: "Analytics", href: "/analytics", type: "route" },
  { label: "Users", href: "/users", type: "route" },
  { label: "Settings", href: "/settings", type: "route" },
];

export interface KPICard {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  prefix?: string;
  suffix?: string;
}

export interface Transaction {
  id: string;
  user: string;
  email: string;
  plan: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  date: string;
}

export type ChartPeriod = "7d" | "30d" | "90d" | "1y";

export interface PlanBreakdown {
  name: string;
  value: number;
  color: string;
}

export const PLAN_COLORS: Record<string, string> = {
  Starter: "#6366F1",
  Pro: "#22D3EE",
  Business: "#F59E0B",
  Enterprise: "#10B981",
};