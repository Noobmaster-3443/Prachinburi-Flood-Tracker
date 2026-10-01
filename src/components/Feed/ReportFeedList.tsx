'use client';

import React from 'react';
import {
  MapPin,
  Clock,
  Car,
  ShieldAlert,
  ThumbsUp,
  ShieldCheck,
  ChevronRight,
  Inbox,
  AlertTriangle,
} from 'lucide-react';
import { FloodReport, SeverityLevel } from '@/types';

interface ReportFeedListProps {
  reports: FloodReport[];
  onSelectReport: (report: FloodReport) => void;
}

const severityConfig: Record<
  SeverityLevel,
  { label: string; badgeBg: string; text: string; dot: string }
> = {
  red: {
    label: 'วิกฤต',
    badgeBg: 'bg-red-50 text-red-700 border-red-200',
    text: 'text-red-700',
    dot: 'bg-red-500',
  },
  orange: {
    label: 'รถเล็กผ่านไม่ได้',
    badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
    text: 'text-orange-700',
    dot: 'bg-orange-500',
  },
  yellow: {
    label: 'รถเล็กผ่านได้',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    text: 'text-amber-800',
    dot: 'bg-amber-400',
  },
  green: {
    label: 'ปกติ / แห้งแล้ว',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
};

export const ReportFeedList: React.FC<ReportFeedListProps> = ({
  reports,
  onSelectReport,
}) => {
  const formatTimeThai = (isoDate: string) => {
    try {
      const date = new Date(isoDate);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) return 'เมื่อสักครู่';
      if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
      if (diffHours < 24) return `${diffHours} ชม. ที่แล้ว`;
      return date.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
      });
    } catch {
      return '';
    }
  };

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-3 text-blue-500 border border-blue-100">
          <Inbox className="w-8 h-8" />
        </div>
        <h4 className="font-semibold text-slate-800 text-base mb-1">ยังไม่มีรายงานสถานการณ์น้ำในขณะนี้</h4>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          ระบบพร้อมใช้งานแล้ว! หากพบเห็นจุดน้ำท่วมขังหรือเส้นทางสัญจรลำบากในจังหวัดปราจีนบุรี สามารถกดแจ้งสถานการณ์ได้ทันที
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>พบ {reports.length} รายงานสถานการณ์</span>
        <span>เรียงจากรายงานล่าสุด</span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {reports.map((report) => {
          const cfg = severityConfig[report.severity] || severityConfig.yellow;

          return (
            <div
              key={report.id}
              onClick={() => onSelectReport(report)}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col sm:flex-row gap-3 sm:items-center justify-between group"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {/* Photo Thumbnail if exists */}
                {report.image_url ? (
                  <img
                    src={report.image_url}
                    alt={report.location_name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0 border border-slate-100"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-100 flex flex-col items-center justify-center flex-shrink-0 text-slate-400 border border-slate-100">
                    <MapPin className="w-6 h-6 text-slate-300" />
                    <span className="text-[10px] mt-0.5">ไม่มีรูป</span>
                  </div>
                )}

                {/* Details */}
                <div className="flex-1 min-w-0">
                  {/* Status Badge & Time */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${cfg.badgeBg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>

                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeThai(report.created_at)}
                    </span>

                    {report.is_verified && (
                      <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> ยืนยันแล้ว
                      </span>
                    )}
                  </div>

                  {/* Title & District */}
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate group-hover:text-blue-600 transition-colors">
                    {report.location_name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>
                      ตำบล{report.subdistrict}, {report.district}
                    </span>
                  </p>

                  {/* Depth & Passability info */}
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
                      {report.water_depth_label}
                    </span>

                    {report.passable_for_vehicles ? (
                      <span className="text-emerald-700 flex items-center gap-1 text-[11px] font-medium">
                        <Car className="w-3.5 h-3.5" /> ผ่านได้
                      </span>
                    ) : (
                      <span className="text-rose-700 flex items-center gap-1 text-[11px] font-medium">
                        <ShieldAlert className="w-3.5 h-3.5" /> รถเล็กผ่านไม่ได้
                      </span>
                    )}

                    {(report.upvotes || 0) > 0 && (
                      <span className="text-slate-400 flex items-center gap-1 text-[11px] ml-auto">
                        <ThumbsUp className="w-3 h-3" /> {report.upvotes}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* View Chevron Arrow */}
              <div className="hidden sm:flex items-center text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
