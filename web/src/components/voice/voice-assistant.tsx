"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic,
  MicOff,
  Send,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import { useChatStore } from "@/stores/chat-store";

interface SpeechRecognitionResultItem { transcript: string; }
interface SpeechRecognitionResultList {
  [index: number]: { [index: number]: SpeechRecognitionResultItem };
  length: number;
}
interface SpeechRecognitionEvent { resultIndex: number; results: SpeechRecognitionResultList; }
interface SpeechRecognitionInstance {
  continuous: boolean; interimResults: boolean; lang: string;
  start: () => void; stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
}

export function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [copied, setCopied] = useState(false);
  const { addMessage } = useChatStore();
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) { setIsSupported(false); return; }

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (e) => {
      let t = "";
      for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript;
      setTranscript(t);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    return () => { recognition.stop(); };
  }, []);

  const toggle = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isListening) { recognitionRef.current.stop(); setIsListening(false); }
    else { setTranscript(""); recognitionRef.current.start(); setIsListening(true); }
  }, [isListening]);

  const handleCopy = () => { navigator.clipboard.writeText(transcript); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] max-w-2xl mx-auto px-6">
      {/* Title */}
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-10" style={{ color: "#3a3a44" }}>
        Voice · Speech to Text
      </p>

      {!isSupported && (
        <div className="w-full mb-8 p-3 rounded-xl text-[13px] flex items-center gap-2.5" style={{ color: "#f59e0b", background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.1)" }}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          Use Chrome, Edge, or Safari for native speech recognition.
        </div>
      )}

      {/* ── MIC BUTTON ── */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Pulse rings */}
        {isListening && (
          <>
            <div className="absolute w-40 h-40 rounded-full pulse-ring" style={{ background: "rgba(124,92,252,0.06)" }} />
            <div className="absolute w-56 h-56 rounded-full pulse-ring" style={{ background: "rgba(124,92,252,0.03)", animationDelay: "0.4s" }} />
          </>
        )}

        <button
          disabled={!isSupported}
          onClick={toggle}
          className="relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-500 cursor-pointer"
          style={
            isListening
              ? {
                  background: "linear-gradient(135deg, #7c5cfc, #a78bfa)",
                  boxShadow: "0 0 60px -8px rgba(124,92,252,0.5), 0 0 120px -16px rgba(124,92,252,0.2)",
                }
              : {
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }
          }
        >
          {isListening ? (
            <>
              <Mic className="w-8 h-8 text-white" />
              <span className="text-[8px] font-bold mt-1 tracking-[0.2em] uppercase text-white/70">Listening</span>
            </>
          ) : (
            <>
              <MicOff className="w-8 h-8" style={{ color: "#3a3a44" }} />
              <span className="text-[8px] font-bold mt-1 tracking-[0.2em] uppercase" style={{ color: "#3a3a44" }}>Tap</span>
            </>
          )}
        </button>
      </div>

      {/* Waveform when listening */}
      {isListening && (
        <div className="flex items-center gap-[3px] h-10 mb-6">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="wave-bar"
              style={{ animationDelay: `${i * 0.06}s` }}
            />
          ))}
        </div>
      )}

      {/* ── TRANSCRIPT ── */}
      <div className="w-full mt-4">
        {transcript ? (
          <div
            className="p-5 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p className="text-[15px] leading-relaxed mb-4" style={{ color: "#d4d4dc" }}>
              {transcript}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
                style={{ color: "#6b6b76", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={() => { addMessage({ role: "user", content: transcript }); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-white transition-all"
                style={{ background: "linear-gradient(135deg, #7c5cfc, #a78bfa)", boxShadow: "0 4px 12px -4px rgba(124,92,252,0.3)" }}
              >
                <Send className="w-3 h-3" />
                Send to Chat
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-[13px]" style={{ color: "#3a3a44" }}>
            {isListening ? "Listening — start speaking..." : "Tap the microphone to begin"}
          </p>
        )}
      </div>
    </div>
  );
}
