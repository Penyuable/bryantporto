"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import GeminiChat from "@/components/GeminiChat";
import ClayNav from "@/components/ClayNav";
import ClayBlobs from "@/components/ClayBlobs";

const generateNotes = (startOctave: number, numNotes: number) => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const keys = [];
  
  const keyMap = [
    'z', 's', 'x', 'd', 'c', 'v', 'g', 'b', 'h', 'n', 'j', 'm',
    'q', '2', 'w', '3', 'e', 'r', '5', 't', '6', 'y', '7', 'u',
    'i', '9', 'o', '0', 'p', '[', '=', ']'
  ];

  for (let i = 0; i < numNotes; i++) {
    
    const octave = startOctave + Math.floor(i / 12);
    const noteName = notes[i % 12];
    const isBlack = noteName.includes('#');

    const midiNote = (octave + 1) * 12 + (i % 12);
    const freq = 440 * Math.pow(2, (midiNote - 69) / 12);

    let parentWhite = undefined;
    if (isBlack) {
      parentWhite = notes[(i - 1) % 12] + octave;
    }

    keys.push({
      note: noteName + octave,
      key: keyMap[i] || '',
      freq: Number(freq.toFixed(2)),
      isBlack,
      parentWhite
    });
  }
  return keys;
};

const KEYS_DATA = generateNotes(3, 32);

