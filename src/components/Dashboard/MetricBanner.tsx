'use client';

import React from 'react';
import { 
  AlertTriangle, 
  Car, 
  CloudRain, 
  Waves, 
  TrendingUp, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { TelemetryStation, HighwayDisasterAlert } from '@/types/telemetry';

interface MetricBannerProps {
  stations: TelemetryStation[];
  highwayAlerts: HighwayDisasterAlert[];
  onFilterSeverity?: (severity: string) => void;
  onFilterRoad?: () => void;
}

export const MetricBanner: React.FC<MetricBannerProps> = ({
  stations,
  highwayAlerts,
  onFilterSeverity,
  onFilterRoad,
}) => {
  const overflowStations = stations.filter((s) => s.severity === 'red');
  const warningStations = stations.filter((s) => s.severity === 'orange');
  const impassableRoads = highwayAlerts.filter((h) => !h.passable);
  
  // Find station with highest 24h rainfall
  const highestRainStation = [...stations].sort(
    (a, b) => (b.rain_24h_mm || 0) - (a.rain_24h_mm || 0)
  )[0];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-sans">
      {/* 1. จุดล้นตลิ่ง (Critical) */}
      <div 
        onClick={() => onFilterSeverity && onFilterSeverity('red')}
        className={`p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer backdrop-blur-md ${
          overflowStations.length > 0 
            ? 'bg-red-500/10 hover:bg-red-500/15 border-red-200/80 shadow-xs' 
            : 'bg-white/90 border-slate-200/80'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold flex items-center gap-1.5 text-red-700">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            น้ำล้นตลิ่งวิกฤต
          </span>
          <Waves className="w-4 h-4 text-red-500" />
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-xl sm:text-2xl font-black text-slate-900">
            {overflowStations.length}
            <span className="text-xs font-semibold text-slate-500 ml-1">สถานี</span>
          </span>
          {overflowStations[0] && (
            <span className="text-[10px] font-bold text-red-700 truncate max-w-[90px] sm:max-w-[110px] bg-red-100/80 px-1.5 py-0.5 rounded">
              {overflowStations[0].station_code}
            </span>
          )}
        </div>
      </div>

      {/* 2. จุดจ่อล้น / เตือนภัย */}
      <div 
        onClick={() => onFilterSeverity && onFilterSeverity('orange')}
        className="p-2.5 sm:p-3 rounded-2xl bg-white/90 hover:bg-orange-50/50 border border-slate-200/80 transition-all cursor-pointer shadow-xs backdrop-blur-md"
      >
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-orange-700 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            จ่อล้น / เตือนภัย
          </span>
          <AlertTriangle className="w-4 h-4 text-orange-500" />
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-xl sm:text-2xl font-black text-slate-900">
            {warningStations.length}
            <span className="text-xs font-semibold text-slate-500 ml-1">จุด</span>
          </span>
          <span className="text-[10px] text-slate-500">
            อ.บ้านสร้าง/นาดี
          </span>
        </div>
      </div>

      {/* 3. ถนนถูกตัดขาด / รถเล็กผ่านไม่ได้ */}
      <div 
        onClick={() => onFilterRoad && onFilterRoad()}
        className={`p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer backdrop-blur-md ${
          impassableRoads.length > 0 
            ? 'bg-amber-500/10 hover:bg-amber-500/15 border-amber-300 shadow-xs' 
            : 'bg-white/90 border-slate-200/80'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-amber-900 flex items-center gap-1">
            <Car className="w-3.5 h-3.5 text-amber-600" />
            ทางหลวงน้ำท่วมทาง
          </span>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
            DOH
          </span>
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-xl sm:text-2xl font-black text-slate-900">
            {impassableRoads.length}
            <span className="text-xs font-semibold text-slate-500 ml-1">จุดทางขาด</span>
          </span>
          <span className="text-[10px] font-bold text-red-600 truncate max-w-[80px]">
            ทล.304
          </span>
        </div>
      </div>

      {/* 4. ปริมาณฝนสูงสุด 24 ชม. */}
      <div className="p-2.5 sm:p-3 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs backdrop-blur-md">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-blue-700 flex items-center gap-1">
            <CloudRain className="w-3.5 h-3.5 text-blue-600" />
            ฝนสูงสุด 24 ชม.
          </span>
          <span className="text-[10px] text-slate-400">สะสม</span>
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-xl sm:text-2xl font-black text-blue-900">
            {highestRainStation?.rain_24h_mm ?? 0}
            <span className="text-xs font-semibold text-slate-500 ml-1">มม.</span>
          </span>
          <span className="text-[10px] text-slate-500 truncate max-w-[90px]">
            {highestRainStation?.district?.replace('อำเภอ', 'อ.') || 'ทับลาน'}
          </span>
        </div>
      </div>
    </div>
  );
};
