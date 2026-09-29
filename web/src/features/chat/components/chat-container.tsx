"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Settings, Sparkles, Loader2, Bot, User, BrainCircuit } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChatStore } from "../store";
import { apiClient } from "@/lib/api-client";

export function ChatContainer() {
  const { messages, addMessage, clearMessages, selectedModel, setSelectedModel } = useChatStore();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput("");
    addMessage({ role: "user", content: userText });
    setIsTyping(true);

    try {
      const response = await apiClient.generateText({ prompt: userText, model: selectedModel });
      addMessage({ role: "assistant", content: response.content });
    } catch (error) {
      addMessage({ role: "assistant", content: "**Error:** Failed to reach model." });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto px-6">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between pb-6 mb-6" style={{ borderBottom: "1px solid var(--tile-border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Chat Intelligence</h1>
            <p className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>Running on ProjectX Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="text-[12px] font-medium px-3 py-1.5 rounded-lg outline-none cursor-pointer shadow-sm transition-all"
            style={{
              background: "var(--tile-bg)",
              border: "1px solid var(--tile-border)",
              color: "var(--text-primary)"
            }}
          >
            <option value="llama3.2">llama3.2</option>
            <option value="mistral">mistral</option>
            <option value="qwen2.5">qwen2.5</option>
          </select>
          <button
            onClick={clearMessages}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── MESSAGES ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 space-y-8 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center shadow-2xl" style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
              <BrainCircuit className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>How can I assist you?</h2>
            <p className="text-[14px] max-w-sm mb-8" style={{ color: "var(--text-muted)" }}>
              Ask anything. I can write code, analyze data, or help you brainstorm.
            </p>
            <div className="flex flex-wrap justify-center gap-3 max-w-lg">
              {["Explain quantum computing", "Write a Python script", "Summarize latest AI news"].map((t) => (
                <button
                  key={t}
                  onClick={() => setInput(t)}
                  className="px-4 py-2 rounded-xl text-[12px] font-medium transition-transform hover:scale-105"
                  style={{ background: "var(--tile-bg)", border: "1px solid var(--tile-border)", color: "var(--text-primary)" }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className="flex gap-4 group">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                style={{
                  background: m.role === "assistant" ? "var(--accent)" : "var(--tile-bg)",
                  color: m.role === "assistant" ? "var(--bg-base)" : "var(--text-muted)",
                  border: m.role === "user" ? "1px solid var(--tile-border)" : "none"
                }}
              >
                {m.role === "assistant" ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-bold" style={{ color: "var(--text-primary)" }}>
                    {m.role === "assistant" ? selectedModel : "You"}
                  </span>
                </div>
                <div className="prose-chat">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm" style={{ background: "var(--accent)", color: "var(--bg-base)" }}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="pt-2 flex gap-1">
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--accent)" }} />
              <div className="w-2 h-2 rounded-full animate-bounce delay-100" style={{ background: "var(--accent)" }} />
              <div className="w-2 h-2 rounded-full animate-bounce delay-200" style={{ background: "var(--accent)" }} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* ── INPUT ── */}
      <div className="pt-6 pb-2">
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
          <div
            className="flex-1 rounded-2xl p-2 pl-4 pr-14 shadow-lg transition-all focus-within:shadow-xl"
            style={{
              background: "var(--tile-bg)",
              border: "1px solid var(--tile-border)",
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Message..."
              className="w-full bg-transparent outline-none resize-none max-h-32 text-[14px] pt-1"
              style={{ color: "var(--text-primary)" }}
              rows={1}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-4 bottom-4 p-2 rounded-xl transition-all disabled:opacity-30 disabled:hover:scale-100 hover:scale-110 shadow-md"
              style={{ background: "var(--accent)", color: "var(--bg-base)" }}
            >
              {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
            </button>
          </div>
        </form>
        <div className="text-center mt-3 text-[10px]" style={{ color: "var(--text-muted)" }}>
          ProjectX AI can make mistakes. Consider verifying important information.
        </div>
      </div>
    </div>
  );
}
