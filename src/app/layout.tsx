import type { Metadata } from "next";
import "./globals.css";
import { profile } from "@/data/profile";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: `${profile.name} — Portfolio`,
  description:
    `${profile.title} specialising in full-stack web, data engineering, and AI products.`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-white antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
