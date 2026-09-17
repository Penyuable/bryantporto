"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function GamesPage() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const directionRef = useRef(direction);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on the snake
      const isOnSnake = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    setFood(newFood);
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    generateFood();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (directionRef.current.y !== 1) {
            setDirection({ x: 0, y: -1 });
            directionRef.current = { x: 0, y: -1 };
          }
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (directionRef.current.y !== -1) {
            setDirection({ x: 0, y: 1 });
            directionRef.current = { x: 0, y: 1 };
          }
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (directionRef.current.x !== 1) {
            setDirection({ x: -1, y: 0 });
            directionRef.current = { x: -1, y: 0 };
          }
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (directionRef.current.x !== -1) {
            setDirection({ x: 1, y: 0 });
            directionRef.current = { x: 1, y: 0 };
          }
          break;
        case " ":
          setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        // Wall collision 
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Eat food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          generateFood();
        } else {
          newSnake.pop(); // Remove tail if not eating
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 120); // Snake speed
    return () => clearInterval(interval);
  }, [direction, food, isGameOver, isPaused, generateFood]);

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
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 bg-yellow-300 px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2">
            Snake Game
          </h1>
          
          <div className="w-full flex justify-between items-center mb-6 px-2">
            <div className="text-xl md:text-2xl font-bold bg-pink-300 border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Score: {score}
            </div>
            <div className="text-xs md:text-sm font-bold bg-blue-300 border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
              Space to Pause <br className="md:hidden" /> / WASD
            </div>
          </div>

          <div 
            className="border-4 border-black bg-[#9bc400] grid relative overflow-hidden"
            style={{
              width: "100%",
              maxWidth: "400px",
              aspectRatio: "1/1",
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            }}
          >
            {/* Render Snake */}
            {snake.map((segment, index) => (
              <div
                key={index}
                className={`border border-black/20 ${index === 0 ? "bg-black" : "bg-black/80"}`}
                style={{
                  gridColumnStart: segment.x + 1,
                  gridRowStart: segment.y + 1,
                  borderRadius: index === 0 ? '4px' : '2px'
                }}
              />
            ))}
            
            {/* Render Food */}
            <div
              className="bg-red-500 border-2 border-black animate-pulse rounded-full"
              style={{
                gridColumnStart: food.x + 1,
                gridRowStart: food.y + 1,
                transform: 'scale(0.8)',
              }}
            />

            {isGameOver && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
                <h2 className="text-4xl font-black text-white uppercase mb-4 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] text-red-500">
                  Game Over!
                </h2>
                <button 
                  onClick={resetGame}
                  className="bg-yellow-300 font-bold text-xl border-4 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]"
                >
                  Play Again
                </button>
              </div>
            )}

            {isPaused && !isGameOver && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 backdrop-blur-sm">
                <h2 className="text-3xl font-black text-white uppercase drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  Paused
                </h2>
              </div>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="mt-8 grid grid-cols-3 gap-2 w-full max-w-[200px] md:hidden">
            <div />
            <button 
              onClick={() => { if (directionRef.current.y !== 1) { setDirection({ x: 0, y: -1 }); directionRef.current = { x: 0, y: -1 }; } }}
              className="bg-white border-4 border-black p-4 active:bg-gray-200 active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-bold text-xl transition-all"
            >
              ↑
            </button>
            <div />
            <button 
              onClick={() => { if (directionRef.current.x !== 1) { setDirection({ x: -1, y: 0 }); directionRef.current = { x: -1, y: 0 }; } }}
              className="bg-white border-4 border-black p-4 active:bg-gray-200 active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-bold text-xl transition-all"
            >
              ←
            </button>
            <button 
              onClick={() => { if (directionRef.current.y !== -1) { setDirection({ x: 0, y: 1 }); directionRef.current = { x: 0, y: 1 }; } }}
              className="bg-white border-4 border-black p-4 active:bg-gray-200 active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-bold text-xl transition-all"
            >
              ↓
            </button>
            <button 
              onClick={() => { if (directionRef.current.x !== -1) { setDirection({ x: 1, y: 0 }); directionRef.current = { x: 1, y: 0 }; } }}
              className="bg-white border-4 border-black p-4 active:bg-gray-200 active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-bold text-xl transition-all"
            >
              →
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
