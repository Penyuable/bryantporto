"use client";
import React, { useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "theme";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

const getIsDark = () => document.documentElement.classList.contains("dark");

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getIsDark, () => false);

  const toggle = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // storage unavailable (private mode) — theme still applies for this visit
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="clay-btn rounded-full! bg-amber-200 w-12 h-12 flex items-center justify-center text-xl overflow-hidden shrink-0"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ y: 20, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -20, rotate: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
        >
          {isDark ? "🌙" : "☀️"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