export default function PianoGame() {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playNote = useCallback((freq: number, note: string) => {
    if (!audioCtxRef.current) return;
    const audioCtx = audioCtxRef.current;
    
    // Create oscillator
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'triangle'; // Triangle sounds a bit more mellow like a soft piano/synth
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    // Envelope to avoid clicks and give a piano-like strike
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5); // Decay/Release
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 1.5);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    const pianoKey = KEYS_DATA.find(k => k.key === key);
    if (pianoKey && !e.repeat && !activeKeys.includes(pianoKey.note)) {
      initAudio();
      setActiveKeys(prev => [...prev, pianoKey.note]);
      playNote(pianoKey.freq, pianoKey.note);
    }
  }, [activeKeys, playNote]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    const pianoKey = KEYS_DATA.find(k => k.key === key);
    if (pianoKey) {
      setActiveKeys(prev => prev.filter(k => k !== pianoKey.note));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <div className="min-h-screen font-sans text-slate-700 flex flex-col relative" onClick={initAudio}>
      <ClayBlobs colors={["bg-teal-300", "bg-rose-300", "bg-violet-300"]} />
      <ClayNav links={[{ href: "/games", label: "Back to Games" }]} />

      <main className="flex-grow max-w-5xl mx-auto px-6 py-12 w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
          className="text-center mb-12"
        >
          <h1 className="clay bg-teal-200 text-teal-900 text-5xl md:text-7xl font-black tracking-tight mb-4 px-8 py-4 -rotate-1 inline-block animate-squish">
            Virtual Piano 🎹
          </h1>
          <br/>
          <p className="clay-sm bg-surface/80 text-xl font-bold px-5 py-2 mt-4 inline-block">
            Click keys or use your keyboard to play!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 18, delay: 0.1 }}
          className="clay relative bg-rose-300 p-4 pb-6 pt-12 max-w-4xl w-full overflow-x-auto"
        >
            <div className="absolute top-4 left-6 flex gap-2">
              {["bg-amber-200", "bg-teal-200", "bg-violet-200"].map((c, i) => (
                <span
                  key={c}
                  className={`w-3 h-3 rounded-full ${c} animate-pulse`}
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </div>
            <div className="absolute top-3 right-6 flex gap-3">
                <div className="clay-sm rounded-full! w-6 h-6 bg-rose-200"></div>
                <div className="clay-sm rounded-full! w-6 h-6 bg-rose-200"></div>
            </div>

            <div className="clay-inset bg-rose-400/40 rounded-[1.5rem]! flex relative justify-center min-w-max pt-2 pb-4 px-3">
              {KEYS_DATA.filter(k => !k.isBlack).map((whiteKey) => {
                const isWhiteActive = activeKeys.includes(whiteKey.note);
                const blackKey = KEYS_DATA.find(k => k.isBlack && k.parentWhite === whiteKey.note);
                const isBlackActive = blackKey ? activeKeys.includes(blackKey.note) : false;

                return (
                  <div key={whiteKey.note} className="relative">
                    {/* White Key */}
                    <div
                      onMouseDown={() => {
                        initAudio();
                        if (!activeKeys.includes(whiteKey.note)) {
                            setActiveKeys(prev => [...prev, whiteKey.note]);
                            playNote(whiteKey.freq, whiteKey.note);
                        }
                      }}
                      onMouseUp={() => setActiveKeys(prev => prev.filter(k => k !== whiteKey.note))}
                      onMouseLeave={() => setActiveKeys(prev => prev.filter(k => k !== whiteKey.note))}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        initAudio();
                        if (!activeKeys.includes(whiteKey.note)) {
                            setActiveKeys(prev => [...prev, whiteKey.note]);
                            playNote(whiteKey.freq, whiteKey.note);
                        }
                      }}
                      onTouchEnd={() => setActiveKeys(prev => prev.filter(k => k !== whiteKey.note))}
                      className={`
                        w-14 sm:w-20 h-56 sm:h-72 rounded-b-2xl rounded-t-md flex items-end justify-center pb-4 cursor-pointer select-none transition-all duration-100
                        ${isWhiteActive ? 'bg-[#ccfbf1]' : 'bg-white'}
                      `}
                      style={{
                          margin: '0 2px',
                          boxShadow: isWhiteActive
                            ? 'inset 4px 4px 10px rgba(13,148,136,0.25), inset -4px -4px 10px rgba(255,255,255,0.8)'
                            : '0 8px 12px -4px rgba(136,19,55,0.35), inset -4px -6px 10px rgba(0,0,0,0.08), inset 4px 4px 10px rgba(255,255,255,0.9)',
                          transform: isWhiteActive ? 'translateY(4px) scale(0.98)' : 'none'
                      }}
                    >
                      <div className="flex flex-col items-center pointer-events-none">
                        <span className={`text-sm font-bold uppercase mb-1 ${isWhiteActive ? 'text-[#14b8a6]' : 'text-[#94a3b8]'}`}>{whiteKey.key}</span>
                        <span className={`font-black ${isWhiteActive ? 'text-[#115e59]' : 'text-[#334155]'}`}>{whiteKey.note}</span>
                      </div>
                    </div>

                    {/* Black Key Overlay */}
                    {blackKey && (
                      <div
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          initAudio();
                          if (!activeKeys.includes(blackKey.note)) {
                              setActiveKeys(prev => [...prev, blackKey.note]);
                              playNote(blackKey.freq, blackKey.note);
                          }
                        }}
                        onMouseUp={(e) => {
                          e.stopPropagation();
                          setActiveKeys(prev => prev.filter(k => k !== blackKey.note));
                        }}
                        onMouseLeave={() => setActiveKeys(prev => prev.filter(k => k !== blackKey.note))}
                        onTouchStart={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          initAudio();
                          if (!activeKeys.includes(blackKey.note)) {
                              setActiveKeys(prev => [...prev, blackKey.note]);
                              playNote(blackKey.freq, blackKey.note);
                          }
                        }}
                        onTouchEnd={(e) => {
                          e.stopPropagation();
                          setActiveKeys(prev => prev.filter(k => k !== blackKey.note));
                        }}
                        className={`
                          absolute top-0 right-[-14px] sm:right-[-20px] w-8 sm:w-12 h-36 sm:h-44 z-10 rounded-b-xl flex items-end justify-center pb-4 cursor-pointer select-none transition-all duration-100
                          ${isBlackActive ? 'bg-violet-500 h-36 sm:h-[170px]' : 'bg-[#334155]'}
                        `}
                        style={{
                            boxShadow: isBlackActive
                              ? 'inset 3px 3px 8px rgba(0,0,0,0.35), inset -3px -3px 8px rgba(255,255,255,0.15)'
                              : '0 8px 12px -4px rgba(15,23,42,0.5), inset -3px -5px 8px rgba(0,0,0,0.35), inset 3px 3px 8px rgba(255,255,255,0.2)'
                        }}
                      >
                         <div className="flex flex-col items-center pointer-events-none">
                            <span className="text-xs font-bold text-[#94a3b8] mb-1 uppercase">{blackKey.key}</span>
                            <span className="text-xs font-black text-white">{blackKey.note}</span>
                         </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
        </motion.div>
      </main>
      <GeminiChat
        pageContext="Ini adalah game Piano/Keyboard virtual di portofolio Bryant. Pengguna bisa menekan tuts piano di layar atau keyboard komputer untuk memainkan nada. Bantu pengguna dengan tips bermain atau info tentang nada/musik."
      />
    </div>
  );
}
