"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "@/lib/data";
import { APP_NAME } from "@/lib/data";
import { Menu, X, Activity, Bell, User } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_32px_rgba(99,102,241,0.08)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-[0_0_16px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_24px_rgba(99,102,241,0.7)] transition-all duration-300">
              <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[#F8FAFC] font-semibold text-lg tracking-tight">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              if (link.type === "anchor") {
                return (
                  <Link
                    key={link.href}
                    href={pathname === "/" ? link.href : "/" + link.href}
                    onClick={(e) => {
                      if (pathname === "/") {
                        e.preventDefault();
                        document
                          .querySelector(link.href)
                          ?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg bg-white/10 border border-white/10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-white/10 border border-white/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
              aria-label="User profile"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm text-slate-300 font-medium">Admin</span>
            </motion.button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden overflow-hidden bg-[#0F172A]/95 backdrop-blur-xl border-b border-white/10"
          >
            <nav className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                if (link.type === "anchor") {
                  return (
                    <Link
                      key={link.href}
                      href={pathname === "/" ? link.href : "/" + link.href}
                      onClick={(e) => {
                        if (pathname === "/") {
                          e.preventDefault();
                          document
                            .querySelector(link.href)
                            ?.scrollIntoView({ behavior: "smooth" });
                        }
                        setMobileOpen(false);
                      }}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-white/10 text-white border border-white/10"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-white/10 text-white border border-white/10"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-slate-400">admin@pulse.io</p>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}