"use client";

import React, { useEffect, useState } from "react";
import Canvas from "./Canvas";

import { useRouter } from "next/navigation";
export default function CanvasRoom({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined" || typeof localStorage === "undefined" || typeof localStorage.getItem !== "function") return;
    
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}?token=${token}`
    );
    ws.onopen = () => {
      console.log("WebSocket connection established");
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        })
      );
    };
  }, [roomId, router]);

  if (!socket) return <div>Connecting to server...</div>;
  return (
    <>
      <div style={{ margin: 0, padding: 0 }}>
        <Canvas roomId={roomId} socket={socket} />
      </div>
    </>
  );
}
