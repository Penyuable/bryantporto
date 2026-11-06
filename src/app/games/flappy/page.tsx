"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import GeminiChat from "@/components/GeminiChat";
import ClayNav from "@/components/ClayNav";
import ClayBlobs from "@/components/ClayBlobs";

const GAME_WIDTH = 400;
const GAME_HEIGHT = 500;
const GRAVITY = 0.5;
const JUMP = -8;
const PIPE_SPEED = 3;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const BIRD_SIZE = 30;

export default function FlappyBirdPage() {
  const [birdPos, setBirdPos] = useState(GAME_HEIGHT / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<{x: number, topHeight: number}[]>([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const jump = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
      setBirdPos(GAME_HEIGHT / 2);
      setPipes([]);
      setScore(0);
      setIsGameOver(false);
    }
    
    if (!isGameOver) {
      setBirdVelocity(JUMP);
    }
  }, [gameStarted, isGameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jump]);

  useEffect(() => {
    if (gameStarted && !isGameOver) {
      gameLoopRef.current = setInterval(() => {
        // Update bird
        setBirdPos((p) => p + birdVelocity);
        setBirdVelocity((v) => v + GRAVITY);
        setPipes((currentPipes) => {
          let newPipes = currentPipes
            .map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
            .filter((pipe) => pipe.x + PIPE_WIDTH > 0);
          if (newPipes.length === 0 || GAME_WIDTH - newPipes[newPipes.length - 1].x >= 200) {
            const minHeight = 50;
            const maxHeight = GAME_HEIGHT - PIPE_GAP - 50;
            const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
            newPipes.push({ x: GAME_WIDTH, topHeight });
          }

          return newPipes;
        });

      }, 24); // ~40fps
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameStarted, isGameOver, birdVelocity]);

  // Collision detection & scoring
  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    // Hit floor or ceiling
    if (birdPos < 0 || birdPos + BIRD_SIZE > GAME_HEIGHT) {
      setIsGameOver(true);
      return;
    }

    // Hit pipes
    const birdRect = { left: 50, right: 50 + BIRD_SIZE, top: birdPos, bottom: birdPos + BIRD_SIZE };
    
    let scoredThisFrame = false;

    for (let pipe of pipes) {
      const pipeRectTop = { left: pipe.x, right: pipe.x + PIPE_WIDTH, top: 0, bottom: pipe.topHeight };
      const pipeRectBottom = { left: pipe.x, right: pipe.x + PIPE_WIDTH, top: pipe.topHeight + PIPE_GAP, bottom: GAME_HEIGHT };

      const hitTop = birdRect.right > pipeRectTop.left && birdRect.left < pipeRectTop.right && birdRect.top < pipeRectTop.bottom;
      const hitBottom = birdRect.right > pipeRectBottom.left && birdRect.left < pipeRectBottom.right && birdRect.bottom > pipeRectBottom.top;

      if (hitTop || hitBottom) {
        setIsGameOver(true);
        return;
      }

      // Scoring logic (when passing the middle of the pipe)
      // Since it moves at PIPE_SPEED per frame, we check if it crossed 50
      if (pipe.x <= 50 && pipe.x + PIPE_SPEED > 50) {
        scoredThisFrame = true;
      }
    }

    if (scoredThisFrame) {
      setScore(s => s + 1);
    }

  }, [birdPos, pipes, gameStarted, isGameOver]);

  const resetGame = () => {
    setGameStarted(false);
    setBirdPos(GAME_HEIGHT / 2);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setIsGameOver(false);
  };

  return (
    <div className="min-h-screen font-sans text-slate-700 flex flex-col relative">
      <ClayBlobs colors={["bg-sky-300", "bg-cyan-300", "bg-amber-300"]} />
      <ClayNav links={[{ href: "/games", label: "Back to Games" }]} />

      <main className="flex-grow flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
          className="clay bg-surface/80 backdrop-blur-sm p-5 md:p-8 flex flex-col items-center w-full max-w-xl"
        >
          <h1 className="clay bg-sky-200 text-3xl md:text-5xl font-black tracking-tight text-sky-900 mb-6 px-6 py-3 -rotate-2 animate-squish">
            Flappy Bird 🐦
          </h1>

          <div className="w-full flex justify-between items-center gap-3 mb-6 px-2">
            <motion.div
              key={score}
              initial={{ scale: 1.25 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
              className="clay-sm bg-pink-200 text-pink-900 text-xl md:text-2xl font-black px-5 py-2"
            >
              Score: {score}
            </motion.div>
            <div className="clay-sm bg-amber-200 text-amber-900 text-xs md:text-sm font-bold px-4 py-2 text-center">
              Space / Tap to Jump
            </div>
          </div>

          {/* Game Canvas */}
          <div
            onClick={jump}
            className="clay-inset rounded-[1.75rem]! bg-sky-200 relative overflow-hidden cursor-pointer"
            style={{
              width: "100%",
              maxWidth: `${GAME_WIDTH}px`,
              height: `${GAME_HEIGHT}px`,
            }}
          >
            {/* Drifting clouds */}
            <div className="absolute top-12 left-8 w-20 h-8 bg-surface/80 rounded-full clay-sm animate-float-slow" />
            <div className="absolute top-32 right-10 w-28 h-10 bg-surface/70 rounded-full clay-sm animate-float" style={{ animationDelay: "-2s" }} />

            {/* Bird */}
            <div
              className="absolute bg-amber-300 rounded-full z-20"
              style={{
                width: BIRD_SIZE,
                height: BIRD_SIZE,
                top: birdPos,
                left: 50,
                transform: `rotate(${Math.min(birdVelocity * 4, 90)}deg)`,
                transition: 'transform 0.1s ease-out',
                boxShadow:
                  "inset -3px -3px 5px rgba(0,0,0,0.18), inset 3px 3px 5px rgba(255,255,255,0.7), 0 4px 8px rgba(146,64,14,0.3)",
              }}
            >
              {/* Eye */}
              <div className="absolute bg-white rounded-full w-3 h-3 right-2 top-1 shadow-sm">
                 <div className="absolute bg-[#1e293b] rounded-full w-1.5 h-1.5 right-0.5 top-0.5" />
              </div>
              {/* Beak */}
              <div className="absolute bg-orange-400 rounded-full w-4 h-2 -right-2 top-4 shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.2)]" />
            </div>

            {/* Pipes */}
            {pipes.map((pipe, i) => (
              <React.Fragment key={i}>
                {/* Top Pipe */}
                <div
                  className="absolute bg-emerald-400 z-10 rounded-b-xl"
                  style={{
                    left: pipe.x,
                    top: 0,
                    width: PIPE_WIDTH,
                    height: pipe.topHeight,
                    boxShadow: "inset -6px 0 10px rgba(0,0,0,0.15), inset 6px 0 10px rgba(255,255,255,0.45)",
                  }}
                >
                  <div
                    className="absolute bottom-0 w-[120%] -left-[10%] h-6 bg-emerald-300 rounded-xl"
                    style={{ boxShadow: "inset -4px -4px 8px rgba(0,0,0,0.15), inset 4px 4px 8px rgba(255,255,255,0.6), 0 4px 6px rgba(6,78,59,0.25)" }}
                  />
                </div>
                {/* Bottom Pipe */}
                <div
                  className="absolute bg-emerald-400 z-10 rounded-t-xl"
                  style={{
                    left: pipe.x,
                    top: pipe.topHeight + PIPE_GAP,
                    width: PIPE_WIDTH,
                    height: GAME_HEIGHT - (pipe.topHeight + PIPE_GAP),
                    boxShadow: "inset -6px 0 10px rgba(0,0,0,0.15), inset 6px 0 10px rgba(255,255,255,0.45)",
                  }}
                >
                   <div
                     className="absolute top-0 w-[120%] -left-[10%] h-6 bg-emerald-300 rounded-xl"
                     style={{ boxShadow: "inset -4px -4px 8px rgba(0,0,0,0.15), inset 4px 4px 8px rgba(255,255,255,0.6), 0 -4px 6px rgba(6,78,59,0.2)" }}
                   />
                </div>
              </React.Fragment>
            ))}

            {!gameStarted && !isGameOver && (
              <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center z-30 backdrop-blur-[2px]">
                <h2 className="clay bg-surface/90 text-2xl font-black text-sky-800 px-6 py-4 text-center animate-float">
                  Tap or Space<br/>to Start
                </h2>
              </div>
            )}

            {isGameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-slate-900/30 flex flex-col items-center justify-center z-30 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.5, y: 30 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 15 }}
                  className="clay bg-surface px-8 py-6 flex flex-col items-center"
                >
                  <h2 className="text-3xl font-black text-rose-500 mb-4">Game Over!</h2>
                  <button
                    onClick={(e) => { e.stopPropagation(); resetGame(); }}
                    className="clay-btn bg-amber-200 text-amber-900 font-extrabold text-xl px-6 py-3"
                  >
                    Play Again
                  </button>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
      <GeminiChat
        pageContext="Ini adalah game Flappy Bird versi web portofolio Bryant. Pengguna mengklik atau menekan spasi untuk membuat burung melompat menghindari pipa. Bantu pengguna dengan tips bermain atau jawab pertanyaan umum."
      />
    </div>
  );
}
