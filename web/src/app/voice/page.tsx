"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import the Voice module (which uses browser Speech APIs)
const VoiceAssistant = dynamic(
  () => import("@/features/voice/components/voice-assistant").then((mod) => mod.VoiceAssistant),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col h-[calc(100vh-100px)] items-center justify-center opacity-50">
        <Loader2 className="w-8 h-8 animate-spin mb-4" style={{ color: "var(--accent)" }} />
        <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Loading Voice Engine</p>
      </div>
    )
  }
);

export default function VoicePage() {
  return (
    <div className="feature-page pt-8">
      <VoiceAssistant />
    </div>
  );
}
