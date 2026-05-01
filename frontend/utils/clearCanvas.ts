import { Shape } from "./types";
import { drawShape } from "../draw/shapes";

export function clearCanvas(
  existingShape: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  zoomRef: React.RefObject<number>,
  offsetRef: React.RefObject<{ x: number; y: number }>
) {
  const zoom = zoomRef.current || 1;
  const offset = offsetRef.current || { x: 0, y: 0 };

  // Clear background
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "#0a0a0a"; // Vercel-like dark background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Set transform for shapes
  ctx.setTransform(zoom, 0, 0, zoom, offset.x, offset.y);

  // Draw all shapes
  existingShape.forEach((shape) => {
    drawShape(ctx, shape, zoom, {
      strokeWidth: 2,
      strokeColor: "#ffffff",
      backgroundColor: "#333333"
    });
  });
}
