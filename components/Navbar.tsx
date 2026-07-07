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
          ? "bg-[#FAF7F2]/90 backdrop-blur-xl border-b border-black/8 shadow-[0_4px_32px_rgba(99,102,241,0.10)]"
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
            <span className="text-[#1E1B18] font-semibold text-lg tracking-tight">
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
                        ? "text-[#1E1B18]"
                        : "text-[#6B6560] hover:text-[#1E1B18]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg bg-black/6 border border-black/8"
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
                      ? "text-[#1E1B18]"
                      : "text-[#6B6560] hover:text-[#1E1B18]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-black/6 border border-black/8"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-indigo-500" />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Bell */}
            <button
              type="button"
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-[#6B6560] hover:text-[#1E1B18] bg-black/5 border border-black/8 hover:bg-black/10 transition-all duration-200"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
            </button>

            {/* Avatar */}
            <button
              type="button"
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white flex items-center justify-center font-semibold text-sm shadow-[0_0_12px_rgba(99,102,241,0.4)] hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-all duration-200"
              aria-label="User menu"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-[#6B6560] hover:text-[#1E1B18] transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-[#FAF7F2]/98 backdrop-blur-xl border-b border-black/8"
          >
            <nav className="px-4 py-3 flex flex-col gap-1">
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
                      className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? "text-[#1E1B18] bg-black/8"
                          : "text-[#6B6560] hover:text-[#1E1B18] hover:bg-black/5"
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
                    className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? "text-[#1E1B18] bg-black/8"
                        : "text-[#6B6560] hover:text-[#1E1B18] hover:bg-black/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
