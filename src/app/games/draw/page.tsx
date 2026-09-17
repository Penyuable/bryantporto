"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatQuery, setChatQuery] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const executeDrawings = (drawings: any[]) => {
    const ctx = contextRef.current;
    if (!ctx) return;
    
    // Save current context state
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
    
    // Restore context to previous user settings
    ctx.restore();
  };

  const handleAskGemini = async () => {
    if (!chatQuery.trim()) return;
    setIsChatLoading(true);
    // Move current query to response so user knows what they asked
    const currentQuery = chatQuery;
    setChatResponse("");
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
      
      const parts: any[] = [{ text: currentQuery }];
      
      // Ambil gambar dari kanvas
      if (canvasRef.current) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvasRef.current.width;
        tempCanvas.height = canvasRef.current.height;
        const ctx = tempCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          ctx.drawImage(canvasRef.current, 0, 0);
          
          const dataUrl = tempCanvas.toDataURL("image/jpeg", 0.8);
          const base64Data = dataUrl.split(',')[1];
          if (base64Data) {
            parts.push({
              inlineData: {
                data: base64Data,
                mimeType: "image/jpeg"
              }
            });
          }
        }
      }

      let model = "gemini-3.6-flash";      
      const systemInstruction = {
        parts: [{ 
          text: `Kamu adalah asisten menggambar pintar. Pengguna bisa memintamu menggambar di atas kanvas mereka. Jika mereka meminta kamu menggambar sesuatu (misalnya, gambarkan kotak, lingkaran merah, dll), kamu harus membalas HANYA dengan JSON murni dalam format berikut, tanpa markdown blok backtick:
{
  "message": "Pesan yang kamu sampaikan ke pengguna (misal: Ini gambar kotak merah)",
  "drawings": [
    { "type": "circle", "x": 400, "y": 300, "radius": 50, "color": "#ff0000", "fill": true },
    { "type": "rect", "x": 200, "y": 200, "width": 100, "height": 100, "color": "#00ff00", "fill": false },
    { "type": "line", "x1": 0, "y1": 0, "x2": 100, "y2": 100, "color": "#0000ff", "lineWidth": 5 }
  ]
}
Lebar kanvas terlihat sekitar 800px dan tinggi 600px. Gunakan format kordinat x dan y (dikalikan 2 karena display).
Jika pengguna HANYA BERTANYA dan tidak menyuruh menggambar, tetap jawab dalam format JSON tersebut dengan "drawings" berupa array kosong [].`
        }]
      };
      
      let res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          systemInstruction: systemInstruction,
          contents: [{ parts: parts }]
        })
      });
      
      let data = await res.json();
      
      // If high demand or interactions API restriction, fallback
      if (data.error && data.error.message && (data.error.message.includes("high demand") || data.error.message.includes("Interactions API"))) {
         model = "gemini-3.5-flash";
         res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              systemInstruction: systemInstruction,
              contents: [{ parts: parts }]
            })
          });
         data = await res.json();
      }

      if (data.candidates && data.candidates.length > 0) {
        let textResult = data.candidates[0].content.parts[0].text;
        textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
        try {
          const parsed = JSON.parse(textResult);
          setChatResponse(parsed.message || "Selesai!");
          if (parsed.drawings && Array.isArray(parsed.drawings) && parsed.drawings.length > 0) {
            executeDrawings(parsed.drawings);
          }
        } catch (e) {
          setChatResponse(textResult);
        }
      } else if (data.error) {
        setChatResponse(`Error: ${data.error.message || "Failed to get response"}`);
      } else {
        setChatResponse("Maaf, terjadi kesalahan atau tidak ada jawaban.");
      }
    } catch (e) {
      setChatResponse("Error connecting to Gemini AI.");
    } finally {
      setIsChatLoading(false);
      setChatQuery("");
    }
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

      {/* Floating Chat UI */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-80 sm:w-96 mb-4 flex flex-col gap-3"
          >
            <div className="flex justify-between items-center border-b-2 border-black pb-2">
              <h3 className="font-black uppercase tracking-tight text-lg bg-yellow-300 px-2 py-1 border-2 border-black -rotate-2">Tanya Gemini</h3>
              <button 
                onClick={() => setIsChatOpen(false)} 
                className="font-black text-xl hover:text-red-500 hover:scale-110 transition-transform"
              >
                X
              </button>
            </div>
            
            <div className="h-64 overflow-y-auto border-2 border-black p-3 bg-blue-50 text-sm flex flex-col gap-3">
              <div className="bg-white border-2 border-black p-2 self-start rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                Halo! Aku agen AI Gemini-mu. Ada yang ingin kamu tanyakan?
              </div>
              
              {chatResponse && (
                <div className="bg-yellow-200 border-2 border-black p-2 self-start rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] whitespace-pre-wrap">
                  {chatResponse}
                </div>
              )}
              
              {isChatLoading && (
                <div className="bg-gray-200 border-2 border-black p-2 self-start rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] animate-pulse">
                  Berpikir...
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <input 
                type="text" 
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskGemini()}
                placeholder="Ketik pertanyaanmu..."
                className="flex-grow border-2 border-black p-2 text-sm focus:outline-none focus:bg-yellow-100 font-medium"
              />
              <button 
                onClick={handleAskGemini}
                disabled={isChatLoading || !chatQuery.trim()}
                className="bg-green-400 font-black uppercase border-2 border-black px-4 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform"
              >
                Kirim
              </button>
            </div>
          </motion.div>
        )}
        
        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="bg-purple-400 font-black uppercase border-4 border-black w-16 h-16 rounded-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform hover:rotate-12 flex items-center justify-center group relative"
          >
            <span className="text-3xl group-hover:animate-bounce">🤖</span>
            <span className="absolute -top-2 -right-2 bg-yellow-300 border-2 border-black text-xs px-2 py-0.5 font-bold rounded-full animate-pulse">
              AI
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
