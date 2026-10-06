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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 flex-shrink-0">
            <Waves className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-base sm:text-lg tracking-tight text-slate-900 leading-tight">
                ศูนย์ข้อมูลน้ำท่าปราจีนบุรี
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                <span>OPEN DATA</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              ThaiWater (สสน.) • กรมชลประทาน (RID) • GISTDA • กรมทางหลวง
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
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => onViewChange('map')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'map'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="มุมมองแผนที่"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">แผนที่</span>
            </button>
            <button
              onClick={() => onViewChange('list')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'list'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
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
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors shadow-2xs"
            title="พื้นที่ของฉัน (เจาะลึก 7 อำเภอ)"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden xs:inline">พื้นที่ของฉัน</span>
          </Link>

          {/* Emergency Hotline Button (1784/1669/1586) */}
          <button
            onClick={onOpenEmergencyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors shadow-xs"
          >
            <PhoneCall className="w-4 h-4 text-red-500 animate-bounce" />
            <span className="hidden sm:inline">สายด่วน ปภ. 1784</span>
            <span className="sm:hidden font-bold">1784/1669</span>
          </button>
        </div>
      </div>
    </header>
  );
};
