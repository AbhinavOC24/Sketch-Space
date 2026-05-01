"use client";

import type React from "react";
import Link from "next/link";
import {
  Pen,
  Users,
  Share2,
  ChevronRight,
  Loader2,
  LinkIcon,
  ArrowRight,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CreateRoomModal } from "@/components/create-room-modal";
import { JoinRoomModal } from "@/components/join-room-modal";
import { jwtDecode } from "jwt-decode";
import Hero from "@/components/Hero";

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const decoded: { exp: number } = jwtDecode(token);
    return decoded.exp * 1000 >= Date.now();
  } catch {
    return false;
  }
}

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState<boolean>(false);
  const [loginStatus, updateLoginStatus] = useState<boolean>(false);
  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && typeof localStorage !== "undefined" && typeof localStorage.getItem === "function") {
      const token = localStorage.getItem("token");
      if (!token || !isTokenValid(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        updateLoginStatus(false);
      } else {
        updateLoginStatus(true);
      }
    }
  }, []);

  const handleLogOut = async () => {
    try {
      setLogoutLoading(true);
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`, {
        withCredentials: true,
      });
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      updateLoginStatus(false);
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans antialiased">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Purple glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/5 blur-[120px] pointer-events-none rounded-full" />

      {/* ── NAV ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pen className="size-5 text-purple-500" strokeWidth={2.5} />
            <span className="text-lg font-bold tracking-tight">SketchSpace</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="https://github.com/AbhinavOC24/Sketch-Space" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>

          </nav>

          <div className="flex items-center gap-4">
            {!mounted ? (
              <div className="h-8 w-20 rounded-lg bg-white/[0.05] animate-pulse" />
            ) : !loginStatus ? (
              <>
                <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Log in</Link>
                <Link href="/signup" className="text-sm bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-xl transition-all font-bold shadow-[0_0_15px_rgba(147,51,234,0.3)]">Sign up</Link>
              </>
            ) : (
              <button
                onClick={handleLogOut}
                disabled={logoutLoading}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
              >
                {logoutLoading ? <Loader2 className="size-4 animate-spin" /> : "Log out"}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        <Hero>
          {mounted && (
            loginStatus ? (
              <>
                <CreateRoomModal>
                  <button className="group px-8 py-3.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(147,51,234,0.3)] flex items-center gap-2">
                    Create a room
                    <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </CreateRoomModal>
                <button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="px-8 py-3.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold transition-all active:scale-95 flex items-center gap-2"
                >
                  <LinkIcon className="size-4 text-purple-400" />
                  Join a room
                </button>
              </>
            ) : (
              <>
                <Link href="/signup" className="px-8 py-3.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                  Get Started Free
                </Link>
                <button
                  onClick={() => router.push("#features")}
                  className="px-8 py-3.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold transition-all active:scale-95"
                >
                  Learn More
                </button>
              </>
            )
          )}
        </Hero>

        {/* ── FEATURES ── */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-24 mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Pen className="size-6 text-purple-400" />,
                title: "Precision Drawing",
                desc: "Every stroke is sharp, every shape is perfect. Built on top of high-performance canvas tech.",
              },
              {
                icon: <Users className="size-6 text-purple-400" />,
                title: "Live Multiplayer",
                desc: "Work together in real-time. See cursors, selections, and updates as they happen with zero lag.",
              },
              {
                icon: <Share2 className="size-6 text-purple-400" />,
                title: "One-Click Sharing",
                desc: "No complicated export steps. Just copy the URL and your team is in. It's that simple.",
              },
            ].map((f, i) => (
              <div key={i} className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 transition-all hover:bg-white/[0.04]">
                <div className="mb-6 size-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="max-w-7xl mx-auto px-6 pb-32">
          <div className="relative rounded-[2.5rem] border border-purple-500/20 bg-purple-950/20 p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <Zap className="size-10 text-purple-400 mx-auto mb-6" strokeWidth={1.5} />
              <h2 className="text-4xl font-black mb-4 tracking-tight">Ready to start sketching?</h2>
              <p className="text-zinc-400 text-lg mb-10">
                Join thousands of teams using SketchSpace to map out their ideas. No registration required to view.
              </p>
              {loginStatus ? (
                <CreateRoomModal>
                  <button className="h-14 inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-lg font-bold px-10 rounded-2xl transition-all shadow-[0_0_25px_rgba(147,51,234,0.4)] hover:scale-105 active:scale-95">
                    Create your free room
                    <ChevronRight className="size-5" />
                  </button>
                </CreateRoomModal>
              ) : (
                <Link
                  href="/signup"
                  className="h-14 inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-lg font-bold px-10 rounded-2xl transition-all shadow-[0_0_25px_rgba(147,51,234,0.4)] hover:scale-105 active:scale-95"
                >
                  Get started — for free
                  <ChevronRight className="size-5" />
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.06] bg-black/50 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Pen className="size-4 text-purple-500" />
            <span className="font-bold">SketchSpace</span>
          </div>
          <div className="text-sm text-zinc-600">
            © {new Date().getFullYear()} SketchSpace. Built with passion for creators.
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="https://github.com/AbhinavOC24/Sketch-Space" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
            <a href="#collab" className="hover:text-white transition-colors">Collaborate</a>
          </nav>
        </div>
      </footer>

      <JoinRoomModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
    </div>
  );
}
