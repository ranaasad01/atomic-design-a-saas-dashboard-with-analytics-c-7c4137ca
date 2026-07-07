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
  "bg-white border border-black/8 rounded-2xl shadow-sm";

const inputClass =
  "w-full bg-[#FAF7F2] border border-black/12 rounded-xl px-4 py-2.5 text-sm text-[#1E1B18] placeholder-[#9C9590] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200";

const labelClass = "block text-xs font-medium text-[#4A4540] mb-1.5 uppercase tracking-wider";

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
        checked ? "bg-indigo-500" : "bg-black/10"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab() {
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
        <h2 className="text-base font-semibold text-[#1E1B18] mb-1">Profile Photo</h2>
        <p className="text-sm text-[#6B6560] mb-5">Update your avatar and display name.</p>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-[#F3EFE8] border border-black/8 flex items-center justify-center">
              <span className="text-2xl font-bold text-[#1E1B18]">JD</span>
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center shadow-md hover:bg-indigo-600 transition-colors">
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-[#1E1B18]">Jane Doe</p>
            <p className="text-xs text-[#6B6560] mt-0.5">jane.doe@company.com</p>
            <button className="mt-2 text-xs text-indigo-500 hover:text-indigo-600 font-medium transition-colors">
              Upload new photo
            </button>
          </div>
        </div>
      </motion.div>

      {/* Personal Info */}
      <motion.div variants={fadeInUp} className={`${cardClass} p-6`}>
        <h2 className="text-base font-semibold text-[#1E1B18] mb-1">Personal Information</h2>
        <p className="text-sm text-[#6B6560] mb-5">Update your personal details here.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name</label>
            <input className={inputClass} defaultValue="Jane" placeholder="First name" />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input className={inputClass} defaultValue="Doe" placeholder="Last name" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Email Address</label>
            <input className={inputClass} type="email" defaultValue="jane.doe@company.com" placeholder="Email" />
          </div>
          <div>
            <label className={labelClass}>Job Title</label>
            <input className={inputClass} defaultValue="Head of Growth" placeholder="Job title" />
          </div>
          <div>
            <label className={labelClass}>Company</label>
            <input className={inputClass} defaultValue="Acme Corp" placeholder="Company" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Bio</label>
            <textarea
              rows={3}
              className={`${inputClass} resize-none`}
              defaultValue="Building data-driven products that scale."
              placeholder="Short bio"
            />
          </div>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-medium hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-md"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : "Save Changes"}
          </button>
          <button className="px-5 py-2.5 rounded-xl border border-black/15 text-[#1E1B18] text-sm font-medium hover:bg-black/5 transition-all duration-200">
            Cancel
          </button>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div variants={fadeInUp} className={`${cardClass} p-6`}>
        <h2 className="text-base font-semibold text-[#1E1B18] mb-1">Security</h2>
        <p className="text-sm text-[#6B6560] mb-5">Manage your password and two-factor authentication.</p>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Current Password</label>
            <input className={inputClass} type="password" placeholder="••••••••" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>New Password</label>
              <input className={inputClass} type="password" placeholder="••••••••" />
            </div>
            <div>
              <label className={labelClass}>Confirm Password</label>
              <input className={inputClass} type="password" placeholder="••••••••" />
            </div>
          </div>
        </div>
        <div className="mt-5 pt-5 border-t border-black/8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#1E1B18]">Two-Factor Authentication</p>
              <p className="text-xs text-[#6B6560] mt-0.5">Add an extra layer of security to your account.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-black/15 text-[#1E1B18] text-sm font-medium hover:bg-black/5 transition-all duration-200">
              <Shield className="w-4 h-4" />
              Enable 2FA
            </button>
          </div>
        </div>
        <div className="mt-4">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-medium hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-md">
            <Save className="w-4 h-4" />
            Update Password
          </button>
        </div>
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
  sms: boolean;
}

const INITIAL_NOTIFS: NotifSetting[] = [
  { id: "n1", label: "New Signups", description: "When a new user registers for your product.", email: true, push: true, sms: false },
  { id: "n2", label: "Payment Received", description: "When a subscription payment is successfully processed.", email: true, push: true, sms: true },
  { id: "n3", label: "Payment Failed", description: "When a payment attempt fails or is declined.", email: true, push: false, sms: true },
  { id: "n4", label: "Churn Alert", description: "When a user cancels their subscription.", email: true, push: true, sms: false },
  { id: "n5", label: "Weekly Digest", description: "A summary of your key metrics every Monday.", email: true, push: false, sms: false },
  { id: "n6", label: "Anomaly Detection", description: "When an unusual spike or drop is detected.", email: false, push: true, sms: false },
];

function NotificationsTab() {
  const [notifs, setNotifs] = useState<NotifSetting[]>(INITIAL_NOTIFS);
  const [saved, setSaved] = useState(false);

  function toggle(id: string, channel: "email" | "push" | "sms") {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, [channel]: !n[channel] } : n))
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
      <motion.div variants={fadeInUp} className={`${cardClass} p-6`}>
        <h2 className="text-base font-semibold text-[#1E1B18] mb-1">Notification Preferences</h2>
        <p className="text-sm text-[#6B6560] mb-6">Choose how and when you want to be notified.</p>

        {/* Channel headers */}
        <div className="hidden sm:grid grid-cols-[1fr_80px_80px_80px] gap-4 mb-3 px-1">
          <span />
          <span className="text-xs font-medium text-[#4A4540] uppercase tracking-wider text-center flex items-center justify-center gap-1">
            <Mail className="w-3 h-3" /> Email
          </span>
          <span className="text-xs font-medium text-[#4A4540] uppercase tracking-wider text-center flex items-center justify-center gap-1">
            <Bell className="w-3 h-3" /> Push
          </span>
          <span className="text-xs font-medium text-[#4A4540] uppercase tracking-wider text-center flex items-center justify-center gap-1">
            <Smartphone className="w-3 h-3" /> SMS
          </span>
        </div>

        <div className="space-y-1">
          {notifs.map((n, i) => (
            <div
              key={n.id}
              className={`grid grid-cols-1 sm:grid-cols-[1fr_80px_80px_80px] gap-4 items-center py-4 ${
                i < notifs.length - 1 ? "border-b border-black/8" : ""
              }`}
            >
              <div>
                <p className="text-sm font-medium text-[#1E1B18]">{n.label}</p>
                <p className="text-xs text-[#6B6560] mt-0.5">{n.description}</p>
              </div>
              <div className="flex sm:justify-center items-center gap-2">
                <span className="sm:hidden text-xs text-[#4A4540]">Email</span>
                <Toggle checked={n.email} onChange={() => toggle(n.id, "email")} />
              </div>
              <div className="flex sm:justify-center items-center gap-2">
                <span className="sm:hidden text-xs text-[#4A4540]">Push</span>
                <Toggle checked={n.push} onChange={() => toggle(n.id, "push")} />
              </div>
              <div className="flex sm:justify-center items-center gap-2">
                <span className="sm:hidden text-xs text-[#4A4540]">SMS</span>
                <Toggle checked={n.sms} onChange={() => toggle(n.id, "sms")} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-medium hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-md"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : "Save Preferences"}
          </button>
        </div>
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
      <motion.div variants={fadeInUp} className={`${cardClass} p-6`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#1E1B18] mb-1">Current Plan</h2>
            <p className="text-sm text-[#6B6560]">You are on the <span className="text-indigo-500 font-medium">Pro Plan</span>.</p>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-semibold">
            <Star className="w-3 h-3" /> Pro
          </span>
        </div>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Monthly Cost", value: "$79 / mo" },
            { label: "Next Billing", value: "Jan 1, 2025" },
            { label: "Seats Used", value: "4 / 10" },
          ].map((item) => (
            <div key={item.label} className="bg-[#FAF7F2] rounded-xl p-4 border border-black/8">
              <p className="text-xs text-[#6B6560] mb-1">{item.label}</p>
              <p className="text-lg font-semibold text-[#1E1B18]">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-medium hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-md">
            <Zap className="w-4 h-4" />
            Upgrade Plan
          </button>
          <button className="px-5 py-2.5 rounded-xl border border-black/15 text-[#1E1B18] text-sm font-medium hover:bg-black/5 transition-all duration-200">
            Cancel Subscription
          </button>
        </div>
      </motion.div>

      {/* Payment Method */}
      <motion.div variants={fadeInUp} className={`${cardClass} p-6`}>
        <h2 className="text-base font-semibold text-[#1E1B18] mb-1">Payment Method</h2>
        <p className="text-sm text-[#6B6560] mb-5">Manage your payment details.</p>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF7F2] border border-black/8">
          <div className="w-12 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#1E1B18]">Visa ending in 4242</p>
            <p className="text-xs text-[#6B6560]">Expires 08 / 2027</p>
          </div>
          <button className="text-xs text-indigo-500 hover:text-indigo-600 font-medium transition-colors">
            Update
          </button>
        </div>
        <button className="mt-3 flex items-center gap-2 text-sm text-[#6B6560] hover:text-[#1E1B18] transition-colors">
          <span className="w-5 h-5 rounded-full border-2 border-dashed border-black/20 flex items-center justify-center text-xs">+</span>
          Add payment method
        </button>
      </motion.div>

      {/* Invoice History */}
      <motion.div variants={fadeInUp} className={`${cardClass} p-6`}>
        <h2 className="text-base font-semibold text-[#1E1B18] mb-1">Invoice History</h2>
        <p className="text-sm text-[#6B6560] mb-5">Download past invoices for your records.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/8">
                <th className="text-left text-xs font-medium text-[#4A4540] uppercase tracking-wider pb-3">Invoice</th>
                <th className="text-left text-xs font-medium text-[#4A4540] uppercase tracking-wider pb-3">Description</th>
                <th className="text-left text-xs font-medium text-[#4A4540] uppercase tracking-wider pb-3">Date</th>
                <th className="text-right text-xs font-medium text-[#4A4540] uppercase tracking-wider pb-3">Amount</th>
                <th className="text-center text-xs font-medium text-[#4A4540] uppercase tracking-wider pb-3">Status</th>
                <th className="text-right text-xs font-medium text-[#4A4540] uppercase tracking-wider pb-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv, i) => (
                <tr
                  key={inv.id}
                  className={`${
                    i < INVOICES.length - 1 ? "border-b border-black/5" : ""
                  } hover:bg-black/2 transition-colors`}
                >
                  <td className="py-3.5 text-[#1E1B18] font-mono text-xs">{inv.id}</td>
                  <td className="py-3.5 text-[#6B6560]">{inv.description}</td>
                  <td className="py-3.5 text-[#6B6560]">{inv.date}</td>
                  <td className="py-3.5 text-right font-medium text-[#1E1B18]">${inv.amount}</td>
                  <td className="py-3.5 text-center">
                    {inv.status === "paid" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                        <Check className="w-3 h-3" /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                        <AlertCircle className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-right">
                    <button className="inline-flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-600 font-medium transition-colors">
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
      prev.map((int) =>
        int.id === id ? { ...int, connected: !int.connected } : int
      )
    );
  }

  return (
    <motion.div
      key="integrations"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-6"
    >
      <motion.div variants={fadeInUp} className={`${cardClass} p-6`}>
        <h2 className="text-base font-semibold text-[#1E1B18] mb-1">Connected Apps</h2>
        <p className="text-sm text-[#6B6560] mb-6">Manage your third-party integrations and connected services.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {integrations.map((int) => (
            <div
              key={int.id}
              className="bg-white border border-black/8 shadow-sm rounded-xl p-4 flex items-start gap-4 hover:border-black/15 transition-all duration-200"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm"
                style={{ backgroundColor: int.color }}
              >
                {int.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#1E1B18]">{int.name}</p>
                  <span className="text-xs text-[#9C9590] flex-shrink-0">{int.category}</span>
                </div>
                <p className="text-xs text-[#6B6560] mt-0.5 leading-relaxed">{int.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  {int.connected ? (
                    <>
                      <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        Connected
                      </span>
                      <button
                        onClick={() => toggleIntegration(int.id)}
                        className="ml-auto text-xs text-[#6B6560] hover:text-red-500 font-medium transition-colors"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => toggleIntegration(int.id)}
                      className="flex items-center gap-1.5 text-xs text-indigo-500 hover:text-indigo-600 font-medium transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className={`${cardClass} p-6`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
            <Puzzle className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1E1B18]">Need a custom integration?</p>
            <p className="text-xs text-[#6B6560]">Use our REST API or webhooks to connect any service.</p>
          </div>
          <button className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl border border-black/15 text-[#1E1B18] text-sm font-medium hover:bg-black/5 transition-all duration-200 flex-shrink-0">
            <Github className="w-4 h-4" />
            View Docs
          </button>
        </div>
      </motion.div>
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
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-[#1E1B18] tracking-tight">Settings</h1>
          <p className="mt-1 text-[#6B6560]">Manage your account, notifications, billing, and integrations.</p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-8"
        >
          <div className="flex gap-1 p-1 rounded-2xl bg-[#F3EFE8] border border-black/8 w-fit">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white text-[#1E1B18] shadow-sm"
                      : "text-[#6B6560] hover:text-[#1E1B18]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <div key={activeTab}>{tabContent[activeTab]}</div>
        </AnimatePresence>
      </div>
    </div>
  );
}
