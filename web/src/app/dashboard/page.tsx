"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const SystemDashboard = dynamic(
  () => import("@/features/dashboard/components/system-dashboard").then((mod) => mod.SystemDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col h-[calc(100vh-100px)] items-center justify-center opacity-50">
        <Loader2 className="w-8 h-8 animate-spin mb-4" style={{ color: "var(--accent)" }} />
        <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Checking System Health</p>
      </div>
    )
  }
);

export default function DashboardPage() {
  return (
    <div className="feature-page pt-8">
      <SystemDashboard />
    </div>
  );
}
