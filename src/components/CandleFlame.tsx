
import React from 'react';
import { motion } from 'framer-motion';

export const CandleFlame: React.FC<{ isLit?: boolean }> = ({ isLit = true }) => {
  if (!isLit) return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 w-1 h-3 bg-neutral-800 rounded-sm opacity-80" />
  );

  return (
    <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
        className="relative w-[120px] h-[180px] flex justify-center items-end -translate-y-6 pointer-events-none"
    >
      
      {/* 1. Large Ambient Bloom (Softer, friendlier glow) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.15, 0.25, 0.15],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="absolute bottom-10 w-44 h-44 bg-amber-200/20 rounded-full blur-[60px] z-0 mix-blend-screen"
      />

      {/* 2. Inner Heat Bloom (Warmth) */}
      <motion.div 
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          scale: [0.95, 1.05, 0.95]
        }}
        transition={{ duration: 0.15, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-8 w-24 h-28 bg-yellow-100/10 rounded-full blur-[25px] z-0"
      />

      {/* 3. Main Flame Assembly */}
      <div className="relative z-10 w-full h-full flex items-end justify-center pb-8">
        
        {/* Halo / Aura (Peachier tone for lightheartedness) */}
        <motion.div
          animate={{
            scaleY: [1, 1.05, 1],
            scaleX: [1, 0.95, 1],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 w-16 h-28 bg-gradient-to-t from-orange-300/20 via-yellow-100/10 to-transparent rounded-[50%] blur-[12px]"
          style={{ transformOrigin: "bottom center" }}
        />

        {/* Core Flame SVG */}
        <svg viewBox="0 0 100 200" className="w-16 h-28 overflow-visible">
            <defs>
                <linearGradient id="flameGradient" x1="50%" y1="100%" x2="50%" y2="0%">
                    <stop offset="0%" stopColor="#FFE5B4" /> {/* Peach/Cream Base */}
                    <stop offset="50%" stopColor="#FFFACD" /> {/* Lemon Chiffon Middle */}
                    <stop offset="90%" stopColor="#FFFFFF" /> {/* Pure White Tip */}
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.8" /> 
                </linearGradient>
                <filter id="flameBlur">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
                </filter>
            </defs>

            {/* Main Body - Rounder, bouncier shape */}
            <motion.path
                d="M50 170 C25 170 25 120 50 30 C75 120 75 170 50 170 Z"
                fill="url(#flameGradient)"
                animate={{
                    d: [
                        "M50 170 C25 170 25 120 50 30 C75 120 75 170 50 170 Z", 
                        "M50 170 C20 170 20 120 48 35 C75 120 80 170 50 170 Z", 
                        "M50 170 C25 170 25 120 50 30 C75 120 75 170 50 170 Z", 
                        "M50 170 C30 170 25 120 52 35 C80 120 70 170 50 170 Z", 
                        "M50 170 C25 170 25 120 50 30 C75 120 75 170 50 170 Z", 
                    ]
                }}
                transition={{
                    duration: 2.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{ filter: "url(#flameBlur)", opacity: 0.95 }}
            />

            {/* Blue Base (Subtle) */}
            <motion.circle 
              cx="50" cy="165" r="6" 
              fill="#A0C4FF" 
              className="opacity-20 blur-[4px] mix-blend-screen"
              animate={{ opacity: [0.2, 0.3, 0.2] }}
              transition={{ duration: 0.2, repeat: Infinity }}
            />
        </svg>

        {/* Tip Sparks (Gentle floating particles) */}
        <motion.div
           animate={{
             y: [0, -20],
             x: [0, 5, -5, 0],
             opacity: [0, 0.6, 0],
             scale: [0.5, 1]
           }}
           transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
           className="absolute bottom-[100px] w-1.5 h-1.5 bg-yellow-100/50 rounded-full blur-[0.5px]"
        />
        
      </div>
    </motion.div>
  );
};
