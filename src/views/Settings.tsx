
import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { Header, Toggle, Icon } from '../components/UI';

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

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

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
        <div className="h-full flex flex-col bg-bg dark:bg-obsidian pb-20 transition-colors duration-500">
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
             </div>
        </div>
    );
};
