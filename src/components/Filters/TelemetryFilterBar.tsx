'use client';

import React from 'react';
import { Search, X, Check, Filter, RefreshCw, Radio } from 'lucide-react';
import { DashboardFilterState, SeverityLevel } from '@/types/telemetry';
import { PRACHINBURI_DISTRICTS } from '@/data/prachinburi-locations';

interface TelemetryFilterBarProps {
  filter: DashboardFilterState;
  onFilterChange: (newFilter: DashboardFilterState) => void;
  totalStations: number;
  isAutoRefresh: boolean;
  onToggleAutoRefresh: () => void;
  onManualRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: string;
}

export const TelemetryFilterBar: React.FC<TelemetryFilterBarProps> = ({
  filter,
  onFilterChange,
  totalStations,
  isAutoRefresh,
  onToggleAutoRefresh,
  onManualRefresh,
  isRefreshing,
  lastUpdated,
}) => {
  const [isOpenMobile, setIsOpenMobile] = React.useState(false);

  const severityOptions: { value: SeverityLevel | 'all'; label: string; dotColor: string }[] = [
    { value: 'all', label: 'ทั้งหมด', dotColor: 'bg-slate-400' },
    { value: 'red', label: 'วิกฤต/ล้นตลิ่ง', dotColor: 'bg-red-500' },
    { value: 'orange', label: 'เตือนภัย/จ่อล้น', dotColor: 'bg-orange-500' },
    { value: 'yellow', label: 'เฝ้าระวัง', dotColor: 'bg-amber-400' },
    { value: 'green', label: 'ปกติ', dotColor: 'bg-emerald-500' },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/80 p-3 max-w-5xl mx-auto transition-all font-sans">
      {/* Top Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาสถานีวัดน้ำ, แหล่งน้ำ, อำเภอ, รหัสสถานี (เช่น Kgt.3)..."
            value={filter.searchQuery}
            onChange={(e) => onFilterChange({ ...filter, searchQuery: e.target.value })}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs sm:text-sm text-slate-900 placeholder-slate-400 border border-transparent focus:border-blue-500 focus:outline-none transition-all"
          />
          {filter.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filter, searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* District Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={filter.district}
            onChange={(e) => onFilterChange({ ...filter, district: e.target.value })}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">📍 ทุกอำเภอ (7 อำเภอ)</option>
            {PRACHINBURI_DISTRICTS.map((d) => (
              <option key={d.id} value={d.name_th}>
                {d.name_th}
              </option>
            ))}
          </select>

          {/* Auto Refresh Toggle */}
          <button
            onClick={onToggleAutoRefresh}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isAutoRefresh
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title="เปิด/ปิด การดึงข้อมูลอัตโนมัติทุก 60 วินาที"
          >
            <Radio className={`w-3.5 h-3.5 ${isAutoRefresh ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
            <span className="hidden xs:inline">{isAutoRefresh ? 'Auto-Sync' : 'Manual'}</span>
          </button>

          {/* Manual Refresh Button */}
          <button
            onClick={onManualRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors disabled:opacity-50"
            title="รีเฟรชข้อมูล Open Data ทันที"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Severity Filter Badges */}
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-slate-500 mr-1 hidden sm:inline">เกณฑ์ระดับน้ำ:</span>
          {severityOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onFilterChange({ ...filter, severity: opt.value })}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                filter.severity === opt.value
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${opt.dotColor}`} />
              <span>{opt.label}</span>
            </button>
          ))}
        </div>

        <div className="text-[11px] text-slate-500">
          อัปเดตล่าสุด: {new Date(lastUpdated).toLocaleTimeString('th-TH')} น.
        </div>
      </div>
    </div>
  );
};
