
import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { BackButton, Icon } from '../components/UI';
import { CandleFlame } from '../components/CandleFlame';
import { motion, AnimatePresence } from 'framer-motion';

interface CandleProps {
  setView: (view: ViewState) => void;
}

type CandleStep = 'INTENTION' | 'RITUAL';

export const Candle: React.FC<CandleProps> = ({ setView }) => {
    const [step, setStep] = useState<CandleStep>('INTENTION');
    const [name, setName] = useState(() => {
        // Pre-fill from local storage if available
        const user = JSON.parse(localStorage.getItem('solace_user') || '{}');
        return user.lovedOne?.name || '';
    });
    
    const [isBreathingIn, setIsBreathingIn] = useState(true);

    // Breathing Cycle Effect
    useEffect(() => {
        if (step === 'RITUAL') {
            const interval = setInterval(() => {
                setIsBreathingIn(prev => !prev);
            }, 3000); // 3 seconds in, 3 seconds out
            return () => clearInterval(interval);
        }
    }, [step]);

    return (
        <div className="h-full bg-[#2E2A36] relative overflow-hidden flex flex-col font-sans transition-colors duration-1000">
             {/* Background Noise - Subtle */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay pointer-events-none"></div>
            
            {/* Soft Ambient Light for "Lighthearted" feel */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[#4A3B49]/30 to-transparent pointer-events-none"></div>

            <AnimatePresence mode="wait">
                
                {/* --- STEP 1: INTENTION --- */}
                {step === 'INTENTION' && (
                    <motion.div 
                        key="intention"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="flex-1 flex flex-col items-center justify-between py-8 px-6 relative z-10"
                    >
                         {/* Header */}
                        <div className="w-full flex justify-start">
                            <BackButton onClick={() => setView(ViewState.HOME)} dark />
                        </div>

                        {/* Content */}
                        <div className="w-full flex flex-col items-center text-center -mt-10">
                            <h1 className="font-serif text-[32px] text-[#F4F2ED] leading-tight mb-4">
                                Light a candle for<br/>those you hold dear
                            </h1>
                            <p className="text-[#E8E6E3]/70 text-sm leading-relaxed max-w-[260px] mb-12">
                                Take a moment to pause, breathe, and honor their memory.
                            </p>

                            <div className="w-full max-w-[320px] relative">
                                <p className="text-[10px] font-bold tracking-[0.2em] text-[#D68F54] uppercase mb-3 text-center">Reflection Time</p>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter a name"
                                    className="w-full h-14 bg-[#3E3A45] border border-[#E8E6E3]/10 rounded-[20px] text-center text-[#F4F2ED] placeholder:text-[#E8E6E3]/20 focus:border-[#D68F54]/50 outline-none transition-all font-serif text-lg"
                                />
                                
                                {/* Silhouette of candle behind/below */}
                                <div className="absolute top-[120%] left-1/2 -translate-x-1/2 w-16 h-32 bg-[#3E3A45]/50 rounded-t-lg blur-sm pointer-events-none opacity-50"></div>
                            </div>
                        </div>

                        {/* Action */}
                        <div className="w-full">
                            <button 
                                onClick={() => name.trim() && setStep('RITUAL')}
                                disabled={!name.trim()}
                                className={`w-full py-4 rounded-[24px] font-serif text-lg tracking-wide transition-all font-medium ${name.trim() ? 'bg-[#5C5566] text-[#F4F2ED] hover:bg-[#6D657A] shadow-lg' : 'bg-[#3E3A45] text-[#E8E6E3]/20 cursor-not-allowed'}`}
                            >
                                Begin Ritual
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* --- STEP 2: RITUAL --- */}
                {step === 'RITUAL' && (
                    <motion.div 
                        key="ritual"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.0, ease: "easeOut" }}
                        className="flex-1 flex flex-col items-center justify-between py-6 px-6 relative z-10"
                    >
                         {/* Header */}
                         <div className="w-full flex justify-start">
                            <BackButton onClick={() => setView(ViewState.HOME)} dark />
                        </div>

                        {/* Text Header */}
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-center absolute top-20 z-20"
                        >
                            <p className="text-[10px] font-bold tracking-[0.2em] text-[#D68F54] uppercase mb-3">In Loving Memory</p>
                            <h2 className="font-serif text-[40px] text-[#F4F2ED] leading-none">For {name}</h2>
                        </motion.div>

                        {/* Main Candle Assembly */}
                        <div className="flex-1 w-full flex flex-col items-center justify-center relative translate-y-8">
                            
                            {/* The Breathing Ring (Behind Candle, Centered on Flame area) */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.0, duration: 0.8 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60px] pointer-events-none"
                            >
                                <motion.div 
                                    animate={{ 
                                        scale: isBreathingIn ? 0.9 : 1.2, 
                                        opacity: isBreathingIn ? 0.4 : 0.15,
                                        borderColor: isBreathingIn ? "rgba(255,242,214,0.3)" : "rgba(255,242,214,0.1)"
                                    }}
                                    transition={{ duration: 3, ease: "easeInOut" }}
                                    className="w-[200px] h-[200px] rounded-full border border-white/20 shadow-[0_0_30px_rgba(255,230,200,0.05)]"
                                />
                            </motion.div>

                             {/* Ambient Light Glow (Warmer) */}
                             <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0.15, 0.25, 0.15] }}
                                transition={{ delay: 0.5, duration: 2, repeat: Infinity }}
                                className="absolute w-72 h-72 bg-[#D68F54] rounded-full blur-[90px] opacity-10 pointer-events-none -translate-y-12 mix-blend-screen"
                             />

                            {/* Candle Body & Flame */}
                            <div className="relative z-10 flex flex-col items-center">
                                {/* Flame */}
                                <div className="relative z-20 mb-[-15px]">
                                     <CandleFlame isLit={true} />
                                </div>
                                
                                {/* Candle Wax Body */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 100 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                                    className="w-[84px] h-48 bg-gradient-to-b from-[#5C5566] to-[#3E3A45] rounded-t-[16px] rounded-b-[24px] relative shadow-2xl"
                                >
                                    {/* Top Rim Highlight */}
                                    <div className="absolute top-0 w-full h-4 bg-[#6D657A] rounded-[50%] opacity-60 blur-[1px]"></div>
                                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-[70%] h-2 bg-black/20 rounded-[50%] blur-[2px]"></div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Breathing Text & Footer */}
                        <div className="w-full relative z-20 flex flex-col items-center gap-6">
                            
                            {/* Breathing Text - Moved here to ensure it's above the button */}
                            <motion.p 
                                key={isBreathingIn ? 'in' : 'out'}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.8 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="font-serif text-xl text-[#F4F2ED] tracking-wide"
                            >
                                {isBreathingIn ? 'Breathe in...' : 'Breathe out...'}
                            </motion.p>
                            
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5, duration: 0.8 }}
                                className="w-full"
                            >
                                 <button 
                                    onClick={() => setView(ViewState.HOME)}
                                    className="w-full py-4 rounded-[24px] bg-[#D69F67] text-[#3E2D20] font-serif text-lg tracking-wide shadow-[0_4px_20px_rgba(214,159,103,0.3)] hover:brightness-105 transition-all font-medium"
                                >
                                    End Ritual
                                </button>
                            </motion.div>
                        </div>

                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
};
