"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { User, Bell, CreditCard, Puzzle, Camera, Save, Check, X, ChevronRight, Code2 as Github, AlertCircle, Mail, Smartphone, Star, Zap, Shield, Download, ExternalLink } from 'lucide-react';
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending";
  description: string;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  connected: boolean;
  icon: string;
  color: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INVOICES: Invoice[] = [
  { id: "INV-2024-012", date: "Dec 1, 2024", amount: 79, status: "paid", description: "Pro Plan — December 2024" },
  { id: "INV-2024-011", date: "Nov 1, 2024", amount: 79, status: "paid", description: "Pro Plan — November 2024" },
  { id: "INV-2024-010", date: "Oct 1, 2024", amount: 79, status: "paid", description: "Pro Plan — October 2024" },
  { id: "INV-2024-009", date: "Sep 1, 2024", amount: 49, status: "paid", description: "Starter Plan — September 2024" },
  { id: "INV-2024-008", date: "Aug 1, 2024", amount: 49, status: "paid", description: "Starter Plan — August 2024" },
];

const INITIAL_INTEGRATIONS: Integration[] = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Accept payments and manage subscriptions seamlessly.",
    category: "Payments",
    connected: true,
    icon: "S",
    color: "#635BFF",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get real-time alerts and reports delivered to your channels.",
    category: "Communication",
    connected: true,
    icon: "Sl",
    color: "#4A154B",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Link deployments and track release metrics automatically.",
    category: "Development",
    connected: false,
    icon: "G",
    color: "#24292F",
  },
  {
    id: "intercom",
    name: "Intercom",
    description: "Sync customer data and support tickets with your analytics.",
    category: "Support",
    connected: false,
    icon: "I",
    color: "#1F8DED",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Connect CRM data to understand your sales funnel better.",
    category: "CRM",
    connected: false,
    icon: "H",
    color: "#FF7A59",
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Automate workflows by connecting Pulse to 5,000+ apps.",
    category: "Automation",
    connected: true,
    icon: "Z",
    color: "#FF4A00",
  },
];

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "integrations", label: "Integrations", icon: Puzzle },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Reusable primitives ──────────────────────────────────────────────────────

const cardClass =
  "bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.2),0_8px_24px_-8px_rgba(0,0,0,0.4)]";

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200";

