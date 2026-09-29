"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import the heavy Chat component so it never blocks the initial page load
const ChatContainer = dynamic(
  () => import("@/features/chat/components/chat-container").then((mod) => mod.ChatContainer),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col h-[calc(100vh-100px)] items-center justify-center opacity-50">
        <Loader2 className="w-8 h-8 animate-spin mb-4" style={{ color: "var(--accent)" }} />
        <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Loading Chat Module</p>
      </div>
    )
  }
);

export default function ChatPage() {
  return (
    <div className="feature-page pt-8">
      <ChatContainer />
    </div>
  );
}
