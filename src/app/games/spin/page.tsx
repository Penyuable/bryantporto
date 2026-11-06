"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import GeminiChat from "@/components/GeminiChat";
import ClayNav from "@/components/ClayNav";
import ClayBlobs from "@/components/ClayBlobs";

const PRIZES = [
  { text: "iPhone 15", color: "#fca5a5" },   // red-300
  { text: "Zonk!", color: "#e2e8f0" },       // slate-200
  { text: "Rp 1 Juta", color: "#fde68a" },   // amber-200
  { text: "Zonk!", color: "#e2e8f0" },       // slate-200
  { text: "MacBook", color: "#86efac" },     // green-300
  { text: "Zonk!", color: "#e2e8f0" },       // slate-200
  { text: "PS5", color: "#93c5fd" },         // blue-300
  { text: "Zonk!", color: "#e2e8f0" }        // slate-200
];

const SPIN_DURATION = 4; // seconds
const SLICE_ANGLE = 360 / PRIZES.length;

export default function SpinWheelPage() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setResult(null);

    // Randomize rotation: 5 to 10 extra full spins + a random stop point
    const extraSpins = Math.floor(Math.random() * 5) + 5; 
    const randomDegree = Math.floor(Math.random() * 360);
    const newRotation = rotation + (extraSpins * 360) + randomDegree;
    
    setRotation(newRotation);

    setTimeout(() => {
      const normalizedRotation = newRotation % 360;
      // Calculate winning angle considering the pointer is at 0 degrees (top).
      // If we rotate clockwise by R, the top now points to (360 - R).
      const winningAngle = (360 - normalizedRotation) % 360;
      const winningIndex = Math.floor(winningAngle / SLICE_ANGLE);
      
      setResult(PRIZES[winningIndex].text);
      setIsSpinning(false);
    }, SPIN_DURATION * 1000);
  };

  const gradient = PRIZES.map((p, i) => {
    const start = i * SLICE_ANGLE;
    const end = (i + 1) * SLICE_ANGLE;
    return `${p.color} ${start}deg ${end}deg`;
  }).join(", ");

  return (
    <div className="min-h-screen font-sans text-slate-700 flex flex-col overflow-hidden relative">
      <ClayBlobs colors={["bg-violet-300", "bg-pink-300", "bg-amber-300"]} />
      <ClayNav links={[{ href: "/games", label: "Back to Games" }]} />

      <main className="flex-grow flex items-center justify-center p-6 relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-pink-200 clay rounded-full! animate-float" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-amber-200 clay rotate-12 animate-float-slow" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
          className="clay bg-surface/80 backdrop-blur-sm p-5 md:p-8 flex flex-col items-center w-full max-w-xl z-10"
        >
          <h1 className="clay bg-violet-200 text-3xl md:text-5xl font-black tracking-tight text-violet-900 mb-10 px-6 py-3 -rotate-2 animate-squish">
            Lucky Spin 🎡
          </h1>

          <div className="relative flex flex-col items-center mb-10">
            {/* Pointer */}
            <svg
              className={`absolute -top-7 z-20 w-12 h-12 text-pink-400 drop-shadow-[0_4px_4px_rgba(190,24,93,0.35)] ${isSpinning ? "animate-wiggle" : ""}`}
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
            >
              <path d="M12 22L2 2h20L12 22z" />
            </svg>

            {/* Wheel rim */}
            <div className="clay rounded-full! bg-surface p-3">
              {/* Wheel */}
              <div
                className="relative w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden"
                style={{
                  background: `conic-gradient(${gradient})`,
                  transition: `transform ${SPIN_DURATION}s cubic-bezier(0.2, 0.8, 0.2, 1)`,
                  transform: `rotate(${rotation}deg)`,
                  boxShadow: "inset 0 0 0 4px rgba(255,255,255,0.6), inset -10px -10px 24px rgba(0,0,0,0.12), inset 10px 10px 24px rgba(255,255,255,0.45)",
                }}
              >
                {/* Lines and Text */}
                {PRIZES.map((prize, i) => {
                  const angle = i * SLICE_ANGLE + (SLICE_ANGLE / 2);
                  return (
                    <React.Fragment key={i}>
                      {/* Divider line */}
                      <div
                        className="absolute top-0 left-1/2 w-1 h-1/2 bg-surface/80 origin-bottom -translate-x-1/2 z-10 rounded-full"
                        style={{ transform: `rotate(${i * SLICE_ANGLE}deg)` }}
                      />
                      {/* Text */}
                      <div
                        className="absolute w-full h-full z-10"
                        style={{ transform: `rotate(${angle}deg)` }}
                      >
                        <span
                          className="absolute left-1/2 top-4 md:top-6 -translate-x-1/2 font-black text-[#1e293b] uppercase whitespace-nowrap text-[10px] md:text-sm drop-shadow-[0_1px_0_rgba(255,255,255,0.7)]"
                        >
                          {prize.text}
                        </span>
                      </div>
                    </React.Fragment>
                  );
                })}
                {/* Center knob */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-surface rounded-full z-20"
                  style={{ boxShadow: "0 6px 12px rgba(88,80,160,0.35), inset -4px -4px 8px rgba(0,0,0,0.1), inset 4px 4px 8px rgba(255,255,255,0.9)" }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={spin}
            disabled={isSpinning}
            className={`clay-btn font-black text-2xl uppercase px-10 py-4 ${
              isSpinning ? "bg-slate-200 text-slate-500" : "bg-amber-200 text-amber-900"
            }`}
          >
            {isSpinning ? "Spinning..." : "SPIN NOW!"}
          </button>

          {/* Result Popup Overlay */}
          {result && !isSpinning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 14 }}
              className="absolute inset-0 flex items-center justify-center z-50 p-6"
            >
              <div className="clay bg-surface p-8 flex flex-col items-center rotate-2 max-w-sm w-full">
                <motion.div
                  initial={{ rotate: -20, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10, delay: 0.15 }}
                  className="text-6xl mb-2"
                >
                  {result === "Zonk!" ? "😵" : "🎉"}
                </motion.div>
                <h2 className="text-4xl font-black text-slate-800 mb-3">
                  {result === "Zonk!" ? "Ouch!" : "Winner!"}
                </h2>
                <p className={`clay-sm ${result === "Zonk!" ? "bg-slate-200" : "bg-emerald-200 text-emerald-900"} text-2xl font-extrabold px-5 py-2 mb-6 text-center`}>
                  You got: {result}
                </p>
                <button
                  onClick={() => setResult(null)}
                  className="clay-btn bg-violet-400 text-white font-extrabold text-xl px-8 py-2"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}

        </motion.div>
      </main>
      <GeminiChat
        pageContext="Ini adalah game Spin Wheel (putar roda) di portofolio Bryant. Pengguna menekan tombol SPIN untuk memutar roda berhadiah. Hadiahnya acak dan lucu-lucuan saja (tidak nyata). Bantu pengguna bersenang-senang."
      />
    </div>
  );
}
