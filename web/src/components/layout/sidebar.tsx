"use client";

import React from "react";
import {
  MessageSquare,
  Mic,
  ShoppingBag,
  Activity,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Command,
  Settings,
} from "lucide-react";
import { useUiStore } from "@/stores/ui-store";

const navItems = [
  {
    id: "chat" as const,
    label: "Chat",
    description: "AI models & streaming",
    icon: MessageSquare,
    shortcut: "⌘1",
  },
  {
    id: "voice" as const,
    label: "Voice",
    description: "Speech to text",
    icon: Mic,
    shortcut: "⌘2",
  },
  {
    id: "shopping" as const,
    label: "Shopping",
    description: "Price intelligence",
    icon: ShoppingBag,
    shortcut: "⌘3",
  },
  {
    id: "dashboard" as const,
    label: "Dashboard",
    description: "Platform health",
    icon: Activity,
    shortcut: "⌘4",
  },
];

export function Sidebar() {
  const { isSidebarOpen, activeTab, toggleSidebar, setActiveTab } = useUiStore();

  return (
    <aside
      id="main-sidebar"
      className={`fixed top-0 left-0 z-40 h-screen flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
        isSidebarOpen ? "w-[260px]" : "w-[72px]"
      }`}
      style={{
        background: "rgba(9, 9, 11, 0.92)",
        backdropFilter: "blur(24px) saturate(130%)",
        WebkitBackdropFilter: "blur(24px) saturate(130%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* ─── Brand Header ─── */}
      <div>
        <div className="h-14 px-4 flex items-center justify-between border-b border-white/[0.04]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)",
                boxShadow: "0 2px 8px -2px rgba(99, 102, 241, 0.4)",
              }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white tracking-tight leading-tight">
                  ProjectX
                </span>
                <span className="text-[10px] text-zinc-500 font-medium leading-tight">
                  AI Platform v0.1
                </span>
              </div>
            )}
          </div>
          <button
            id="btn-toggle-sidebar"
            onClick={toggleSidebar}
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors"
            aria-label="Toggle navigation sidebar"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* ─── Search / Command Pill ─── */}
        {isSidebarOpen && (
          <div className="px-3 pt-3">
            <button
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-zinc-500 hover:text-zinc-400 transition-colors"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <Command className="w-3.5 h-3.5" />
              <span className="flex-1 text-left">Search or command...</span>
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-zinc-600 font-mono">
                ⌘K
              </kbd>
            </button>
          </div>
        )}

        {/* ─── Navigation ─── */}
        <nav className="px-3 pt-3 space-y-0.5">
          {isSidebarOpen && (
            <div className="px-2 pb-1.5 text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.08em]">
              Workspace
            </div>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 rounded-lg transition-all group relative ${
                  isSidebarOpen ? "px-2.5 py-2" : "px-0 py-2 justify-center"
                } ${
                  isActive
                    ? "text-white"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                }`}
                style={
                  isActive
                    ? {
                        background: "rgba(99, 102, 241, 0.08)",
                        boxShadow: "inset 0 0 0 1px rgba(99, 102, 241, 0.15)",
                      }
                    : undefined
                }
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-r-full"
                    style={{ background: "#6366f1" }}
                  />
                )}
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-400"
                  }`}
                />
                {isSidebarOpen && (
                  <div className="flex items-center justify-between w-full min-w-0">
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-medium truncate leading-tight">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-zinc-600 truncate leading-tight">
                        {item.description}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-600 font-mono shrink-0 ml-2">
                      {item.shortcut}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ─── Bottom Section ─── */}
      <div className="p-3 space-y-2 border-t border-white/[0.04]">
        {/* Settings link */}
        <button
          className={`w-full flex items-center gap-3 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] transition-colors ${
            isSidebarOpen ? "px-2.5 py-2" : "px-0 py-2 justify-center"
          }`}
        >
          <Settings className="w-4 h-4 shrink-0" />
          {isSidebarOpen && (
            <span className="text-[13px] font-medium">Settings</span>
          )}
        </button>

        {/* Status indicator */}
        <div
          className={`flex items-center gap-2.5 p-2.5 rounded-lg ${
            !isSidebarOpen ? "justify-center" : ""
          }`}
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div className="relative flex items-center justify-center shrink-0">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-zinc-400 font-medium leading-tight">
                FastAPI Connected
              </span>
              <span className="text-[10px] text-emerald-500/80 leading-tight">
                All systems operational
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
