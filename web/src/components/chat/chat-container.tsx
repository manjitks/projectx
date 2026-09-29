"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  User,
  Copy,
  Check,
  StopCircle,
  Trash2,
  ChevronDown,
  Mic,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChatStore } from "@/stores/chat-store";
import { apiClient } from "@/lib/api-client";

export function ChatContainer() {
  const {
    messages,
    selectedModel,
    selectedProvider,
    isGenerating,
    addMessage,
    updateMessageContent,
    setIsGenerating,
    setSelectedModel,
    clearMessages,
  } = useChatStore();

  const [inputPrompt, setInputPrompt] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 180) + "px";
    }
  }, [inputPrompt]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async () => {
    if (!inputPrompt.trim() || isGenerating) return;
    const userText = inputPrompt.trim();
    setInputPrompt("");

    addMessage({ role: "user", content: userText });
    const assistantMsgId = addMessage({
      role: "assistant", content: "", model: selectedModel, isStreaming: true,
    });

    setIsGenerating(true);
    try {
      let accumulated = "";
      const stream = apiClient.generateTextStream({
        prompt: userText, model: selectedModel, provider: selectedProvider,
      });
      for await (const chunk of stream) {
        accumulated += chunk.content;
        updateMessageContent(assistantMsgId, accumulated, true);
      }
      updateMessageContent(assistantMsgId, accumulated, false);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Connection failed";
      updateMessageContent(
        assistantMsgId,
        `⚠️ **Connection Issue**\n\n${errorMsg}\n\n*Start Ollama with \`ollama serve\` or check config.*`,
        false
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const hasConversation = messages.filter((m) => m.id !== "welcome-1").length > 0;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-3xl mx-auto px-4">
      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto py-6">
        {/* Empty state */}
        {!hasConversation && (
          <div className="flex flex-col items-center justify-center pt-[15vh]">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8"
              style={{
                background: "linear-gradient(135deg, rgba(124,92,252,0.12), rgba(167,139,250,0.06))",
                border: "1px solid rgba(124,92,252,0.15)",
                boxShadow: "0 8px 32px -8px rgba(124,92,252,0.2)",
              }}
            >
              <Sparkles className="w-7 h-7" style={{ color: "#a78bfa" }} />
            </div>

            <h2
              className="text-3xl font-bold tracking-tight text-center mb-3"
              style={{
                background: "linear-gradient(135deg, #fafafa, #a1a1aa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              What&apos;s on your mind?
            </h2>
            <p className="text-center text-[14px] max-w-md leading-relaxed" style={{ color: "#6b6b76" }}>
              Chat with local models via Ollama or connect cloud providers.
              Everything stays on your machine.
            </p>

            {/* Model selector */}
            <div
              className="mt-6 flex items-center gap-2 px-3.5 py-2 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span className="text-[11px] font-medium" style={{ color: "#6b6b76" }}>Model:</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent text-[12px] font-semibold text-white focus:outline-none cursor-pointer"
              >
                <option value="llama3.2" className="bg-zinc-900">llama3.2</option>
                <option value="mistral" className="bg-zinc-900">mistral:7b</option>
                <option value="qwen2.5:coder" className="bg-zinc-900">qwen2.5:coder</option>
                <option value="phi3:mini" className="bg-zinc-900">phi3:mini</option>
                <option value="gpt-4o" className="bg-zinc-900">gpt-4o</option>
              </select>
              <ChevronDown className="w-3 h-3" style={{ color: "#6b6b76" }} />
            </div>

            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-2 mt-6 justify-center max-w-lg">
              {[
                "Explain recursion to a 5-year-old",
                "Write a Python decorator for caching",
                "Compare REST vs GraphQL",
                "What is quantization in LLMs?",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInputPrompt(suggestion)}
                  className="px-3.5 py-2 rounded-xl text-[12px] font-medium transition-all hover:scale-[1.02]"
                  style={{
                    color: "#8b8b96",
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Conversation thread ── */}
        {hasConversation && (
          <div className="space-y-0">
            {messages
              .filter((m) => m.id !== "welcome-1")
              .map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className="group py-5"
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.03)",
                    }}
                  >
                    <div className="flex gap-3.5">
                      {/* Avatar */}
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={
                          isUser
                            ? { background: "rgba(255,255,255,0.06)" }
                            : {
                                background: "linear-gradient(135deg, rgba(124,92,252,0.15), rgba(167,139,250,0.08))",
                                border: "1px solid rgba(124,92,252,0.15)",
                              }
                        }
                      >
                        {isUser ? (
                          <User className="w-3.5 h-3.5" style={{ color: "#6b6b76" }} />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" style={{ color: "#a78bfa" }} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[13px] font-semibold text-white">
                            {isUser ? "You" : msg.model || "ProjectX"}
                          </span>
                          <span className="text-[10px]" style={{ color: "#3a3a44" }}>
                            {msg.timestamp}
                          </span>
                        </div>

                        {msg.isStreaming && !msg.content ? (
                          <div className="flex items-center gap-1 py-1">
                            <div className="typing-dot" />
                            <div className="typing-dot" />
                            <div className="typing-dot" />
                          </div>
                        ) : (
                          <div className="prose-chat">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        )}

                        {/* Hover actions */}
                        {!isUser && msg.content && !msg.isStreaming && (
                          <div className="flex items-center gap-0.5 mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleCopy(msg.id, msg.content)}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] transition-colors"
                              style={{ color: "#6b6b76" }}
                            >
                              {copiedId === msg.id ? (
                                <><Check className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
                              ) : (
                                <><Copy className="w-3 h-3" />Copy</>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <div className="pb-6 pt-2">
        {hasConversation && (
          <div className="flex justify-end mb-2">
            <button
              onClick={clearMessages}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] transition-colors"
              style={{ color: "#3a3a44" }}
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          </div>
        )}
        <div
          className="rounded-2xl p-1.5 transition-all"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: inputPrompt
              ? "0 0 0 1px rgba(124,92,252,0.15), 0 4px 24px -4px rgba(0,0,0,0.3)"
              : "0 4px 24px -4px rgba(0,0,0,0.2)",
          }}
        >
          <div className="flex items-end gap-2">
            <button
              className="p-2.5 rounded-xl transition-colors"
              style={{ color: "#3a3a44" }}
              title="Voice input"
            >
              <Mic className="w-4.5 h-4.5" />
            </button>
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message ProjectX..."
              className="flex-1 min-h-[44px] max-h-[180px] py-2.5 bg-transparent text-[14.5px] placeholder:text-[#3a3a44] focus:outline-none resize-none"
              style={{ color: "#e8e8ed", lineHeight: "1.6" }}
            />
            <button
              disabled={!inputPrompt.trim() || isGenerating}
              onClick={handleSend}
              className="p-2.5 rounded-xl transition-all shrink-0 disabled:opacity-20"
              style={{
                background:
                  inputPrompt.trim() && !isGenerating
                    ? "linear-gradient(135deg, #7c5cfc, #a78bfa)"
                    : "rgba(255,255,255,0.04)",
                boxShadow:
                  inputPrompt.trim() && !isGenerating
                    ? "0 4px 16px -4px rgba(124,92,252,0.4)"
                    : "none",
              }}
            >
              {isGenerating ? (
                <StopCircle className="w-4.5 h-4.5 animate-spin" style={{ color: "#6b6b76" }} />
              ) : (
                <Send className="w-4.5 h-4.5 text-white" />
              )}
            </button>
          </div>
        </div>
        <p className="text-center text-[10px] mt-2.5" style={{ color: "#2a2a34" }}>
          Responses are generated locally. ProjectX v0.1.0
        </p>
      </div>
    </div>
  );
}
