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
    <div className="font-sans">
      {/* Mobile Compact Horizontal Status Pills (Takes only ~32px of height!) */}
      <div className="flex md:hidden items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
        {/* 1. น้ำล้นตลิ่ง */}
        <button
          onClick={() => onFilterSeverity && onFilterSeverity('red')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs whitespace-nowrap shadow-xs bg-white transition-all cursor-pointer ${
            overflowStations.length > 0 ? 'border-red-400 text-red-700 bg-red-50/50' : 'border-slate-200 text-slate-700'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${overflowStations.length > 0 ? 'bg-red-600 animate-ping' : 'bg-slate-400'}`}></span>
          <span className="font-bold">ล้นตลิ่ง {overflowStations.length}</span>
          {overflowStations[0] && (
            <span className="text-[10px] bg-red-100 text-red-800 px-1 rounded font-bold">{overflowStations[0].station_code}</span>
          )}
        </button>

        {/* 2. จ่อล้น */}
        <button
          onClick={() => onFilterSeverity && onFilterSeverity('orange')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-200 text-slate-700 text-xs whitespace-nowrap shadow-xs bg-white transition-all cursor-pointer hover:border-orange-300"
        >
          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          <span className="font-medium text-orange-900">จ่อล้น {warningStations.length}</span>
        </button>

        {/* 3. ทางขาด */}
        <button
          onClick={() => onFilterRoad && onFilterRoad()}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs whitespace-nowrap shadow-xs bg-white transition-all cursor-pointer ${
            impassableRoads.length > 0 ? 'border-amber-400 text-amber-900 bg-amber-50/50' : 'border-slate-200 text-slate-700'
          }`}
        >
          <Car className="w-3 h-3 text-amber-600" />
          <span className="font-bold">ทางขาด {impassableRoads.length}</span>
          <span className="text-[10px] text-red-600 font-bold">ทล. 304</span>
        </button>

        {/* 4. ฝนสูงสุด */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-200 bg-white text-slate-700 text-xs whitespace-nowrap shadow-xs">
          <CloudRain className="w-3 h-3 text-blue-600" />
          <span>ฝน {highestRainStation?.rain_24h_mm ?? 0} มม.</span>
        </div>
      </div>

      {/* Desktop Key Metrics Grid */}
      <div className="hidden md:grid md:grid-cols-4 gap-2">
      <div 
        onClick={() => onFilterSeverity && onFilterSeverity('red')}
        className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer shadow-sm hover:shadow-md bg-white ${
          overflowStations.length > 0 
            ? 'border-red-300 hover:border-red-400' 
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold flex items-center gap-1.5 text-red-700">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            น้ำล้นตลิ่งวิกฤต
          </span>
          <Waves className="w-4 h-4 text-red-600" />
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-xl sm:text-2xl font-black text-slate-900">
            {overflowStations.length}
            <span className="text-xs font-semibold text-slate-500 ml-1">สถานี</span>
          </span>
          {overflowStations[0] && (
            <span className="text-[10px] font-bold text-red-700 truncate max-w-[90px] sm:max-w-[110px] bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
              {overflowStations[0].station_code}
            </span>
          )}
        </div>
      </div>

      {/* 2. จุดจ่อล้น / เตือนภัย */}
      <div 
        onClick={() => onFilterSeverity && onFilterSeverity('orange')}
        className="p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200 hover:border-orange-300 transition-all cursor-pointer shadow-sm hover:shadow-md"
      >
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-orange-700 flex items-center gap-1.5">
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
        className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer shadow-sm hover:shadow-md bg-white ${
          impassableRoads.length > 0 
            ? 'border-amber-400 hover:border-amber-500' 
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-amber-900 flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-amber-600" />
            ทางหลวงน้ำท่วมทาง
          </span>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
            DOH
          </span>
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-xl sm:text-2xl font-black text-slate-900">
            {impassableRoads.length}
            <span className="text-xs font-semibold text-slate-500 ml-1">จุดทางขาด</span>
          </span>
          <span className="text-[10px] font-bold text-red-600 truncate max-w-[80px]">
            ทล. 304
          </span>
        </div>
      </div>

      {/* 4. ปริมาณฝนสูงสุด 24 ชม. */}
      <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-sm hover:shadow-md">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-blue-700 flex items-center gap-1.5">
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
  </div>
);
};
