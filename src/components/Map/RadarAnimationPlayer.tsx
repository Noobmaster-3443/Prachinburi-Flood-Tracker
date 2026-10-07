'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Radio, CloudRain, Clock } from 'lucide-react';
import { RadarFrameInfo } from '@/types/weather';

interface RadarAnimationPlayerProps {
  frames: RadarFrameInfo[];
  currentIndex: number;
  onSelectFrame: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose?: () => void;
}

export const RadarAnimationPlayer: React.FC<RadarAnimationPlayerProps> = ({
  frames,
  currentIndex,
  onSelectFrame,
  isPlaying,
  onTogglePlay,
}) => {
  if (frames.length === 0) return null;

  const currentFrame = frames[currentIndex] || frames[frames.length - 1];

  const handlePrev = () => {
    const prev = currentIndex > 0 ? currentIndex - 1 : frames.length - 1;
    onSelectFrame(prev);
  };

  const handleNext = () => {
    const next = currentIndex < frames.length - 1 ? currentIndex + 1 : 0;
    onSelectFrame(next);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 p-2 sm:px-3 sm:py-2 max-w-sm sm:max-w-md w-full font-sans select-none animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? 'bg-indigo-400' : 'bg-emerald-400'} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isPlaying ? 'bg-indigo-600' : 'bg-emerald-500'}`} />
          </span>
          <span className="text-[11px] sm:text-xs font-bold text-slate-800 truncate flex items-center gap-1">
            <CloudRain className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
            <span>เรดาร์กลุ่มฝนสด TMD</span>
          </span>
        </div>

        {/* Time Badge */}
        <div className="flex items-center gap-1 bg-indigo-50 border border-indigo-200/70 px-2 py-0.5 rounded-lg text-indigo-900 font-bold text-[11px] sm:text-xs">
          <Clock className="w-3 h-3 text-indigo-600" />
          <span>{currentFrame?.formattedTime}</span>
          {currentFrame?.isLatest && (
            <span className="bg-indigo-600 text-white text-[9px] px-1 rounded-sm ml-0.5">สด</span>
          )}
        </div>
      </div>

      {/* Scrubber Slider */}
      <div className="px-1 py-1">
        <input
          type="range"
          min={0}
          max={frames.length - 1}
          value={currentIndex}
          onChange={(e) => onSelectFrame(parseInt(e.target.value, 10))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 transition-all"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5 mt-0.5">
          <span>{frames[0]?.formattedTime} (-2 ชม.)</span>
          <span>{frames[frames.length - 1]?.formattedTime} (ล่าสุด)</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-2 pt-1 border-t border-slate-100">
        <button
          onClick={handlePrev}
          className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
          title="เฟรมก่อนหน้า"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onTogglePlay}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>หยุด</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>เล่นภาพ ({frames.length} เฟรม)</span>
            </>
          )}
        </button>

        <button
          onClick={handleNext}
          className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
          title="เฟรมถัดไป"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
