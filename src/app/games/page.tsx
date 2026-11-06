"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ClayNav from "@/components/ClayNav";
import ClayBlobs from "@/components/ClayBlobs";

export default function GamesHub() {
  const games = [
    {
      title: "Snake",
      desc: "The classic retro snake game.",
      link: "/games/snake",
      color: "bg-lime-200",
      icon: "🐍"
    },
    {
      title: "Flappy Bird",
      desc: "Flap your wings and dodge the pipes.",
      link: "/games/flappy",
      color: "bg-sky-200",
      icon: "🐦"
    },
    {
      title: "Lucky Spin",
      desc: "Spin the wheel and test your luck!",
      link: "/games/spin",
      color: "bg-violet-200",
      icon: "🎡"
    },
    {
      title: "Free Draw",
      desc: "Unleash your creativity and draw anything!",
      link: "/games/draw",
      color: "bg-pink-200",
      icon: "🎨"
    },
    {
      title: "Tebak-Tebakan",
      desc: "Uji wawasanmu tentang Indonesia!",
      link: "/games/trivia",
      color: "bg-orange-200",
      icon: "🇮🇩"
    },
    {
      title: "Virtual Piano",
      desc: "Mainkan melodi dengan piano virtual!",
      link: "/games/piano",
      color: "bg-teal-200",
      icon: "🎹"
    }
  ];

  return (
    <div className="min-h-screen font-sans text-slate-700 flex flex-col relative">
      <ClayBlobs colors={["bg-lime-300", "bg-violet-300", "bg-amber-300"]} />
      <ClayNav links={[{ href: "/", label: "Back to Home" }]} />

      <main className="flex-grow max-w-5xl mx-auto px-6 py-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 16 }}
          className="flex flex-col items-center mb-16"
        >
          <h1 className="clay bg-amber-200 text-5xl md:text-7xl font-black tracking-tight text-amber-900 mb-6 px-8 py-4 -rotate-2 animate-squish">
            Games Hub
          </h1>
          <p className="clay-sm bg-surface/80 text-xl font-bold px-5 py-2">
            Choose your mini game! 🎮
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {games.map((game, idx) => (
            <Link key={idx} href={game.link} className="group">
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 160, damping: 18, delay: 0.1 + idx * 0.08 }}
                whileHover={{ y: -10, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`clay ${game.color} p-8 cursor-pointer h-full flex flex-col relative overflow-hidden`}
              >
                {/* Background decorative icon */}
                <div className="text-9xl absolute -bottom-4 -right-4 opacity-30 rotate-12 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-500 pointer-events-none">
                  {game.icon}
                </div>

                <div className="relative z-10 flex items-center gap-4 mb-4">
                  <span
                    className="clay-sm bg-surface text-4xl w-16 h-16 flex items-center justify-center animate-float group-hover:animate-wiggle"
                    style={{ animationDelay: `${-idx * 0.7}s` }}
                  >
                    {game.icon}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-800">{game.title}</h2>
                </div>

                <p className="clay-inset bg-surface/50 text-lg font-bold p-4 flex-grow relative z-10">
                  {game.desc}
                </p>
                <div className="mt-6 flex justify-end relative z-10">
                  <span className="clay-btn bg-violet-500 text-white font-extrabold px-6 py-2 group-hover:bg-pink-400">
                    Play Now →
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
