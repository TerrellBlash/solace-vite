
import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { Header, Toggle, Icon } from '../components/UI';
import { AnimatePresence, motion } from 'framer-motion';

interface SettingsProps {
  setView: (view: ViewState) => void;
}

export const Settings: React.FC<SettingsProps> = ({ setView }) => {
    const [darkMode, setDarkMode] = useState(() => {
        // Initialize from DOM status which is set in index.html script
        return document.documentElement.classList.contains('dark');
    });
    
    const [reminderMode, setReminderMode] = useState<'on' | 'quiet' | 'off'>('on');
    const [anniversary, setAnniversary] = useState(true);
    const [missedStreak, setMissedStreak] = useState(true);
    const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const handleSignOut = () => {
        // Clear all local storage data
        localStorage.clear();
        
        // Explicitly remove the user key to be safe
        localStorage.removeItem('solace_user');

        // Navigate to Onboarding immediately
        // We do not use window.location.reload() here to keep the transition smooth
        // The App component will render Onboarding because we passed the ViewState
        setView(ViewState.ONBOARDING);
    };

    const RadioOption = ({ value, label, sub, current }: any) => {
        const isSelected = current === value;
        return (
            <div 
                onClick={() => setReminderMode(value)}
                className={`flex items-center gap-4 p-4 rounded-[20px] cursor-pointer transition-all 
                    ${isSelected 
                        ? 'border border-amber bg-[#FBF6F1] dark:bg-amber/10 dark:border-amber/50' 
                        : 'border border-transparent hover:bg-[#F4F2ED] dark:hover:bg-charcoal/50'}`}
            >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'border-amber' : 'border-[#D6D3CD] dark:border-muted'}`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-amber" />}
                </div>
                <div>
                    <p className={`font-medium text-[15px] ${isSelected ? 'text-text dark:text-bg' : 'text-muted dark:text-muted/80'}`}>{label}</p>
                    <p className="text-xs text-muted/80">{sub}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full flex flex-col bg-bg dark:bg-obsidian pb-40 transition-colors duration-500 relative">
             <Header title="Settings" onBack={() => setView(ViewState.HOME)} />

             <div className="px-6 mt-2 space-y-8 animate-enter">
                
                {/* Dark Mode Card */}
                <div className="bg-white dark:bg-charcoal rounded-[24px] p-5 flex items-center justify-between shadow-soft border border-transparent dark:border-white/5 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <Icon name={darkMode ? "moon" : "sun"} size={20} className="text-text dark:text-bg" />
                        <span className="font-medium text-text dark:text-bg text-[15px]">Dark Mode</span>
                    </div>
                    <Toggle active={darkMode} onToggle={() => setDarkMode(!darkMode)} />
                </div>

                {/* Gentle Reminders */}
                <div>
                    <h3 className="font-serif text-xl text-text dark:text-bg mb-4 pl-1">Gentle Reminders</h3>
                    
                    <div className="bg-white dark:bg-charcoal rounded-[32px] p-6 shadow-soft space-y-2 border border-transparent dark:border-white/5 transition-colors duration-300">
                        {/* Radio Group */}
                        <div className="space-y-1">
                            <RadioOption value="on" label="On" sub="Check in if I'm away" current={reminderMode} />
                            <RadioOption value="quiet" label="Quiet" sub="Only important dates" current={reminderMode} />
                            <RadioOption value="off" label="Off" sub="I'll come when ready" current={reminderMode} />
                        </div>

                        <div className="h-4"></div> {/* Spacer */}

                        {/* Toggles */}
                        <div className="flex items-center justify-between py-2 pl-2 pr-1">
                             <span className="font-medium text-text dark:text-bg text-[15px]">Anniversary Reminders</span>
                             <Toggle active={anniversary} onToggle={() => setAnniversary(!anniversary)} color="bg-clay" />
                        </div>
                         <div className="flex items-center justify-between py-2 pl-2 pr-1">
                             <span className="font-medium text-text dark:text-bg text-[15px]">Missed Streak Nudges</span>
                             <Toggle active={missedStreak} onToggle={() => setMissedStreak(!missedStreak)} color="bg-clay" />
                        </div>
                    </div>
                    
                    <p className="text-center text-[11px] text-muted/60 dark:text-muted/40 mt-6 px-8 leading-relaxed">
                        We'll only reach out when we think you might need a moment of space. No pressure, ever.
                    </p>
                </div>
                
                {/* Account Section */}
                <div>
                    <h3 className="font-serif text-xl text-text dark:text-bg mb-4 pl-1">Account</h3>
                    <div className="bg-white dark:bg-charcoal rounded-[32px] p-6 shadow-soft border border-transparent dark:border-white/5 transition-colors duration-300">
                        <button 
                            onClick={() => setShowSignOutConfirm(true)}
                            className="w-full flex items-center justify-between group"
                        >
                            <span className="font-medium text-red-500 group-hover:text-red-600 transition-colors">Sign Out</span>
                            <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/10 flex items-center justify-center text-red-500 group-hover:bg-red-100 dark:group-hover:bg-red-900/20 transition-colors">
                                <Icon name="log-out" size={20} />
                            </div>
                        </button>
                    </div>
                </div>

             </div>

             {/* Sign Out Confirmation Modal */}
             <AnimatePresence>
                {showSignOutConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowSignOutConfirm(false)}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-charcoal w-full max-w-sm rounded-[32px] p-6 shadow-2xl border border-white/10 relative z-10"
                        >
                            <h3 className="font-serif text-xl text-text dark:text-bg mb-2">Sign Out?</h3>
                            <p className="text-muted text-sm mb-6 leading-relaxed">
                                This will reset your journey and clear your saved data from this device. Are you sure?
                            </p>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setShowSignOutConfirm(false)}
                                    className="flex-1 py-3.5 rounded-full border border-sand dark:border-white/10 text-muted font-medium hover:bg-bg dark:hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSignOut}
                                    className="flex-1 py-3.5 rounded-full bg-red-500 text-white font-medium shadow-lg hover:bg-red-600 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
             </AnimatePresence>
        </div>
    );
};
