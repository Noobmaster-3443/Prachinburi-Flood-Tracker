'use client';

import React from 'react';
import { PlusCircle, Waves } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-30">
      <button
        onClick={onClick}
        type="button"
        className="group relative flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-blue-600/40 border-2 border-white/80 active:scale-95 transition-all cursor-pointer"
      >
        <span className="absolute -inset-1 rounded-full bg-blue-500 opacity-30 animate-ping group-hover:opacity-50" />
        <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
        <span className="relative z-10 whitespace-nowrap">แจ้งสถานการณ์น้ำ</span>
      </button>
    </div>
  );
};
