import React, { useEffect, useRef, useState, useCallback } from "react";
import { drawLogic } from "@/draw/drawLogic";
import { clearCanvas } from "@/utils/clearCanvas";
import { Shape } from "@/utils/types";
import Toolbar from "./Toolbar";
import {
  DrawingSettingsSidebar,
  TextDrawingSettingsSidebar,
  ArrowSettingsSidebar,
  PencilSettingsSidebar,
} from "./StyleOptions";
import { useDrawingSettings } from "@/stores/StyleOptionStore";
import { useCanvasView } from "@/hooks/useCanvasView";

const generateColor = (userId: string) => {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
  const [currShape, updateShape] = useState<string>("pointer");
  const [activeSidebar, setActiveSidebar] = useState<"drawing" | "text" | "arrow" | "pencil" | null>(null);
  const [mounted, setMounted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapeRef = useRef("pointer");
  const existingShapesRef = useRef<Shape[]>([]);
  const otherCursorsRef = useRef<{[userId: string]: { x: number; y: number; username: string; color: string }}>({});
  
  const drawingSettings = useDrawingSettings();
  const settingsRef = useRef(drawingSettings);

  // --- Drawing & Rendering Logic ---

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.setTransform(zoomRef.current, 0, 0, zoomRef.current, offsetRef.current.x, offsetRef.current.y);
    ctx.clearRect(-offsetRef.current.x / zoomRef.current, -offsetRef.current.y / zoomRef.current, canvas.width / zoomRef.current, canvas.height / zoomRef.current);
    
    clearCanvas(existingShapesRef.current, canvas, ctx, zoomRef, offsetRef);
    
    // Draw cursors
    Object.values(otherCursorsRef.current).forEach((cursor) => {
      ctx.fillStyle = cursor.color;
      ctx.beginPath();
      ctx.arc(cursor.x, cursor.y, 5 / zoomRef.current, 0, 2 * Math.PI);
      ctx.fill();
      ctx.font = `${12 / zoomRef.current}px sans-serif`;
      ctx.fillStyle = "#fff";
      ctx.fillText(cursor.username, cursor.x + 8 / zoomRef.current, cursor.y - 8 / zoomRef.current);
    });
    ctx.restore();
  }, []);

  const { zoomRef, offsetRef, zoomStatus, applyZoom, zoomIn, zoomOut, resetZoom } = useCanvasView(redraw);

  const getCanvasCoordinates = useCallback((e: MouseEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - offsetRef.current.x) / zoomRef.current,
      y: (e.clientY - rect.top - offsetRef.current.y) / zoomRef.current,
    };
  }, []);

  const handleShapeChange = (shape: string) => {
    shapeRef.current = shape;
    updateShape(shape);
    const sidebarMap: Record<string, typeof activeSidebar> = { rect: "drawing", circle: "drawing", text: "text", arrow: "arrow", pencil: "pencil" };
    setActiveSidebar(sidebarMap[shape] || null);
  };

  // --- Effects ---

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { settingsRef.current = drawingSettings; }, [drawingSettings]);

  // WebSocket & Event Listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !socket || !mounted) return;

    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");

    const handleSocketMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "mouse-move" && data.userId !== userId) {
        otherCursorsRef.current[data.userId] = { x: data.x, y: data.y, username: data.username, color: generateColor(data.userId) };
        redraw();
      }
    };

    const handleMouseMoveSync = (e: MouseEvent) => {
      const coords = getCanvasCoordinates(e, canvas);
      socket.send(JSON.stringify({ type: "mouse-move", userId, username, roomId, x: coords.x, y: coords.y }));
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const newZoom = e.deltaY < 0 ? zoomRef.current * 1.1 : zoomRef.current / 1.1;
      applyZoom(Math.max(0.1, Math.min(3, newZoom)), e.clientX - rect.left, e.clientY - rect.top);
    };

    let isPanning = false;
    let lastX = 0, lastY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      if (shapeRef.current === "hand") { isPanning = true; lastX = e.clientX; lastY = e.clientY; canvas.style.cursor = "grabbing"; }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (shapeRef.current === "hand") canvas.style.cursor = isPanning ? "grabbing" : "grab";
      if (isPanning && shapeRef.current === "hand") {
        offsetRef.current.x += e.clientX - lastX;
        offsetRef.current.y += e.clientY - lastY;
        lastX = e.clientX; lastY = e.clientY;
        redraw();
      }
    };

    const handleMouseUp = () => { if (isPanning) canvas.style.cursor = "grab"; isPanning = false; };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      if (e.key === "+" || e.key === "=") { e.preventDefault(); zoomIn(canvas); }
      else if (e.key === "-") { e.preventDefault(); zoomOut(canvas); }
      else if (e.key === "0") { e.preventDefault(); resetZoom(canvas); }
    };

    socket.addEventListener("message", handleSocketMessage);
    canvas.addEventListener("mousemove", handleMouseMoveSync);
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      socket.removeEventListener("message", handleSocketMessage);
      canvas.removeEventListener("mousemove", handleMouseMoveSync);
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [socket, mounted, redraw, applyZoom, zoomIn, zoomOut, resetZoom, getCanvasCoordinates, roomId]);

  // Main Drawing Init
  useEffect(() => {
    if (!canvasRef.current || !mounted) return;
    let cleanup: (() => void) | undefined;
    drawLogic(canvasRef.current, roomId, socket, shapeRef, settingsRef, handleShapeChange, zoomRef, offsetRef, existingShapesRef, getCanvasCoordinates)
      .then(fn => cleanup = fn);
    return () => cleanup?.();
  }, [roomId, socket, mounted, getCanvasCoordinates]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black selection:bg-none">
      {/* Zoom Controls */}
      <div className="absolute top-6 right-6 z-50 flex flex-col gap-2 scale-90 sm:scale-100">
        <button onClick={() => zoomIn(canvasRef.current)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/50 text-xl font-light text-white backdrop-blur-md transition-all hover:bg-white/10" title="Zoom In (Ctrl + +)">+</button>
        <button onClick={() => zoomOut(canvasRef.current)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/50 text-xl font-light text-white backdrop-blur-md transition-all hover:bg-white/10" title="Zoom Out (Ctrl + -)">−</button>
        <button onClick={() => resetZoom(canvasRef.current)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/50 text-xs font-medium text-white/70 backdrop-blur-md transition-all hover:text-white" title="Reset Zoom (Ctrl + 0)">{Math.round(zoomStatus * 100)}%</button>
      </div>

      {/* Sidebars */}
      {activeSidebar && (
        <div className="absolute left-6 top-1/2 z-50 -translate-y-1/2 animate-in fade-in slide-in-from-left-4 duration-300">
          {activeSidebar === "drawing" && <DrawingSettingsSidebar />}
          {activeSidebar === "text" && <TextDrawingSettingsSidebar />}
          {activeSidebar === "arrow" && <ArrowSettingsSidebar />}
          {activeSidebar === "pencil" && <PencilSettingsSidebar />}
        </div>
      )}

      <Toolbar changeShape={handleShapeChange} currShape={currShape} />

      <canvas
        ref={canvasRef}
        width={mounted ? window.innerWidth : 1920}
        height={mounted ? window.innerHeight : 1080}
        className={`touch-none ${["pointer", "hand", "eraser"].includes(currShape) ? "cursor-default" : "cursor-crosshair"}`}
      />
    </div>
  );
}

export default Canvas;