const labelClass = "block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider";

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
        checked ? "bg-indigo-500" : "bg-white/10"
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-md ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab() {
  const [name, setName] = useState("Alex Rivera");
  const [email, setEmail] = useState("alex.rivera@company.io");
  const [role, setRole] = useState("Product Manager");
  const [bio, setBio] = useState("Building data-driven products at the intersection of design and engineering.");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <motion.div
      key="profile"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Avatar */}
      <motion.div variants={fadeInUp} className={`${cardClass} p-6`}>
        <h2 className="text-sm font-semibold text-slate-300 mb-5 uppercase tracking-wider">Avatar</h2>
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_24px_rgba(99,102,241,0.4)]">
              AR
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-indigo-500 border-2 border-[#0F172A] flex items-center justify-center shadow-lg"
              aria-label="Upload avatar"
            >
              <Camera className="w-3.5 h-3.5 text-white" />
            </motion.button>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">Profile photo</p>
            <p className="text-xs text-slate-500 mt-0.5">PNG, JPG or GIF. Max 2 MB.</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="mt-2.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200 flex items-center gap-1"
            >
              <Camera className="w-3 h-3" /> Upload new photo
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Personal Info */}
      <motion.div variants={fadeInUp} className={`${cardClass} p-6`}>
        <h2 className="text-sm font-semibold text-slate-300 mb-5 uppercase tracking-wider">Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className={labelClass}>Role / Title</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={inputClass}
              placeholder="e.g. Product Manager"
            />
          </div>
          <div>
            <label className={labelClass}>Company</label>
            <input
              type="text"
              defaultValue="Acme Corp"
              className={inputClass}
              placeholder="Your company"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="A short bio about yourself..."
            />
          </div>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div variants={fadeInUp} className={`${cardClass} p-6`}>
        <h2 className="text-sm font-semibold text-slate-300 mb-5 uppercase tracking-wider">Security</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Current Password</label>
            <input type="password" defaultValue="" className={inputClass} placeholder="••••••••" />
          </div>
          <div>
            <label className={labelClass}>New Password</label>
            <input type="password" defaultValue="" className={inputClass} placeholder="••••••••" />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-indigo-400" />
          Use at least 12 characters with a mix of letters, numbers, and symbols.
        </p>
      </motion.div>

      {/* Save */}
      <motion.div variants={fadeInUp} className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            saved
              ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
              : "bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_28px_rgba(99,102,241,0.6)]"
          }`}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" /> Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ─── Notifications Tab ────────────────────────────────────────────────────────

interface NotifSetting {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
}

function NotificationsTab() {
  const [settings, setSettings] = useState<NotifSetting[]>([
    { id: "revenue", label: "Revenue Milestones", description: "Get notified when MRR crosses a new threshold.", email: true, push: true },
    { id: "churn", label: "Churn Alerts", description: "Immediate alerts when a customer cancels their subscription.", email: true, push: false },
    { id: "new_user", label: "New Sign-ups", description: "Daily digest of new user registrations.", email: false, push: false },
    { id: "trial_end", label: "Trial Expiry", description: "Remind you 3 days before a trial account expires.", email: true, push: true },
    { id: "invoice", label: "Invoice Events", description: "Notifications for successful payments and failed charges.", email: true, push: false },
    { id: "security", label: "Security Alerts", description: "Unusual login attempts or permission changes.", email: true, push: true },
  ]);

  const [digest, setDigest] = useState("daily");
  const [saved, setSaved] = useState(false);

  function toggle(id: string, channel: "email" | "push") {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [channel]: !s[channel] } : s))
    );
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <motion.div
      key="notifications"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Channel header */}
      <motion.div variants={fadeInUp} className={`${cardClass} p-6`}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Alert Preferences</h2>
          <div className="flex items-center gap-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</span>
            <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5" /> Push</span>
          </div>
        </div>
        <div className="space-y-0 divide-y divide-white/5">
          {settings.map((s) => (
            <motion.div
              key={s.id}
              variants={fadeInUp}
              className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
            >
              <div className="flex-1 pr-6">
                <p className="text-sm font-medium text-slate-200">{s.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.description}</p>
              </div>
              <div className="flex items-center gap-6">
                <Toggle checked={s.email} onChange={() => toggle(s.id, "email")} />
                <Toggle checked={s.push} onChange={() => toggle(s.id, "push")} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Digest frequency */}
      <motion.div variants={fadeInUp} className={`${cardClass} p-6`}>
        <h2 className="text-sm font-semibold text-slate-300 mb-5 uppercase tracking-wider">Digest Frequency</h2>
        <div className="grid grid-cols-3 gap-3">
          {(["realtime", "daily", "weekly"] as const).map((freq) => (
            <motion.button
              key={freq}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setDigest(freq)}
              className={`py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 capitalize ${
                digest === freq
                  ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                  : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-200"
              }`}
            >
              {freq}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            saved
              ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
              : "bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_28px_rgba(99,102,241,0.6)]"
          }`}
        >
          {saved ? <><Check className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Preferences</>}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ─── Billing Tab ──────────────────────────────────────────────────────────────

