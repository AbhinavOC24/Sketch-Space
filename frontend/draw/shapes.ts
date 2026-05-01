import { Shape } from "../utils/types";
import { drawArrow } from "../utils/drawUtils";

export function drawShape(
  ctx: CanvasRenderingContext2D,
  shape: Shape,
  zoom: number,
  settings: any
) {
  if (shape.type === "eraser") return;

  ctx.save();
  
  // Set common properties safely
  if ("opacity" in shape) {
    ctx.globalAlpha = (shape.opacity ?? 100) / 100;
  }
  
  if ("strokeColor" in shape) {
    ctx.strokeStyle = shape.strokeColor || settings.strokeColor;
  }
  
  if ("strokeWidth" in shape) {
    ctx.lineWidth = (shape.strokeWidth || settings.strokeWidth) / zoom;
  }

  switch (shape.type) {
    case "rect":
      if (shape.fillStyle === "fill") {
        ctx.fillStyle = shape.backgroundColor || settings.backgroundColor;
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
      }
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      break;

    case "circle":
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
      if (shape.fillStyle === "fill") {
        ctx.fillStyle = shape.backgroundColor || settings.backgroundColor;
        ctx.fill();
      }
      ctx.stroke();
      break;

    case "pencil":
      if (shape.points && shape.points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++) {
          ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        ctx.stroke();
      }
      break;

    case "arrow":
      drawArrow(ctx, shape.startX, shape.startY, shape.endX, shape.endY);
      break;

    case "text":
      ctx.font = `${shape.textFontWeight || "normal"} ${
        shape.fontSize || 16
      }px sans-serif`;
      ctx.fillStyle = shape.textStrokeColor || "#ffffff";
      ctx.textAlign = (shape.textAlign as CanvasTextAlign) || "left";
      ctx.fillText(shape.text, shape.x, shape.y);
      break;
  }
  ctx.restore();
}
