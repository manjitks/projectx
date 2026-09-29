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
import { useChatStore } from "@/features/chat/store";

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
      <p className="text-[12px] font-bold uppercase tracking-widest mb-12" style={{ color: "var(--text-muted)" }}>
        Voice · Speech to Text
      </p>

      {!isSupported && (
        <div className="w-full mb-10 p-4 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-3 shadow-sm" style={{ color: "#d97706", background: "#fef3c7", border: "1px solid #fde68a" }}>
          <AlertCircle className="w-5 h-5 shrink-0" />
          Use Chrome, Edge, or Safari for native speech recognition.
        </div>
      )}

      {/* ── MIC BUTTON ── */}
      <div className="relative flex items-center justify-center mb-10">
        {/* Pulse rings */}
        {isListening && (
          <>
            <div className="absolute w-48 h-48 rounded-full pulse-ring" style={{ background: "var(--accent-glow)" }} />
            <div className="absolute w-64 h-64 rounded-full pulse-ring" style={{ background: "var(--accent-glow)", animationDelay: "0.4s", opacity: 0.5 }} />
          </>
        )}

        <button
          disabled={!isSupported}
          onClick={toggle}
          className="relative z-10 w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-500 cursor-pointer shadow-2xl hover:scale-105"
          style={
            isListening
              ? {
                  background: "var(--accent)",
                  boxShadow: "0 0 60px -8px var(--accent-glow), 0 0 120px -16px var(--accent-glow)",
                }
              : {
                  background: "var(--tile-bg)",
                  border: "1px solid var(--tile-border)",
                }
          }
        >
          {isListening ? (
            <>
              <Mic className="w-10 h-10" style={{ color: "var(--bg-base)" }} />
              <span className="text-[10px] font-extrabold mt-2 tracking-widest uppercase" style={{ color: "var(--bg-base)", opacity: 0.8 }}>Listening</span>
            </>
          ) : (
            <>
              <MicOff className="w-10 h-10" style={{ color: "var(--text-muted)" }} />
              <span className="text-[10px] font-bold mt-2 tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>Tap</span>
            </>
          )}
        </button>
      </div>

      {/* Waveform when listening */}
      {isListening && (
        <div className="flex items-center gap-1.5 h-12 mb-8">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="wave-bar w-1.5 rounded-full"
              style={{ background: "var(--accent)", animationDelay: `${i * 0.06}s` }}
            />
          ))}
        </div>
      )}

      {/* ── TRANSCRIPT ── */}
      <div className="w-full mt-4">
        {transcript ? (
          <div
            className="p-8 rounded-3xl shadow-xl transition-all"
            style={{ background: "var(--tile-bg)", border: "1px solid var(--tile-border)" }}
          >
            <p className="text-[16px] font-medium leading-relaxed mb-6" style={{ color: "var(--text-primary)" }}>
              {transcript}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:scale-105"
                style={{ color: "var(--text-primary)", background: "rgba(0,0,0,0.05)", border: "1px solid var(--tile-border)" }}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={() => { addMessage({ role: "user", content: transcript }); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:scale-105 shadow-md"
                style={{ background: "var(--accent)", color: "var(--bg-base)" }}
              >
                <Send className="w-4 h-4" />
                Send to Chat
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-[15px] font-semibold" style={{ color: "var(--text-muted)" }}>
            {isListening ? "Listening — start speaking..." : "Tap the microphone to begin"}
          </p>
        )}
      </div>
    </div>
  );
}
