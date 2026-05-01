"use client";

import React from "react";
import { AlignLeft, AlignCenter, AlignRight, Bold, Type } from "lucide-react";
import { useDrawingSettings } from "@/stores/StyleOptionStore";
import { cn } from "@/lib/utils";

const strokeColors = ["#ffffff", "#d1d5db", "#f87171", "#60a5fa"];
const backgroundColors = ["#ffffff", "#9ca3af", "#7f1d1d", "#15803d"];

// --- Shared Components ---

const SidebarContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="w-56 overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-left-4 duration-300">
    <div className="flex flex-col gap-5">{children}</div>
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-white/40">{children}</h3>
);

const ColorButton = ({ color, isActive, onClick }: { color: string, isActive: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "h-7 w-7 rounded-lg border transition-all duration-200 hover:scale-110 active:scale-95",
      isActive ? "border-white shadow-[0_0_10px_rgba(255,255,255,0.2)]" : "border-white/10 hover:border-white/30"
    )}
    style={{ backgroundColor: color }}
  />
);

const CustomColorInput = ({ value, onChange, isActive }: { value: string, onChange: (val: string) => void, isActive: boolean }) => (
  <div className="relative group">
    <div
      className={cn(
        "h-7 w-7 rounded-lg border transition-all duration-200 group-hover:scale-110",
        isActive ? "border-white shadow-[0_0_10px_rgba(255,255,255,0.2)]" : "border-white/10 group-hover:border-white/30"
      )}
      style={{ backgroundColor: value }}
    />
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
    />
  </div>
);

// --- Sidebars ---

