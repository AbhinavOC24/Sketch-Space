import { v4 as uuidv4 } from "uuid";
import { Shape } from "../utils/types";
import { drawArrow, intersectsEraser } from "../utils/drawUtils";
import { getExistingShape } from "../utils/fetchShapes";
import { clearCanvas } from "../utils/clearCanvas";

let activeTextInput: HTMLInputElement | null = null;

// --- Helper Functions ---

function hexToRgba(hex: string, alpha: number): string {
  let r = 255, g = 255, b = 255;
  if (hex.startsWith("#")) {
    const parsed = hex.slice(1);
    if (parsed.length === 3) {
      r = parseInt(parsed[0] + parsed[0], 16);
      g = parseInt(parsed[1] + parsed[1], 16);
      b = parseInt(parsed[2] + parsed[2], 16);
    } else if (parsed.length === 6) {
      r = parseInt(parsed.substring(0, 2), 16);
      g = parseInt(parsed.substring(2, 4), 16);
      b = parseInt(parsed.substring(4, 6), 16);
    }
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// --- Main Drawing Orchestrator ---

export async function drawLogic(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  ShapeRef: React.MutableRefObject<string>,
  settingsRef: React.MutableRefObject<any>,
  handleClick: (currShape: string) => void,
  zoomRef: React.RefObject<number>,
  offsetRef: React.RefObject<{ x: number; y: number }>,
  existingShapesRef: React.MutableRefObject<any[]>,
  getCanvasCoordinates: (e: MouseEvent, canvas: HTMLCanvasElement) => { x: number; y: number }
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let existingShape: Shape[] = await getExistingShape(roomId);
  existingShapesRef.current = existingShape;

  const getSettings = () => settingsRef.current;
  const redraw = () => clearCanvas(existingShape, canvas, ctx, zoomRef, offsetRef);

  // --- WebSocket Handlers ---

  const handleSocketMessage = (event: MessageEvent) => {
    const message = JSON.parse(event.data);
    if (message.type === "chat") {
      const parsedShape = JSON.parse(message.message);
      existingShape.push(parsedShape.shape);
      existingShapesRef.current = existingShape;
      redraw();
    } else if (message.type === "deleted") {
      try {
        const payload = JSON.parse(message.message);
        const shapeIdsToDelete = payload.deletedShape.map((s: any) => s.shapeId);
        existingShape = existingShape.filter(shape => !shapeIdsToDelete.includes(shape.shapeId));
        existingShapesRef.current = existingShape;
        redraw();
      } catch (e) {
        console.error("Failed to parse deleted message", e);
      }
    }
  };

  socket.addEventListener("message", handleSocketMessage);

  // --- Drawing State ---

  let deletedShapes: Shape[] = [];
  let pencilPoints: { x: number; y: number }[] = [];
  let eraserPoints: { x: number; y: number }[] = [];
  let isDrawing = false;
  let startX = 0, startY = 0;
  const eraserRadius = 20;

  // --- Text Input Management ---

  const completeTextInput = () => {
    if (!activeTextInput) return;
    const input = activeTextInput;
    const text = input.value.trim();
    if (text) {
      const settings = getSettings();
      const zoom = zoomRef.current || 1;
      const inputRect = input.getBoundingClientRect();
      const inputBoxWidth = inputRect.width / zoom;
      
      ctx.font = `${settings.textFontWeight || "normal"} ${settings.textFontSize || 16}px sans-serif`;
      const textWidth = ctx.measureText(text).width;
      
      let adjustedX = startX;
      if (settings.textAlign === "center") adjustedX += (inputBoxWidth - textWidth) / 2;
      else if (settings.textAlign === "right") adjustedX += (inputBoxWidth - textWidth);

      const shape: Shape = {
        type: "text", x: adjustedX + 12, y: startY - 12, text, fontSize: settings.textFontSize,
        textFontWeight: settings.textFontWeight, textAlign: settings.textAlign,
        textStrokeColor: settings.textStrokeColor, opacity: settings.opacity,
        shapeId: uuidv4(), createdAt: Date.now().toString(),
      };

      existingShape.push(shape);
      existingShapesRef.current = existingShape;
      socket.send(JSON.stringify({ type: "chat", message: JSON.stringify({ shape }), roomId }));
    }
    input.remove();
    activeTextInput = null;
    isDrawing = false;
    redraw();
  };

  const createTextInput = (coords: { x: number, y: number }) => {
    const settings = getSettings();
    const zoom = zoomRef.current || 1;
    const canvasRect = canvas.getBoundingClientRect();
    const input = document.createElement("input");
    activeTextInput = input;
    const screenX = coords.x * zoom + offsetRef.current.x + canvasRect.left;
    const screenY = coords.y * zoom + offsetRef.current.y + canvasRect.top;
    const fontSize = settings.textFontSize || 16;
    
    Object.assign(input.style, {
        position: "fixed", left: `${screenX}px`, top: `${screenY - fontSize}px`, fontSize: `${fontSize}px`,
        fontWeight: settings.textFontWeight || "normal", textAlign: settings.textAlign || "left",
        color: hexToRgba(settings.textStrokeColor, (settings.opacity || 100) / 100),
        background: "transparent", border: "1px solid #007bff", padding: "4px", zIndex: "1000", outline: "none", borderRadius: "3px"
    });
    
    document.body.appendChild(input);
    setTimeout(() => input.focus(), 0);
    input.onkeydown = (ev) => {
        if (ev.key === "Enter") completeTextInput();
        if (ev.key === "Escape") { input.remove(); activeTextInput = null; isDrawing = false; redraw(); }
    };
    input.onblur = () => setTimeout(completeTextInput, 100);
  };

  // --- Mouse Event Handlers ---

  const handleMouseDown = (e: MouseEvent) => {
    if (activeTextInput) completeTextInput();
    const coords = getCanvasCoordinates(e, canvas);
    isDrawing = true;
    startX = coords.x;
    startY = coords.y;

    if (ShapeRef.current === "pencil") pencilPoints = [coords];
    if (ShapeRef.current === "eraser") {
      eraserPoints = [coords];
      deletedShapes = [];
    }
    if (ShapeRef.current === "text") createTextInput(coords);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const coords = getCanvasCoordinates(e, canvas);
    const settings = getSettings();
    const zoom = zoomRef.current || 1;
    
    if (isDrawing) {
        const width = coords.x - startX;
        const height = coords.y - startY;

        if (["rect", "circle", "pencil", "arrow"].includes(ShapeRef.current)) {
            renderPreview(ShapeRef.current, coords, width, height, settings, zoom);
        } else if (ShapeRef.current === "eraser") {
            performErasing(coords, zoom);
        }
    } else if (ShapeRef.current === "eraser") {
        redraw();
        renderEraserCursor(coords, zoom, false);
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDrawing) return;
    isDrawing = false;
    const coords = getCanvasCoordinates(e, canvas);
    
    if (ShapeRef.current !== "text") {
      commitShape(ShapeRef.current, coords);
    }
    
    pencilPoints = [];
    eraserPoints = [];
    redraw();
  };

  // --- Sub-logic Functions ---

  const renderPreview = (type: string, coords: any, width: number, height: number, settings: any, zoom: number) => {
    redraw();
    ctx.save();
    ctx.setTransform(zoom, 0, 0, zoom, offsetRef.current.x, offsetRef.current.y);
    ctx.lineWidth = settings.strokeWidth / zoom;
    ctx.strokeStyle = settings.strokeColor;
    ctx.globalAlpha = (settings.opacity || 100) / 100;

    if (type === "rect") {
        if (settings.fillStyle === "fill") { ctx.fillStyle = settings.backgroundColor; ctx.fillRect(startX, startY, width, height); }
        ctx.strokeRect(startX, startY, width, height);
    } else if (type === "circle") {
        const radius = Math.sqrt(width**2 + height**2) / 2;
        ctx.beginPath();
        ctx.arc(startX + width/2, startY + height/2, radius, 0, 2 * Math.PI);
        if (settings.fillStyle === "fill") { ctx.fillStyle = settings.backgroundColor; ctx.fill(); }
        ctx.stroke();
    } else if (type === "pencil") {
        pencilPoints.push(coords);
        ctx.beginPath();
        ctx.moveTo(pencilPoints[0].x, pencilPoints[0].y);
        pencilPoints.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.stroke();
    } else if (type === "arrow") {
        drawArrow(ctx, startX, startY, coords.x, coords.y);
    }
    ctx.restore();
  };

  const performErasing = (coords: any, zoom: number) => {
    eraserPoints.push(coords);
    existingShape = existingShape.filter(shape => {
        const hit = intersectsEraser(shape, eraserPoints, eraserRadius);
        if (hit) deletedShapes.push(shape);
        return !hit;
    });
    existingShapesRef.current = existingShape;
    redraw();
    renderEraserCursor(coords, zoom, true);
  };

  const renderEraserCursor = (coords: any, zoom: number, active = false) => {
    ctx.save();
    ctx.setTransform(zoom, 0, 0, zoom, offsetRef.current.x, offsetRef.current.y);
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, eraserRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1 / zoom;
    ctx.stroke();
    ctx.fillStyle = active ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.04)";
    ctx.fill();
    ctx.restore();
  };

  const commitShape = (type: string, coords: any) => {
    const settings = getSettings();
    let shape: Shape | null = null;
    const common = { strokeColor: settings.strokeColor, strokeWidth: settings.strokeWidth, opacity: settings.opacity, shapeId: uuidv4(), createdAt: Date.now().toString() };

    if (type === "rect") {
      shape = { type: "rect", x: startX, y: startY, width: coords.x - startX, height: coords.y - startY, backgroundColor: settings.backgroundColor, fillStyle: settings.fillStyle, ...common };
    } else if (type === "circle") {
      const w = coords.x - startX, h = coords.y - startY;
      shape = { type: "circle", centerX: startX + w/2, centerY: startY + h/2, radius: Math.sqrt(w**2 + h**2)/2, backgroundColor: settings.backgroundColor, fillStyle: settings.fillStyle, ...common };
    } else if (type === "pencil") {
      shape = { type: "pencil", points: pencilPoints, ...common };
    } else if (type === "arrow") {
      shape = { type: "arrow", startX, startY, endX: coords.x, endY: coords.y, ...common };
    } else if (type === "eraser" && deletedShapes.length > 0) {
      socket.send(JSON.stringify({ type: "deleted", message: JSON.stringify({ deletedShape: deletedShapes }), roomId }));
      deletedShapes = [];
    }

    if (shape) {
      existingShape.push(shape);
      existingShapesRef.current = existingShape;
      socket.send(JSON.stringify({ type: "chat", message: JSON.stringify({ shape }), roomId }));
    }
  };

  // --- Lifecycle ---

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);

  return () => {
    socket.removeEventListener("message", handleSocketMessage);
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mousemove", handleMouseMove);
    canvas.removeEventListener("mouseup", handleMouseUp);
  };
}
