
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { motion } from 'framer-motion';

// --- Icon Mapper ---
export const Icon: React.FC<{ name: string; size?: number; className?: string; strokeWidth?: number; fill?: string }> = ({ 
  name, 
  size = 20, 
  className = "", 
  strokeWidth = 1.5, 
  fill = "none" 
}) => {
  // Convert kebab-case (e.g. arrow-left) to PascalCase (e.g. ArrowLeft)
  const pascalName = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  const LucideIcon = (LucideIcons as any)[pascalName] || (LucideIcons as any)[name] || LucideIcons.HelpCircle;

  return <LucideIcon size={size} className={className} strokeWidth={strokeWidth} fill={fill} />;
};

// --- Custom Unique Icons ---
export const SolaceIcon: React.FC<{ size?: number; className?: string; fill?: string }> = ({ size = 24, className = "", fill = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path 
            d="M12 2C12.8 8.5 17 11.2 22 12C17 12.8 12.8 15.5 12 22C11.2 15.5 7 12.8 2 12C7 11.2 11.2 8.5 12 2Z" 
            fill={fill} 
        />
        <circle cx="17.5" cy="6.5" r="2" fill={fill} fillOpacity="0.7" />
        <path 
            d="M16 16C16.5 17.5 18 18 19 18.2C18 18.5 16.5 19 16 20.5C15.5 19 14 18.5 13 18.2C14 18 15.5 17.5 16 16Z" 
            fill={fill} 
            fillOpacity="0.8" 
        />
    </svg>
);

export const SolaceHeartIcon: React.FC<{ size?: number; className?: string; fill?: string; strokeWidth?: number }> = ({ size = 24, className = "", fill = "none", strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Organic Heart Shape */}
        <path 
            d="M12 21.5C12 21.5 2 13.8 2 7.8C2 4.5 5 2.2 8 2.2C10.5 2.2 12 4 12 4C12 4 13.5 2.2 16 2.2C19 2.2 22 4.5 22 7.8C22 13.8 12 21.5 12 21.5Z" 
            stroke="currentColor" 
            strokeWidth={strokeWidth} 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill={fill}
        />
        {/* Subtle geometric accent line (shine) */}
        <path 
            d="M16.5 5.5C17.5 6 18.5 7 19 8.5" 
            stroke="currentColor" 
            strokeWidth={strokeWidth} 
            strokeLinecap="round" 
            opacity="0.5"
        />
    </svg>
);


// --- Shared Components ---

export const Card: React.FC<{ children: React.ReactNode; onClick?: () => void; className?: string; delay?: string }> = ({ 
  children, 
  onClick, 
  className = "", 
  delay = "" 
}) => (
  <div onClick={onClick} className={`bg-white/60 dark:bg-charcoal/80 backdrop-blur-md rounded-[32px] p-5 relative overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-amber/10 active:scale-[0.98] active:duration-100 border border-transparent dark:border-white/5 animate-enter ${delay} ${className}`}>
      {children}
  </div>
);

export const BackButton: React.FC<{ onClick: () => void; dark?: boolean }> = ({ onClick, dark = false }) => (
  <button onClick={onClick} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 active:duration-100 z-20 ${dark ? 'bg-[#E8E6E3]/10 text-[#E8E6E3] hover:bg-[#E8E6E3]/20' : 'bg-white shadow-sm text-text hover:bg-white/80 dark:bg-charcoal dark:text-bg dark:border dark:border-white/10'}`}>
      <Icon name="arrow-left" size={20} />
  </button>
);

export const Toggle: React.FC<{ active: boolean; onToggle: () => void; color?: string }> = ({ active, onToggle, color = 'bg-amber' }) => (
  <div onClick={onToggle} className={`w-12 h-7 rounded-full flex items-center p-1 cursor-pointer transition-colors duration-300 ${active ? color : 'bg-[#E6E2DC] dark:bg-white/20'}`}>
      <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ease-out ${active ? 'translate-x-5' : 'translate-x-0'}`}></div>
  </div>
);

export const Avatar: React.FC<{ src?: string; initial?: string }> = ({ src, initial }) => (
  <div className="w-8 h-8 rounded-full bg-sand border-[3px] border-bg dark:border-obsidian flex items-center justify-center text-[10px] font-bold text-text relative -ml-3 first:ml-0 overflow-hidden">
      {src ? <img src={src} className="w-full h-full object-cover" alt="avatar" /> : initial}
  </div>
);

export const Header: React.FC<{ title: string; onBack: () => void; className?: string; rightAction?: React.ReactNode }> = ({ title, onBack, className = "", rightAction }) => (
  <div className={`pt-12 px-6 pb-4 flex items-center justify-between sticky top-0 z-50 bg-bg/80 dark:bg-obsidian/80 backdrop-blur-md transition-colors duration-500 ${className}`}>
      <div className="w-10 shrink-0">
          <BackButton onClick={onBack} />
      </div>
      <h2 className="font-serif text-2xl text-text dark:text-bg text-center flex-1">{title}</h2>
      <div className="w-10 shrink-0 flex justify-end">
          {rightAction}
      </div>
  </div>
);

export const Button: React.FC<{ children: React.ReactNode; onClick?: () => void; fullWidth?: boolean; className?: string }> = ({ 
  children, 
  onClick, 
  fullWidth = false, 
  className = "" 
}) => (
  <button 
    onClick={onClick} 
    className={`py-4 px-8 rounded-full bg-amber text-white font-serif text-lg tracking-wide shadow-orange-glow hover:brightness-110 transition-all duration-300 font-medium active:scale-[0.98] active:duration-100 shadow-inner-light ${fullWidth ? 'w-full' : ''} ${className}`}
  >
    {children}
  </button>
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className = "", ...props }) => (
  <textarea 
    className={`w-full rounded-[24px] p-5 resize-none outline-none font-serif placeholder:text-muted/30 focus:bg-white dark:bg-charcoal dark:focus:bg-charcoal/80 dark:text-bg dark:placeholder:text-muted/50 transition-all duration-300 border border-transparent focus:border-amber/30 focus:shadow-sm ${className}`} 
    {...props} 
  />
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = "", ...props }) => (
  <input 
    className={`w-full h-14 rounded-full px-5 outline-none font-medium text-text placeholder:text-muted/60 focus:bg-white dark:bg-charcoal dark:text-bg dark:placeholder:text-muted/50 transition-all duration-300 border border-transparent focus:border-amber/30 focus:shadow-sm ${className}`} 
    {...props} 
  />
);

export const BreathingLoader: React.FC<{ className?: string }> = ({ className = "" }) => (
    <div className={`flex items-center gap-1.5 ${className}`}>
        <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0 }}
            className="w-2 h-2 rounded-full bg-amber/50"
        />
        <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="w-2 h-2 rounded-full bg-amber/70"
        />
        <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="w-2 h-2 rounded-full bg-amber/90"
        />
    </div>
);
