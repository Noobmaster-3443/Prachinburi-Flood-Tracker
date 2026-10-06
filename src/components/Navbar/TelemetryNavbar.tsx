'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Waves, 
  PhoneCall, 
  MapPin, 
  LayoutList, 
  Map as MapIcon, 
  AlertTriangle,
  ShieldCheck,
  Radio,
  ExternalLink
} from 'lucide-react';
import { TelemetryStation, HighwayDisasterAlert } from '@/types/telemetry';

interface TelemetryNavbarProps {
  currentView: 'map' | 'list';
  onViewChange: (view: 'map' | 'list') => void;
  onOpenEmergencyModal: () => void;
  stations: TelemetryStation[];
  highwayAlerts: HighwayDisasterAlert[];
  isAutoRefresh: boolean;
}

export const TelemetryNavbar: React.FC<TelemetryNavbarProps> = ({
  currentView,
  onViewChange,
  onOpenEmergencyModal,
  stations,
  highwayAlerts,
  isAutoRefresh,
}) => {
  const criticalCount = stations.filter((s) => s.severity === 'red').length;
  const warningCount = stations.filter((s) => s.severity === 'orange').length;
  const impassableRoads = highwayAlerts.filter((h) => !h.passable).length;

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-slate-200 shadow-xs transition-all font-sans">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-xs shadow-blue-500/20 flex-shrink-0">
            <Waves className="w-4 h-4 sm:w-6 sm:h-6 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-sm sm:text-base tracking-tight text-slate-900 leading-tight whitespace-nowrap truncate">
                ข้อมูลน้ำปราจีนบุรี
              </h1>
              <span className="hidden sm:inline-flex bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                <span>OPEN DATA</span>
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 hidden sm:block truncate">
              ThaiWater (สสน.) • กรมชลประทาน • GISTDA • กรมทางหลวง
            </p>
          </div>
        </div>

        {/* Live Status Summary Badges (Desktop/Tablet) */}
        <div className="hidden lg:flex items-center gap-2 text-xs">
          {criticalCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 animate-pulse font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>ล้นตลิ่ง {criticalCount} สถานี</span>
            </div>
          )}
          {warningCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-800 border border-orange-200 font-semibold">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span>จ่อล้น {warningCount} จุด</span>
            </div>
          )}
          {impassableRoads > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-semibold">
              <span>🚧 ทางขาด/ท่วมทาง {impassableRoads} จุด</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* View Toggle (Map / List) */}
          <div className="bg-slate-100/90 p-1 rounded-xl flex items-center border border-slate-300/80 shadow-xs">
            <button
              onClick={() => onViewChange('map')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                currentView === 'map'
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-700/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
              title="มุมมองแผนที่"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">แผนที่</span>
            </button>
            <button
              onClick={() => onViewChange('list')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                currentView === 'list'
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-700/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
              title="มุมมองรายการสถานี"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">รายการ</span>
            </button>
          </div>

          {/* Area Overview Page */}
          <Link
            href="/area"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-blue-50 text-blue-700 border-2 border-blue-400/80 hover:border-blue-500 shadow-xs hover:shadow-sm transition-all active:scale-95"
            title="พื้นที่ของฉัน (เจาะลึก 7 อำเภอ)"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden xs:inline">7 อำเภอ</span>
          </Link>

          {/* Emergency Hotline Button (1784/1669/1586) */}
          <button
            onClick={onOpenEmergencyModal}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white shadow-md hover:shadow-lg transition-all active:scale-95 border border-red-500 cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white animate-pulse" />
            <span className="hidden sm:inline">สายด่วน ปภ. 1784</span>
            <span className="sm:hidden font-black">1784 / 1669</span>
          </button>
        </div>
      </div>
    </header>
  );
};
