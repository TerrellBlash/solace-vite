
import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { Icon, SolaceIcon, SolaceHeartIcon } from '../components/UI';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingProps {
  setView: (view: ViewState) => void;
}

type OnboardingStep = 'WELCOME' | 'WHO' | 'READY';

const RELATIONSHIPS = [
  'Parent', 'Partner', 'Child', 'Sibling', 'Friend', 'Pet', 'Grandparent', 'Other'
];

export const Onboarding: React.FC<OnboardingProps> = ({ setView }) => {
  const [step, setStep] = useState<OnboardingStep>('WELCOME');
  const [data, setData] = useState({
    name: '',
    lovedOneName: '',
    relationship: ''
  });

  // --- STEP 1: WELCOME LOGIC ---
  useEffect(() => {
    if (step === 'WELCOME') {
      const timer = setTimeout(() => {
        setStep('WHO');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // --- SAVE LOGIC ---
  const handleComplete = (targetView: ViewState) => {
    const userData = {
      name: data.name,
      lovedOne: {
        name: data.lovedOneName,
        relationship: data.relationship
      },
      onboardingComplete: true,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('solace_user', JSON.stringify(userData));
    setView(targetView);
  };

  return (
    <div className="h-full w-full bg-[#1F1D24] relative overflow-hidden flex flex-col font-sans">
      {/* Noise Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay pointer-events-none z-0"></div>

      <AnimatePresence mode="wait">
        
        {/* --- STEP 1: WELCOME --- */}
        {step === 'WELCOME' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex flex-col items-center justify-center relative z-10 cursor-pointer"
            onClick={() => setStep('WHO')}
          >
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="w-24 h-24 rounded-full bg-[#2A2730] border border-white/5 flex items-center justify-center shadow-[0_0_50px_rgba(214,143,84,0.15)]"
              >
                <SolaceIcon size={48} className="text-[#D68F54] drop-shadow-[0_0_15px_rgba(214,143,84,0.6)]" fill="currentColor" />
              </motion.div>

              {/* Text */}
              <div className="text-center">
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="font-serif text-[48px] text-white leading-tight mb-2 tracking-tight"
                >
                  Solace
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  className="font-sans text-[14px] text-white font-medium tracking-wide"
                >
                  A gentle space for grief, memory, and healing
                </motion.p>
              </div>
            </div>

            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.3 }}
               transition={{ delay: 2.5, duration: 1 }}
               className="pb-12 text-[10px] text-white uppercase tracking-[0.2em] animate-pulse"
            >
              Tap anywhere to continue
            </motion.div>
          </motion.div>
        )}

        {/* --- STEP 2: WHO --- */}
        {step === 'WHO' && (
          <motion.div
            key="who"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex-1 flex flex-col py-8 px-8 relative z-10 h-full"
          >
            <div className="flex-1 flex flex-col justify-center gap-10">
              <div className="text-center">
                <h2 className="font-serif text-[28px] text-white leading-tight mb-2">Who do you carry<br/>in your heart?</h2>
                <p className="text-[13px] text-white/50 font-medium">This helps us personalize your experience</p>
              </div>

              <div className="space-y-6">
                {/* Field 1: User Name */}
                <div className="space-y-2">
                  <label className="text-[10px] text-[#9E584D] uppercase tracking-[0.2em] font-bold ml-1">Your Name</label>
                  <input 
                    type="text" 
                    value={data.name}
                    onChange={(e) => setData({...data, name: e.target.value})}
                    placeholder="Your first name"
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-[20px] px-5 text-white placeholder:text-white/20 outline-none focus:border-[#D68F54]/50 focus:bg-white/10 transition-all font-sans text-lg focus:scale-[1.02]"
                  />
                </div>

                {/* Field 2: Loved One */}
                <div className="space-y-2">
                  <label className="text-[10px] text-[#D68F54] uppercase tracking-[0.2em] font-bold ml-1">Their Name</label>
                  <input 
                    type="text" 
                    value={data.lovedOneName}
                    onChange={(e) => setData({...data, lovedOneName: e.target.value})}
                    placeholder="Who are you remembering?"
                    className={`w-full h-14 bg-white/5 border border-white/10 rounded-[20px] px-5 placeholder:text-white/20 outline-none focus:border-[#D68F54]/50 focus:bg-white/10 transition-all text-lg focus:scale-[1.02] ${data.lovedOneName ? 'font-hand text-[#D68F54] text-2xl' : 'font-sans text-white'}`}
                  />
                </div>

                {/* Field 3: Relationship */}
                <div className="space-y-3">
                  <label className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold ml-1">Your Relationship</label>
                  <div className="flex flex-wrap gap-2">
                    {RELATIONSHIPS.map((rel) => {
                      const isActive = data.relationship === rel;
                      return (
                        <button
                          key={rel}
                          onClick={() => setData({...data, relationship: rel})}
                          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95 border ${
                            isActive 
                              ? 'bg-[#D68F54] text-[#2A2730] border-[#D68F54] shadow-lg scale-105' 
                              : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80'
                          }`}
                        >
                          {rel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button 
                onClick={() => setStep('READY')}
                disabled={!data.name || !data.lovedOneName || !data.relationship}
                className={`w-full h-14 rounded-[24px] font-serif text-lg font-medium transition-all active:scale-[0.98] ${
                  (!data.name || !data.lovedOneName || !data.relationship)
                    ? 'bg-white/10 text-white/20 cursor-not-allowed'
                    : 'bg-[#D68F54] text-[#2A2730] shadow-[0_0_20px_rgba(214,143,84,0.3)] hover:brightness-110'
                }`}
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {/* --- STEP 3: READY --- */}
        {step === 'READY' && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 text-center"
          >
            <div className="flex flex-col items-center mb-12">
               {/* Custom Heart Icon */}
               <motion.div
                 initial={{ scale: 0, rotate: -20 }}
                 animate={{ scale: 1, rotate: 0 }}
                 transition={{ type: "spring", delay: 0.2 }}
                 className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#9E584D] to-[#D68F54] flex items-center justify-center shadow-[0_10px_30px_rgba(158,88,77,0.3)] mb-8"
               >
                 <SolaceHeartIcon size={36} className="text-white" strokeWidth={2} fill="rgba(255,255,255,0.2)" />
               </motion.div>

               {/* Personalized Message */}
               <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-serif text-[32px] text-white leading-tight mb-3"
               >
                 For {data.lovedOneName}
               </motion.h2>
               
               <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.6 }}
                  className="font-sans text-[15px] text-white font-medium max-w-[200px] leading-relaxed"
               >
                 We'll keep this space sacred for them.
               </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="w-full space-y-4"
            >
              <button 
                onClick={() => handleComplete(ViewState.CANDLE)}
                className="w-full h-14 rounded-[24px] bg-gradient-to-r from-[#9E584D] to-[#D68F54] text-white font-serif text-lg font-medium shadow-[0_0_40px_rgba(214,143,84,0.4)] flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all"
              >
                <Icon name="flame" size={20} fill="currentColor" className="text-white/90" />
                Light Your First Candle
              </button>

              <button 
                onClick={() => handleComplete(ViewState.HOME)}
                className="text-white/30 text-sm font-medium hover:text-white/60 hover:underline transition-colors"
              >
                Skip for now
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
