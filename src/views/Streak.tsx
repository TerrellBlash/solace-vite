
import React from 'react';
import { ViewState } from '../types';
import { Header, Icon } from '../components/UI';
import { motion } from 'framer-motion';

interface StreakProps {
  setView: (view: ViewState) => void;
}

export const Streak: React.FC<StreakProps> = ({ setView }) => {
  // Calendar Configuration: December 2025
  const daysInMonth = 31;
  const startDayOffset = 1; // Dec 1, 2025 is a Monday
  
  // Data matching screenshot
  // Days with dots: 1, 2, 3, 5, 6, 7, 8, 10, 12, 13, 14, 15, 18, 19, 20, 21, 22
  const completedDays = [1, 2, 3, 5, 6, 7, 8, 10, 12, 13, 14, 15, 18, 19, 20, 21, 22];
  const selectedDay = 12;

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty slots for start of month
    for (let i = 0; i < startDayOffset; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    // Days 1-31
    for (let day = 1; day <= daysInMonth; day++) {
      const isCompleted = completedDays.includes(day);
      const isSelected = day === selectedDay;
      
      // Visual Logic:
      // - Text is Amber if completed OR selected. Dark otherwise.
      // - Selected has a Clay border.
      // - Completed has an Amber dot.
      const textColorClass = (isCompleted || isSelected) ? 'text-[#D68F54]' : 'text-[#2D2A26] dark:text-[#F4F2ED]';
      const borderClass = isSelected ? 'border border-[#9E584D]' : 'border border-transparent';

      days.push(
        <div key={day} className="flex flex-col items-center gap-1 mb-3">
            <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-[16px] font-medium transition-all relative
                ${borderClass}
                ${textColorClass}
            `}>
                {day}
            </div>
            
            {/* Dot Indicator */}
            {isCompleted ? (
                <div className="w-1.5 h-1.5 rounded-full bg-[#D68F54]"></div>
            ) : (
                <div className="w-1.5 h-1.5"></div>
            )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="h-full flex flex-col bg-[#F4F2ED] dark:bg-[#1F1D24] overflow-hidden transition-colors">
      <Header title="Ritual Streak" onBack={() => setView(ViewState.HOME)} />

      <div className="flex-1 overflow-y-auto no-scrollbar pt-2 px-6 pb-32">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center py-6 mb-2 animate-enter">
            
            {/* Circle Progress with Flame */}
            <div className="relative w-40 h-40 mb-4 flex items-center justify-center">
                {/* SVG Ring */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background Track */}
                    <circle
                        cx="50"
                        cy="50"
                        r="36" 
                        stroke="#E6E2DC"
                        className="dark:stroke-white/10"
                        strokeWidth="1.5"
                        fill="none"
                    />
                    {/* Progress Arc (approx 70% matching screenshot) */}
                    <motion.circle
                        initial={{ strokeDashoffset: 226 }}
                        animate={{ strokeDashoffset: 226 - (226 * 0.7) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        cx="50"
                        cy="50"
                        r="36"
                        stroke="#D68F54"
                        strokeWidth="1.5"
                        fill="none"
                        strokeDasharray="226"
                        strokeLinecap="round"
                    />
                </svg>
                
                {/* Flame Icon Centered */}
                <div className="absolute inset-0 flex items-center justify-center pb-1">
                    <Icon name="flame" size={42} className="text-[#D68F54]" strokeWidth={1.5} />
                </div>

                {/* +1 Badge - positioned at top right of the ring */}
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute top-6 right-8 w-8 h-8 rounded-full bg-[#9E584D] text-white flex items-center justify-center text-xs font-bold shadow-sm z-10"
                >
                    +1
                </motion.div>
            </div>

            <h1 className="font-serif text-[40px] text-[#2D2A26] dark:text-[#F4F2ED] leading-none mb-2 text-center">5 Day Streak</h1>
            <p className="text-[#96948F] text-sm font-medium text-center">You've found time for them this week.</p>
        </div>

        {/* Calendar Card */}
        <div className="bg-white dark:bg-[#2A2730] rounded-[40px] p-8 shadow-[0_10px_40px_-10px_rgba(45,42,38,0.05)] mt-4 animate-enter delay-100 mb-8 border border-transparent dark:border-white/5 transition-colors">
            {/* Calendar Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <p className="text-[#9E584D] text-[12px] font-bold tracking-[0.15em] uppercase mb-1">2025</p>
                    <h3 className="font-serif text-[32px] text-[#2D2A26] dark:text-[#F4F2ED] leading-none">December</h3>
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#D68F54]"></div>
                    <span className="text-[10px] text-[#96948F] font-bold uppercase tracking-wide">Ritual Complete</span>
                </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-center text-[11px] font-bold text-[#96948F]/60 uppercase">{d}</div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7">
                {renderCalendarDays()}
            </div>
        </div>

      </div>
    </div>
  );
};
