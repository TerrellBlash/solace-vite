
import React, { useState, useEffect, useRef } from 'react';
import { ViewState } from './types';
import { Icon, SolaceIcon } from './components/UI';
import { Home } from './views/Home';
import { Settings } from './views/Settings';
import { Candle } from './views/Candle';
import { Companion } from './views/Companion';
import { CirclesList } from './views/Circles';
import { Journey } from './views/Journey';
import { Letters } from './views/Letters';
import { Memory } from './views/Memory';
import { Streak } from './views/Streak';
import { Onboarding } from './views/Onboarding';
import { motion, AnimatePresence } from 'framer-motion';

const NavItem = ({ icon, active, onClick }: any) => (
    <button 
        onClick={onClick} 
        className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 active:scale-95 active:duration-100 ${active ? 'text-[#2D2A26] dark:text-bg' : 'text-[#96948F] hover:text-[#2D2A26] dark:hover:text-bg'}`}
    >
        <Icon name={icon} size={24} strokeWidth={2} fill={active ? "currentColor" : "none"} className={active ? "opacity-100" : "opacity-100"} />
        {active && <motion.div layoutId="nav-dot" className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-[#9E584D]"></motion.div>}
    </button>
);

const App: React.FC = () => {
    // Check localStorage for onboarding status on initialization
    const [currentView, setView] = useState<ViewState>(() => {
        const user = localStorage.getItem('solace_user');
        return user ? ViewState.HOME : ViewState.ONBOARDING;
    });

    const containerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => { if(containerRef.current) containerRef.current.scrollTop = 0; }, [currentView]);

    const showNav = [ViewState.HOME, ViewState.JOURNEY, ViewState.LETTERS, ViewState.COMPANION, ViewState.CIRCLES].includes(currentView);

    // If we are in Onboarding view, we override the main container styles slightly to ensure full immersion
    if (currentView === ViewState.ONBOARDING) {
         return (
             <div className="w-full max-w-[420px] h-[100dvh] bg-[#1F1D24] transition-colors duration-500 sm:h-[90vh] sm:rounded-[48px] sm:shadow-2xl sm:border-[8px] sm:border-white relative overflow-hidden flex flex-col font-sans ring-1 ring-black/5">
                 <Onboarding setView={setView} />
             </div>
         )
    }

    return (
        <div className="w-full max-w-[420px] h-[100dvh] bg-bg dark:bg-obsidian transition-colors duration-500 sm:h-[90vh] sm:rounded-[48px] sm:shadow-2xl sm:border-[8px] sm:border-white relative overflow-hidden flex flex-col font-sans ring-1 ring-black/5">
            
            <div ref={containerRef} className="flex-1 overflow-y-auto no-scrollbar scroll-smooth relative z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentView}
                        initial={{ opacity: 0, filter: 'blur(5px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, filter: 'blur(5px)' }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="min-h-full"
                    >
                        {currentView === ViewState.HOME && <Home setView={setView} />}
                        {currentView === ViewState.SETTINGS && <Settings setView={setView} />}
                        {currentView === ViewState.CANDLE && <Candle setView={setView} />}
                        {currentView === ViewState.COMPANION && <Companion setView={setView} />}
                        {currentView === ViewState.CIRCLES && <CirclesList setView={setView} />}
                        {currentView === ViewState.JOURNEY && <Journey setView={setView} />}
                        {currentView === ViewState.LETTERS && <Letters setView={setView} />}
                        {currentView === ViewState.MEMORY && <Memory setView={setView} />}
                        {currentView === ViewState.STREAK && <Streak setView={setView} />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Floating Bottom Nav */}
            <div className={`absolute bottom-8 left-6 right-6 z-50 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${showNav ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'}`}>
                <div className="bg-[#F4F2ED]/90 dark:bg-charcoal/90 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-[32px] h-[80px] flex items-center justify-between px-6 shadow-[0_10px_40px_-10px_rgba(45,42,38,0.1)] transition-colors duration-500">
                    
                    <NavItem icon="home" active={currentView === ViewState.HOME} onClick={() => setView(ViewState.HOME)} />
                    <NavItem icon="map" active={currentView === ViewState.JOURNEY} onClick={() => setView(ViewState.JOURNEY)} />
                    
                    {/* Central Action Button */}
                    <div className="relative">
                        <button 
                            onClick={() => setView(ViewState.CANDLE)}
                            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#9E584D] to-[#D68F54] shadow-glow flex items-center justify-center text-white active:scale-95 transition-transform duration-200 ease-out hover:scale-105"
                        >
                            <SolaceIcon size={26} fill="currentColor" />
                        </button>
                    </div>

                    <NavItem icon="mail" active={currentView === ViewState.LETTERS} onClick={() => setView(ViewState.LETTERS)} />
                    <NavItem icon="message-circle" active={currentView === ViewState.COMPANION} onClick={() => setView(ViewState.COMPANION)} />
                
                </div>
            </div>
            
            {/* Gradient Fade for Scroll */}
            <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F4F2ED] via-[#F4F2ED]/80 to-transparent dark:from-obsidian dark:via-obsidian/80 pointer-events-none z-10 transition-opacity duration-500 ${!showNav ? 'opacity-0' : 'opacity-100'}`}></div>
        </div>
    );
};

export default App;
