"use client";

import React from "react";
import { Moon, Sun, Server } from "lucide-react";
import { useUiStore } from "@/stores/ui-store";
import { useChatStore } from "@/stores/chat-store";
import { useTheme } from "next-themes";

const pageTitles: Record<string, string> = {
  chat: "Chat",
  voice: "Voice",
  shopping: "Shopping",
  dashboard: "Dashboard",
};

const pageDescriptions: Record<string, string> = {
  chat: "Converse with local & cloud AI models",
  voice: "Real-time speech to text",
  shopping: "Cross-platform price intelligence",
  dashboard: "System health & architecture",
};

export function Topbar() {
  const { isSidebarOpen, activeTab } = useUiStore();
  const { selectedModel, setSelectedModel, selectedProvider } = useChatStore();
  const { theme, setTheme } = useTheme();

  return (
    <header
      id="main-topbar"
      className={`fixed top-0 right-0 z-30 h-14 flex items-center justify-between px-5 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
        isSidebarOpen ? "left-[260px]" : "left-[72px]"
      }`}
      style={{
        background: "rgba(9, 9, 11, 0.7)",
        backdropFilter: "blur(16px) saturate(120%)",
        WebkitBackdropFilter: "blur(16px) saturate(120%)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Left — Page title */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-[15px] font-semibold text-white tracking-tight leading-tight">
            {pageTitles[activeTab]}
          </h1>
          <p className="text-[11px] text-zinc-500 leading-tight">
            {pageDescriptions[activeTab]}
          </p>
        </div>
      </div>

      {/* Right — Controls */}
      <div className="flex items-center gap-2">
        {/* Model selector */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Server className="w-3 h-3 text-indigo-400" />
          <span className="text-zinc-500 capitalize">{selectedProvider}</span>
          <span className="text-zinc-700">/</span>
          <select
            id="topbar-model-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-transparent text-zinc-300 font-medium text-xs focus:outline-none cursor-pointer"
          >
            <option value="llama3.2" className="bg-zinc-900">
              llama3.2
            </option>
            <option value="mistral" className="bg-zinc-900">
              mistral:7b
            </option>
            <option value="qwen2.5:coder" className="bg-zinc-900">
              qwen2.5:coder
            </option>
            <option value="phi3:mini" className="bg-zinc-900">
              phi3:mini
            </option>
            <option value="gpt-4o" className="bg-zinc-900">
              gpt-4o
            </option>
          </select>
        </div>

        {/* Theme toggle */}
        <button
          id="btn-theme-toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
}