export function DrawingSettingsSidebar() {
  const {
    strokeColor, setStrokeColorByIndex, setCustomStrokeColor,
    backgroundColor, setBackgroundColorByIndex, setCustomBackgroundColor,
    fillStyle, setFillStyle,
    strokeWidth, setStrokeWidth,
    opacity, setOpacity,
  } = useDrawingSettings();

  return (
    <SidebarContainer>
      {/* Stroke */}
      <div>
        <SectionTitle>Stroke Color</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {strokeColors.map((color, index) => (
            <ColorButton key={index} color={color} isActive={strokeColor === color} onClick={() => setStrokeColorByIndex(index)} />
          ))}
          <CustomColorInput value={strokeColor} onChange={setCustomStrokeColor} isActive={!strokeColors.includes(strokeColor)} />
        </div>
      </div>

      {/* Background */}
      <div>
        <SectionTitle>Background Color</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {backgroundColors.map((color, index) => (
            <ColorButton key={index} color={color} isActive={backgroundColor === color} onClick={() => setBackgroundColorByIndex(index)} />
          ))}
          <CustomColorInput value={backgroundColor} onChange={setCustomBackgroundColor} isActive={!backgroundColors.includes(backgroundColor)} />
        </div>
      </div>

      {/* Fill Style */}
      <div>
        <SectionTitle>Fill Style</SectionTitle>
        <div className="flex gap-2">
          <button
            onClick={() => setFillStyle(0)}
            className={cn(
              "flex h-9 flex-1 items-center justify-center rounded-xl border transition-all",
              fillStyle === "no fill" ? "border-purple-500 bg-purple-600/20 text-purple-400" : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10"
            )}
          >
            <div className={cn("h-4 w-4 border-2 border-current rotate-45 opacity-60", fillStyle === "no fill" ? "" : "border-dashed")} />
          </button>
          <button
            onClick={() => setFillStyle(1)}
            className={cn(
              "flex h-9 flex-1 items-center justify-center rounded-xl border transition-all",
              fillStyle === "fill" ? "border-purple-500 bg-purple-600/20 text-purple-400" : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10"
            )}
          >
            <div className="h-4 w-4 rounded-sm bg-current" />
          </button>
        </div>
      </div>

      {/* Stroke Width */}
      <div>
        <SectionTitle>Stroke Width</SectionTitle>
        <div className="flex gap-2">
          {[1, 2, 4].map((width) => (
            <button
              key={width}
              onClick={() => setStrokeWidth([1, 2, 4].indexOf(width))}
              className={cn(
                "flex h-9 flex-1 items-center justify-center rounded-xl border transition-all",
                strokeWidth === width ? "border-purple-500 bg-purple-600/20 text-purple-400" : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10"
              )}
            >
              <div className="bg-current rounded-full" style={{ width: "16px", height: `${width}px` }} />
            </button>
          ))}
        </div>
      </div>

      {/* Opacity */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <SectionTitle>Opacity</SectionTitle>
          <span className="text-[10px] font-medium text-white/40">{opacity}%</span>
        </div>
        <input
          type="range" min={0} max={100} value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="w-full accent-purple-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </SidebarContainer>
  );
}

export function TextDrawingSettingsSidebar() {
  const {
    textStrokeColor, setTextStrokeColorByIndex, setCustomTextStrokeColor,
    textFontWeight, setTextFontWeight,
    textFontSize, setTextFontSize,
    textAlign, setTextAlign,
    opacity, setOpacity,
  } = useDrawingSettings();

  const fontSizes = ["S", "M", "L", "XL"];
  const fontSizeValues = ["8", "12", "16", "60"];
  const fontStyles = ["normal", "bold", "Serif"];
  const textAlignment = ["left", "center", "right"];

  return (
    <SidebarContainer>
      <div>
        <SectionTitle>Text Color</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {strokeColors.map((color, index) => (
            <ColorButton key={index} color={color} isActive={textStrokeColor === color} onClick={() => setTextStrokeColorByIndex(index)} />
          ))}
          <CustomColorInput value={textStrokeColor} onChange={setCustomTextStrokeColor} isActive={!strokeColors.includes(textStrokeColor)} />
        </div>
      </div>

      <div>
        <SectionTitle>Font Style</SectionTitle>
        <div className="flex gap-2">
          {fontStyles.map((style, index) => (
            <button
              key={index}
              onClick={() => setTextFontWeight(index)}
              className={cn(
                "flex h-9 flex-1 items-center justify-center rounded-xl border transition-all",
                textFontWeight === style ? "border-purple-500 bg-purple-600/20 text-purple-400" : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10"
              )}
            >
              {style === "normal" && <Type size={16} />}
              {style === "bold" && <Bold size={16} />}
              {style === "Serif" && <span className="text-sm font-bold font-serif">A</span>}
            </button>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>Font Size</SectionTitle>
        <div className="flex gap-2">
          {fontSizes.map((size, index) => (
            <button
              key={index}
              onClick={() => setTextFontSize(index)}
              className={cn(
                "flex h-9 flex-1 items-center justify-center rounded-xl border transition-all text-xs font-bold",
                textFontSize === fontSizeValues[index] ? "border-purple-500 bg-purple-600/20 text-purple-400" : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>Alignment</SectionTitle>
        <div className="flex gap-2">
          {[AlignLeft, AlignCenter, AlignRight].map((Icon, index) => (
            <button
              key={index}
              onClick={() => setTextAlign(index)}
              className={cn(
                "flex h-9 flex-1 items-center justify-center rounded-xl border transition-all",
                textAlign === textAlignment[index] ? "border-purple-500 bg-purple-600/20 text-purple-400" : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10"
              )}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <SectionTitle>Opacity</SectionTitle>
          <span className="text-[10px] font-medium text-white/40">{opacity}%</span>
        </div>
        <input
          type="range" min={0} max={100} value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="w-full accent-purple-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </SidebarContainer>
  );
}

export function ArrowSettingsSidebar() {
  const {
    strokeColor, setStrokeColorByIndex, setCustomStrokeColor,
    strokeWidth, setStrokeWidth,
    opacity, setOpacity,
  } = useDrawingSettings();

  return (
    <SidebarContainer>
      <div>
        <SectionTitle>Stroke Color</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {strokeColors.map((color, index) => (
            <ColorButton key={index} color={color} isActive={strokeColor === color} onClick={() => setStrokeColorByIndex(index)} />
          ))}
          <CustomColorInput value={strokeColor} onChange={setCustomStrokeColor} isActive={!strokeColors.includes(strokeColor)} />
        </div>
      </div>

      <div>
        <SectionTitle>Thickness</SectionTitle>
        <div className="flex gap-2">
          {[1, 2, 4].map((width) => (
            <button
              key={width}
              onClick={() => setStrokeWidth([1, 2, 4].indexOf(width))}
              className={cn(
                "flex h-9 flex-1 items-center justify-center rounded-xl border transition-all",
                strokeWidth === width ? "border-purple-500 bg-purple-600/20 text-purple-400" : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10"
              )}
            >
              <div className="bg-current rounded-full" style={{ width: "16px", height: `${width}px` }} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <SectionTitle>Opacity</SectionTitle>
          <span className="text-[10px] font-medium text-white/40">{opacity}%</span>
        </div>
        <input
          type="range" min={0} max={100} value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="w-full accent-purple-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </SidebarContainer>
  );
}

export function PencilSettingsSidebar() {
  const {
    strokeColor, setStrokeColorByIndex, setCustomStrokeColor,
    strokeWidth, setStrokeWidth,
    opacity, setOpacity,
  } = useDrawingSettings();

  return (
    <SidebarContainer>
      <div>
        <SectionTitle>Line Color</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {strokeColors.map((color, index) => (
            <ColorButton key={index} color={color} isActive={strokeColor === color} onClick={() => setStrokeColorByIndex(index)} />
          ))}
          <CustomColorInput value={strokeColor} onChange={setCustomStrokeColor} isActive={!strokeColors.includes(strokeColor)} />
        </div>
      </div>

      <div>
        <SectionTitle>Thickness</SectionTitle>
        <div className="flex gap-2">
          {[1, 2, 4].map((width) => (
            <button
              key={width}
              onClick={() => setStrokeWidth([1, 2, 4].indexOf(width))}
              className={cn(
                "flex h-9 flex-1 items-center justify-center rounded-xl border transition-all",
                strokeWidth === width ? "border-purple-500 bg-purple-600/20 text-purple-400" : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10"
              )}
            >
              <div className="bg-current rounded-full" style={{ width: "16px", height: `${width}px` }} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <SectionTitle>Opacity</SectionTitle>
          <span className="text-[10px] font-medium text-white/40">{opacity}%</span>
        </div>
        <input
          type="range" min={0} max={100} value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="w-full accent-purple-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </SidebarContainer>
  );
}
