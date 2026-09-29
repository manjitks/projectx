import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeSelector } from "@/components/layout/theme-selector";
import { FloatingDock } from "@/components/layout/floating-dock";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProjectX — Modular AI Platform",
  description:
    "Next-generation modular AI platform with swappable adapters, real-time chat streaming, voice-to-text, and intelligent e-commerce price intelligence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body suppressHydrationWarning>
        <div className="aurora-bg" />
        <div className="aurora-blob" />

        <ThemeSelector />

        <main className="relative z-10 min-h-screen">
          {children}
        </main>

        <FloatingDock />
      </body>
    </html>
  );
}
