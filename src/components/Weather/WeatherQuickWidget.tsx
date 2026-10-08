'use client';

import React, { useState, useEffect } from 'react';
import { CloudRain, Sparkles, ChevronRight } from 'lucide-react';
import { CurrentWeather } from '@/types/weather';
import { fetchDistrictWeather } from '@/lib/weather-service';

interface WeatherQuickWidgetProps {
  onOpenModal: () => void;
  selectedProvince?: string;
  className?: string;
}

export const WeatherQuickWidget: React.FC<WeatherQuickWidgetProps> = ({
  onOpenModal,
  selectedProvince = 'prachinburi',
  className = '',
}) => {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchDistrictWeather(undefined, selectedProvince)
      .then((data) => {
        if (isMounted && data) setCurrent(data.current);
      })
      .catch((err) => console.warn('Widget weather fetch error:', err));

    return () => {
      isMounted = false;
    };
  }, [selectedProvince]);

  if (!current) {
    return (
      <button
        onClick={onOpenModal}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition-all cursor-pointer select-none ${className}`}
        title="สภาพอากาศปราจีนบุรี"
      >
        <CloudRain className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
        <span className="hidden xs:inline">สภาพอากาศ</span>
      </button>
    );
  }

  return (
    <button
      onClick={onOpenModal}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-slate-800 text-xs font-bold border border-sky-200/80 shadow-xs hover:shadow-sm transition-all active:scale-95 cursor-pointer select-none group ${className}`}
      title={`สภาพอากาศปราจีนบุรี: ${current.weatherDescription} (${current.temperature}°C)`}
    >
      <span className="text-base leading-none select-none">{current.weatherIcon}</span>
      <span className="font-extrabold text-blue-900">{current.temperature}°C</span>
      <span className="text-[11px] text-slate-500 hidden sm:inline truncate max-w-[100px]">
        {current.weatherDescription}
      </span>
      <span className="text-blue-500 font-bold group-hover:translate-x-0.5 transition-transform text-[11px]">
        ›
      </span>
    </button>
  );
};
