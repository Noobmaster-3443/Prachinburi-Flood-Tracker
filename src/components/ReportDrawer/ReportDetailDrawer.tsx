'use client';

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  ThumbsUp,
  Share2,
  Navigation,
  ShieldCheck,
  AlertTriangle,
  Car,
  ShieldAlert,
  PhoneCall,
  User,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { FloodReport, SeverityLevel } from '@/types';

interface ReportDetailDrawerProps {
  report: FloodReport | null;
  onClose: () => void;
  onUpvote: (id: string) => Promise<void>;
  onOpenEmergency: () => void;
  onDeleteReport?: (id: string) => Promise<void>;
}

const severityConfig: Record<
  SeverityLevel,
  { label: string; bg: string; text: string; border: string; icon: string }
> = {
  red: {
    label: 'วิกฤต / ต้องการความช่วยเหลือ',
    bg: 'bg-red-500',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: '🚨',
  },
  orange: {
    label: 'น้ำท่วมสูง รถเล็กผ่านไม่ได้',
    bg: 'bg-orange-500',
    text: 'text-orange-700',
    border: 'border-orange-200',
    icon: '🌊',
  },
  yellow: {
    label: 'น้ำท่วมขัง รถเล็กผ่านได้',
    bg: 'bg-amber-400',
    text: 'text-amber-800',
    border: 'border-amber-200',
    icon: '⚠️',
  },
  green: {
    label: 'เฝ้าระวัง / น้ำแห้งแล้ว',
    bg: 'bg-emerald-500',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: '✅',
  },
};

