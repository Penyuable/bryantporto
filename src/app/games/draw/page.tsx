"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import GeminiChat from "@/components/GeminiChat";

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

  return (
    <div className="min-h-screen font-sans selection:bg-yellow-300 bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b-4 border-black">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black tracking-tighter uppercase hover:underline underline-offset-4 decoration-4">
            Bryxy.
          </Link>
          <div className="flex gap-6 font-bold text-lg">
            <Link href="/games" className="hover:underline underline-offset-4 decoration-4">Back to Games</Link>
          </div>
        </div>
      </nav>
      <main className="flex-grow flex flex-col md:flex-row items-center justify-center p-6 gap-6 max-w-6xl mx-auto w-full">
        {/* Toolbar */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-row md:flex-col gap-6 w-full md:w-64 overflow-x-auto"
        >
          <h2 className="text-2xl font-black uppercase tracking-tighter bg-yellow-300 px-2 py-1 border-2 border-black -rotate-2 hidden md:inline-block w-max">
            Tools
          </h2>

          <div className="flex flex-col gap-2 min-w-max">
            <span className="font-bold uppercase text-sm">Mode</span>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setTool("brush")}
                className={`font-bold uppercase border-4 border-black px-2 py-1 transition-transform text-xs sm:text-sm ${tool === "brush" ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" : "bg-white hover:bg-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"}`}
              >
                Brush
              </button>
              <button 
                onClick={() => setTool("spray")}
                className={`font-bold uppercase border-4 border-black px-2 py-1 transition-transform text-xs sm:text-sm ${tool === "spray" ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" : "bg-white hover:bg-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"}`}
              >
                Spray
              </button>
              <button 
                onClick={() => setTool("watercolor")}
                className={`font-bold uppercase border-4 border-black px-2 py-1 transition-transform text-xs sm:text-sm ${tool === "watercolor" ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" : "bg-white hover:bg-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"}`}
              >
                Water
              </button>
              <button 
                onClick={() => setTool("pastel")}
                className={`font-bold uppercase border-4 border-black px-2 py-1 transition-transform text-xs sm:text-sm ${tool === "pastel" ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" : "bg-white hover:bg-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"}`}
              >
                Pastel
              </button>
              <button 
                onClick={() => setTool("fill")}
                className={`col-span-2 font-bold uppercase border-4 border-black px-2 py-1 transition-transform text-xs sm:text-sm ${tool === "fill" ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" : "bg-white hover:bg-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"}`}
              >
                Fill
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-max">
            <span className="font-bold uppercase text-sm">Colors</span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 md:w-10 md:h-10 border-4 border-black transition-transform flex items-center justify-center ${
                    color === c ? "scale-110 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10" : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                  title={c === "#ffffff" ? "Eraser" : "Color"}
                >
                  {c === "#ffffff" && <span className="text-[10px] md:text-xs font-bold text-black">ER</span>}
                </button>
              ))}
              <label 
                className="w-8 h-8 md:w-10 md:h-10 border-4 border-black transition-transform hover:scale-105 flex items-center justify-center cursor-pointer bg-[conic-gradient(red,yellow,lime,aqua,blue,magenta,red)]"
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
            <span className="font-bold uppercase text-sm">Brush Size ({lineWidth}px)</span>
            <input 
              type="range" 
              min="1" 
              max="50" 
              value={lineWidth} 
              onChange={(e) => setLineWidth(parseInt(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>

          <div className="flex flex-row md:flex-col gap-2 mt-auto min-w-max">
            <button 
              onClick={clearCanvas}
              className="bg-red-400 font-bold uppercase border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]"
            >
              Clear
            </button>
            <button 
              onClick={saveCanvas}
              className="bg-blue-300 font-bold uppercase border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]"
            >
              Save Image
            </button>
          </div>
        </motion.div>

        {/* Canvas Area */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex-grow w-full max-w-3xl flex flex-col items-center"
        >
          <div className="w-full bg-white border-4 border-black p-2 md:p-4 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
            <div className="absolute -top-5 -right-5 bg-pink-300 border-4 border-black px-4 py-1 font-black uppercase text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-3 z-10">
              Draw Here!
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
              className="w-full h-[60vh] md:h-[70vh] border-2 border-black bg-white cursor-crosshair touch-none"
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
