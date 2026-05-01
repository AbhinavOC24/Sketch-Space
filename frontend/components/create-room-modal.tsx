"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogOverlay, DialogContent, DialogClose } from "./ui/dialog";
import { ChevronRight, Loader2, X } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface CreateRoomModalProps {
  children: React.ReactNode;
}

export function CreateRoomModal({ children }: CreateRoomModalProps) {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isRoomNameValid = slug.trim().length >= 3 && slug.trim().length <= 20;

  const handleCreateRoom = async () => {
    if (!isRoomNameValid) return;
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/create-room`,
        { slug },
        { withCredentials: true }
      );
      const roomId = response.data.roomId;
      setIsOpen(false);
      setSlug("");
      router.push(`/canvas/${roomId}`);
    } catch (e) {
      console.error("Error creating room", e);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setSlug("");
    setIsLoading(false);
  };

  return (
    <>
      <div onClick={openModal} className="cursor-pointer">
        {children}
      </div>

      {isOpen && (
        <>
          <DialogOverlay onClick={closeModal} className="backdrop-blur-sm bg-black/60 z-40" />
          <DialogContent className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-zinc-950/80 p-8 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={closeModal}
              className="absolute right-5 top-5 rounded-full p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Create New Room</h2>
              <p className="text-sm text-white/50">Enter a unique name for your collaborative workspace.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="slug" className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">
                  Room Name
                </label>
                <Input
                  id="slug"
                  placeholder="e.g. Design Sprint"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="h-12 bg-white/5 border-white/10 text-white text-base placeholder:text-white/20 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all rounded-xl"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleCreateRoom()}
                />
                <p className={slug.length > 0 && !isRoomNameValid ? "text-[10px] text-red-400 ml-1" : "text-[10px] text-white/20 ml-1"}>
                  Must be between 3 and 20 characters
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="ghost"
                  onClick={closeModal}
                  className="flex-1 h-12 rounded-xl text-white/40 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateRoom}
                  disabled={!isRoomNameValid || isLoading}
                  className="flex-[2] h-12 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                >
                  {isLoading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Room
                      <ChevronRight className="size-4" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </>
      )}
    </>
  );
}
