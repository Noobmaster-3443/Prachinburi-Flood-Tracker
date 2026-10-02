'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Lock,
  Unlock,
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Clock,
  Car,
  ExternalLink,
  RefreshCw,
  LogOut,
  Eye,
  EyeOff,
  Inbox,
  PhoneCall,
  Check,
  X,
  User,
  HeartPulse,
} from 'lucide-react';
import { FloodReport, SeverityLevel, EmergencyContact } from '@/types';
import { getReports, deleteReport, toggleVerifyReport, clearAllReports } from '@/lib/reports-store';
import { getEmergencyContacts, approveEmergencyContact, deleteEmergencyContact } from '@/lib/contacts-store';
import { PRACHINBURI_DISTRICTS } from '@/data/prachinburi-locations';

const DEFAULT_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || 'PrachinAdmin#2026!';
const ADMIN_STORAGE_KEY = 'prachinburi_admin_auth_v1';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>('');

  // Active admin tab: 'reports' or 'contacts'
  const [activeTab, setActiveTab] = useState<'reports' | 'contacts'>('reports');

  // Reports state
  const [reports, setReports] = useState<FloodReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterVerified, setFilterVerified] = useState<string>('all');

  // Contacts state
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Check auth session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem(ADMIN_STORAGE_KEY);
      if (isAuth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Load all data
  const refreshAllData = async () => {
    setLoading(true);
    try {
      const [reps, cons] = await Promise.all([
        getReports(),
        getEmergencyContacts(true), // true = include pending approval
      ]);
      setReports(reps);
      setContacts(cons);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshAllData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === DEFAULT_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      setPinError('');
    } else {
      setPinError('รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    setPinInput('');
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Delete flood report
  const handleDeleteReport = async (id: string, locationName: string) => {
    const confirmDelete = window.confirm(
      `คุณแน่ใจหรือไม่ว่าต้องการลบการรายงานจุด: "${locationName}"?\n\nการลบนี้จะนำออกจากแผนที่และระบบทันที`
    );
    if (!confirmDelete) return;

    const ok = await deleteReport(id);
    if (ok) {
      setReports((prev) => prev.filter((r) => r.id !== id));
      showToast(`ลบรายงาน "${locationName}" สำเร็จ`);
    } else {
      alert('เกิดข้อผิดพลาดในการลบ');
    }
  };

  // Toggle report verify status
  const handleToggleVerify = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    const ok = await toggleVerifyReport(id, nextStatus);
    if (ok) {
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_verified: nextStatus } : r))
      );
      showToast(nextStatus ? 'ยืนยันรายงานโดยเจ้าหน้าที่แล้ว' : 'ยกเลิกการยืนยันแล้ว');
    }
  };

  // Clear all reports
  const handleClearAllReports = async () => {
    const confirmWipe = window.confirm(
      '⚠️ คำเตือน: คุณต้องการล้างรายงานทั้งหมดในระบบหรือไม่?\n\nข้อมูลทั้งหมดจะถูกลบถาวร ไม่สามารถกู้คืนได้'
    );
    if (!confirmWipe) return;

    await clearAllReports();
    setReports([]);
    showToast('ล้างข้อมูลรายงานทั้งหมดเรียบร้อยแล้ว');
  };

  // Approve Contact
  const handleApproveContact = async (id: string, name: string) => {
    const ok = await approveEmergencyContact(id);
    if (ok) {
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_approved: true } : c))
      );
      showToast(`อนุมัติเบอร์โทร "${name}" ขึ้นแสดงผลบนระบบแล้ว`);
    }
  };

  // Delete Contact
  const handleDeleteContact = async (id: string, name: string) => {
    const confirmDelete = window.confirm(`คุณต้องการลบเบอร์โทร "${name}" หรือไม่?`);
    if (!confirmDelete) return;

    const ok = await deleteEmergencyContact(id);
    if (ok) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
      showToast(`ลบเบอร์โทร "${name}" สำเร็จ`);
    }
  };

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (filterDistrict !== 'all' && r.district !== filterDistrict) return false;
      if (filterSeverity !== 'all' && r.severity !== filterSeverity) return false;
      if (filterVerified === 'verified' && !r.is_verified) return false;
      if (filterVerified === 'unverified' && r.is_verified) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mName = r.location_name.toLowerCase().includes(q);
        const mSub = r.subdistrict.toLowerCase().includes(q);
        const mDist = r.district.toLowerCase().includes(q);
        const mDesc = r.description?.toLowerCase().includes(q);
        const mRep = r.reporter_name?.toLowerCase().includes(q);
        if (!mName && !mSub && !mDist && !mDesc && !mRep) return false;
      }

      return true;
    });
  }, [reports, filterDistrict, filterSeverity, filterVerified, searchQuery]);

  // Pending contacts count
  const pendingContacts = contacts.filter((c) => !c.is_approved);
  const approvedContacts = contacts.filter((c) => c.is_approved);

  // If not authenticated, show passcode login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 mx-auto flex items-center justify-center shadow-lg shadow-blue-500/10">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">ระบบควบคุมหลังบ้าน (Admin)</h1>
            <p className="text-xs text-slate-500">
              จัดการรายงานน้ำท่วม และอนุมัติเบอร์โทรฉุกเฉินที่ประชาชนเสนอเข้ามา
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                รหัสผ่านผู้ดูแลระบบ (Admin Passcode)
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  required
                  placeholder="กรอกรหัสผ่านผู้ดูแลระบบ"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-slate-100 rounded-xl text-sm border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {pinError && (
                <p className="text-xs text-red-500 mt-1.5 font-medium">{pinError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>เข้าสู่ระบบจัดการหลังบ้าน</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>กลับสู่หน้าแผนที่หลัก</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Metric counts
  const countTotal = reports.length;
  const countCritical = reports.filter((r) => r.severity === 'red').length;
  const countOrange = reports.filter((r) => r.severity === 'orange').length;
  const countVerified = reports.filter((r) => r.is_verified).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              title="กลับหน้าแผนที่หลัก"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base text-slate-900 leading-tight">
                  ระบบควบคุมหลังบ้าน (Admin Moderation)
                </h1>
                <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ADMIN
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                ลบรายงานก่อกวน / อนุมัติเบอร์โทรฉุกเฉิน / ตรวจสอบความถูกต้อง
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshAllData}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="รีเฟรชข้อมูล"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">รีเฟรช</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="ออกจากระบบ"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher (Reports vs Contacts) */}
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 border-t border-slate-100 bg-slate-50/60">
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-2.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'reports'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🌊 รายงานน้ำท่วม</span>
            <span className="bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full text-[10px]">
              {reports.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`py-2.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'contacts'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>📞 อนุมัติเบอร์โทรฉุกเฉิน</span>
            {pendingContacts.length > 0 && (
              <span className="bg-amber-500 text-white font-black px-2 py-0.5 rounded-full text-[10px] animate-pulse">
                รออนุมัติ {pendingContacts.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        {/* ================================================================= */}
        {/* TAB 1: REPORTS MODERATION */}
        {/* ================================================================= */}
        {activeTab === 'reports' && (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-medium">รายงานทั้งหมด</span>
                <div className="text-2xl font-bold text-slate-900 mt-1">{countTotal} จุด</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-sm">
                <span className="text-xs text-red-600 font-medium">วิกฤต (สีแดง)</span>
                <div className="text-2xl font-bold text-red-600 mt-1">{countCritical} จุด</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-orange-200 shadow-sm">
                <span className="text-xs text-orange-600 font-medium">รถเล็กผ่านไม่ได้</span>
                <div className="text-2xl font-bold text-orange-600 mt-1">{countOrange} จุด</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm">
                <span className="text-xs text-blue-600 font-medium">จนท. ตรวจสอบแล้ว</span>
                <div className="text-2xl font-bold text-blue-600 mt-1">{countVerified} จุด</div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ค้นหาตามสถานที่, ตำบล, อำเภอ หรือชื่อผู้รายงาน..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-xl text-xs sm:text-sm border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={filterDistrict}
                    onChange={(e) => setFilterDistrict(e.target.value)}
                    className="px-3 py-2 bg-slate-100 rounded-xl text-xs font-medium text-slate-700 outline-none"
                  >
                    <option value="all">📍 ทุกอำเภอ</option>
                    {PRACHINBURI_DISTRICTS.map((d) => (
                      <option key={d.id} value={d.name_th}>
                        {d.name_th}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="px-3 py-2 bg-slate-100 rounded-xl text-xs font-medium text-slate-700 outline-none"
                  >
                    <option value="all">ทุกระดับความรุนแรง</option>
                    <option value="red">🔴 วิกฤต</option>
                    <option value="orange">🟠 รถเล็กผ่านไม่ได้</option>
                    <option value="yellow">🟡 รถเล็กผ่านได้</option>
                    <option value="green">🟢 ปกติ / น้ำแห้งแล้ว</option>
                  </select>

                  <select
                    value={filterVerified}
                    onChange={(e) => setFilterVerified(e.target.value)}
                    className="px-3 py-2 bg-slate-100 rounded-xl text-xs font-medium text-slate-700 outline-none"
                  >
                    <option value="all">สถานะยืนยันทั้งหมด</option>
                    <option value="verified">✓ ยืนยันแล้ว</option>
                    <option value="unverified">⏳ ยังไม่ยืนยัน</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span>แสดงผล {filteredReports.length} รายการ จากทั้งหมด {reports.length} รายการ</span>
                {reports.length > 0 && (
                  <button
                    onClick={handleClearAllReports}
                    className="text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ล้างรายงานทั้งหมด (Wipe Data)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Reports List */}
            {filteredReports.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
                <Inbox className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <h3 className="font-semibold text-slate-700 text-sm">ไม่พบรายงานตามตัวกรอง</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {reports.length === 0
                    ? 'ยังไม่มีรายงานใดๆ ถูกส่งเข้ามาในระบบ'
                    : 'ลองปรับการค้นหาหรือเลือกตัวกรองใหม่'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredReports.map((report) => {
                  const dateStr = new Date(report.created_at).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  const severityColors: Record<SeverityLevel, { badge: string; text: string }> = {
                    red: { badge: 'bg-red-100 text-red-700 border-red-200', text: 'วิกฤต' },
                    orange: { badge: 'bg-orange-100 text-orange-700 border-orange-200', text: 'รถเล็กผ่านไม่ได้' },
                    yellow: { badge: 'bg-amber-100 text-amber-800 border-amber-200', text: 'รถเล็กผ่านได้' },
                    green: { badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', text: 'ปกติ/แห้งแล้ว' },
                  };

                  const sev = severityColors[report.severity] || severityColors.yellow;

                  return (
                    <div
                      key={report.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
                    >
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        {report.image_url ? (
                          <a
                            href={report.image_url}
                            target="_blank"
                            rel="noreferrer"
                            className="relative flex-shrink-0 group"
                          >
                            <img
                              src={report.image_url}
                              alt={report.location_name}
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-100"
                            />
                            <span className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 text-white text-[10px]">
                              ขยาย
                            </span>
                          </a>
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-slate-400 flex-shrink-0 text-[10px]">
                            <MapPin className="w-5 h-5 text-slate-300" />
                            <span>ไม่มีรูป</span>
                          </div>
                        )}

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sev.badge}`}>
                              {sev.text}
                            </span>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {dateStr}
                            </span>
                            {report.is_verified ? (
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-blue-200">
                                <ShieldCheck className="w-3 h-3" /> ยืนยันแล้ว
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                รอตรวจสอบ
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                            {report.location_name}
                          </h3>

                          <p className="text-xs text-slate-500">
                            ตำบล{report.subdistrict}, {report.district} • พิกัด: {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                          </p>

                          {report.description && (
                            <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg leading-relaxed mt-1">
                              <strong className="text-slate-900 font-semibold">ข้อความ: </strong>
                              {report.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-1">
                            <span>ลึก: <strong>{report.water_depth_label}</strong></span>
                            <span>•</span>
                            <span>สัญจร: <strong>{report.passable_for_vehicles ? 'ผ่านได้' : 'รถเล็กผ่านไม่ได้'}</strong></span>
                            <span>•</span>
                            <span>ผู้แจ้ง: <strong>{report.reporter_name || 'ประชาชนทั่วไป'}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${report.latitude},${report.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          title="ดูพิกัดบน Google Maps"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">พิกัด</span>
                        </a>

                        <button
                          onClick={() => handleToggleVerify(report.id, report.is_verified)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            report.is_verified
                              ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                              : 'bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700'
                          }`}
                          title={report.is_verified ? 'ยกเลิกการยืนยัน' : 'กดยืนยันว่าเป็นข้อมูลจริง'}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{report.is_verified ? 'ยืนยันแล้ว' : 'กดยืนยัน'}</span>
                        </button>

                        <button
                          onClick={() => handleDeleteReport(report.id, report.location_name)}
                          className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                          title="ลบรายงานนี้ (กรณีป่วนหรือข้อมูลเท็จ)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>ลบรายงาน</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ================================================================= */}
        {/* TAB 2: EMERGENCY CONTACTS MODERATION */}
        {/* ================================================================= */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            {/* Section 1: Pending Approval Numbers */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                  <h2 className="font-bold text-base text-slate-900">
                    เบอร์โทรที่ประชาชนเสนอเข้ามา (รอการอนุมัติ)
                  </h2>
                </div>
                <span className="text-xs text-amber-700 font-semibold bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {pendingContacts.length} เบอร์รอการตรวจสอบ
                </span>
              </div>

              {pendingContacts.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center text-slate-400 border border-slate-200">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500" />
                  <h3 className="font-semibold text-slate-700 text-sm">ไม่มีเบอร์โทรค้างรออนุมัติ</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    เมื่อประชาชนเสนอเบอร์โทรเข้ามา จะปรากฏในส่วนนี้เพื่อให้แอดมินกดอนุมัติก่อนขึ้นระบบ
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {pendingContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="bg-white rounded-2xl p-4 border-2 border-amber-200 shadow-sm flex flex-col md:flex-row gap-3 items-start md:items-center justify-between"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            รออนุมัติ
                          </span>
                          {contact.district && (
                            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                              📍 {contact.district}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-base text-slate-900">{contact.name}</h3>
                        <p className="text-xs text-slate-600">{contact.description}</p>
                        <div className="flex items-center gap-3 pt-1 text-xs">
                          <span className="font-mono font-bold text-blue-600 text-sm">{contact.phone}</span>
                          <span className="text-slate-400">• เสนอโดย: {contact.submitted_by || 'ประชาชน'}</span>
                        </div>
                      </div>

                      {/* Action: Approve or Reject */}
                      <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                        <button
                          onClick={() => handleApproveContact(contact.id, contact.name)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                        >
                          <Check className="w-4 h-4" />
                          <span>อนุมัติขึ้นระบบ</span>
                        </button>

                        <button
                          onClick={() => handleDeleteContact(contact.id, contact.name)}
                          className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                        >
                          <X className="w-4 h-4" />
                          <span>ปฏิเสธ / ลบ</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 2: Approved / Official Numbers */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h2 className="font-bold text-base text-slate-900">
                เบอร์โทรฉุกเฉินที่กำลังแสดงผลบนระบบ ({approvedContacts.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {approvedContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900">{contact.name}</span>
                        {contact.is_official && (
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded">
                            หลัก
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{contact.description}</p>
                      <p className="font-mono font-bold text-blue-600 text-sm mt-1">{contact.phone}</p>
                    </div>

                    {!contact.is_official && (
                      <button
                        onClick={() => handleDeleteContact(contact.id, contact.name)}
                        className="w-8 h-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                        title="ลบเบอร์โทรนี้ออกจากระบบ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
