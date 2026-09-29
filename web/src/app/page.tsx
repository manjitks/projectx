"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare, Mic, ShoppingBag, Activity, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-32">
      {/* ── Brand Header ── */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-xl"
             style={{ background: "var(--accent)" }}>
          <Sparkles className="w-8 h-8" style={{ color: "var(--bg-base)" }} />
        </div>
        <h1 className="text-6xl font-extrabold tracking-tight mb-4" style={{ color: "var(--text-primary)" }}>
          Your AI, unified.
        </h1>
        <p className="text-xl max-w-2xl" style={{ color: "var(--text-muted)" }}>
          A truly elegant, life-like workspace. Chat, voice, price intelligence, and system health flowing seamlessly together.
        </p>
      </div>

      {/* ── Bento Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* FOUNDRY (FLAGSHIP) */}
        <Link href="/foundry" className="bento-tile col-span-1 lg:col-span-4 p-8 flex flex-col sm:flex-row items-center justify-between gap-8 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 -mr-20 -mt-20 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none" style={{ background: "var(--accent)" }} />

          <div className="relative z-10 flex-1">
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full mb-4 font-bold text-[10px] tracking-widest uppercase shadow-sm" style={{ background: "var(--accent-glow)", color: "var(--accent)", border: "1px solid var(--accent)" }}>
              Flagship Workspace
            </div>
            <h2 className="text-4xl font-extrabold mb-2 tracking-tight" style={{ color: "var(--text-primary)" }}>The Foundry</h2>
            <p className="text-lg max-w-lg font-medium" style={{ color: "var(--text-muted)" }}>Drop raw ideas, PDFs, and links into the Hopper. Watch the AI autonomously synthesize them into a structured document.</p>
          </div>

          <div className="relative z-10 flex-shrink-0 flex items-center gap-4 p-5 rounded-2xl border backdrop-blur-md shadow-xl transition-transform group-hover:scale-105" style={{ background: "var(--tile-border)", borderColor: "var(--tile-border)" }}>
            <div className="flex flex-col gap-2 w-32 opacity-70">
              <div className="h-2 w-full rounded-full" style={{ background: "var(--text-muted)" }} />
              <div className="h-2 w-3/4 rounded-full" style={{ background: "var(--text-muted)" }} />
              <div className="h-2 w-5/6 rounded-full" style={{ background: "var(--text-muted)" }} />
            </div>
            <Sparkles className="w-6 h-6 animate-pulse" style={{ color: "var(--accent)" }} />
            <div className="flex flex-col gap-2 w-32">
              <div className="h-2 w-full rounded-full" style={{ background: "var(--accent)" }} />
              <div className="h-2 w-full rounded-full" style={{ background: "var(--accent)" }} />
              <div className="h-2 w-3/4 rounded-full" style={{ background: "var(--accent)" }} />
            </div>
          </div>
        </Link>

        {/* CHAT */}
        <Link href="/chat" className="bento-tile col-span-1 lg:col-span-2 row-span-2 p-8 min-h-[300px] flex flex-col justify-between group">
          <div>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-transform group-hover:scale-110" style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>AI Chat</h2>
            <p className="text-lg" style={{ color: "var(--text-muted)" }}>Talk to local and cloud models in real time.</p>
          </div>
          <div className="mt-8 p-4 rounded-xl border backdrop-blur-md" style={{ background: "var(--tile-border)", borderColor: "var(--tile-border)" }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--accent)" }}><Sparkles className="w-4 h-4" style={{ color: "var(--bg-base)" }}/></div>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Hello! How can I help you build today?</p>
            </div>
          </div>
        </Link>

        {/* VOICE */}
        <Link href="/voice" className="bento-tile col-span-1 lg:col-span-2 p-8 flex items-center justify-between group">
          <div>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-transform group-hover:scale-110" style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Voice</h3>
            <p style={{ color: "var(--text-muted)" }}>Speech to text intelligence.</p>
          </div>
          <div className="flex gap-1 items-center h-12">
            {[1, 0.5, 0.8, 0.3, 1].map((h, i) => (
              <div key={i} className="w-2 rounded-full transition-all group-hover:scale-y-110" style={{ height: `${h * 40}px`, background: "var(--accent)" }} />
            ))}
          </div>
        </Link>

        {/* SHOPPING */}
        <Link href="/shopping" className="bento-tile col-span-1 lg:col-span-2 p-8 flex flex-col justify-between group">
          <div>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-transform group-hover:scale-110" style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Shopping</h3>
            <p style={{ color: "var(--text-muted)" }}>Price intelligence & AI reviews.</p>
          </div>
          <div className="mt-6 flex justify-between items-end">
            <div className="text-4xl font-extrabold" style={{ color: "var(--accent)" }}>-15%</div>
            <div className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>Amazon dropped</div>
          </div>
        </Link>

        {/* DASHBOARD */}
        <Link href="/dashboard" className="bento-tile col-span-1 lg:col-span-4 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 group">
          <div className="flex items-center gap-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl shadow-inner transition-transform group-hover:scale-110" style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Platform Health</h3>
              <p className="text-lg" style={{ color: "var(--text-muted)" }}>All systems operational.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             {[1, 1, 1, 1, 1].map((_, i) => <div key={i} className="w-8 h-8 rounded-lg shadow-lg" style={{ background: "var(--accent)", opacity: 0.8 }} />)}
          </div>
        </Link>

        {/* ── UPCOMING FLAGSHIP FEATURES ── */}

        {/* LENS (Data) */}
        <Link href="/lens" className="bento-tile col-span-1 lg:col-span-2 p-8 flex flex-col justify-between group">
          <div>
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full mb-4 font-bold text-[10px] tracking-widest uppercase" style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
              New
            </div>
            <h3 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>The Lens</h3>
            <p style={{ color: "var(--text-muted)" }}>Autonomous Data Analyst.</p>
          </div>
          <div className="mt-6 flex justify-between items-end opacity-50">
            <p className="text-[12px] font-bold" style={{ color: "var(--text-primary)" }}>Drop CSV → Get Insights</p>
          </div>
        </Link>

        {/* MULTIPLIER (Content) */}
        <Link href="/multiplier" className="bento-tile col-span-1 lg:col-span-2 p-8 flex flex-col justify-between group">
          <div>
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full mb-4 font-bold text-[10px] tracking-widest uppercase" style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
              New
            </div>
            <h3 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>The Multiplier</h3>
            <p style={{ color: "var(--text-muted)" }}>AI Content & Podcasting Engine.</p>
          </div>
          <div className="mt-6 flex justify-between items-end opacity-50">
            <p className="text-[12px] font-bold" style={{ color: "var(--text-primary)" }}>1 Video → 10 Posts</p>
          </div>
        </Link>

        {/* SCOUT (SDR) */}
        <Link href="/scout" className="bento-tile col-span-1 lg:col-span-2 p-8 flex flex-col justify-between group">
          <div>
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full mb-4 font-bold text-[10px] tracking-widest uppercase" style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
              New
            </div>
            <h3 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>The Scout</h3>
            <p style={{ color: "var(--text-muted)" }}>Hyper-personalized SDR Agent.</p>
          </div>
          <div className="mt-6 flex justify-between items-end opacity-50">
             <p className="text-[12px] font-bold" style={{ color: "var(--text-primary)" }}>Scrape URL → Write Pitch</p>
          </div>
        </Link>

        {/* ARCHITECT (Wireframes) */}
        <Link href="/architect" className="bento-tile col-span-1 lg:col-span-2 p-8 flex flex-col justify-between group">
          <div>
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full mb-4 font-bold text-[10px] tracking-widest uppercase" style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
              New
            </div>
            <h3 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>The Architect</h3>
            <p style={{ color: "var(--text-muted)" }}>Interactive UI Builder.</p>
          </div>
          <div className="mt-6 flex justify-between items-end opacity-50">
             <p className="text-[12px] font-bold" style={{ color: "var(--text-primary)" }}>Prompt → React App</p>
          </div>
        </Link>

      </div>
    </div>
  );
}
