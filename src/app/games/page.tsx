"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function GamesHub() {
  const games = [
    {
      title: "Snake",
      desc: "The classic retro snake game.",
      link: "/games/snake",
      color: "bg-[#9bc400]",
      icon: "🐍"
    },
    {
      title: "Flappy Bird",
      desc: "Flap your wings and dodge the pipes.",
      link: "/games/flappy",
      color: "bg-blue-300",
      icon: "🐦"
    },
    {
      title: "Lucky Spin",
      desc: "Spin the wheel and test your luck!",
      link: "/games/spin",
      color: "bg-purple-300",
      icon: "🎡"
    },
    {
      title: "Free Draw",
      desc: "Unleash your creativity and draw anything!",
      link: "/games/draw",
      color: "bg-pink-300",
      icon: "🎨"
    },
    {
      title: "Tebak-Tebakan",
      desc: "Uji wawasanmu tentang Indonesia!",
      link: "/games/trivia",
      color: "bg-orange-300",
      icon: "🇮🇩"
    },
    {
      title: "Virtual Piano",
      desc: "Mainkan melodi dengan piano virtual!",
      link: "/games/piano",
      color: "bg-teal-300",
      icon: "🎹"
    }
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-yellow-300 bg-gray-50 flex flex-col">
      <nav className="sticky top-0 z-50 bg-white border-b-4 border-black">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black tracking-tighter uppercase hover:underline underline-offset-4 decoration-4">
            SB.
          </Link>
          <div className="flex gap-6 font-bold text-lg">
            <Link href="/" className="hover:underline underline-offset-4 decoration-4">Back to Home</Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-5xl mx-auto px-6 py-12 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex flex-col items-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 bg-yellow-300 px-6 py-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-2">
            Games Hub
          </h1>
          <p className="text-xl font-bold bg-white px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Choose your mini game!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {games.map((game, idx) => (
            <Link key={idx} href={game.link} className="group">
              <motion.div
                whileHover={{ y: -5 }}
                className={`${game.color} border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer h-full flex flex-col relative overflow-hidden`}
              >
                {/* Background decorative icon */}
                <div className="text-9xl absolute -bottom-4 -right-4 opacity-40 rotate-12 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300 pointer-events-none">
                  {game.icon}
                </div>

                <div className="relative z-10 flex items-center gap-4 mb-4">
                  <span className="text-4xl bg-white border-2 border-black w-16 h-16 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-5deg] group-hover:rotate-0 transition-transform">
                    {game.icon}
                  </span>
                  <h2 className="text-4xl font-black uppercase">{game.title}</h2>
                </div>
                
                <p className="text-lg font-bold bg-white/90 p-4 border-2 border-black flex-grow relative z-10">
                  {game.desc}
                </p>
                <div className="mt-6 flex justify-end relative z-10">
                  <span className="bg-black text-white font-bold px-6 py-2 border-2 border-black group-hover:-translate-y-1 group-hover:shadow-[4px_4px_0px_0px_#fff] transition-all">
                    Play Now
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
