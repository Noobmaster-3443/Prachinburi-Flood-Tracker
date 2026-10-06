'use client';

import React from 'react';
import {
  X,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Car,
  Waves,
  CloudRain,
  ExternalLink,
  PhoneCall,
  Activity,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { TelemetryStation, HighwayDisasterAlert, SeverityLevel } from '@/types/telemetry';

interface TelemetryDetailDrawerProps {
  station: TelemetryStation | null;
  highwayAlert: HighwayDisasterAlert | null;
  onClose: () => void;
  onOpenEmergency: () => void;
}

const severityConfig: Record<
  SeverityLevel,
  { label: string; bg: string; text: string; border: string; icon: string }
> = {
  red: {
    label: 'วิกฤต / น้ำล้นตลิ่ง',
    bg: 'bg-red-500',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: '🚨',
  },
  orange: {
    label: 'เตือนภัย / จ่อล้นตลิ่ง',
    bg: 'bg-orange-500',
    text: 'text-orange-700',
    border: 'border-orange-200',
    icon: '🌊',
  },
  yellow: {
    label: 'เฝ้าระวังระดับน้ำ',
    bg: 'bg-amber-400',
    text: 'text-amber-800',
    border: 'border-amber-200',
    icon: '⚠️',
  },
  green: {
    label: 'ระดับน้ำปกติ',
    bg: 'bg-emerald-500',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: '✅',
  },
};

export const TelemetryDetailDrawer: React.FC<TelemetryDetailDrawerProps> = ({
  station,
  highwayAlert,
  onClose,
  onOpenEmergency,
}) => {
  if (!station && !highwayAlert) return null;

  // Render Telemetry Station details
  if (station) {
    const cfg = severityConfig[station.severity] || severityConfig.yellow;
    const isWater = station.station_type === 'water_level';

    return (
      <div className="fixed inset-y-0 right-0 z-[1000] w-full sm:w-[460px] bg-white shadow-2xl flex flex-col font-sans animate-in slide-in-from-right duration-300 border-l border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                รหัสสถานี: {station.station_code}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold text-white ${cfg.bg}`}>
                {station.severity_label}
              </span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug">
              {station.name_th}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>ต.{station.subdistrict} อ.{station.district} • {station.basin_name}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white hover:bg-slate-200 text-slate-400 hover:text-slate-700 shadow-2xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Official Open Data Badge */}
          <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                สสน.
              </div>
              <div>
                <div className="text-xs font-bold text-blue-950 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>ข้อมูลเปิดทางการ (Official Telemetry)</span>
                </div>
                <div className="text-[11px] text-blue-700">{station.source_name_th}</div>
              </div>
            </div>
            {station.source_url && (
              <a
                href={station.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 p-1 rounded-lg hover:bg-blue-100 transition-colors"
                title="เปิดเว็บแหล่งข้อมูลหลัก"
              >
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Key Hydrological Metrics */}
          {isWater ? (
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">ระดับน้ำปัจจุบัน</span>
                <span className="text-2xl font-black text-slate-900 mt-0.5 block">
                  {station.water_level_m_msl ?? '-'} <span className="text-xs font-normal text-slate-600">ม.รทก.</span>
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  ระดับตลิ่ง: <b>{station.bank_level_m_msl ?? '-'} ม.</b>
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">ความจุลำน้ำ</span>
                <span className={`text-2xl font-black mt-0.5 block ${
                  (station.capacity_percentage || 0) >= 100 ? 'text-red-600' : 'text-blue-700'
                }`}>
                  {station.capacity_percentage ?? '-'}%
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {station.diff_from_bank && station.diff_from_bank > 0 ? (
                    <b className="text-red-600">สูงกว่าตลิ่ง {station.diff_from_bank.toFixed(2)} ม.</b>
                  ) : (
                    <b className="text-emerald-700">ต่ำกว่าตลิ่ง {Math.abs(station.diff_from_bank || 0).toFixed(2)} ม.</b>
                  )}
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">ปริมาณฝน 24 ชม. สะสม</span>
                <span className="text-2xl font-black text-blue-700 mt-0.5 block">
                  {station.rain_24h_mm ?? 0} <span className="text-xs font-normal text-slate-600">มม.</span>
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {station.rain_24h_mm && station.rain_24h_mm >= 90 ? '⚠️ เกณฑ์ฝนหนักมาก' : 'เกณฑ์ฝนปานกลาง'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">ฝนวันนี้ (ตั้งแต่เที่ยงคืน)</span>
                <span className="text-2xl font-black text-slate-900 mt-0.5 block">
                  {station.rain_today_mm ?? 0} <span className="text-xs font-normal text-slate-600">มม.</span>
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">สถานีต้นน้ำเขาใหญ่-ทับลาน</span>
              </div>
            </div>
          )}

          {/* Description & Situation Assessment */}
          <div className="space-y-1.5 bg-slate-50/60 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              <span>การวิเคราะห์สถานการณ์น้ำหน้าสถานี</span>
            </span>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {station.status_text}
            </p>
            <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>ข้อมูลตรวจวัดล่าสุดเมื่อ: {new Date(station.observed_at).toLocaleTimeString('th-TH')} น.</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-2">
          <button
            onClick={onOpenEmergency}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs sm:text-sm border border-red-200 transition-colors"
          >
            <PhoneCall className="w-4 h-4 text-red-500" />
            <span>สายด่วน 1784/1669</span>
          </button>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors text-center"
          >
            <Compass className="w-4 h-4" />
            <span>นำทางไปพิกัด</span>
          </a>
        </div>
      </div>
    );
  }

  // Render Highway Flood Alert details
  if (highwayAlert) {
    const isImpassable = !highwayAlert.passable;

    return (
      <div className="fixed inset-y-0 right-0 z-[1000] w-full sm:w-[460px] bg-white shadow-2xl flex flex-col font-sans animate-in slide-in-from-right duration-300 border-l border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                {highwayAlert.route_number}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold text-white ${
                isImpassable ? 'bg-red-600' : 'bg-amber-500'
              }`}>
                {isImpassable ? '⛔ รถเล็กผ่านไม่ได้' : '⚠️ ระวังน้ำท่วมผิวทาง'}
              </span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug">
              {highwayAlert.road_name}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>อ.{highwayAlert.district} • {highwayAlert.km_range}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white hover:bg-slate-200 text-slate-400 hover:text-slate-700 shadow-2xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Official Open Data Badge */}
          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                ทล.
              </div>
              <div>
                <div className="text-xs font-bold text-amber-950 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>รายงานเตือนภัยกรมทางหลวง (HDMS Open Data)</span>
                </div>
                <div className="text-[11px] text-amber-800">{highwayAlert.source_name_th}</div>
              </div>
            </div>
            <a
              href="https://hdms.doh.go.th/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 hover:text-amber-900 p-1 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Road Water Level Metric */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span className="text-xs text-slate-500 block">ระดับน้ำท่วมผิวจราจร</span>
            <span className={`text-3xl font-black mt-1 block ${
              isImpassable ? 'text-red-600' : 'text-amber-600'
            }`}>
              {highwayAlert.water_height_cm} <span className="text-sm font-normal text-slate-600">ซม.</span>
            </span>
            <span className={`text-xs font-bold mt-1 inline-block px-2.5 py-0.5 rounded-full ${
              isImpassable ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {isImpassable ? 'ช่องทางจราจรถูกตัดขาด / รถเตี้ยห้ามผ่าน' : 'รถทุกประเภทสัญจรได้ด้วยความระมัดระวัง'}
            </span>
          </div>

          {/* Detour Information */}
          <div className="space-y-1.5 bg-slate-50/60 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-amber-600" />
              <span>คำแนะนำเส้นทางเลี่ยง & ข้อมูลหน้างาน</span>
            </span>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {highwayAlert.detour_info || 'ชะลอความเร็วและปฏิบัติตามป้ายเตือนของเจ้าหน้าที่แขวงทางหลวง'}
            </p>
            <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>อัปเดตแจ้งเตือนเมื่อ: {new Date(highwayAlert.updated_at).toLocaleTimeString('th-TH')} น.</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-2">
          <a
            href="tel:1586"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs sm:text-sm border border-amber-200 transition-colors"
          >
            <PhoneCall className="w-4 h-4 text-amber-600" />
            <span>สายด่วนทางหลวง 1586</span>
          </a>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${highwayAlert.latitude},${highwayAlert.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors text-center"
          >
            <Compass className="w-4 h-4" />
            <span>นำทางตรวจสอบ</span>
          </a>
        </div>
      </div>
    );
  }

  return null;
};
