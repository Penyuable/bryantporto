"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

type NavLink = { href: string; label: string };

type ClayNavProps = {
  brand?: string;
  links: NavLink[];
  /** Hide links below md breakpoint (used on the home page) */
  collapseOnMobile?: boolean;
};

export default function ClayNav({ brand = "SB.", links, collapseOnMobile = false }: ClayNavProps) {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className="sticky top-4 z-50 px-4 print:hidden"
    >
      <div className="clay max-w-5xl mx-auto bg-surface/75 backdrop-blur-md px-5 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="clay-btn bg-violet-300 text-violet-900 w-12 h-12 flex items-center justify-center text-lg font-black tracking-tight"
        >
          {brand}
        </Link>
        <div className="flex items-center gap-3">
          <div className={`${collapseOnMobile ? "hidden md:flex" : "flex"} gap-2 font-bold`}>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="clay-btn bg-surface/70 px-4 py-2 text-slate-600 hover:text-violet-700"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
}
