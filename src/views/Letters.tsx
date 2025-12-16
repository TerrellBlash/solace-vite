
import React, { useState } from 'react';
import { ViewState } from '../types';
import { BackButton, Icon } from '../components/UI';

interface LettersProps {
  setView: (view: ViewState) => void;
}

export const Letters: React.FC<LettersProps> = ({ setView }) => {
    const [step, setStep] = useState('LIST'); 
    
    if (step === 'LIST') return (
        <div className="h-full flex flex-col bg-bg dark:bg-obsidian pt-12 px-6 relative transition-colors">
            <div className="flex items-center justify-between mb-8">
                <BackButton onClick={() => setView(ViewState.HOME)} />
                <h2 className="font-serif text-2xl text-text dark:text-bg">Legacy Letters</h2>
                <div className="w-10"></div>
            </div>

            <div className="flex gap-4 mb-6 border-b border-sand/40 dark:border-white/10 pb-1">
                <button className="text-sm font-bold text-clay border-b-2 border-clay pb-2 px-2">Waiting</button>
                <button className="text-sm font-medium text-text/40 dark:text-bg/40 pb-2 px-2">Delivered</button>
            </div>

            <div className="space-y-4 animate-enter-up">
                <div className="bg-white/60 dark:bg-charcoal/80 backdrop-blur-md rounded-[24px] p-5 border-l-4 border-l-sand dark:border-l-white/20 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <Icon name="lock" size={14} className="text-text/40 dark:text-bg/40" />
                            <span className="text-xs font-bold uppercase tracking-wider text-text/60 dark:text-bg/60">Sealed</span>
                        </div>
                        <span className="text-xs text-clay bg-clay/10 px-2 py-1 rounded-full">Dec 3, 2026</span>
                    </div>
                    <h3 className="font-serif text-xl text-text dark:text-bg">For Future Me</h3>
                    <p className="text-text/50 dark:text-bg/50 text-xs mt-1">Written on Oct 15, 2025</p>
                </div>

                 <div onClick={() => setStep('WIZARD_1')} className="border-2 border-dashed border-sand dark:border-white/10 rounded-[24px] p-6 flex flex-col items-center justify-center text-sand dark:text-muted cursor-pointer hover:bg-white/40 dark:hover:bg-white/5 hover:border-amber hover:text-amber dark:hover:text-amber transition-all gap-2 min-h-[140px]">
                    <Icon name="plus" size={24} />
                    <span className="font-serif text-lg">Write a new letter</span>
                </div>
            </div>
        </div>
    );

    if (step === 'WIZARD_1') return (
        <div className="h-full flex flex-col bg-bg dark:bg-obsidian pt-12 px-6 transition-colors">
            <div className="flex items-center justify-between mb-8">
                <BackButton onClick={() => setStep('LIST')} />
                <div className="flex gap-1.5">
                     <div className="w-2 h-2 rounded-full bg-clay"></div>
                     <div className="w-2 h-2 rounded-full bg-sand/50 dark:bg-white/20"></div>
                     <div className="w-2 h-2 rounded-full bg-sand/50 dark:bg-white/20"></div>
                </div>
                <div className="w-10"></div>
            </div>
            
            <h2 className="font-serif text-3xl text-text dark:text-bg mb-2 animate-enter-up">Who is this for?</h2>
            
            <div className="grid gap-4 mt-8 animate-enter-up delay-100">
                <button onClick={() => setStep('WIZARD_2')} className="text-left bg-white/60 dark:bg-charcoal/80 p-5 rounded-[24px] hover:border-amber border border-transparent dark:border-white/5 transition-all group">
                    <div className="w-12 h-12 rounded-full bg-bg dark:bg-obsidian flex items-center justify-center text-text dark:text-bg mb-3 group-hover:bg-amber group-hover:text-white transition-colors">
                        <Icon name="user" size={24} />
                    </div>
                    <h3 className="font-serif text-lg text-text dark:text-bg">Future Me</h3>
                    <p className="text-xs text-text/50 dark:text-bg/50">A message to yourself</p>
                </button>

                <button onClick={() => setStep('WIZARD_2')} className="text-left bg-white/60 dark:bg-charcoal/80 p-5 rounded-[24px] hover:border-amber border border-transparent dark:border-white/5 transition-all group">
                     <div className="w-12 h-12 rounded-full bg-bg dark:bg-obsidian flex items-center justify-center text-clay mb-3 group-hover:bg-amber group-hover:text-white transition-colors">
                        <Icon name="heart" size={24} />
                    </div>
                    <h3 className="font-serif text-lg text-text dark:text-bg">To Mom</h3>
                    <p className="text-xs text-text/50 dark:text-bg/50">Words you wish you could say</p>
                </button>
            </div>
        </div>
    );

     if (step === 'WIZARD_2') return (
        <div className="h-full flex flex-col bg-bg dark:bg-obsidian pt-12 px-6 transition-colors">
             <div className="flex items-center justify-between mb-8">
                <BackButton onClick={() => setStep('WIZARD_1')} />
                <div className="flex gap-1.5">
                     <div className="w-2 h-2 rounded-full bg-sand/50 dark:bg-white/20"></div>
                     <div className="w-2 h-2 rounded-full bg-clay"></div>
                     <div className="w-2 h-2 rounded-full bg-sand/50 dark:bg-white/20"></div>
                </div>
                <div className="w-10"></div>
            </div>
            
            <h2 className="font-serif text-3xl text-text dark:text-bg mb-2 animate-enter-up">When to deliver?</h2>
            
            <div className="space-y-3 mt-8 animate-enter-up delay-100">
                {['In 1 month', 'In 6 months', 'In 1 year', "On Mom's Birthday"].map((t, i) => (
                     <button key={i} onClick={() => setStep('WIZARD_3')} className="w-full flex items-center justify-between bg-white/60 dark:bg-charcoal/80 p-4 rounded-[20px] hover:bg-white dark:hover:bg-charcoal text-text dark:text-bg font-medium transition-all group border border-transparent dark:border-white/5">
                        <span>{t}</span>
                        <Icon name="arrow-right" size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-amber" />
                     </button>
                ))}
            </div>
        </div>
    );

     if (step === 'WIZARD_3') return (
        <div className="h-full flex flex-col bg-bg dark:bg-obsidian pt-12 px-6 pb-8 transition-colors">
             <div className="flex items-center justify-between mb-4">
                <BackButton onClick={() => setStep('WIZARD_2')} />
                <div className="flex gap-1.5">
                     <div className="w-2 h-2 rounded-full bg-sand/50 dark:bg-white/20"></div>
                     <div className="w-2 h-2 rounded-full bg-sand/50 dark:bg-white/20"></div>
                     <div className="w-2 h-2 rounded-full bg-clay"></div>
                </div>
                <div className="w-10"></div>
            </div>
            
            <div className="flex-1 bg-white/60 dark:bg-charcoal/80 rounded-[32px] p-6 mb-6 shadow-sm border border-white/60 dark:border-white/5 relative flex flex-col animate-enter-up">
                 <p className="font-serif text-xl text-text dark:text-bg mb-4">Dear Future Me,</p>
                 <textarea className="flex-1 w-full bg-transparent resize-none outline-none text-text dark:text-bg leading-relaxed font-serif placeholder:text-text/20 dark:placeholder:text-bg/20" placeholder="Start writing here..." autoFocus></textarea>
                 <p className="text-xs text-text/40 dark:text-bg/40 mt-2 text-right">Arrives Dec 3, 2026</p>
            </div>

            <button onClick={() => setStep('SEALED')} className="w-full py-4 rounded-full bg-amber text-white font-serif text-lg tracking-wide shadow-[0_0_30px_rgba(214,143,84,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-medium">
                <Icon name="stamp" size={20} />
                Seal Letter
            </button>
        </div>
    );

    if (step === 'SEALED') return (
        <div className="h-full flex flex-col items-center justify-center bg-bg dark:bg-obsidian px-8 text-center relative overflow-hidden transition-colors">
            <div className="absolute inset-0 noise-texture opacity-30"></div>
            
            <div className="relative mb-12">
                 <div className="w-48 h-32 bg-sand/40 dark:bg-white/10 rounded-lg shadow-xl flex items-center justify-center border border-sand dark:border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full border-t-[64px] border-r-[96px] border-l-[96px] border-t-sand/70 dark:border-t-white/10 border-r-transparent border-l-transparent z-10 drop-shadow-sm"></div>
                    
                    <div className="absolute z-20 w-16 h-16 rounded-full bg-gradient-to-br from-clay to-[#2A2730] shadow-[0_4px_12px_rgba(0,0,0,0.2)] flex items-center justify-center text-white/90 animate-wax-drip">
                        <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center animate-stamp-press">
                             <Icon name="heart" size={24} fill="currentColor" />
                        </div>
                    </div>
                 </div>
            </div>

            <h2 className="font-serif text-3xl text-text dark:text-bg mb-3 animate-enter-up delay-500">Letter Sealed</h2>
            <p className="text-text/60 dark:text-bg/60 text-sm mb-8 animate-enter-up delay-500">It will arrive safely on Dec 3, 2026.</p>

            <button onClick={() => setStep('LIST')} className="bg-white/60 dark:bg-charcoal/80 px-8 py-3 rounded-full text-text dark:text-bg font-medium hover:bg-white dark:hover:bg-charcoal transition-all animate-enter-up delay-500 border border-sand dark:border-white/10">
                Return to List
            </button>
        </div>
    );

    return null;
};