export const ReportDetailDrawer: React.FC<ReportDetailDrawerProps> = ({
  report,
  onClose,
  onUpvote,
  onOpenEmergency,
  onDeleteReport,
}) => {
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  if (!report) return null;

  const cfg = severityConfig[report.severity] || severityConfig.yellow;

  // Format time relative or Thai format
  const formatTimeThai = (isoDate: string) => {
    try {
      const date = new Date(isoDate);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) return 'เมื่อสักครู่';
      if (diffMins < 60) return `เมื่อ ${diffMins} นาทีที่แล้ว`;
      if (diffHours < 24) return `เมื่อ ${diffHours} ชั่วโมงที่แล้ว`;
      return date.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'เมื่อเร็วๆ นี้';
    }
  };

  const handleUpvoteClick = async () => {
    if (hasUpvoted) return;
    setHasUpvoted(true);
    await onUpvote(report.id);
  };

  const handleShare = async () => {
    const shareText = `[รายงานน้ำท่วมปราจีนบุรี] ${report.location_name} (${report.district}) - สถานะ: ${cfg.label}, ระดับน้ำ: ${report.water_depth_label}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'น้ำท่วมปราจีนบุรี',
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // user cancelled share
      }
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${report.latitude},${report.longitude}`,
      '_blank'
    );
  };

  const handleDeleteReport = async () => {
    if (!onDeleteReport || !report) return;
    const isAuth = typeof window !== 'undefined' && sessionStorage.getItem('prachinburi_admin_auth_v1') === 'true';
    if (!isAuth) {
      const pin = window.prompt('กรุณากรอกรหัสผ่านผู้ดูแลระบบ (Admin PIN) เพื่อลบรายงานนี้:');
      const expectedPin = process.env.NEXT_PUBLIC_ADMIN_PIN || 'admin8888';
      if (pin !== expectedPin) {
        alert('รหัสผ่านไม่ถูกต้อง');
        return;
      }
      sessionStorage.setItem('prachinburi_admin_auth_v1', 'true');
    }

    const confirmed = window.confirm(`คุณแน่ใจว่าต้องการลบการรายงาน "${report.location_name}" หรือไม่?`);
    if (confirmed) {
      await onDeleteReport(report.id);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 sm:bottom-auto sm:inset-y-0 sm:right-0 sm:w-96 z-40 bg-white/95 backdrop-blur-md rounded-t-3xl sm:rounded-none sm:border-l border-t sm:border-t-0 border-slate-200 shadow-2xl flex flex-col max-h-[85vh] sm:max-h-full transition-transform duration-300">
        {/* Mobile Pull Bar */}
        <div className="sm:hidden w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5" />

        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{cfg.icon}</span>
            <div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.bg} text-white`}>
                {cfg.label}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {onDeleteReport && (
              <button
                onClick={handleDeleteReport}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                title="ลบรายงานนี้ (Admin)"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm flex-1">
          {/* Location Name & Area */}
          <div>
            <h3 className="font-bold text-lg text-slate-900 leading-snug">
              {report.location_name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>
                ตำบล{report.subdistrict}, {report.district}
              </span>
            </div>
          </div>

          {/* Photo Thumbnail if available */}
          {report.image_url && (
            <div
              onClick={() => setShowPhotoModal(true)}
              className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-sm"
            >
              <img
                src={report.image_url}
                alt={report.location_name}
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg">
                  แตะเพื่อดูรูปขนาดใหญ่
                </span>
              </div>
            </div>
          )}

          {/* Status Metrics Box */}
          <div className="grid grid-cols-2 gap-2">
            {/* Water Depth */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] text-slate-400 block mb-0.5">ระดับความลึกของน้ำ</span>
              <span className="font-semibold text-slate-800 text-xs sm:text-sm">
                {report.water_depth_label}
              </span>
            </div>

            {/* Vehicle Passability */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] text-slate-400 block mb-0.5">การสัญจร</span>
              <div className="flex items-center gap-1.5">
                {report.passable_for_vehicles ? (
                  <>
                    <Car className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="font-semibold text-emerald-700 text-xs">
                      รถเล็กผ่านได้
                    </span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span className="font-semibold text-rose-700 text-xs">
                      รถเล็กผ่านไม่ได้
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {report.description && (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
              <p className="font-medium text-slate-900 mb-1">รายละเอียด:</p>
              {report.description}
            </div>
          )}

          {/* Metadata & Source */}
          <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimeThai(report.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                {report.is_verified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    ยืนยันโดยเจ้าหน้าที่
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px]">
                    <User className="w-3 h-3" />
                    {report.reporter_name || 'รายงานโดยประชาชน'}
                  </span>
                )}
              </div>
            </div>

            {/* GPS coordinates */}
            <div className="text-[11px] text-slate-400 font-mono">
              พิกัด: {report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}
            </div>
          </div>

          {/* Critical Emergency Banner if Red */}
          {report.severity === 'red' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-red-700">
                <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />
                <span>จุดนี้อยู่ในภาวะวิกฤต ต้องการความช่วยเหลือ</span>
              </div>
              <button
                onClick={onOpenEmergency}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>กดโทรสายด่วนกู้ภัย / ปภ. ปราจีนบุรี</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center gap-2">
          {/* Upvote Button */}
          <button
            onClick={handleUpvoteClick}
            className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              hasUpvoted
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-blue-600 text-blue-600' : ''}`} />
            <span>ยืนยัน ({((report.upvotes || 0) + (hasUpvoted ? 1 : 0))})</span>
          </button>

          {/* Open Google Maps Button */}
          <button
            onClick={openGoogleMaps}
            className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            title="นำทางด้วย Google Maps"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
            <span>นำทาง</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-all"
            title="แชร์ข้อมูลจุดนี้"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{copied ? 'คัดลอกแล้ว!' : 'แชร์'}</span>
          </button>
        </div>
      </div>

      {/* Image Modal for Full View */}
      {showPhotoModal && report.image_url && (
        <div
          onClick={() => setShowPhotoModal(false)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img
              src={report.image_url}
              alt={report.location_name}
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
            />
            <p className="text-white text-center text-xs mt-2 font-medium">
              {report.location_name} (แตะที่ใดก็ได้เพื่อปิด)
            </p>
          </div>
        </div>
      )}
    </>
  );
};
