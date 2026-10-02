'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Waves, 
  PhoneCall, 
  MapPin, 
  PlusCircle, 
  LayoutList, 
  Map as MapIcon, 
  AlertTriangle,
  ShieldCheck,
  Shield
} from 'lucide-react';
import { FloodReport } from '@/types';

interface NavbarProps {
  currentView: 'map' | 'list';
  onViewChange: (view: 'map' | 'list') => void;
  onOpenReportModal: () => void;
  onOpenEmergencyModal: () => void;
  reports: FloodReport[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenReportModal,
  onOpenEmergencyModal,
  reports,
}) => {
  const criticalCount = reports.filter((r) => r.severity === 'red').length;
  const highCount = reports.filter((r) => r.severity === 'orange').length;

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 flex-shrink-0">
            <Waves className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-base sm:text-lg tracking-tight text-slate-900 leading-tight">
                น้ำท่วมปราจีนบุรี
              </h1>
              <span className="bg-blue-100 text-blue-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border border-blue-200/60 hidden xs:inline-block">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Prachinburi Flood Tracker • รายงานสถานการณ์น้ำเรียลไทม์
            </p>
          </div>
        </div>

        {/* Live Status Summary Badges (Desktop/Tablet) */}
        <div className="hidden lg:flex items-center gap-2 text-xs">
          {criticalCount > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="font-medium">วิกฤต {criticalCount} จุด</span>
            </div>
          )}
          {highCount > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span className="font-medium">รถเล็กผ่านไม่ได้ {highCount} จุด</span>
            </div>
          )}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>รายงานทั้งหมด {reports.length} จุด</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* View Toggle (Map / List) */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => onViewChange('map')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'map'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="มุมมองแผนที่"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">แผนที่</span>
            </button>
            <button
              onClick={() => onViewChange('list')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="มุมมองรายการ"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">รายการ</span>
            </button>
          </div>

          {/* My Area Button */}
          <Link
            href="/area"
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors shadow-2xs"
            title="พื้นที่ของฉัน (เจาะลึก 7 อำเภอ)"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden xs:inline">พื้นที่ของฉัน</span>
          </Link>

          {/* Emergency Hotline Button */}
          <button
            onClick={onOpenEmergencyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors shadow-sm"
          >
            <PhoneCall className="w-4 h-4 text-red-500 animate-bounce" />
            <span className="hidden sm:inline">สายด่วนฉุกเฉิน</span>
            <span className="sm:hidden font-bold">1784/1669</span>
          </button>

          {/* Admin Backoffice Button */}
          <Link
            href="/admin"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 flex items-center justify-center transition-colors"
            title="ระบบจัดการหลังบ้าน (Admin)"
          >
            <Shield className="w-4 h-4" />
          </Link>

          {/* Desktop Report Button */}
          <button
            onClick={onOpenReportModal}
            className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>แจ้งสถานการณ์น้ำ</span>
          </button>
        </div>
      </div>
    </header>
  );
};
