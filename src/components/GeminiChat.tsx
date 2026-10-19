"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type GeminiChatProps = {
  /** Optional: pass a function that returns a base64 JPEG data URL for visual context */
  getCanvasImage?: () => string | null;
  /** Optional: extra system context (e.g. game state, page info) */
  pageContext?: string;
  /** Optional: callback when AI returns drawing commands */
  onDrawingCommands?: (drawings: any[]) => void;
};

async function callGemini(
  messages: Message[],
  imagePart: { data: string; mimeType: string } | null,
  systemPrompt: string
): Promise<string> {
  const models = ["gemini-3.6-flash", "gemini-3.5-flash"];

  for (const model of models) {
    const userParts: any[] = [];
    const lastUser = [...messages].reverse().find(m => m.role === "user");
    if (lastUser) userParts.push({ text: lastUser.content });
    if (imagePart) userParts.push({ inlineData: imagePart });

    const history: any[] = [];
    let skippedLast = false;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user" && !skippedLast) {
        skippedLast = true;
        continue;
      }
      history.unshift({
        role: messages[i].role === "user" ? "user" : "model",
        parts: [{ text: messages[i].content }]
      });
    }

    const body: any = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [...history, { role: "user", parts: userParts }]
    };

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );
      const data = await res.json();
      if (data.error) {
        const msg: string = data.error.message || "";
        if (msg.includes("high demand") || msg.includes("Interactions API") || msg.includes("UNAVAILABLE")) {
          continue;
        }
        throw new Error(msg);
      }
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
    } catch (e: any) {
      if (e.message?.includes("high demand") || e.message?.includes("UNAVAILABLE")) continue;
      throw e;
    }
  }
  throw new Error("Semua model AI sedang sibuk. Coba lagi sebentar lagi.");
}

export default function GeminiChat({ getCanvasImage, pageContext, onDrawingCommands }: GeminiChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const canDraw = !!onDrawingCommands;

  const systemPrompt = `Kamu adalah asisten AI cerdas bernama Gemini yang tertanam di dalam website portofolio Bryant (Bryxy), seorang developer dari Indonesia.
Kamu membantu pengguna menjawab pertanyaan, memahami konten halaman ini, dan bisa berinteraksi dengan elemen halaman.
Gunakan bahasa Indonesia yang ramah, singkat, dan helpful.

${pageContext ? `Konteks halaman saat ini:\n${pageContext}` : ""}

${canDraw ? `Kamu juga bisa menggambar di kanvas halaman ini. Jika pengguna memintamu menggambar sesuatu, balas HANYA dengan JSON murni (tanpa backtick markdown) dalam format:
{
  "message": "Pesan ke pengguna",
  "drawings": [
    { "type": "circle", "x": 400, "y": 300, "radius": 50, "color": "#ff0000", "fill": true },
    { "type": "rect", "x": 200, "y": 200, "width": 100, "height": 100, "color": "#00ff00", "fill": false },
    { "type": "line", "x1": 0, "y1": 0, "x2": 300, "y2": 300, "color": "#0000ff", "lineWidth": 5 }
  ]
}
Lebar kanvas sekitar 800px dan tinggi 600px. Koordinat canvas sudah dalam skala 1:1 (tidak perlu dikalikan).
Jika tidak ada yang digambar, tetap balas JSON dengan "drawings": [].
Jika pengguna hanya bertanya biasa tanpa menyuruh menggambar, balas teks biasa (bukan JSON).` : "Balas dengan teks biasa yang informatif dan ramah."}`;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      let imagePart: { data: string; mimeType: string } | null = null;
      if (getCanvasImage) {
        const dataUrl = getCanvasImage();
        if (dataUrl) {
          const base64 = dataUrl.split(",")[1];
          if (base64) imagePart = { data: base64, mimeType: "image/jpeg" };
        }
      }

      const rawText = await callGemini(newMessages, imagePart, systemPrompt);

      let displayMsg = rawText;
      const cleanRaw = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      try {
        const parsed = JSON.parse(cleanRaw);
        displayMsg = parsed.message || "Selesai!";
        if (canDraw && parsed.drawings && Array.isArray(parsed.drawings) && parsed.drawings.length > 0) {
          onDrawingCommands!(parsed.drawings);
        }
      } catch {
        // plain text response
      }

      setMessages(prev => [...prev, { role: "assistant", content: displayMsg }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { role: "assistant", content: `❌ ${e.message || "Terjadi error, coba lagi."}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-80 sm:w-96 mb-4 flex flex-col"
            style={{ maxHeight: "80vh" }}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b-4 border-black p-3 bg-purple-400 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                <div>
                  <h3 className="font-black uppercase tracking-tight text-sm leading-none">Gemini AI</h3>
                  <p className="text-xs font-bold opacity-70 leading-none mt-0.5">
                    {canDraw ? "Asisten & Pelukis AI" : "Asisten Pintarmu"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="font-black text-lg w-8 h-8 border-2 border-black bg-white flex items-center justify-center hover:bg-red-400 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-3 bg-slate-50 flex flex-col gap-3 min-h-0"
              style={{ maxHeight: "340px" }}
            >
              {messages.length === 0 && (
                <div className="bg-white border-2 border-black p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] text-sm leading-relaxed">
                  Halo! Aku Gemini AI 👋
                  {canDraw
                    ? " Aku bisa melihat kanvasmu, menjawab pertanyaan, dan menggambar untukmu!"
                    : " Tanyakan apa saja tentang portofolio ini!"}
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`text-sm p-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] whitespace-pre-wrap max-w-[85%] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-yellow-300 self-end rounded-tl-xl rounded-bl-xl rounded-br-xl ml-auto"
                      : "bg-white self-start rounded-tr-xl rounded-br-xl rounded-bl-xl"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              {isLoading && (
                <div className="bg-gray-200 border-2 border-black p-3 self-start rounded-tr-xl rounded-br-xl rounded-bl-xl text-sm animate-pulse shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]">
                  ✦ Sedang berpikir...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="flex border-t-4 border-black shrink-0">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder={canDraw ? "Tanya atau minta AI menggambar..." : "Ketik pertanyaanmu..."}
                className="flex-1 p-3 text-sm focus:outline-none focus:bg-yellow-50 border-r-2 border-black font-medium"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-green-400 font-black text-lg px-4 border-l-2 border-black hover:-translate-y-0.5 transition-transform disabled:opacity-40 disabled:hover:translate-y-0 active:translate-y-0 shrink-0"
              >
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        onClick={() => setIsOpen(prev => !prev)}
        whileHover={{ scale: 1.1, rotate: isOpen ? 0 : 12 }}
        whileTap={{ scale: 0.95 }}
        className="bg-purple-400 border-4 border-black w-16 h-16 rounded-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center relative"
      >
        <span className="text-3xl">{isOpen ? "✕" : "🤖"}</span>
        {!isOpen && (
          <span className="absolute -top-2 -right-2 bg-yellow-300 border-2 border-black text-[10px] px-1.5 py-0.5 font-black rounded-full animate-pulse">
            AI
          </span>
        )}
      </motion.button>
    </div>
  );
}
