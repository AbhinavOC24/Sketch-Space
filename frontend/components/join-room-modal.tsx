"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogOverlay, DialogContent } from "./ui/dialog";
import { LinkIcon, Loader2, X, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinRoomModal({ isOpen, onClose }: JoinRoomModalProps) {
  const router = useRouter();
  const [roomLink, setRoomLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinRoom = async () => {
    if (!roomLink.trim()) return;
    setIsLoading(true);
    
    // Simple validation to ensure it looks like a canvas path or URL
    const targetPath = roomLink.includes("/canvas/") 
      ? roomLink.substring(roomLink.indexOf("/canvas/")) 
      : roomLink;

    try {
      router.push(targetPath);
      onClose();
    } catch (err) {
      console.error("Failed to join room", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <DialogOverlay onClick={onClose} className="backdrop-blur-sm bg-black/60 z-40" />
      <DialogContent className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-zinc-950/80 p-8 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="size-4" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Join a Room</h2>
          <p className="text-sm text-white/50">Paste a room link or ID to start collaborating.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="roomLink" className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">
              Room Link / ID
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-purple-500 transition-colors">
                <LinkIcon size={18} />
              </div>
              <Input
                id="roomLink"
                placeholder="https://sketchspace.app/canvas/room-id"
                value={roomLink}
                onChange={(e) => setRoomLink(e.target.value)}
                className="h-12 bg-white/5 border-white/10 text-white text-sm placeholder:text-white/20 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all rounded-xl pl-11"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl text-white/40 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleJoinRoom}
              disabled={!roomLink.trim() || isLoading}
              className="flex-[2] h-12 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
            >
              {isLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Join Room
                  <ChevronRight className="size-4" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </>
  );
}
