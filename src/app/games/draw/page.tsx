"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import GeminiChat from "@/components/GeminiChat";
import ClayNav from "@/components/ClayNav";
import ClayBlobs from "@/components/ClayBlobs";

const COLORS = [
  "#000000", // Black
  "#ffffff", // White (Eraser)
  "#9ca3af", // Gray
  "#ef4444", // Red
  "#f97316", // Orange
  "#f59e0b", // Amber
  "#eab308", // Yellow
  "#84cc16", // Lime
  "#22c55e", // Green
  "#10b981", // Emerald
  "#14b8a6", // Teal
  "#06b6d4", // Cyan
  "#0ea5e9", // Sky
  "#3b82f6", // Blue
  "#6366f1", // Indigo
  "#8b5cf6", // Violet
  "#a855f7", // Purple
  "#d946ef", // Fuchsia
  "#ec4899", // Pink
  "#f43f5e", // Rose
  "#78350f", // Brown
];  

export default function DrawPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const [lineWidth, setLineWidth] = useState(5);
  type ToolType = "brush" | "spray" | "watercolor" | "pastel" | "fill";
  const [tool, setTool] = useState<ToolType>("brush");

  const executeDrawings = (drawings: any[]) => {
    const ctx = contextRef.current;
    if (!ctx) return;
    ctx.save();
    drawings.forEach(draw => {
      ctx.beginPath();
      if (draw.color) {
        if (draw.fill) ctx.fillStyle = draw.color;
        else ctx.strokeStyle = draw.color;
      }
      if (draw.lineWidth) ctx.lineWidth = draw.lineWidth;
      if (draw.type === "circle") {
        ctx.arc(draw.x, draw.y, draw.radius, 0, Math.PI * 2);
      } else if (draw.type === "rect") {
        ctx.rect(draw.x, draw.y, draw.width, draw.height);
      } else if (draw.type === "line") {
        ctx.moveTo(draw.x1, draw.y1);
        ctx.lineTo(draw.x2, draw.y2);
      }
      if (draw.fill) ctx.fill();
      else ctx.stroke();
    });
    ctx.restore();
  };

  const getCanvasImage = (): string | null => {
    if (!canvasRef.current) return null;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasRef.current.width;
    tempCanvas.height = canvasRef.current.height;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return null;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    ctx.drawImage(canvasRef.current, 0, 0);
    return tempCanvas.toDataURL("image/jpeg", 0.8);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Support high-DPI displays by using a larger internal canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;

    const context = canvas.getContext("2d");
    if (!context) return;
    
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    contextRef.current = context;
  }, []);
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = lineWidth;
    }
  }, [color, lineWidth]);

  const hexToRgba = (hex: string) => {
    if (hex === "#ffffff") return [255, 255, 255, 255];
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b, 255];
  };

  const floodFill = (startX: number, startY: number, fillColorHex: string) => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;
    const x = Math.floor(startX * 2);
    const y = Math.floor(startY * 2);
    const width = canvas.width;
    const height = canvas.height;
    
    if (x < 0 || x >= width || y < 0 || y >= height) return;

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const startPos = (y * width + x) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];
    const startA = data[startPos + 3];

    const [fillR, fillG, fillB, fillA] = hexToRgba(fillColorHex);

    if (startR === fillR && startG === fillG && startB === fillB && startA === fillA) return;

    const matchStartColor = (pos: number) => {
      return (
        data[pos] === startR &&
        data[pos + 1] === startG &&
        data[pos + 2] === startB &&
        data[pos + 3] === startA
      );
    };

    const colorPixel = (pos: number) => {
      data[pos] = fillR;
      data[pos + 1] = fillG;
      data[pos + 2] = fillB;
      data[pos + 3] = fillA;
    };

    const stack = [[x, y]];

    while (stack.length > 0) {
      const [curX, curY] = stack.pop()!;
      let tempY = curY;
      let pos = (tempY * width + curX) * 4;

      while (tempY >= 0 && matchStartColor(pos)) {
        tempY--;
        pos -= width * 4;
      }
      
      tempY++;
      pos += width * 4;
      
      let reachLeft = false;
      let reachRight = false;

      while (tempY < height && matchStartColor(pos)) {
        colorPixel(pos);

        if (curX > 0) {
          if (matchStartColor(pos - 4)) {
            if (!reachLeft) {
              stack.push([curX - 1, tempY]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }

        if (curX < width - 1) {
          if (matchStartColor(pos + 4)) {
            if (!reachRight) {
              stack.push([curX + 1, tempY]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }

        tempY++;
        pos += width * 4;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const drawAtCoordinates = (offsetX: number, offsetY: number) => {
    const ctx = contextRef.current;
    if (!ctx) return;

    if (tool === "spray") {
      ctx.globalAlpha = 1.0;
      const density = lineWidth * 3;
      for (let i = 0; i < density; i++) {
        const radius = lineWidth;
        const offsetAngle = Math.random() * Math.PI * 2;
        const offsetRadius = Math.random() * radius;
        const x = offsetX + Math.cos(offsetAngle) * offsetRadius;
        const y = offsetY + Math.sin(offsetAngle) * offsetRadius;
        
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    } else if (tool === "watercolor") {
      ctx.globalAlpha = 0.03;
      ctx.beginPath();
      ctx.arc(offsetX, offsetY, lineWidth, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    } else if (tool === "pastel") {
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      const radius = lineWidth / 2;
      for (let i = 0; i < 10; i++) {
        const x = offsetX + (Math.random() - 0.5) * radius * 2;
        const y = offsetY + (Math.random() - 0.5) * radius * 2;
        ctx.moveTo(x, y);
        ctx.arc(x, y, Math.random() * 2 + 0.5, 0, Math.PI * 2);
      }
      ctx.fillStyle = color;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const { offsetX, offsetY } = getCoordinates(e);
    
    if (tool === "fill") {
      floodFill(offsetX, offsetY, color);
      return;
    }

    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);

    if (tool !== "brush") {
      drawAtCoordinates(offsetX, offsetY);
    }
  };

  const finishDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { offsetX, offsetY } = getCoordinates(e);
    
    const ctx = contextRef.current;
    if (!ctx) return;

    if (tool === "brush") {
      ctx.globalAlpha = 1.0;
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    } else {
      drawAtCoordinates(offsetX, offsetY);
    }
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { offsetX: 0, offsetY: 0 };
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY
      };
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "my-masterpiece.png";
      link.href = dataUrl;
      link.click();
    }
  };

  const tools: { id: ToolType; label: string; icon: string; span?: boolean }[] = [
    { id: "brush", label: "Brush", icon: "🖌️" },
    { id: "spray", label: "Spray", icon: "💨" },
    { id: "watercolor", label: "Water", icon: "💧" },
    { id: "pastel", label: "Pastel", icon: "🖍️" },
    { id: "fill", label: "Fill", icon: "🪣", span: true },
  ];

  return (
    <div className="min-h-screen font-sans text-slate-700 flex flex-col relative">
      <ClayBlobs colors={["bg-pink-300", "bg-violet-300", "bg-sky-300"]} />
      <ClayNav brand="Bx." links={[{ href: "/games", label: "Back to Games" }]} />
      <main className="flex-grow flex flex-col md:flex-row items-center justify-center p-6 gap-6 max-w-6xl mx-auto w-full">
        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
          className="clay bg-surface/80 backdrop-blur-sm p-6 flex flex-row md:flex-col gap-6 w-full md:w-64 overflow-x-auto"
        >
          <h2 className="clay-sm bg-amber-200 text-amber-900 text-2xl font-black tracking-tight px-4 py-1 -rotate-2 hidden md:inline-block w-max animate-wiggle">
            Tools
          </h2>

          <div className="flex flex-col gap-2 min-w-max">
            <span className="font-extrabold uppercase text-sm text-slate-500">Mode</span>
            <div className="grid grid-cols-2 gap-2.5">
              {tools.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTool(t.id)}
                  className={`${t.span ? "col-span-2" : ""} font-extrabold px-2 py-2 text-xs sm:text-sm flex items-center justify-center gap-1 transition-all ${
                    tool === t.id
                      ? "clay-inset bg-violet-200 text-violet-900 scale-95"
                      : "clay-btn bg-surface text-slate-600"
                  }`}
                >
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-max">
            <span className="font-extrabold uppercase text-sm text-slate-500">Colors</span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {COLORS.map((c) => (
                <motion.button
                  key={c}
                  onClick={() => setColor(c)}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.85 }}
                  animate={{ scale: color === c ? 1.15 : 1 }}
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                    color === c ? "ring-4 ring-violet-300 ring-offset-2 ring-offset-surface z-10" : ""
                  }`}
                  style={{
                    backgroundColor: c,
                    boxShadow: "0 4px 8px -2px rgba(88,80,160,0.35), inset -3px -3px 6px rgba(0,0,0,0.18), inset 3px 3px 6px rgba(255,255,255,0.5)",
                  }}
                  title={c === "#ffffff" ? "Eraser" : "Color"}
                >
                  {c === "#ffffff" && <span className="text-[10px] md:text-xs font-black text-[#64748b]">ER</span>}
                </motion.button>
              ))}
              <label
                className="w-8 h-8 md:w-10 md:h-10 rounded-full transition-transform hover:scale-110 flex items-center justify-center cursor-pointer bg-[conic-gradient(red,yellow,lime,aqua,blue,magenta,red)] relative"
                style={{ boxShadow: "0 4px 8px -2px rgba(88,80,160,0.35), inset -3px -3px 6px rgba(0,0,0,0.18), inset 3px 3px 6px rgba(255,255,255,0.5)" }}
                title="Custom Color"
              >
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="opacity-0 absolute w-0 h-0"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-max">
            <span className="font-extrabold uppercase text-sm text-slate-500">Brush Size ({lineWidth}px)</span>
            <div className="clay-inset bg-slate-50 px-3 py-2">
              <input
                type="range"
                min="1"
                max="50"
                value={lineWidth}
                onChange={(e) => setLineWidth(parseInt(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-3 mt-auto min-w-max">
            <button
              onClick={clearCanvas}
              className="clay-btn bg-rose-300 text-rose-900 font-extrabold px-4 py-2.5"
            >
              🧽 Clear
            </button>
            <button
              onClick={saveCanvas}
              className="clay-btn bg-sky-300 text-sky-900 font-extrabold px-4 py-2.5"
            >
              💾 Save Image
            </button>
          </div>
        </motion.div>

        {/* Canvas Area */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 18, delay: 0.1 }}
          className="flex-grow w-full max-w-3xl flex flex-col items-center"
        >
          <div className="clay w-full bg-surface/80 p-3 md:p-4 relative">
            <div className="clay-sm absolute -top-5 -right-3 bg-pink-200 text-pink-900 px-4 py-1 font-black text-xl rotate-3 z-10 animate-float">
              Draw Here! ✏️
            </div>
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseUp={finishDrawing}
              onMouseOut={finishDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={finishDrawing}
              onTouchMove={draw}
              className="w-full h-[60vh] md:h-[70vh] rounded-[1.5rem] bg-white cursor-crosshair touch-none shadow-[inset_4px_4px_10px_rgba(88,80,160,0.15)]"
            />
          </div>
        </motion.div>
      </main>

      <GeminiChat
        getCanvasImage={getCanvasImage}
        onDrawingCommands={executeDrawings}
        pageContext="Ini adalah halaman Drawing Canvas di portofolio Bryant. Pengguna bisa menggambar bebas dengan berbagai alat (brush, spray, watercolor, pastel, fill). Kamu bisa melihat gambar di kanvas dan menggambar di atasnya."
      />
    </div>
  );
}
