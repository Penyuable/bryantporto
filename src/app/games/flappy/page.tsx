"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import GeminiChat from "@/components/GeminiChat";

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
    <div className="min-h-screen font-sans selection:bg-yellow-300 bg-gray-50 flex flex-col">
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

      <main className="flex-grow flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="bg-white border-4 border-black p-4 md:p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center w-full max-w-xl"
        >
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 bg-blue-300 px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2">
            Flappy Bird
          </h1>
          
          <div className="w-full flex justify-between items-center mb-6 px-2">
            <div className="text-xl md:text-2xl font-bold bg-pink-300 border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Score: {score}
            </div>
            <div className="text-xs md:text-sm font-bold bg-yellow-300 border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
              Space / Tap to Jump
            </div>
          </div>

          {/* Game Canvas */}
          <div 
            onClick={jump}
            className="border-4 border-black bg-cyan-200 relative overflow-hidden cursor-pointer shadow-[inset_0px_4px_10px_rgba(0,0,0,0.2)]"
            style={{
              width: "100%",
              maxWidth: `${GAME_WIDTH}px`,
              height: `${GAME_HEIGHT}px`,
            }}
          >
            {/* Bird */}
            <div 
              className="absolute bg-yellow-400 border-2 border-black rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)] z-20"
              style={{
                width: BIRD_SIZE,
                height: BIRD_SIZE,
                top: birdPos,
                left: 50,
                transform: `rotate(${Math.min(birdVelocity * 4, 90)}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              {/* Eye */}
              <div className="absolute bg-white border border-black rounded-full w-3 h-3 right-2 top-1">
                 <div className="absolute bg-black rounded-full w-1 h-1 right-0.5 top-1" />
              </div>
              {/* Beak */}
              <div className="absolute bg-orange-500 border border-black rounded w-4 h-2 -right-2 top-4" />
            </div>

            {/* Pipes */}
            {pipes.map((pipe, i) => (
              <React.Fragment key={i}>
                {/* Top Pipe */}
                <div 
                  className="absolute bg-green-500 border-x-4 border-b-4 border-black z-10"
                  style={{
                    left: pipe.x,
                    top: 0,
                    width: PIPE_WIDTH,
                    height: pipe.topHeight,
                  }}
                >
                  <div className="absolute bottom-0 w-[120%] -left-[10%] h-6 bg-green-400 border-4 border-black shadow-[0_4px_0_rgba(0,0,0,0.2)]" />
                </div>
                {/* Bottom Pipe */}
                <div 
                  className="absolute bg-green-500 border-x-4 border-t-4 border-black z-10"
                  style={{
                    left: pipe.x,
                    top: pipe.topHeight + PIPE_GAP,
                    width: PIPE_WIDTH,
                    height: GAME_HEIGHT - (pipe.topHeight + PIPE_GAP),
                  }}
                >
                   <div className="absolute top-0 w-[120%] -left-[10%] h-6 bg-green-400 border-4 border-black shadow-[0_4px_0_rgba(0,0,0,0.2)]" />
                </div>
              </React.Fragment>
            ))}

            {!gameStarted && !isGameOver && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-30 backdrop-blur-sm">
                <h2 className="text-3xl font-black text-white uppercase drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] animate-pulse text-center">
                  Tap or Space<br/>to Start
                </h2>
              </div>
            )}

            {isGameOver && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-30 backdrop-blur-sm">
                <h2 className="text-4xl font-black text-white uppercase mb-4 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] text-red-500">
                  Game Over!
                </h2>
                <button 
                  onClick={(e) => { e.stopPropagation(); resetGame(); }}
                  className="bg-yellow-300 font-bold text-xl border-4 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]"
                >
                  Play Again
                </button>
              </div>
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
