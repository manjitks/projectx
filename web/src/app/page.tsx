"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Mic,
  ShoppingBag,
  Activity,
  Home,
  ArrowLeft,
  Sparkles,
  Zap,
  TrendingDown,
  Radio,
} from "lucide-react";
import { ChatContainer } from "@/components/chat/chat-container";
import { VoiceAssistant } from "@/components/voice/voice-assistant";
import { ShoppingHelper } from "@/components/shopping/shopping-helper";
import { SystemDashboard } from "@/components/dashboard/system-dashboard";

type View = "hub" | "chat" | "voice" | "shopping" | "dashboard";

const dockItems = [
  { id: "hub" as View, icon: Home, label: "Hub" },
  { id: "chat" as View, icon: MessageSquare, label: "Chat" },
  { id: "voice" as View, icon: Mic, label: "Voice" },
  { id: "shopping" as View, icon: ShoppingBag, label: "Shopping" },
  { id: "dashboard" as View, icon: Activity, label: "Dashboard" },
];

export default function HomePage() {
  const [activeView, setActiveView] = useState<View>("hub");

  return (
    <div className="relative min-h-screen" style={{ background: "#050507" }}>
      {/* ═══ ANIMATED GRADIENT MESH BACKDROP ═══ */}
      <div className="gradient-mesh" />
      <div className="gradient-mesh-accent" />

      {/* ═══ MAIN CONTENT ═══ */}
      {activeView === "hub" ? (
        <HubView onNavigate={setActiveView} />
      ) : (
        <div className="feature-page">
          {/* Back to hub */}
          <div className="px-6 pt-5">
            <button
              onClick={() => setActiveView("hub")}
              className="back-btn"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          </div>

          {activeView === "chat" && <ChatContainer />}
          {activeView === "voice" && <VoiceAssistant />}
          {activeView === "shopping" && <ShoppingHelper />}
          {activeView === "dashboard" && <SystemDashboard />}
        </div>
      )}

      {/* ═══ FLOATING DOCK ═══ */}
      <div className="floating-dock">
        {dockItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`dock-item ${activeView === item.id ? "active" : ""}`}
              aria-label={item.label}
            >
              <Icon className="w-5 h-5" />
              <span className="dock-tooltip">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════
   BENTO GRID HUB
   The signature landing view
   ═══════════════════════════ */

function HubView({ onNavigate }: { onNavigate: (view: View) => void }) {
  return (
    <div className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-24">
      {/* ── Brand Header ── */}
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #7c5cfc, #a78bfa, #c4b5fd)",
              boxShadow: "0 4px 20px -4px rgba(124, 92, 252, 0.4)",
            }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span
            className="text-[13px] font-medium px-2.5 py-0.5 rounded-full"
            style={{
              color: "#7c5cfc",
              background: "rgba(124, 92, 252, 0.08)",
              border: "1px solid rgba(124, 92, 252, 0.15)",
            }}
          >
            v0.1.0
          </span>
        </div>
        <h1
          className="text-5xl font-bold tracking-tight leading-[1.1] mb-3"
          style={{
            background: "linear-gradient(135deg, #fafafa 0%, #a1a1aa 50%, #fafafa 100%)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Your AI,<br />unified.
        </h1>
        <p className="text-lg leading-relaxed max-w-lg" style={{ color: "#6b6b76" }}>
          Chat, voice, price intelligence, and system health —
          all running through one modular platform.
        </p>
      </div>

      {/* ── Bento Grid ── */}
      <div className="grid grid-cols-4 grid-rows-3 gap-4" style={{ minHeight: 520 }}>
        {/* ━━ CHAT — Large tile (2x2) ━━ */}
        <div
          className="bento-tile col-span-2 row-span-2 p-7 flex flex-col justify-between"
          onClick={() => onNavigate("chat")}
        >
          {/* Decorative gradient corner */}
          <div
            className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
            style={{
              background: "radial-gradient(circle at top right, rgba(124, 92, 252, 0.1), transparent 70%)",
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(124, 92, 252, 0.1)",
                  border: "1px solid rgba(124, 92, 252, 0.2)",
                }}
              >
                <MessageSquare className="w-4.5 h-4.5 text-[#a78bfa]" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: "#6b6b76" }}>
                AI Chat
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-1.5">
              Talk to any model
            </h2>
            <p className="text-[13px] leading-relaxed" style={{ color: "#6b6b76" }}>
              Ollama local, GPT-4o cloud, or your own — stream responses in real time.
            </p>
          </div>

          {/* Mini chat preview */}
          <div className="relative z-10 space-y-3 mt-6">
            <div className="flex gap-2.5">
              <div className="w-6 h-6 rounded-lg flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)" }} />
              <div
                className="px-3.5 py-2.5 rounded-xl rounded-tl-sm text-[12.5px] max-w-[70%]"
                style={{ background: "rgba(255,255,255,0.04)", color: "#a1a1aa" }}
              >
                Explain quantum entanglement simply
              </div>
            </div>
            <div className="flex gap-2.5">
              <div
                className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center"
                style={{ background: "rgba(124, 92, 252, 0.15)" }}
              >
                <Sparkles className="w-3 h-3 text-[#a78bfa]" />
              </div>
              <div
                className="px-3.5 py-2.5 rounded-xl rounded-tl-sm text-[12.5px] max-w-[85%]"
                style={{ background: "rgba(124, 92, 252, 0.06)", color: "#c4b5fd" }}
              >
                Think of two coins that are magically linked — when you flip one and it lands heads, the other instantly lands tails...
              </div>
            </div>
          </div>
        </div>

        {/* ━━ VOICE — Tall tile (2x1, top-right) ━━ */}
        <div
          className="bento-tile col-span-2 row-span-1 p-6 flex items-center justify-between"
          onClick={() => onNavigate("voice")}
        >
          <div
            className="absolute bottom-0 left-0 w-40 h-40 pointer-events-none"
            style={{
              background: "radial-gradient(circle at bottom left, rgba(16, 185, 129, 0.08), transparent 70%)",
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                }}
              >
                <Mic className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: "#6b6b76" }}>
                Voice
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight mb-1">
              Speech to text
            </h3>
            <p className="text-[12px]" style={{ color: "#6b6b76" }}>
              Browser-native + Whisper server
            </p>
          </div>

          {/* Waveform visualization */}
          <div className="relative z-10 flex items-center gap-[3px] h-12">
            {[0.3, 0.7, 1, 0.5, 0.8, 1, 0.6, 0.9, 0.4, 0.7, 1, 0.5].map((d, i) => (
              <div
                key={i}
                className="wave-bar"
                style={{
                  height: `${d * 36}px`,
                  animationDelay: `${i * 0.08}s`,
                  opacity: 0.5 + d * 0.5,
                }}
              />
            ))}
          </div>
        </div>

        {/* ━━ SHOPPING — Wide tile (2x1, bottom-right) ━━ */}
        <div
          className="bento-tile col-span-2 row-span-2 p-6 flex flex-col justify-between"
          onClick={() => onNavigate("shopping")}
        >
          <div
            className="absolute top-0 left-0 w-56 h-56 pointer-events-none"
            style={{
              background: "radial-gradient(circle at top left, rgba(59, 130, 246, 0.06), transparent 70%)",
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(59, 130, 246, 0.1)",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                }}
              >
                <ShoppingBag className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: "#6b6b76" }}>
                Shopping
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mb-1">
              Price Intelligence
            </h3>
            <p className="text-[12px]" style={{ color: "#6b6b76" }}>
              Cross-platform comparison with AI review synthesis
            </p>
          </div>

          {/* Mini price comparison */}
          <div className="relative z-10 mt-4 space-y-2">
            {[
              { site: "Amazon", price: "₹26,990", drop: "-15%", color: "#fbbf24" },
              { site: "Flipkart", price: "₹27,999", drop: "-12%", color: "#3b82f6" },
            ].map((item) => (
              <div
                key={item.site}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: item.color }}
                  />
                  <span className="text-[12px] text-white font-medium">{item.site}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] text-white font-semibold">{item.price}</span>
                  <span
                    className="text-[10px] font-semibold flex items-center gap-0.5 px-1.5 py-0.5 rounded-md"
                    style={{
                      color: "#10b981",
                      background: "rgba(16,185,129,0.08)",
                    }}
                  >
                    <TrendingDown className="w-3 h-3" />
                    {item.drop}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ━━ DASHBOARD — Bottom row, wide (4x1) ━━ */}
        <div
          className="bento-tile col-span-2 row-span-1 p-5 flex items-center justify-between"
          onClick={() => onNavigate("dashboard")}
        >
          <div className="relative z-10 flex items-center gap-4">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(245, 158, 11, 0.1)",
                border: "1px solid rgba(245, 158, 11, 0.2)",
              }}
            >
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Platform Health
              </h3>
              <p className="text-[11px]" style={{ color: "#6b6b76" }}>
                6 layers verified · 103 tests passing
              </p>
            </div>
          </div>

          {/* Mini health bars */}
          <div className="relative z-10 flex items-center gap-1.5">
            {[1, 1, 1, 1, 1, 1].map((_, i) => (
              <div
                key={i}
                className="w-6 h-4 rounded-[3px]"
                style={{
                  background: "rgba(16, 185, 129, 0.2)",
                  border: "1px solid rgba(16, 185, 129, 0.15)",
                }}
              />
            ))}
            <span className="text-[10px] font-semibold text-emerald-400 ml-2">
              All green
            </span>
          </div>
        </div>
      </div>

      {/* ── Quick stat pills ── */}
      <div className="flex items-center gap-3 mt-8">
        {[
          { icon: Zap, label: "Ollama connected", color: "#10b981" },
          { icon: Radio, label: "FastAPI live", color: "#7c5cfc" },
        ].map((pill) => (
          <div
            key={pill.label}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium"
            style={{
              color: pill.color,
              background: `${pill.color}10`,
              border: `1px solid ${pill.color}20`,
            }}
          >
            <pill.icon className="w-3 h-3" />
            {pill.label}
          </div>
        ))}
      </div>
    </div>
  );
}
