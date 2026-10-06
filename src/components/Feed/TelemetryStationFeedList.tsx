'use client';

import React from 'react';
import {
  MapPin,
  Clock,
  Car,
  ChevronRight,
  Inbox,
  AlertTriangle,
  Waves,
  CloudRain,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { TelemetryStation, HighwayDisasterAlert, SeverityLevel } from '@/types/telemetry';

interface TelemetryStationFeedListProps {
  stations: TelemetryStation[];
  highwayAlerts: HighwayDisasterAlert[];
  onSelectStation: (station: TelemetryStation) => void;
  onSelectHighwayAlert: (alert: HighwayDisasterAlert) => void;
}

const severityConfig: Record<
  SeverityLevel,
  { label: string; badgeBg: string; text: string; dot: string }
> = {
  red: {
    label: 'วิกฤต/ล้นตลิ่ง',
    badgeBg: 'bg-red-50 text-red-700 border-red-200',
    text: 'text-red-700',
    dot: 'bg-red-500',
  },
  orange: {
    label: 'เตือนภัย/จ่อล้น',
    badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
    text: 'text-orange-700',
    dot: 'bg-orange-500',
  },
  yellow: {
    label: 'เฝ้าระวัง',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    text: 'text-amber-800',
    dot: 'bg-amber-400',
  },
  green: {
    label: 'ระดับน้ำปกติ',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
};

export const TelemetryStationFeedList: React.FC<TelemetryStationFeedListProps> = ({
  stations,
  highwayAlerts,
  onSelectStation,
  onSelectHighwayAlert,
}) => {
  const formatTimeThai = (isoDate: string) => {
    try {
      const date = new Date(isoDate);
      return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-4 font-sans pt-1">
      {/* Highway Flood Alerts Section */}
      {highwayAlerts.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-amber-600" />
              <span>แจ้งเตือนเส้นทางน้ำท่วมขัง (กรมทางหลวง DOH)</span>
            </span>
            <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              พบ {highwayAlerts.length} จุดเฝ้าระวัง
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {highwayAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => onSelectHighwayAlert(alert)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                  !alert.passable
                    ? 'bg-red-50/70 border-red-200 hover:border-red-400'
                    : 'bg-amber-50/60 border-amber-200 hover:border-amber-400'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-black px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800">
                        {alert.route_number}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        !alert.passable ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {!alert.passable ? '⛔ รถเล็กผ่านไม่ได้' : '⚠️ ระวังน้ำท่วมทาง'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {alert.road_name}
                    </h4>
                    <p className="text-xs text-slate-600">
                      อ.{alert.district} • {alert.km_range} (ระดับน้ำ {alert.water_height_cm} ซม.)
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 self-center" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Telemetry Stations Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Waves className="w-4 h-4 text-blue-600" />
            <span>สถานีวัดระดับน้ำ & โทรมาตรลุ่มน้ำปราจีนบุรี (สสน./กรมชลฯ)</span>
          </span>
          <span className="text-xs text-slate-500">พบ {stations.length} สถานี</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {stations.map((sta) => {
            const cfg = severityConfig[sta.severity] || severityConfig.yellow;
            const isWater = sta.station_type === 'water_level';

            return (
              <div
                key={sta.id}
                onClick={() => onSelectStation(sta)}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                        {sta.station_code}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badgeBg}`}>
                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                        <span>{sta.severity_label}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>{sta.source_agency}</span>
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-900">
                      {sta.name_th}
                    </h4>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                      <span>ต.{sta.subdistrict} อ.{sta.district}</span>
                      {isWater && sta.water_level_m_msl && (
                        <span>
                          ระดับน้ำ: <b>{sta.water_level_m_msl} ม.รทก.</b> (ตลิ่ง {sta.bank_level_m_msl} ม.)
                        </span>
                      )}
                      {sta.rain_24h_mm !== undefined && (
                        <span>
                          ฝนสะสม 24 ชม.: <b>{sta.rain_24h_mm} มม.</b>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                      {sta.status_text}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between self-stretch flex-shrink-0">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeThai(sta.observed_at)}</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 mt-2" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
