"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

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
    <div className="min-h-screen font-sans selection:bg-yellow-300 bg-teal-50 flex flex-col" onClick={initAudio}>
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

      <main className="flex-grow max-w-5xl mx-auto px-6 py-12 w-full flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 bg-teal-300 px-6 py-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-1 inline-block">
            Virtual Piano 🎹
          </h1>
          <br/>
          <p className="text-xl font-bold bg-white px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-4 inline-block">
            Click keys or use your keyboard to play!
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-red-500 p-4 pb-6 pt-10 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-xl max-w-4xl w-full overflow-x-auto"
        >
            <div className="absolute top-3 right-6 flex gap-3">
                <div className="w-5 h-5 rounded-full bg-black border-2 border-white shadow-inner"></div>
                <div className="w-5 h-5 rounded-full bg-black border-2 border-white shadow-inner"></div>
            </div>

            <div className="flex relative justify-center min-w-max pb-4 px-2">
              {KEYS_DATA.filter(k => !k.isBlack).map((whiteKey, idx) => {
                const isWhiteActive = activeKeys.includes(whiteKey.note);
                const blackKey = KEYS_DATA.find(k => k.isBlack && k.parentWhite === whiteKey.note);
                
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
                        w-14 sm:w-20 h-56 sm:h-72 border-x-2 border-b-2 border-black rounded-b-md flex items-end justify-center pb-4 cursor-pointer select-none transition-colors
                        ${isWhiteActive ? 'bg-gray-300 pt-2' : 'bg-white'}
                      `}
                      style={{
                          margin: '0 2px',
                          boxShadow: isWhiteActive ? 'inset 0 -4px 0 0 rgba(0,0,0,0.2)' : 'inset 0 -12px 0 0 rgba(0,0,0,0.1), 0 4px 0 0 rgba(0,0,0,1)',
                          transform: isWhiteActive ? 'translateY(4px)' : 'none'
                      }}
                    >
                      <div className="flex flex-col items-center pointer-events-none">
                        <span className={`text-sm font-bold uppercase mb-1 ${isWhiteActive ? 'text-gray-500' : 'text-gray-400'}`}>{whiteKey.key}</span>
                        <span className={`font-black ${isWhiteActive ? 'text-black' : 'text-gray-800'}`}>{whiteKey.note}</span>
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
                          absolute top-0 right-[-14px] sm:right-[-20px] w-8 sm:w-12 h-36 sm:h-44 z-10 border-2 border-black rounded-b-md flex items-end justify-center pb-4 cursor-pointer select-none transition-colors
                          ${activeKeys.includes(blackKey.note) ? 'bg-gray-800 h-36 sm:h-[170px]' : 'bg-black'}
                        `}
                        style={{
                            boxShadow: activeKeys.includes(blackKey.note) ? 'none' : 'inset 0 -8px 0 0 rgba(255,255,255,0.2), 0 4px 0 0 rgba(0,0,0,1)'
                        }}
                      >
                         <div className="flex flex-col items-center pointer-events-none">
                            <span className="text-xs font-bold text-gray-500 mb-1 uppercase">{blackKey.key}</span>
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
    </div>
  );
}
