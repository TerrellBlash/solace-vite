
import React from 'react';
import { Icon } from './UI';

export const NudgeBanner: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  return (
    <div className="bg-white rounded-[28px] p-5 flex items-center justify-between shadow-soft border border-white relative">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-[#E6E2DC] flex items-center justify-center text-[#9E584D]">
                <Icon name="heart" size={20} strokeWidth={1.5} />
            </div>
            <div>
                <p className="font-serif text-[18px] text-text leading-none mb-1.5">Your candle is waiting 🕯️</p>
                <p className="text-muted text-[12px] font-medium">No pressure. Just here if you need us.</p>
            </div>
        </div>
        <button onClick={onDismiss} className="w-8 h-8 flex items-center justify-center text-muted/40 hover:text-text transition-colors">
            <Icon name="x" size={16} />
        </button>
    </div>
  );
};
