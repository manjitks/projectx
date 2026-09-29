"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const FoundryWorkspace = dynamic(
  () => import("@/features/foundry/components/foundry-workspace").then((mod) => mod.FoundryWorkspace),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col h-screen items-center justify-center opacity-50">
        <Loader2 className="w-8 h-8 animate-spin mb-4" style={{ color: "var(--accent)" }} />
        <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Initializing Foundry Workspace</p>
      </div>
    )
  }
);

export default function FoundryPage() {
  return (
    <div className="feature-page min-h-screen">
      <FoundryWorkspace />
    </div>
  );
}
