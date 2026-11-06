"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import GeminiChat from "@/components/GeminiChat";
import ClayNav from "@/components/ClayNav";
import ClayBlobs from "@/components/ClayBlobs";

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
    let newFood: { x: number; y: number };
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
    <div className="min-h-screen font-sans text-slate-700 flex flex-col relative">
      <ClayBlobs colors={["bg-lime-300", "bg-emerald-300", "bg-amber-300"]} />
      <ClayNav links={[{ href: "/games", label: "Back to Games" }]} />

      <main className="flex-grow flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
          className="clay bg-surface/80 backdrop-blur-sm p-5 md:p-8 flex flex-col items-center w-full max-w-xl"
        >
          <h1 className="clay bg-lime-200 text-3xl md:text-5xl font-black tracking-tight text-lime-900 mb-6 px-6 py-3 -rotate-2 animate-squish">
            Snake Game 🐍
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
            <div className="clay-sm bg-sky-200 text-sky-900 text-xs md:text-sm font-bold px-4 py-2 text-center">
              Space to Pause <br className="md:hidden" /> / WASD
            </div>
          </div>

          <div
            className="clay-inset bg-lime-200 grid relative overflow-hidden rounded-[1.75rem]! p-1"
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
                className={index === 0 ? "bg-emerald-600 z-[1]" : "bg-emerald-500"}
                style={{
                  gridColumnStart: segment.x + 1,
                  gridRowStart: segment.y + 1,
                  borderRadius: index === 0 ? "40%" : "30%",
                  transform: index === 0 ? "scale(1.1)" : "scale(0.92)",
                  boxShadow:
                    "inset -2px -2px 3px rgba(0,0,0,0.25), inset 2px 2px 3px rgba(255,255,255,0.45), 0 2px 3px rgba(6,78,59,0.3)",
                }}
              />
            ))}

            {/* Render Food */}
            <div
              className="bg-rose-500 rounded-full animate-pulse"
              style={{
                gridColumnStart: food.x + 1,
                gridRowStart: food.y + 1,
                transform: "scale(0.85)",
                boxShadow:
                  "inset -2px -2px 3px rgba(0,0,0,0.25), inset 2px 2px 3px rgba(255,255,255,0.6), 0 2px 4px rgba(159,18,57,0.35)",
              }}
            />

            {isGameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-slate-900/30 flex flex-col items-center justify-center z-10 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.5, y: 30 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 15 }}
                  className="clay bg-surface px-8 py-6 flex flex-col items-center"
                >
                  <h2 className="text-3xl font-black text-rose-500 mb-4">Game Over!</h2>
                  <button
                    onClick={resetGame}
                    className="clay-btn bg-amber-200 text-amber-900 font-extrabold text-xl px-6 py-3"
                  >
                    Play Again
                  </button>
                </motion.div>
              </motion.div>
            )}

            {isPaused && !isGameOver && (
              <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center z-10 backdrop-blur-sm">
                <h2 className="clay bg-surface text-3xl font-black text-slate-700 px-8 py-4 animate-squish">
                  Paused ⏸
                </h2>
              </div>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-[220px] md:hidden">
            <div />
            <button
              onClick={() => { if (directionRef.current.y !== 1) { setDirection({ x: 0, y: -1 }); directionRef.current = { x: 0, y: -1 }; } }}
              className="clay-btn bg-surface p-4 flex items-center justify-center font-black text-xl"
            >
              ↑
            </button>
            <div />
            <button
              onClick={() => { if (directionRef.current.x !== 1) { setDirection({ x: -1, y: 0 }); directionRef.current = { x: -1, y: 0 }; } }}
              className="clay-btn bg-surface p-4 flex items-center justify-center font-black text-xl"
            >
              ←
            </button>
            <button
              onClick={() => { if (directionRef.current.y !== -1) { setDirection({ x: 0, y: 1 }); directionRef.current = { x: 0, y: 1 }; } }}
              className="clay-btn bg-surface p-4 flex items-center justify-center font-black text-xl"
            >
              ↓
            </button>
            <button
              onClick={() => { if (directionRef.current.x !== -1) { setDirection({ x: 1, y: 0 }); directionRef.current = { x: 1, y: 0 }; } }}
              className="clay-btn bg-surface p-4 flex items-center justify-center font-black text-xl"
            >
              →
            </button>
          </div>
        </motion.div>
      </main>
      <GeminiChat
        pageContext="Ini adalah game Snake klasik di portofolio Bryant. Pengguna mengontrol ular menggunakan tombol panah untuk memakan apel dan menghindari dinding. Bantu pengguna dengan tips bermain atau jawab pertanyaan umum."
      />
    </div>
  );
}
