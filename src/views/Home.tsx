
import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { Icon } from '../components/UI';
import { NudgeBanner } from '../components/NudgeBanner';

interface HomeProps {
  setView: (view: ViewState) => void;
}

const CountUp: React.FC<{ end: number, duration?: number }> = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number;
        let animationFrame: number;

        const updateCount = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            
            if (progress < duration) {
                setCount(Math.min(Math.floor((progress / duration) * end), end));
                animationFrame = requestAnimationFrame(updateCount);
            } else {
                setCount(end);
            }
        };

        animationFrame = requestAnimationFrame(updateCount);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return <>{count}</>;
};

const MenuRow = ({ title, subtitle, icon, onClick, delay, iconBg = "bg-[#F4F2ED]", iconColor = "text-[#2D2A26]" }: any) => (
    <div 
        onClick={onClick}
        className={`bg-white dark:bg-charcoal rounded-[32px] p-6 flex items-center gap-5 shadow-soft active:scale-[0.99] transition-transform cursor-pointer animate-enter border border-transparent dark:border-white/5 hover:bg-white/80 dark:hover:bg-charcoal/80 ${delay}`}
    >
        <div className={`w-12 h-12 rounded-full ${iconBg} dark:bg-obsidian flex items-center justify-center ${iconColor} dark:text-bg shrink-0 shadow-sm`}>
             <Icon name={icon} size={20} strokeWidth={1.5} />
        </div>
        <div className="flex-1">
            <h3 className="font-serif text-[20px] text-text dark:text-bg leading-tight tracking-tight">{title}</h3>
            <p className="text-[13px] text-muted dark:text-muted/80 font-medium">{subtitle}</p>
        </div>
        <div className="w-8 h-8 flex items-center justify-center text-sand dark:text-muted">
            <Icon name="chevron-right" size={20} />
        </div>
    </div>
);

export const Home: React.FC<HomeProps> = ({ setView }) => {
    const [showNudge, setShowNudge] = useState(true);

    // Get user name from local storage
    const user = JSON.parse(localStorage.getItem('solace_user') || '{}');
    const name = user.name || "Friend";

    return (
        <div className="pb-40 min-h-full bg-bg dark:bg-obsidian px-6 pt-16 transition-colors duration-500">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-8 animate-enter">
                <div>
                    <h1 className="font-serif text-[40px] leading-[1.1] text-text dark:text-bg tracking-tight">
                        Welcome home, <br/>
                        <span className="font-hand text-clay dark:text-amber text-[42px] relative">
                            {name}
                            <span className="absolute -bottom-2 right-0 w-full h-2 bg-amber/10 -rotate-1 rounded-full -z-10"></span>
                        </span>
                    </h1>
                    <p className="text-muted dark:text-muted/80 text-[15px] mt-3 font-sans">Your space is here whenever you need it.</p>
                </div>
                <button onClick={() => setView(ViewState.SETTINGS)} className="w-12 h-12 rounded-full bg-white/50 dark:bg-charcoal border border-white dark:border-white/10 flex items-center justify-center text-text/40 dark:text-white/60 shadow-sm active:scale-95 transition-transform hover:bg-white dark:hover:bg-charcoal/80">
                    <Icon name="sliders-horizontal" size={20} />
                </button>
            </div>

            {/* Nudge */}
            {showNudge && (
                <div className="mb-6 animate-enter delay-100">
                   <NudgeBanner onDismiss={() => setShowNudge(false)} />
                </div>
            )}

            {/* Candle Hero */}
            <div 
                onClick={() => setView(ViewState.CANDLE)}
                className="w-full aspect-[1.6/1] rounded-[36px] p-8 relative overflow-hidden cursor-pointer shadow-orange-glow group active:scale-[0.99] transition-all animate-enter delay-100 bg-gradient-to-br from-[#4A3B39] via-[#9E584D] to-[#D68F54] border border-white/10"
            >
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                 
                 {/* Shimmer Effect */}
                 <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent z-0"></div>
                 
                 <div className="relative z-10 h-full flex flex-col justify-between">
                     <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 w-fit">
                         <div className="w-1.5 h-1.5 rounded-full bg-[#D68F54] shadow-[0_0_8px_rgba(214,143,84,0.8)] animate-pulse"></div>
                         <span className="text-[10px] font-bold tracking-[0.15em] text-white/90 uppercase">Daily Ritual</span>
                     </div>

                     <div className="flex justify-between items-end">
                         <div>
                             <h2 className="font-serif text-[36px] text-white leading-none mb-2 tracking-tight">Light a<br/>Candle</h2>
                             <p className="text-white/80 text-[15px] font-medium">Reflect & remember.</p>
                         </div>
                         <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#FFDDB6] shadow-lg group-hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
                             <Icon name="flame" size={28} strokeWidth={1.5} fill="currentColor" className="opacity-90 animate-float" />
                         </div>
                     </div>
                 </div>
            </div>

            {/* Grid: Streak & Journey */}
            <div className="grid grid-cols-2 gap-4 mt-4 animate-enter delay-200">
                <div onClick={() => setView(ViewState.STREAK)} className="bg-white dark:bg-charcoal rounded-[36px] aspect-square flex flex-col items-center justify-center text-center shadow-soft cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden group border border-transparent dark:border-white/5 hover:shadow-lg">
                     <h3 className="font-serif text-[56px] text-text dark:text-bg leading-none mb-1 group-hover:scale-110 transition-transform duration-500 text-shadow">
                         <CountUp end={5} />
                     </h3>
                     <p className="text-[11px] font-bold tracking-[0.2em] text-text/60 dark:text-white/40 uppercase">Days</p>
                </div>

                <div onClick={() => setView(ViewState.JOURNEY)} className="bg-white dark:bg-charcoal rounded-[36px] aspect-square flex flex-col items-center justify-center text-center shadow-soft cursor-pointer active:scale-[0.98] transition-transform group border border-transparent dark:border-white/5 hover:shadow-lg">
                     <div className="w-12 h-12 mb-3 rounded-full bg-amber/10 dark:bg-amber/20 flex items-center justify-center text-amber group-hover:scale-110 transition-transform duration-300">
                        <Icon name="map" size={24} strokeWidth={1.5} />
                     </div>
                     <h3 className="font-serif text-[20px] text-text dark:text-bg mb-0.5 tracking-tight">Journey</h3>
                     <p className="text-muted dark:text-muted/80 text-[13px] font-medium">Your path</p>
                </div>
            </div>

            {/* List Items */}
            <div className="flex flex-col gap-3 mt-4 pb-8">
                <MenuRow 
                    title="Memory Jar"
                    subtitle="Save a thought for today"
                    icon="book-open"
                    delay="delay-300"
                    onClick={() => setView(ViewState.MEMORY)}
                />
                <MenuRow 
                    title="Legacy Letters"
                    subtitle="Write for the future"
                    icon="mail"
                    iconBg="bg-[#F5E6E0]"
                    iconColor="text-clay"
                    delay="delay-400"
                    onClick={() => setView(ViewState.LETTERS)}
                />
                <MenuRow 
                    title="Companion"
                    subtitle="Here to listen"
                    icon="sparkles"
                    iconBg="bg-[#E8EDE9]"
                    iconColor="text-sage"
                    delay="delay-500"
                    onClick={() => setView(ViewState.COMPANION)}
                />
                <MenuRow 
                    title="Circles"
                    subtitle="Find your space"
                    icon="users"
                    iconBg="bg-[#FDF3E6]"
                    iconColor="text-amber"
                    delay="delay-600"
                    onClick={() => setView(ViewState.CIRCLES)}
                />
            </div>

        </div>
    );
};
