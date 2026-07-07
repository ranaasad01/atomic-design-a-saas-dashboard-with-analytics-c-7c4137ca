"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Activity, Code2 as Github, MessageCircle as Twitter, Briefcase as Linkedin } from 'lucide-react';
import { APP_NAME, APP_TAGLINE, navLinks } from "@/lib/data";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const footerLinks = [
  { label: "Dashboard", href: "/dashboard", type: "route" as const },
  { label: "Analytics", href: "/analytics", type: "route" as const },
  { label: "Users", href: "/users", type: "route" as const },
  { label: "Settings", href: "/settings", type: "route" as const },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com", icon: Github },
  { label: "Twitter", href: "https://twitter.com", icon: Twitter },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
];

export default function Footer() {
  const pathname = usePathname();

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={staggerContainer}
      className="border-t border-white/10 bg-[#0F172A]/80 backdrop-blur-xl mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <motion.div variants={fadeInUp} className="col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-[0_0_16px_rgba(99,102,241,0.4)] group-hover:shadow-[0_0_24px_rgba(99,102,241,0.6)] transition-all duration-300">
                <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[#F8FAFC] font-semibold text-lg tracking-tight">
                {APP_NAME}
              </span>
            </Link>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-xs">
              {APP_TAGLINE}
            </p>
            <div className="flex items-center gap-3 mt-5">
              {socialLinks.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                  aria-label={s.label}
                >
                  <s.icon className="w-3.5 h-3.5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => {
                if (link.type === "anchor") {
                  return (
                    <li key={link.href}>
                      <Link
                        href={pathname === "/" ? link.href : "/" + link.href}
                        onClick={(e) => {
                          if (pathname === "/") {
                            e.preventDefault();
                            document
                              .querySelector(link.href)
                              ?.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                        className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Product info */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
              Product
            </h3>
            <ul className="space-y-2.5">
              {["Changelog", "Documentation", "API Reference", "Status"].map(
                (item) => (
                  <li key={item}>
                    <span className="text-sm text-slate-400 cursor-default">
                      {item}
                    </span>
                  </li>
                )
              )}
            </ul>
            <div className="mt-6 px-3 py-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-300 font-medium">
                All systems operational
              </span>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={fadeInUp}
          className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="text-xs text-slate-500">
            &copy; 2024 {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Built for modern SaaS teams.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}