function BillingTab() {
  return (
    <motion.div
      key="billing"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Current Plan */}
      <motion.div variants={scaleIn} className={`${cardClass} p-6 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/5 pointer-events-none" />
        <div className="relative">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                  Current Plan
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-2 tracking-tight">Pro</h2>
              <p className="text-slate-400 text-sm mt-1">Up to 10 team members, 50k events/mo, advanced analytics.</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white tracking-tight">$79<span className="text-base font-normal text-slate-400">/mo</span></p>
              <p className="text-xs text-slate-500 mt-1">Renews Jan 1, 2025</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { label: "Events Used", value: "38,240", max: "50,000" },
              { label: "Team Members", value: "7", max: "10" },
              { label: "Data Retention", value: "12 mo", max: "12 mo" },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-3">
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="text-sm font-semibold text-slate-200 mt-0.5">{item.value}</p>
                <p className="text-xs text-slate-600">of {item.max}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-3 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300"
            >
              <Zap className="w-4 h-4" /> Upgrade to Business
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <CreditCard className="w-4 h-4" /> Manage Payment Method
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Plan comparison */}
      <motion.div variants={fadeInUp} className={`${cardClass} p-6`}>
        <h2 className="text-sm font-semibold text-slate-300 mb-5 uppercase tracking-wider">Available Plans</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: "Starter", price: "$29", events: "10k events/mo", members: "3 members", current: false },
            { name: "Pro", price: "$79", events: "50k events/mo", members: "10 members", current: true },
            { name: "Business", price: "$199", events: "250k events/mo", members: "Unlimited", current: false },
          ].map((plan) => (
            <motion.div
              key={plan.name}
              whileHover={{ y: -2 }}
              className={`rounded-xl p-4 border transition-all duration-200 ${
                plan.current
                  ? "bg-indigo-500/10 border-indigo-500/40"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-slate-200">{plan.name}</p>
                {plan.current && (
                  <span className="text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">Active</span>
                )}
              </div>
              <p className="text-xl font-bold text-white">{plan.price}<span className="text-xs font-normal text-slate-500">/mo</span></p>
              <ul className="mt-3 space-y-1.5">
                <li className="text-xs text-slate-400 flex items-center gap-1.5"><Check className="w-3 h-3 text-indigo-400" />{plan.events}</li>
                <li className="text-xs text-slate-400 flex items-center gap-1.5"><Check className="w-3 h-3 text-indigo-400" />{plan.members}</li>
              </ul>
              {!plan.current && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-4 w-full py-1.5 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-slate-300 hover:bg-indigo-500/20 hover:border-indigo-500/30 hover:text-indigo-300 transition-all duration-200"
                >
                  Switch to {plan.name}
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Invoice History */}
      <motion.div variants={fadeInUp} className={`${cardClass} p-6`}>
        <h2 className="text-sm font-semibold text-slate-300 mb-5 uppercase tracking-wider">Invoice History</h2>
        <div className="space-y-0 divide-y divide-white/5">
          {INVOICES.map((inv) => (
            <motion.div
              key={inv.id}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
              className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 rounded-lg px-2 -mx-2 transition-colors duration-150"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{inv.description}</p>
                  <p className="text-xs text-slate-500">{inv.id} · {inv.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                    inv.status === "paid"
                      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                      : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                  }`}
                >
                  {inv.status}
                </span>
                <p className="text-sm font-semibold text-slate-200 w-12 text-right">${inv.amount}</p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                  aria-label="Download invoice"
                >
                  <Download className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Integrations Tab ─────────────────────────────────────────────────────────

function IntegrationsTab() {
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);

  function toggleIntegration(id: string) {
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, connected: !i.connected } : i))
    );
  }

  const connected = integrations.filter((i) => i.connected);
  const available = integrations.filter((i) => !i.connected);

  return (
    <motion.div
      key="integrations"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Stats bar */}
      <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-4">
        {[
          { label: "Connected", value: connected.length, color: "text-emerald-400" },
          { label: "Available", value: available.length, color: "text-indigo-400" },
          { label: "Total", value: integrations.length, color: "text-slate-300" },
        ].map((stat) => (
          <div key={stat.label} className={`${cardClass} p-4 text-center`}>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Connected */}
      {connected.length > 0 && (
        <motion.div variants={fadeInUp} className={`${cardClass} p-6`}>
          <h2 className="text-sm font-semibold text-slate-300 mb-5 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Connected Apps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {connected.map((intg) => (
              <IntegrationCard key={intg.id} integration={intg} onToggle={toggleIntegration} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Available */}
      {available.length > 0 && (
        <motion.div variants={fadeInUp} className={`${cardClass} p-6`}>
          <h2 className="text-sm font-semibold text-slate-300 mb-5 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-500 inline-block" />
            Available Apps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {available.map((intg) => (
              <IntegrationCard key={intg.id} integration={intg} onToggle={toggleIntegration} />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function IntegrationCard({
  integration,
  onToggle,
}: {
  integration: Integration;
  onToggle: (id: string) => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`rounded-xl p-4 border transition-all duration-200 ${
        integration.connected
          ? "bg-white/5 border-white/10 hover:border-white/20"
          : "bg-white/[0.02] border-white/5 hover:border-white/10"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg flex-shrink-0"
            style={{ backgroundColor: integration.color }}
          >
            {integration.icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">{integration.name}</p>
            <span className="text-xs text-slate-500 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-md">
              {integration.category}
            </span>
          </div>
        </div>
        <Toggle checked={integration.connected} onChange={() => onToggle(integration.id)} />
      </div>
      <p className="text-xs text-slate-500 mt-3 leading-relaxed">{integration.description}</p>
      {integration.connected && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400">
          <Check className="w-3 h-3" /> Connected and syncing
        </div>
      )}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  const tabContent: Record<TabId, React.ReactNode> = {
    profile: <ProfileTab />,
    notifications: <NotificationsTab />,
    billing: <BillingTab />,
    integrations: <IntegrationsTab />,
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/6 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-8"
        >
          <motion.p variants={fadeInUp} className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">
            Account
          </motion.p>
          <motion.h1
            variants={fadeInUp}
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance"
          >
            Settings
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-slate-400 mt-2 text-sm leading-relaxed">
            Manage your profile, notifications, billing, and connected apps.
          </motion.p>
        </motion.div>

        {/* Tab bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-2xl p-1.5 mb-8 overflow-x-auto"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap flex-1 justify-center ${
                  isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="settings-tab-pill"
                    className="absolute inset-0 rounded-xl bg-white/10 border border-white/15 shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {tabContent[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}