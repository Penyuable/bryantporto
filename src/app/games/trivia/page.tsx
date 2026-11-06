"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import GeminiChat from "@/components/GeminiChat";
import ClayNav from "@/components/ClayNav";
import ClayBlobs from "@/components/ClayBlobs";

const QUESTIONS = [
  {
    question: "Siapakah presiden pertama Indonesia?",
    options: ["Soeharto", "B.J. Habibie", "Soekarno", "Megawati"],
    answer: "Soekarno",
  },
  {
    question: "Apa ibukota provinsi Jawa Barat?",
    options: ["Surabaya", "Bandung", "Semarang", "Jakarta"],
    answer: "Bandung",
  },
  {
    question: "Candi Borobudur terletak di provinsi apa?",
    options: ["Jawa Timur", "Daerah Istimewa Yogyakarta", "Jawa Tengah", "Bali"],
    answer: "Jawa Tengah",
  },
  {
    question: "Tanggal berapakah Indonesia merdeka?",
    options: ["17 Agustus 1945", "1 Juni 1945", "20 Mei 1908", "28 Oktober 1928"],
    answer: "17 Agustus 1945",
  },
  {
    question: "Gunung tertinggi di Indonesia adalah?",
    options: ["Gunung Rinjani", "Gunung Semeru", "Gunung Kerinci", "Puncak Jaya"],
    answer: "Puncak Jaya",
  },
  {
    question: "Apa nama rumah adat dari provinsi Sumatera Barat?",
    options: ["Rumah Gadang", "Rumah Joglo", "Rumah Betang", "Rumah Tongkonan"],
    answer: "Rumah Gadang",
  },
  {
    question: "Lagu daerah 'Ampar-Ampar Pisang' berasal dari provinsi?",
    options: ["Kalimantan Timur", "Kalimantan Selatan", "Kalimantan Barat", "Sulawesi Selatan"],
    answer: "Kalimantan Selatan",
  },
  {
    question: "Sila ke-3 dari Pancasila berbunyi?",
    options: ["Ketuhanan Yang Maha Esa", "Kemanusiaan yang Adil dan Beradab", "Persatuan Indonesia", "Keadilan Sosial bagi Seluruh Rakyat Indonesia"],
    answer: "Persatuan Indonesia",
  }
];

export default function TriviaGamePage() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleOptionClick = (option: string) => {
    if (selectedOption) return; // Prevent multiple clicks

    setSelectedOption(option);
    const correct = option === QUESTIONS[currentQuestionIdx].answer;
    setIsCorrect(correct);
    if (correct) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      setSelectedOption(null);
      setIsCorrect(null);
      if (currentQuestionIdx < QUESTIONS.length - 1) {
        setCurrentQuestionIdx((prev) => prev + 1);
      } else {
        setIsFinished(true);
      }
    }, 1500);
  };

  const restartGame = () => {
    setCurrentQuestionIdx(0);
    setScore(0);
    setIsFinished(false);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const currentQ = QUESTIONS[currentQuestionIdx];

  return (
    <div className="min-h-screen font-sans text-slate-700 flex flex-col overflow-hidden relative">
      <ClayBlobs colors={["bg-orange-300", "bg-rose-300", "bg-sky-300"]} />
      <ClayNav links={[{ href: "/games", label: "Back to Games" }]} />

      <main className="flex-grow flex items-center justify-center p-6 relative w-full">
        {/* Background Decorative Elements */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-sky-200 clay rounded-full! animate-float" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-emerald-200 clay rotate-12 animate-float-slow" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-amber-200 clay rotate-45 animate-float" style={{ animationDelay: "-2s" }} />

        <div className="w-full max-w-2xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 18 }}
            className="flex flex-col items-center mb-8"
          >
            <h1 className="clay bg-orange-200 text-orange-900 text-3xl md:text-5xl font-black tracking-tight mb-5 px-6 py-3 -rotate-2 text-center animate-squish">
              Tebak-Tebakan ID 🇮🇩
            </h1>
            <motion.p
              key={score}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
              className="clay-sm bg-surface text-xl font-extrabold px-5 py-2"
            >
              Score: {score} / {QUESTIONS.length}
            </motion.p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!isFinished ? (
              <motion.div
                key={currentQuestionIdx}
                initial={{ opacity: 0, x: 60, rotate: 2 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                exit={{ opacity: 0, x: -60, rotate: -2 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="clay bg-surface/85 backdrop-blur-sm p-6 md:p-10 flex flex-col items-center w-full relative"
              >
                <div className="clay-sm rounded-full! absolute -top-5 -left-4 bg-amber-200 text-amber-900 font-black text-xl w-14 h-14 flex items-center justify-center -rotate-12 animate-wiggle">
                  {currentQuestionIdx + 1}
                </div>

                {/* Progress bar */}
                <div className="clay-inset w-full h-4 bg-slate-100 mb-6 rounded-full! overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-orange-300"
                    initial={{ width: `${(currentQuestionIdx / QUESTIONS.length) * 100}%` }}
                    animate={{ width: `${((currentQuestionIdx + 1) / QUESTIONS.length) * 100}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-slate-800 text-center mb-8">
                  {currentQ.question}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {currentQ.options.map((option, idx) => {
                    let btnColor = "bg-surface text-slate-700";
                    const isThisSelected = selectedOption === option;

                    if (selectedOption) {
                      if (option === currentQ.answer) {
                        btnColor = "bg-emerald-300 text-emerald-900"; // Highlight correct answer
                      } else if (isThisSelected && !isCorrect) {
                        btnColor = "bg-rose-300 text-rose-900"; // Highlight wrong answer
                      }
                    }

                    const shake = selectedOption && isThisSelected && !isCorrect;
                    const bounce = selectedOption && option === currentQ.answer;

                    return (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                          shake
                            ? { opacity: 1, y: 0, x: [0, -10, 10, -8, 8, 0] }
                            : bounce
                            ? { opacity: 1, y: [0, -10, 0], x: 0 }
                            : { opacity: 1, y: 0, x: 0 }
                        }
                        transition={{ duration: shake || bounce ? 0.5 : 0.3, delay: selectedOption ? 0 : idx * 0.06 }}
                        onClick={() => handleOptionClick(option)}
                        disabled={!!selectedOption}
                        className={`clay-btn text-lg font-extrabold p-4 flex items-center justify-center text-center disabled:opacity-100! disabled:cursor-default! ${btnColor}`}
                      >
                        {option}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="finished"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 14 }}
                className="clay bg-surface/85 backdrop-blur-sm p-8 md:p-12 flex flex-col items-center text-center w-full"
              >
                <div className="text-7xl mb-4 animate-float">{score === QUESTIONS.length ? "🏆" : "🎯"}</div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6">
                  {score === QUESTIONS.length ? "Sempurna! 🇮🇩" : "Permainan Selesai!"}
                </h2>
                <p className="clay-sm bg-sky-200 text-sky-900 text-2xl font-extrabold mb-8 px-6 py-3">
                  Kamu menjawab {score} dari {QUESTIONS.length} dengan benar!
                </p>
                <button
                  onClick={restartGame}
                  className="clay-btn bg-violet-400 text-white font-black text-2xl uppercase px-8 py-4"
                >
                  Main Lagi
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <GeminiChat
        pageContext="Ini adalah game Trivia Quiz di portofolio Bryant. Pengguna menjawab pertanyaan pilihan ganda bertopik umum (sejarah, sains, dll). Bantu pengguna jika ingin hints atau penjelasan seputar pertanyaan trivia."
      />
    </div>
  );
}
