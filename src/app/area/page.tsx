'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  PhoneCall, 
  RefreshCw, 
  AlertTriangle, 
  Waves, 
  CheckCircle2, 
  Car, 
  Clock, 
  Compass,
  ChevronRight,
  ShieldCheck,
  Search
} from 'lucide-react';
import { PRACHINBURI_DISTRICTS } from '@/data/prachinburi-locations';
import { getReports, createReport, upvoteReport, deleteReport } from '@/lib/reports-store';
import { FloodReport, SeverityLevel } from '@/types';
import { DynamicMap } from '@/components/Map/DynamicMap';
import { EmergencyDrawer } from '@/components/Emergency/EmergencyDrawer';
import { ReportFormModal } from '@/components/ReportModal/ReportFormModal';
import { ReportDetailDrawer } from '@/components/ReportDrawer/ReportDetailDrawer';

export default function AreaPage() {
  const [reports, setReports] = useState<FloodReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('all');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<FloodReport | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Handle report upvote
  const handleUpvote = async (id: string) => {
    const newCount = await upvoteReport(id);
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: newCount } : r))
    );
    if (selectedReport && selectedReport.id === id) {
      setSelectedReport((prev) => (prev ? { ...prev, upvotes: newCount } : null));
    }
  };

  // Handle report delete
  const handleDeleteReport = async (id: string) => {
    const success = await deleteReport(id);
    if (success) {
      setReports((prev) => prev.filter((r) => r.id !== id));
      setSelectedReport(null);
      setToastMessage('ลบรายงานเรียบร้อยแล้ว');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Fetch reports
  const fetchReportsData = async () => {
    setLoading(true);
    try {
      const data = await getReports();
      setReports(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  // Selected district info
  const selectedDistrict = useMemo(() => {
    if (selectedDistrictId === 'all') return null;
    return PRACHINBURI_DISTRICTS.find((d) => d.id === selectedDistrictId) || null;
  }, [selectedDistrictId]);

  // Filtered reports by district
  const districtReports = useMemo(() => {
    if (!selectedDistrict) return reports;
    return reports.filter((r) => r.district === selectedDistrict.name_th);
  }, [reports, selectedDistrict]);

  // Severity counts & highest severity
  const stats = useMemo(() => {
    const total = districtReports.length;
    const red = districtReports.filter((r) => r.severity === 'red').length;
    const orange = districtReports.filter((r) => r.severity === 'orange').length;
    const yellow = districtReports.filter((r) => r.severity === 'yellow').length;
    const green = districtReports.filter((r) => r.severity === 'green').length;
    const impassable = districtReports.filter((r) => r.passable_for_vehicles === false).length;

    let overallSeverity: SeverityLevel | 'normal' = 'normal';
    if (red > 0) overallSeverity = 'red';
    else if (orange > 0) overallSeverity = 'orange';
    else if (yellow > 0) overallSeverity = 'yellow';
    else if (green > 0) overallSeverity = 'green';

    return { total, red, orange, yellow, green, impassable, overallSeverity };
  }, [districtReports]);

  // GPS Locate Nearest District
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง GPS');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lng: longitude });

        // Find closest Prachinburi district
        let closestDistrict = PRACHINBURI_DISTRICTS[0];
        let minDist = Infinity;

        PRACHINBURI_DISTRICTS.forEach((d) => {
          const dist = Math.hypot(d.lat - latitude, d.lng - longitude);
          if (dist < minDist) {
            minDist = dist;
            closestDistrict = d;
          }
        });

        setSelectedDistrictId(closestDistrict.id);
        setLocating(false);
        setToastMessage(`พบตำแหน่งของคุณ: ใกล้เคียง ${closestDistrict.name_th}`);
        setTimeout(() => setToastMessage(null), 3500);
      },
      (err) => {
        console.error(err);
        setLocating(false);
        alert('ไม่สามารถดึงตำแหน่งได้ กรุณาอนุญาตการเข้าถึง GPS ในเบราว์เซอร์');
      },
      { timeout: 10000 }
    );
  };

  const getSeverityBadge = (level: SeverityLevel | 'normal') => {
    switch (level) {
      case 'red':
        return { label: 'น้ำท่วมวิกฤต', bg: 'bg-red-500 text-white', border: 'border-red-600', ring: 'ring-red-300' };
      case 'orange':
        return { label: 'น้ำท่วมสูง / รถเล็กผ่านไม่ได้', bg: 'bg-orange-500 text-white', border: 'border-orange-600', ring: 'ring-orange-300' };
      case 'yellow':
        return { label: 'น้ำท่วมขัง / สัญจรระวัง', bg: 'bg-yellow-400 text-slate-900', border: 'border-yellow-500', ring: 'ring-yellow-200' };
      case 'green':
        return { label: 'เฝ้าระวัง / น้ำแห้งแล้ว', bg: 'bg-emerald-500 text-white', border: 'border-emerald-600', ring: 'ring-emerald-200' };
      default:
        return { label: 'ยังไม่มีรายงานเหตุ', bg: 'bg-slate-100 text-slate-700', border: 'border-slate-300', ring: 'ring-slate-100' };
    }
  };

  const badge = getSeverityBadge(stats.overallSeverity);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 animate-fade-in border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
              title="กลับหน้าหลัก"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-1.5">
              <Compass className="w-5 h-5 text-blue-600" />
              <h1 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
                พื้นที่ของฉัน (รายอำเภอ)
              </h1>
            </div>
          </div>

          <button
            onClick={() => setIsEmergencyOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs sm:text-sm font-semibold border border-red-200 transition-all shadow-sm"
          >
            <PhoneCall className="w-4 h-4 text-red-500 animate-bounce" />
            <span>สายด่วน 1784</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 space-y-4">
        {/* District Selector & GPS Button */}
        <section className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <p className="text-xs sm:text-sm text-slate-600">
            เลือกอำเภอบ้านหรือที่ทำงาน เพื่อดูสถานการณ์ระดับน้ำ เส้นทางสัญจร และรายงานล่าสุดในพื้นที่
          </p>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <select
                value={selectedDistrictId}
                onChange={(e) => setSelectedDistrictId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 transition-all outline-none appearance-none"
              >
                <option value="all">📍 ทั้งหมด (7 อำเภอในปราจีนบุรี)</option>
                {PRACHINBURI_DISTRICTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name_th} ({d.subdistricts.length} ตำบล)
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                ▼
              </div>
            </div>

            <button
              onClick={handleLocateMe}
              disabled={locating}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition-all flex-shrink-0"
              title="ค้นหาอำเภอใกล้ตำแหน่งของคุณ"
            >
              <Navigation className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">{locating ? 'กำลังค้นหา...' : 'ใกล้ฉัน'}</span>
            </button>
          </div>
        </section>

        {/* Status Card */}
        <section className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-medium text-slate-500">สถานการณ์พื้นที่</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                {selectedDistrict ? selectedDistrict.name_th : 'ทั้งจังหวัดปราจีนบุรี'}
              </h2>
            </div>

            <button
              onClick={fetchReportsData}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="รีเฟรชข้อมูล"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Severity Banner */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${badge.bg} ${badge.border}`}>
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <div>
                <div className="text-sm font-bold leading-tight">{badge.label}</div>
                <div className="text-xs opacity-90">
                  {stats.total === 0 
                    ? 'ยังไม่มีการแจ้งเหตุน้ำท่วมในพื้นที่นี้' 
                    : `มีรายงานจุดน้ำท่วมสะสม ${stats.total} จุด`}
                </div>
              </div>
            </div>
            {stats.impassable > 0 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/25 backdrop-blur-sm">
                ⛔ ทางขาด {stats.impassable} จุด
              </span>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            <div className="bg-red-50/70 border border-red-100 p-2.5 rounded-xl text-center">
              <span className="text-xs font-semibold text-red-600 block">🔴 วิกฤต</span>
              <span className="text-lg font-bold text-red-700">{stats.red}</span>
            </div>
            <div className="bg-orange-50/70 border border-orange-100 p-2.5 rounded-xl text-center">
              <span className="text-xs font-semibold text-orange-600 block">🟠 สูง</span>
              <span className="text-lg font-bold text-orange-700">{stats.orange}</span>
            </div>
            <div className="bg-yellow-50/70 border border-yellow-100 p-2.5 rounded-xl text-center">
              <span className="text-xs font-semibold text-yellow-700 block">🟡 ขัง</span>
              <span className="text-lg font-bold text-yellow-800">{stats.yellow}</span>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-100 p-2.5 rounded-xl text-center">
              <span className="text-xs font-semibold text-emerald-600 block">🟢 เฝ้าระวัง</span>
              <span className="text-lg font-bold text-emerald-700">{stats.green}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all text-center"
            >
              + แจ้งระดับน้ำพื้นที่นี้
            </button>
            <Link
              href="/"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm border border-slate-200 transition-all text-center"
            >
              ดูแผนที่รวมทั้งหมด
            </Link>
          </div>
        </section>

        {/* Map Preview for Selected District */}
        <section className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              แผนที่จุดน้ำท่วม ({districtReports.length} จุด)
            </span>
            <span className="text-[11px] text-slate-500">คลิกที่หมุดเพื่อดูรูปและข้อมูล</span>
          </div>

          <div className="h-64 sm:h-72 w-full rounded-xl overflow-hidden border border-slate-200 relative">
            <DynamicMap
              reports={districtReports}
              selectedReport={selectedReport}
              onSelectReport={setSelectedReport}
              selectedDistrict={selectedDistrict ? selectedDistrict.name_th : 'all'}
            />
          </div>
        </section>

        {/* Recent Reports in this Area */}
        <section className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              รายงานล่าสุดในพื้นที่ ({districtReports.length})
            </h3>
            <span className="text-xs text-slate-500">เรียงตามเวลาล่าสุด</span>
          </div>

          {districtReports.length === 0 ? (
            <div className="py-8 text-center text-slate-500 space-y-2">
              <p className="text-sm">ยังไม่มีรายงานสถานการณ์น้ำท่วมในพื้นที่นี้</p>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="text-xs text-blue-600 font-semibold underline hover:text-blue-700"
              >
                คุณอยู่ในพื้นที่นี้ใช่หรือไม่? ช่วยกันแจ้งระดับน้ำได้เลย
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {districtReports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className="py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 px-2 rounded-xl transition-colors"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        report.severity === 'red' ? 'bg-red-500' :
                        report.severity === 'orange' ? 'bg-orange-500' :
                        report.severity === 'yellow' ? 'bg-yellow-400' : 'bg-emerald-500'
                      }`} />
                      <h4 className="text-sm font-semibold text-slate-900 truncate">
                        {report.location_name}
                      </h4>
                      {report.is_verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                      <span>ต.{report.subdistrict} อ.{report.district}</span>
                      <span>•</span>
                      <span className={report.passable_for_vehicles ? 'text-emerald-600' : 'text-red-600 font-medium'}>
                        {report.passable_for_vehicles ? '✓ รถเล็กผ่านได้' : '⛔ รถเล็กผ่านไม่ได้'}
                      </span>
                    </div>
                  </div>

                  {report.image_url && (
                    <img
                      src={report.image_url}
                      alt="รูปภาพน้ำท่วม"
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                    />
                  )}

                  <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Subdistrict Tag Cloud (If district selected) */}
        {selectedDistrict && (
          <section className="bg-slate-100/70 p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-semibold text-slate-600 block">
              รายชื่อตำบลใน {selectedDistrict.name_th} ({selectedDistrict.subdistricts.length} ตำบล):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedDistrict.subdistricts.map((sub) => (
                <span
                  key={sub}
                  className="px-2.5 py-1 rounded-lg bg-white text-slate-700 text-xs font-medium border border-slate-200/80 shadow-2xs"
                >
                  ต.{sub}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Disclaimer footer */}
        <p className="text-[11px] leading-relaxed text-slate-400 text-center px-4 py-2">
          * ข้อมูลระดับน้ำประมวลผลจากการรายงานของประชาชนในพื้นที่เพื่อการเฝ้าระวังและการสัญจร โปรดระมัดระวังและปฏิบัติตามคำเตือนของหน่วยงานกู้ภัยในพื้นที่
        </p>
      </main>

      {/* Drawers & Modals */}
      <EmergencyDrawer
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      <ReportFormModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={async (reportData, imageBlob) => {
          const newReport = await createReport(reportData);
          setReports((prev) => [newReport, ...prev]);
          setIsReportModalOpen(false);
          setToastMessage('บันทึกและเผยแพร่รายงานน้ำท่วมเรียบร้อยแล้ว');
          setTimeout(() => setToastMessage(null), 3500);
        }}
      />

      {selectedReport && (
        <ReportDetailDrawer
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onUpvote={handleUpvote}
          onDeleteReport={handleDeleteReport}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
        />
      )}
    </div>
  );
}
