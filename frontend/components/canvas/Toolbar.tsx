import type React from "react";
import { useEffect } from "react";
import { Hand, MousePointer2, Square, Circle, ArrowRight, Pen, Type, ImageIcon, Eraser } from "lucide-react";
import { cn } from "../../lib/utils";

interface ToolbarItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut: string;
  label: string;
}

interface ToolbarProps {
  changeShape: (e: string) => void;
  currShape: string;
}

export default function Toolbar({ changeShape, currShape }: ToolbarProps) {
  const toolbarItems: ToolbarItem[] = [
    { id: "hand", icon: Hand, shortcut: "1", label: "Hand Tool" },
    { id: "pointer", icon: MousePointer2, shortcut: "2", label: "Selection Tool" },
    { id: "rect", icon: Square, shortcut: "3", label: "Rectangle" },
    { id: "circle", icon: Circle, shortcut: "4", label: "Circle" },
    { id: "arrow", icon: ArrowRight, shortcut: "5", label: "Arrow" },
    { id: "pencil", icon: Pen, shortcut: "6", label: "Pen" },
    { id: "text", icon: Type, shortcut: "7", label: "Text" },
    { id: "image", icon: ImageIcon, shortcut: "8", label: "Image" },
    { id: "eraser", icon: Eraser, shortcut: "9", label: "Eraser Tool" },
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (["INPUT", "TEXTAREA"].includes((event.target as HTMLElement).tagName)) return;
      
      const tool = toolbarItems.find((item) => item.shortcut === event.key);
      if (tool) {
        changeShape(tool.id);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeShape]);

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-black/40 p-1.5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {toolbarItems.map((item) => {
          const Icon = item.icon;
          const isSelected = currShape === item.id;

          return (
            <button
              key={item.id}
              onClick={() => changeShape(item.id)}
              className={cn(
                "group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 outline-none",
                isSelected 
                  ? "bg-purple-600/90 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]" 
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              )}
              title={`${item.label} (${item.shortcut})`}
            >
              <Icon className={cn("h-[18px] w-[18px] transition-transform duration-200", isSelected ? "scale-110" : "group-hover:scale-110")} />
              
              {/* Shortcut Indicator */}
              <span className={cn(
                "absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-md px-1 text-[9px] font-bold uppercase tracking-tighter transition-opacity duration-200",
                isSelected ? "bg-white text-purple-700 opacity-100" : "bg-white/10 text-white/40 opacity-0 group-hover:opacity-100"
              )}>
                {item.shortcut}
              </span>

              {/* Tooltip (Custom style) */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 rounded-md bg-zinc-900 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none border border-white/5 whitespace-nowrap shadow-xl">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
