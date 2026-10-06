'use client';

import React, { useState } from 'react';
import { Search, X, Check, Filter, RefreshCw, Radio, SlidersHorizontal, ChevronDown } from 'lucide-react';
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
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const severityOptions: { value: SeverityLevel | 'all'; label: string; dotColor: string }[] = [
    { value: 'all', label: 'ทั้งหมด', dotColor: 'bg-slate-400' },
    { value: 'red', label: 'วิกฤต/ล้นตลิ่ง', dotColor: 'bg-red-500' },
    { value: 'orange', label: 'เตือนภัย/จ่อล้น', dotColor: 'bg-orange-500' },
    { value: 'yellow', label: 'เฝ้าระวัง', dotColor: 'bg-amber-400' },
    { value: 'green', label: 'ปกติ', dotColor: 'bg-emerald-500' },
  ];

  const isFiltered = filter.district !== 'all' || filter.severity !== 'all' || filter.searchQuery.trim() !== '';

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-1.5 sm:p-3 max-w-5xl mx-auto transition-all font-sans">
      {/* Main Search & Compact Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาสถานี, คลอง, รหัส Kgt.3..."
            value={filter.searchQuery}
            onChange={(e) => onFilterChange({ ...filter, searchQuery: e.target.value })}
            className="w-full pl-8 sm:pl-9 pr-7 sm:pr-8 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs sm:text-sm text-slate-900 placeholder-slate-400 border border-transparent focus:border-blue-500 focus:outline-none transition-all font-medium"
          />
          {filter.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filter, searchQuery: '' })}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* District Selector (Always visible or compact) */}
        <div className="hidden sm:block">
          <select
            value={filter.district}
            onChange={(e) => onFilterChange({ ...filter, district: e.target.value })}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">📍 ทุกอำเภอ (7 อำเภอ)</option>
            {PRACHINBURI_DISTRICTS.map((d) => (
              <option key={d.id} value={d.name_th}>
                {d.name_th}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile Filter Toggle Button */}
        <button
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          className={`sm:hidden p-2 rounded-xl border flex items-center gap-1 text-xs font-semibold transition-all ${
            isMobileExpanded || isFiltered
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}
          title="ตัวกรองเพิ่มเติม"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {isFiltered && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
        </button>

        {/* Auto Refresh Toggle */}
        <button
          onClick={onToggleAutoRefresh}
          className={`hidden xs:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
            isAutoRefresh
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
          title="เปิด/ปิด การดึงข้อมูลอัตโนมัติทุก 60 วินาที"
        >
          <Radio className={`w-3.5 h-3.5 ${isAutoRefresh ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
          <span className="hidden md:inline">{isAutoRefresh ? 'Auto-Sync' : 'Manual'}</span>
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

      {/* Expanded Filter Row (Always on Desktop, Collapsible on Mobile) */}
      <div className={`mt-2.5 pt-2 border-t border-slate-100 space-y-2 ${
        isMobileExpanded ? 'block animate-in fade-in duration-200' : 'hidden sm:block'
      }`}>
        {/* Mobile District Selector (when expanded) */}
        <div className="sm:hidden">
          <select
            value={filter.district}
            onChange={(e) => onFilterChange({ ...filter, district: e.target.value })}
            className="w-full px-3 py-2 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200 outline-none"
          >
            <option value="all">📍 ทุกอำเภอ (7 อำเภอ)</option>
            {PRACHINBURI_DISTRICTS.map((d) => (
              <option key={d.id} value={d.name_th}>
                {d.name_th}
              </option>
            ))}
          </select>
        </div>

        {/* Severity Filter Badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
            <span className="text-[11px] font-bold text-slate-400 mr-0.5">เกณฑ์ระดับน้ำ:</span>
            {severityOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onFilterChange({ ...filter, severity: opt.value })}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
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

          <div className="text-[11px] text-slate-400 w-full sm:w-auto text-right">
            ข้อมูลสด สสน. • อัปเดต {new Date(lastUpdated).toLocaleTimeString('th-TH')} น.
          </div>
        </div>
      </div>
    </div>
  );
};
