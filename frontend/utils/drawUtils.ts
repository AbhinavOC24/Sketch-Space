import { Shape } from "./types";

export function drawArrow(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  const headLength = 20;
  const angle = Math.atan2(endY - startY, endX - startX);

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - headLength * Math.cos(angle - Math.PI / 6),
    endY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - headLength * Math.cos(angle + Math.PI / 6),
    endY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
}

export function intersectsEraser(
  shape: Shape,
  eraserPoints: { x: number; y: number }[],
  eraserRadius: number = 10
): boolean {
  for (const pt of eraserPoints) {
    if (shape.type === "rect") {
      const xStart = Math.min(shape.x, shape.x + shape.width!) - eraserRadius;
      const xEnd = Math.max(shape.x, shape.x + shape.width!) + eraserRadius;
      const yStart = Math.min(shape.y, shape.y + shape.height!) - eraserRadius;
      const yEnd = Math.max(shape.y, shape.y + shape.height!) + eraserRadius;
      if (pt.x >= xStart && pt.x <= xEnd && pt.y >= yStart && pt.y <= yEnd) {
        return true;
      }
    }
    
    if (shape.type === "circle") {
      const dx = pt.x - shape.centerX!;
      const dy = pt.y - shape.centerY!;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= shape.radius! + eraserRadius) {
        return true;
      }
    }

    if (shape.type === "pencil") {
      for (const p of shape.points!) {
        const dx = pt.x - p.x;
        const dy = pt.y - p.y;
        if (Math.sqrt(dx * dx + dy * dy) <= (shape.strokeWidth || 5) + eraserRadius) return true;
      }
    }

    if (shape.type === "arrow") {
      const minX = Math.min(shape.startX!, shape.endX!) - eraserRadius;
      const maxX = Math.max(shape.startX!, shape.endX!) + eraserRadius;
      const minY = Math.min(shape.startY!, shape.endY!) - eraserRadius;
      const maxY = Math.max(shape.startY!, shape.endY!) + eraserRadius;
      if (pt.x >= minX && pt.x <= maxX && pt.y >= minY && pt.y <= maxY) {
        return true;
      }
    }

    if (shape.type === "text") {
      const fontSize = shape.fontSize || 16;
      const textWidth = (shape.text?.length || 0) * fontSize * 0.6;
      if (
        pt.x >= shape.x! - eraserRadius &&
        pt.x <= shape.x! + textWidth + eraserRadius &&
        pt.y >= shape.y! - fontSize - eraserRadius &&
        pt.y <= shape.y! + eraserRadius
      ) {
        return true;
      }
    }
  }
  return false;
}
