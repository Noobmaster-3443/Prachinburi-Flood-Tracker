'use client';

import React from 'react';
import { Search, X, Check, Filter } from 'lucide-react';
import { FilterState, SeverityLevel } from '@/types';
import { PRACHINBURI_DISTRICTS } from '@/data/prachinburi-locations';

interface FilterBarProps {
  filter: FilterState;
  onFilterChange: (newFilter: FilterState) => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onFilterChange,
  totalResults,
}) => {
  const [isOpenMobile, setIsOpenMobile] = React.useState(false);

  const severityOptions: { value: SeverityLevel | 'all'; label: string; dotColor: string }[] = [
    { value: 'all', label: 'ทั้งหมด', dotColor: 'bg-slate-400' },
    { value: 'red', label: 'วิกฤต', dotColor: 'bg-red-500' },
    { value: 'orange', label: 'รถเล็กผ่านไม่ได้', dotColor: 'bg-orange-500' },
    { value: 'yellow', label: 'รถเล็กผ่านได้', dotColor: 'bg-amber-400' },
    { value: 'green', label: 'ปกติ/แห้งแล้ว', dotColor: 'bg-emerald-500' },
  ];

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filter,
      district: e.target.value,
    });
  };

  const handleSeverityChange = (sev: SeverityLevel | 'all') => {
    onFilterChange({
      ...filter,
      severity: sev,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filter,
      searchQuery: e.target.value,
    });
  };

  const handlePassableToggle = () => {
    onFilterChange({
      ...filter,
      onlyPassable: filter.onlyPassable === true ? null : true,
    });
  };

  const handleImpassableToggle = () => {
    onFilterChange({
      ...filter,
      onlyPassable: filter.onlyPassable === false ? null : false,
    });
  };

  const handleReset = () => {
    onFilterChange({
      district: 'all',
      severity: 'all',
      onlyPassable: null,
      searchQuery: '',
      onlyVerified: false,
    });
  };

  const isFiltered =
    filter.district !== 'all' ||
    filter.severity !== 'all' ||
    filter.onlyPassable !== null ||
    filter.searchQuery.trim() !== '' ||
    filter.onlyVerified;

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/80 p-3 max-w-5xl mx-auto transition-all">
      {/* Top Search & District Row */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาจุดน้ำท่วม, ชื่อตำบล, ถนน, สถานที่..."
            value={filter.searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-900 placeholder-slate-400 border border-transparent focus:border-blue-500 focus:outline-none transition-all"
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
            onChange={handleDistrictChange}
            className="w-full sm:w-auto px-3 py-2 bg-slate-100 hover:bg-slate-200/80 rounded-xl text-sm font-medium text-slate-800 border-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-all"
          >
            <option value="all">📍 ทุกอำเภอในปราจีนบุรี</option>
            {PRACHINBURI_DISTRICTS.map((d) => (
              <option key={d.id} value={d.name_th}>
                {d.name_th}
              </option>
            ))}
          </select>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsOpenMobile(!isOpenMobile)}
            className="sm:hidden px-3 py-2 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1"
          >
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>ตัวกรอง</span>
          </button>
        </div>
      </div>

      {/* Severity & Passability Badges (Desktop or Collapsible Mobile) */}
      <div
        className={`mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 ${
          isOpenMobile ? 'block' : 'hidden sm:flex'
        }`}
      >
        {/* Severity Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-slate-400 mr-1 hidden md:inline">
            ระดับสถานการณ์:
          </span>
          {severityOptions.map((opt) => {
            const isSelected = filter.severity === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSeverityChange(opt.value)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${opt.dotColor}`} />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Toggles: Passable, Impassable, Reset */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleImpassableToggle}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              filter.onlyPassable === false
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            🚫 รถเล็กผ่านไม่ได้
          </button>

          <button
            onClick={handlePassableToggle}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              filter.onlyPassable === true
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            🚗 ผ่านได้ปกติ
          </button>

          {isFiltered && (
            <button
              onClick={handleReset}
              className="text-xs text-rose-500 hover:text-rose-700 font-medium px-2 py-1 flex items-center gap-0.5 ml-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>ล้างตัวกรอง</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
