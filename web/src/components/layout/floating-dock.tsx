"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Mic, ShoppingBag, Activity, Home, Layers, LineChart, Share2, Target, LayoutDashboard } from "lucide-react";

export function FloatingDock() {
  const pathname = usePathname();

  const dockItems = [
    { href: "/", icon: Home, label: "Hub" },
    { href: "/foundry", icon: Layers, label: "Foundry" },
    { href: "/chat", icon: MessageSquare, label: "Chat" },
    { href: "/voice", icon: Mic, label: "Voice" },
    { href: "/shopping", icon: ShoppingBag, label: "Shopping" },
    { href: "/lens", icon: LineChart, label: "Lens" },
    { href: "/multiplier", icon: Share2, label: "Multiplier" },
    { href: "/scout", icon: Target, label: "Scout" },
    { href: "/architect", icon: LayoutDashboard, label: "Architect" },
    { href: "/dashboard", icon: Activity, label: "Dashboard" },
  ];

  return (
    <div className="floating-dock">
      {dockItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`dock-item ${isActive ? "active" : ""}`}
          >
            <Icon className="w-6 h-6" />
            <span className="dock-tooltip">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
