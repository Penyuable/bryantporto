"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const PRIZES = [
  { text: "iPhone 15", color: "#f87171" },   // red-400
  { text: "Zonk!", color: "#d1d5db" },       // gray-300
  { text: "Rp 1 Juta", color: "#facc15" },   // yellow-400
  { text: "Zonk!", color: "#d1d5db" },       // gray-300
  { text: "MacBook", color: "#4ade80" },     // green-400
  { text: "Zonk!", color: "#d1d5db" },       // gray-300
  { text: "PS5", color: "#60a5fa" },         // blue-400
  { text: "Zonk!", color: "#d1d5db" }        // gray-300
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
    <div className="min-h-screen font-sans selection:bg-yellow-300 bg-gray-50 flex flex-col overflow-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b-4 border-black">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black tracking-tighter uppercase hover:underline underline-offset-4 decoration-4">
            SB.
          </Link>
          <div className="flex gap-6 font-bold text-lg">
            <Link href="/games" className="hover:underline underline-offset-4 decoration-4">Back to Games</Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center p-6 relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-pink-300 border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -z-10" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-12 -z-10" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="bg-white border-4 border-black p-4 md:p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center w-full max-w-xl z-10"
        >
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8 bg-purple-300 px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2">
            Lucky Spin
          </h1>
          
          <div className="relative flex flex-col items-center mb-8">
            {/* Pointer */}
            <svg 
              className="absolute -top-6 z-20 w-12 h-12 text-pink-500 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              stroke="black" 
              strokeWidth="1.5"
            >
              <path d="M12 22L2 2h20L12 22z" />
            </svg>

            {/* Wheel */}
            <div 
              className="relative w-72 h-72 md:w-80 md:h-80 rounded-full border-8 border-black overflow-hidden shadow-[8px_8px_0px_rgba(0,0,0,1)]"
              style={{
                background: `conic-gradient(${gradient})`,
                transition: `transform ${SPIN_DURATION}s cubic-bezier(0.2, 0.8, 0.2, 1)`,
                transform: `rotate(${rotation}deg)`
              }}
            >
              {/* Lines and Text */}
              {PRIZES.map((prize, i) => {
                const angle = i * SLICE_ANGLE + (SLICE_ANGLE / 2);
                return (
                  <React.Fragment key={i}>
                    {/* Border line */}
                    <div
                      className="absolute top-0 left-1/2 w-1 h-1/2 bg-black origin-bottom -translate-x-1/2 z-10"
                      style={{ transform: `rotate(${i * SLICE_ANGLE}deg)` }}
                    />
                    {/* Text */}
                    <div 
                      className="absolute w-full h-full z-10"
                      style={{ transform: `rotate(${angle}deg)` }}
                    >
                      <span 
                        className="absolute left-1/2 top-4 md:top-6 -translate-x-1/2 font-black text-black uppercase whitespace-nowrap text-[10px] md:text-sm drop-shadow-md"
                      >
                        {prize.text}
                      </span>
                    </div>
                  </React.Fragment>
                );
              })}
              {/* Center Dot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-full z-20 shadow-inner" />
            </div>
          </div>

          <button 
            onClick={spin}
            disabled={isSpinning}
            className={`font-black text-2xl uppercase border-4 border-black px-8 py-4 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${
              isSpinning 
                ? "bg-gray-300 translate-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-not-allowed" 
                : "bg-yellow-300 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none"
            }`}
          >
            {isSpinning ? "Spinning..." : "SPIN NOW!"}
          </button>

          {/* Result Popup Overlay */}
          {result && !isSpinning && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute inset-0 flex items-center justify-center z-50 p-6"
            >
              <div className="bg-white border-8 border-black p-8 flex flex-col items-center shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rotate-2 max-w-sm w-full">
                <h2 className="text-4xl font-black uppercase mb-2">
                  {result === "Zonk!" ? "Ouch!" : "Winner!"}
                </h2>
                <p className="text-2xl font-bold bg-green-300 border-2 border-black px-4 py-2 mb-6 text-center">
                  You got: {result}
                </p>
                <button 
                  onClick={() => setResult(null)}
                  className="bg-black text-white font-bold text-xl px-6 py-2 border-4 border-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-transform"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}

        </motion.div>
      </main>
    </div>
  );
}
