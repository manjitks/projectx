"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";

const themes = [
  { id: "cosmic", name: "Cosmic", color: "#c33764" },
  { id: "emerald", name: "Emerald", color: "#10b981" },
  { id: "nordic", name: "Nordic", color: "#89b0ae" },
  { id: "monochrome", name: "Monochrome", color: "#ff4500" },
];

export function ThemeSelector() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("projectx-theme");
      if (saved && themes.some((t) => t.id === saved)) return saved;
    }
    return "cosmic";
  });
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Apply theme to DOM and persist on every change
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("projectx-theme", theme);
  }, [theme]);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setThemeMenuOpen(false);
      }
    }
    if (themeMenuOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [themeMenuOpen]);

  return (
    <div className="fixed top-6 right-6 z-50" ref={menuRef}>
      <button
        onClick={() => setThemeMenuOpen(!themeMenuOpen)}
        className="p-3 rounded-2xl bento-tile flex items-center justify-center hover:scale-105 transition-transform border-none"
      >
        <Sparkles className="w-5 h-5" style={{ color: "var(--accent)" }} />
      </button>

      {themeMenuOpen && (
        <div className="absolute right-0 mt-3 p-2 rounded-2xl bento-tile flex flex-col gap-1 w-48 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
            Select Theme
          </div>
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTheme(t.id); setThemeMenuOpen(false); }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all"
              style={{
                background: theme === t.id ? "var(--tile-border)" : "transparent",
                color: "var(--text-primary)"
              }}
            >
              <span className="w-4 h-4 rounded-full shadow-lg" style={{ background: t.color }} />
              <span className="text-sm font-semibold">{t.name}</span>
              {theme === t.id && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
