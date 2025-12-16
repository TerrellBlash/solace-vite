
import React from 'react';
import { ViewState } from '../types';
import { BackButton, Icon } from '../components/UI';
import { motion } from 'framer-motion';

interface JourneyProps {
  setView: (view: ViewState) => void;
}

export const Journey: React.FC<JourneyProps> = ({ setView }) => {
    return (
        <div className="h-full flex flex-col bg-bg dark:bg-obsidian pt-12 relative overflow-hidden font-sans transition-colors">
             {/* Header */}
             <div className="px-6 flex items-center justify-between mb-2 relative z-10">
                <BackButton onClick={() => setView(ViewState.HOME)} />
                <h2 className="font-serif text-[28px] text-text dark:text-bg">Your Journey</h2>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar relative">
                {/* Stats Card */}
                <div className="px-6 pt-6 pb-2 relative z-10">
                    <div className="bg-white dark:bg-charcoal rounded-[40px] p-8 text-center shadow-card border border-transparent dark:border-white/5 transition-colors">
                        <p className="font-serif text-[22px] text-text dark:text-bg mb-8 leading-tight">
                            "You've saved 12 memories of Mom"
                        </p>
                        
                        <div className="flex justify-between items-start px-2">
                            <div className="flex flex-col items-center gap-1">
                                <span className="font-serif text-[32px] text-amber leading-none">34</span>
                                <span className="text-[10px] font-bold tracking-[0.2em] text-text dark:text-bg uppercase mt-1">Candles</span>
                            </div>
                            
                            <div className="flex flex-col items-center gap-1">
                                <span className="font-serif text-[32px] text-amber leading-none">12</span>
                                <span className="text-[10px] font-bold tracking-[0.2em] text-text dark:text-bg uppercase mt-1">Memories</span>
                            </div>
                            
                            <div className="flex flex-col items-center gap-1">
                                <span className="font-serif text-[32px] text-amber leading-none">47</span>
                                <span className="text-[10px] font-bold tracking-[0.2em] text-text dark:text-bg uppercase mt-1">Days</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="relative w-full min-h-[600px] mt-4">
                    {/* SVG Path */}
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 375 600" preserveAspectRatio="none">
                        {/* Dashed Path matching screenshot shape */}
                        <path 
                            d="M 60 -20 C 60 80, 80 100, 180 150 C 280 200, 320 280, 320 380 C 320 500, 180 520, 100 600" 
                            fill="none" 
                            stroke="#E6E2DC" 
                            className="dark:stroke-white/10"
                            strokeWidth="2" 
                            strokeDasharray="6 6" 
                        />
                    </svg>

                    {/* Today Node */}
                    <div className="absolute top-[80px] left-[70px] z-20">
                        <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative"
                        >
                            {/* Icon Circle */}
                            <div className="w-14 h-14 rounded-full bg-white dark:bg-charcoal shadow-soft flex items-center justify-center text-amber relative z-20">
                                <Icon name="sparkles" size={24} fill="currentColor" />
                            </div>
                            
                            {/* Dotted Line Connector */}
                            <div className="absolute top-1/2 left-full w-8 h-0 border-t-2 border-dashed border-[#E6E2DC] dark:border-white/10 -translate-y-1/2 z-0"></div>

                            {/* Label Card */}
                            <div className="absolute top-1/2 left-[calc(100%+32px)] -translate-y-1/2 bg-white dark:bg-charcoal px-5 py-3 rounded-[20px] shadow-sm whitespace-nowrap min-w-[140px] border border-transparent dark:border-white/5">
                                <p className="font-bold text-text dark:text-bg text-sm mb-0.5">Today</p>
                                <p className="text-muted text-xs">You're here now</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Faded bottom path indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg dark:from-obsidian to-transparent z-10 pointer-events-none"></div>
                </div>

                {/* Bottom padding for floating nav */}
                <div className="h-32"></div>
            </div>
        </div>
    );
};
