"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import Shopping which contains heavy Recharts libraries
const ShoppingHelper = dynamic(
  () => import("@/features/shopping/components/shopping-helper").then((mod) => mod.ShoppingHelper),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col h-[calc(100vh-100px)] items-center justify-center opacity-50">
        <Loader2 className="w-8 h-8 animate-spin mb-4" style={{ color: "var(--accent)" }} />
        <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Loading Price Intelligence</p>
      </div>
    )
  }
);

export default function ShoppingPage() {
  return (
    <div className="feature-page pt-8">
      <ShoppingHelper />
    </div>
  );
}
