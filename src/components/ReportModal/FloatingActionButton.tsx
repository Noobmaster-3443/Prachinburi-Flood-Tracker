'use client';

import React from 'react';
import { PlusCircle, Waves } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 md:hidden">
      <button
        onClick={onClick}
        className="group relative flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm shadow-xl shadow-blue-600/40 border-2 border-white/80 active:scale-95 transition-all"
      >
        <span className="absolute -inset-1 rounded-full bg-blue-500 opacity-30 animate-ping group-hover:opacity-50" />
        <PlusCircle className="w-5 h-5 relative z-10" />
        <span className="relative z-10 whitespace-nowrap">แจ้งสถานการณ์น้ำ</span>
      </button>
    </div>
  );
};
