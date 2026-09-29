"use client";

import React, { useState } from "react";
import { Plus, Link as LinkIcon, FileText, Loader2, Sparkles, Send, LayoutTemplate, MoreHorizontal, ArrowRight, BrainCircuit } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useFoundryStore } from "../store";

export function FoundryWorkspace() {
  const {
    goal, setGoal,
    hopperItems, addHopperItem, removeHopperItem,
    canvasContent, setCanvasContent,
    isSynthesizing, setIsSynthesizing
  } = useFoundryStore();

  const [inputVal, setInputVal] = useState("");
  const [inputType, setInputType] = useState<"text" | "url">("text");

  const handleAddHopper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    addHopperItem({ type: inputType, content: inputVal });
    setInputVal("");
  };

  const simulateSynthesis = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setCanvasContent(
        `# ${goal || "Untitled Synthesis"}\n\n` +
        `Based on the context provided, here is the initial synthesis. The AI engine actively reads the Hopper items to continuously refine this document.\n\n` +
        `### Strategic Overview\n` +
        `The market landscape indicates a strong shift towards agentic workflows. By analyzing the provided inputs, we can identify three core pillars for the strategy:\n\n` +
        `1. **Continuous Context Integration:** Unlike linear chat, spatial reasoning allows persistent data anchoring.\n` +
        `2. **Multimodal Ingestion:** Text, URLs, and Voice all map to a single semantic space.\n` +
        `3. **Autonomous Drafting:** The engine writes while the user curates.\n\n` +
        `---\n*Note: This is a simulated draft. The actual SSE pipeline is being wired.*`
      );
      setIsSynthesizing(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 top-[0px] z-20 flex bg-transparent pb-[80px]" style={{ paddingTop: "80px" }}>

      {/* ── LEFT PANE: THE HOPPER (Context Sidebar) ── */}
      <div
        className="w-[320px] ml-6 mb-6 flex flex-col rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl transition-all"
        style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--tile-border)" }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--tile-border)" }}>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Context Hopper</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: "var(--tile-border)", color: "var(--text-muted)" }}>
            {hopperItems.length}
          </span>
        </div>

        {/* Goal Input (Pinned Top) */}
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--tile-border)", background: "rgba(255,255,255,0.02)" }}>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Define synthesis goal..."
            className="w-full bg-transparent outline-none resize-none text-[14px] font-medium placeholder-opacity-40 leading-relaxed"
            style={{ color: "var(--text-primary)" }}
            rows={2}
          />
        </div>

        {/* Hopper Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
          {hopperItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-40">
              <LayoutTemplate className="w-8 h-8 mb-2" style={{ color: "var(--text-muted)" }} />
              <p className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>No context added.</p>
            </div>
          ) : (
            hopperItems.map((item) => (
              <div
                key={item.id}
                className="group relative px-3 py-2.5 rounded-lg flex gap-3 transition-colors hover:bg-black/20 dark:hover:bg-white/5"
              >
                <div className="mt-0.5">
                  {item.type === "url" ? <LinkIcon className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} /> : <FileText className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium truncate" style={{ color: "var(--text-primary)" }}>{item.content}</p>
                  <p className="text-[10px] font-medium mt-0.5" style={{ color: "var(--text-dim)" }}>
                    {item.type.toUpperCase()} · Added just now
                  </p>
                </div>
                <button
                  onClick={() => removeHopperItem(item.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-rose-500/20 text-rose-500 transition-all"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {/* Input Bar (Pinned Bottom) */}
        <div className="p-3 border-t bg-black/10 dark:bg-black/40 backdrop-blur-md" style={{ borderColor: "var(--tile-border)" }}>
          <form onSubmit={handleAddHopper} className="relative flex items-center">
            <button
              type="button"
              onClick={() => setInputType(inputType === "text" ? "url" : "text")}
              className="absolute left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md transition-all hover:bg-black/20 dark:hover:bg-white/10"
              style={{ color: "var(--text-muted)" }}
            >
              {inputType}
            </button>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Paste data..."
              className="w-full pl-16 pr-10 py-2.5 rounded-lg text-[13px] font-medium outline-none transition-all focus:ring-1 focus:ring-opacity-50"
              style={{ background: "var(--tile-bg)", border: "1px solid var(--tile-border)", color: "var(--text-primary)" }}
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="absolute right-2 p-1.5 rounded-md transition-all disabled:opacity-30 hover:scale-105"
              style={{ background: "var(--text-primary)", color: "var(--bg-base)" }}
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* ── RIGHT PANE: THE CANVAS (Editor) ── */}
      <div className="flex-1 flex flex-col mx-6 mb-6 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-3xl transition-all relative"
           style={{ background: "var(--tile-bg)", border: "1px solid var(--tile-border)" }}>

        {/* Canvas Header */}
        <div className="h-14 border-b flex items-center justify-between px-6" style={{ borderColor: "var(--tile-border)" }}>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: isSynthesizing ? "var(--accent)" : "var(--text-dim)" }} />
            <span className="text-[13px] font-semibold" style={{ color: "var(--text-muted)" }}>
              {isSynthesizing ? "Engine synthesizing..." : "Canvas ready"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <MoreHorizontal className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            </button>
            <button
              onClick={simulateSynthesis}
              disabled={isSynthesizing || !goal}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all shadow-sm disabled:opacity-50 hover:opacity-90"
              style={{ background: "var(--text-primary)", color: "var(--bg-base)" }}
            >
              {isSynthesizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {isSynthesizing ? "Generating" : "Synthesize"}
            </button>
          </div>
        </div>

        {/* Canvas Content Area */}
        <div className="flex-1 overflow-y-auto px-12 py-12 flex justify-center scrollbar-hide">
          <div className="w-full max-w-[700px]">
            {isSynthesizing && !canvasContent.includes("Strategic Overview") ? (
              <div className="space-y-6 animate-pulse opacity-40">
                <div className="h-10 w-3/4 rounded-lg" style={{ background: "var(--tile-border)" }} />
                <div className="h-4 w-full rounded-md" style={{ background: "var(--tile-border)" }} />
                <div className="h-4 w-5/6 rounded-md" style={{ background: "var(--tile-border)" }} />
                <div className="h-4 w-4/6 rounded-md" style={{ background: "var(--tile-border)" }} />
              </div>
            ) : (
              <div className="prose-chat prose-lg prose-headings:font-bold prose-p:leading-relaxed" style={{ color: "var(--text-primary)" }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{canvasContent}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
