"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

      <main className="flex-grow flex items-center justify-center p-6 relative w-full">
        {/* Background Decorative Elements */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-blue-300 border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -z-10" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-green-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-12 -z-10" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-yellow-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-45 -z-10" />

        <div className="w-full max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex flex-col items-center mb-8"
          >
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 bg-orange-300 px-6 py-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-2 text-center">
              Tebak-Tebakan ID
            </h1>
            <p className="text-xl font-bold bg-white px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Score: {score} / {QUESTIONS.length}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!isFinished ? (
              <motion.div 
                key={currentQuestionIdx}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-white border-4 border-black p-6 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center w-full relative"
              >
                <div className="absolute -top-4 -left-4 bg-yellow-300 border-4 border-black font-black text-xl w-12 h-12 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-10deg]">
                  {currentQuestionIdx + 1}
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-center mb-8 mt-4">
                  {currentQ.question}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {currentQ.options.map((option, idx) => {
                    let btnColor = "bg-white hover:bg-gray-100";
                    let isThisSelected = selectedOption === option;

                    if (selectedOption) {
                      if (option === currentQ.answer) {
                        btnColor = "bg-green-400 text-white"; // Highlight correct answer
                      } else if (isThisSelected && !isCorrect) {
                        btnColor = "bg-red-400 text-white"; // Highlight wrong answer
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(option)}
                        disabled={!!selectedOption}
                        className={`text-lg font-bold border-4 border-black p-4 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-center ${btnColor} ${!selectedOption && "hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="finished"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center w-full"
              >
                <h2 className="text-4xl md:text-5xl font-black uppercase mb-6">
                  {score === QUESTIONS.length ? "Sempurna! 🇮🇩" : "Permainan Selesai!"}
                </h2>
                <p className="text-2xl font-bold mb-8 bg-blue-200 border-2 border-black px-6 py-3">
                  Kamu menjawab {score} dari {QUESTIONS.length} dengan benar!
                </p>
                <button 
                  onClick={restartGame}
                  className="bg-black text-white font-black text-2xl uppercase border-4 border-black px-8 py-4 transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
                >
                  Main Lagi
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
