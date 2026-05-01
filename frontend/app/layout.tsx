import type React from "react";
// Polyfill localStorage for Node.js environments (especially Node 25 stub issues)
if (typeof window === "undefined") {
  if (typeof global !== "undefined") {
    (global as any).localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null,
    };
  }
}
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "SketchSpace - Collaborative Whiteboarding",
  description:
    "Create, collaborate, and share diagrams and sketches in real-time with anyone, anywhere.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geist.variable} font-sans min-h-screen bg-[#0a0a0a] text-white antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
