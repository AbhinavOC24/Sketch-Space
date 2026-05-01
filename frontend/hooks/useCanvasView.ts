import { useRef, useState, useCallback } from "react";

export function useCanvasView(redraw: () => void) {
  const zoomRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const [zoomStatus, setZoomStatus] = useState(1);

  const applyZoom = useCallback((newZoom: number, centerX: number, centerY: number) => {
    const currentZoom = zoomRef.current;
    zoomRef.current = newZoom;
    setZoomStatus(newZoom);

    offsetRef.current.x = centerX - ((centerX - offsetRef.current.x) / currentZoom) * newZoom;
    offsetRef.current.y = centerY - ((centerY - offsetRef.current.y) / currentZoom) * newZoom;

    redraw();
  }, [redraw]);

  const zoomIn = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    applyZoom(Math.min(3, zoomRef.current * 1.2), canvas.width / 2, canvas.height / 2);
  }, [applyZoom]);

  const zoomOut = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    applyZoom(Math.max(0.1, zoomRef.current / 1.2), canvas.width / 2, canvas.height / 2);
  }, [applyZoom]);

  const resetZoom = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    applyZoom(1, canvas.width / 2, canvas.height / 2);
    offsetRef.current = { x: 0, y: 0 };
    redraw();
  }, [applyZoom, redraw]);

  return {
    zoomRef,
    offsetRef,
    zoomStatus,
    applyZoom,
    zoomIn,
    zoomOut,
    resetZoom
  };
}
