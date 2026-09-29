"use client";

import React, { useState } from "react";
import {
  TrendingDown,
  Star,
  ExternalLink,
  Search,
  Plus,
  BarChart2,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  ArrowRightLeft,
  Sparkles,
  Tag,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useShoppingStore } from "@/stores/shopping-store";
import { ProductData } from "@/types/api";

const mockPriceHistory = [
  { date: "Aug 1", amazon: 29990, flipkart: 30990 },
  { date: "Aug 15", amazon: 28990, flipkart: 29990 },
  { date: "Sep 1", amazon: 28490, flipkart: 28990 },
  { date: "Sep 15", amazon: 27990, flipkart: 28490 },
  { date: "Sep 25", amazon: 26990, flipkart: 27999 },
];

export function ShoppingHelper() {
  const { products, addProduct } = useShoppingStore();
  const [urlInput, setUrlInput] = useState("");
  const [activeTab, setActiveTab] = useState<"compare" | "history" | "reviews">("compare");
  const [isScraping, setIsScraping] = useState(false);

  const handleScrape = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setIsScraping(true);
    setTimeout(() => {
      const isAmazon = urlInput.includes("amazon");
      const p: ProductData = {
        id: `prod-${Date.now()}`, url: urlInput,
        title: isAmazon ? "Apple AirPods Pro (2nd Gen) USB-C" : "Apple AirPods Pro (2nd Gen) ANC",
        current_price: 20999, original_price: 24900, currency: "INR",
        rating: 4.8, review_count: 14200,
        seller: isAmazon ? "Appario Retail" : "SuperComNet",
        availability: "In Stock", images: [],
        specifications: { "Audio": "Adaptive Audio", "Chip": "H2", "Battery": "6 hours", "Charging": "USB-C" },
        source: isAmazon ? "amazon_in" : "flipkart", scraped_at: new Date().toISOString(),
      };
      addProduct(p); setUrlInput(""); setIsScraping(false);
    }, 1200);
  };

  const tabs = [
    { id: "compare" as const, label: "Compare", icon: ArrowRightLeft },
    { id: "history" as const, label: "Price History", icon: BarChart2 },
    { id: "reviews" as const, label: "AI Reviews", icon: Sparkles },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight mb-1">Price Intelligence</h2>
        <p className="text-[12px]" style={{ color: "#6b6b76" }}>
          Track prices across Amazon, Flipkart · {products.length} tracked items
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleScrape} className="flex gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#3a3a44" }} />
          <input
            type="text" value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste product URL or search..."
            className="w-full pl-11 pr-4 py-3 rounded-xl text-[13px] focus:outline-none transition-all"
            style={{
              color: "#e8e8ed", background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          />
        </div>
        <button
          type="submit" disabled={isScraping || !urlInput.trim()}
          className="px-5 py-3 rounded-xl text-[13px] font-medium text-white flex items-center gap-2 shrink-0 disabled:opacity-30 transition-all cursor-pointer"
          style={{ background: "linear-gradient(135deg, #7c5cfc, #a78bfa)", boxShadow: "0 4px 16px -4px rgba(124,92,252,0.3)" }}
        >
          {isScraping ? (
            <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Scraping...</>
          ) : (
            <><Plus className="w-4 h-4" />Track</>
          )}
        </button>
      </form>

      {/* Tabs */}
      <div className="flex items-center gap-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        {tabs.map((t) => {
          const Icon = t.icon; const active = activeTab === t.id;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`relative flex items-center gap-1.5 px-3 py-2.5 text-[12px] font-medium transition-all ${active ? "text-white" : "hover:text-zinc-300"}`}
              style={active ? {} : { color: "#6b6b76" }}
            >
              <Icon className="w-3.5 h-3.5" />{t.label}
              {active && <div className="absolute bottom-0 left-2 right-2 h-[2px] rounded-t-full" style={{ background: "#7c5cfc" }} />}
            </button>
          );
        })}
      </div>

      {/* COMPARE */}
      {activeTab === "compare" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((item, idx) => {
            const savings = item.original_price ? item.original_price - item.current_price : 0;
            const pct = item.original_price ? Math.round((savings / item.original_price) * 100) : 0;
            return (
              <div key={item.id || idx} className="bento-tile p-5 cursor-default hover:translate-y-0 hover:scale-100">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider"
                      style={{
                        color: item.source.includes("amazon") ? "#fbbf24" : "#3b82f6",
                        background: item.source.includes("amazon") ? "rgba(251,191,36,0.08)" : "rgba(59,130,246,0.08)",
                        border: `1px solid ${item.source.includes("amazon") ? "rgba(251,191,36,0.15)" : "rgba(59,130,246,0.15)"}`,
                      }}
                    >
                      {item.source === "amazon_in" ? "Amazon" : "Flipkart"}
                    </span>
                    {pct > 0 && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 px-2 py-0.5 rounded-md"
                        style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
                        <TrendingDown className="w-3 h-3" />{pct}% off
                      </span>
                    )}
                  </div>
                  <h3 className="text-[14px] font-semibold text-white line-clamp-2 leading-snug mb-2">{item.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] mb-4" style={{ color: "#6b6b76" }}>
                    <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                      <Star className="w-3 h-3 fill-amber-400" />{item.rating}
                    </span>
                    ({item.review_count?.toLocaleString()}) · <span className="text-emerald-500">{item.availability}</span>
                  </div>
                  <div className="p-3 rounded-xl flex items-baseline justify-between mb-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.03)" }}>
                    <div>
                      <div className="text-[10px] font-medium" style={{ color: "#6b6b76" }}>Price</div>
                      <div className="text-xl font-bold text-white tracking-tight">₹{item.current_price.toLocaleString()}</div>
                    </div>
                    {item.original_price && (
                      <div className="text-right">
                        <div className="text-[10px]" style={{ color: "#6b6b76" }}>MRP</div>
                        <div className="text-sm line-through" style={{ color: "#3a3a44" }}>₹{item.original_price.toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mb-3">
                    {Object.entries(item.specifications).map(([k, v]) => (
                      <div key={k} className="px-2.5 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.03)" }}>
                        <span className="text-[9px] uppercase tracking-wider block" style={{ color: "#3a3a44" }}>{k}</span>
                        <span className="text-[11px] font-medium text-white truncate block">{v}</span>
                      </div>
                    ))}
                  </div>
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                    className="w-full py-2 rounded-xl text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors"
                    style={{ color: "#6b6b76", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    Visit Store <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* HISTORY */}
      {activeTab === "history" && (
        <div className="bento-tile p-6 cursor-default hover:translate-y-0 hover:scale-100">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[14px] font-semibold text-white">Sony WH-1000XM5 — 60 Day Trend</h3>
                <p className="text-[11px] mt-0.5" style={{ color: "#6b6b76" }}>Daily price snapshots</p>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /><span style={{ color: "#6b6b76" }}>Amazon</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: "#7c5cfc" }} /><span style={{ color: "#6b6b76" }}>Flipkart</span></div>
              </div>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockPriceHistory}>
                  <defs>
                    <linearGradient id="amz" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.12} /><stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c5cfc" stopOpacity={0.12} /><stop offset="100%" stopColor="#7c5cfc" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="date" stroke="#3a3a44" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#3a3a44" fontSize={11} tickLine={false} axisLine={false} domain={["dataMin - 1000", "dataMax + 1000"]} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: "#0c0c0f", borderColor: "#1a1a22", borderRadius: "10px", color: "#e8e8ed", fontSize: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }} formatter={(v) => [`₹${Number(v || 0).toLocaleString()}`, "Price"]} />
                  <Area type="monotone" dataKey="amazon" stroke="#fbbf24" strokeWidth={2} fill="url(#amz)" dot={{ r: 3, fill: "#fbbf24", strokeWidth: 0 }} activeDot={{ r: 5, stroke: "#fbbf24", fill: "#0c0c0f", strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="flipkart" stroke="#7c5cfc" strokeWidth={2} fill="url(#fk)" dot={{ r: 3, fill: "#7c5cfc", strokeWidth: 0 }} activeDot={{ r: 5, stroke: "#7c5cfc", fill: "#0c0c0f", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-3 mt-4">
              {[{ label: "Low", value: "₹26,990", c: "text-emerald-400" }, { label: "Avg", value: "₹28,290", c: "text-white" }, { label: "High", value: "₹30,990", c: "text-rose-400" }].map((p) => (
                <div key={p.label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px]" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.03)" }}>
                  <Tag className="w-3 h-3" style={{ color: "#3a3a44" }} /><span style={{ color: "#6b6b76" }}>{p.label}:</span><span className={`font-semibold ${p.c}`}>{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REVIEWS */}
      {activeTab === "reviews" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bento-tile p-5 cursor-default hover:translate-y-0 hover:scale-100">
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[13px]"><ThumbsUp className="w-4 h-4" />Strengths</div>
              {["Industry-leading ANC mutes airplane noise and chatter.", "30+ hour battery with 3-min fast charge.", "8-microphone call clarity praised for Zoom."].map((t, i) => (
                <div key={i} className="flex items-start gap-2 text-[12px] leading-relaxed" style={{ color: "#8b8b96" }}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />{t}
                </div>
              ))}
            </div>
          </div>
          <div className="bento-tile p-5 cursor-default hover:translate-y-0 hover:scale-100">
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-[13px]"><ThumbsDown className="w-4 h-4" />Considerations</div>
              {["Headband doesn't fold flat — larger carry profile.", "Premium price without bundled adapter."].map((t, i) => (
                <div key={i} className="flex items-start gap-2 text-[12px] leading-relaxed" style={{ color: "#8b8b96" }}>
                  <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[8px] text-rose-400" style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.15)" }}>✕</span>{t}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
