'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  MapPin,
  Camera,
  Navigation,
  AlertTriangle,
  CheckCircle2,
  Car,
  ShieldAlert,
  Loader2,
  Trash2,
  Info,
} from 'lucide-react';
import { FloodReport, SeverityLevel, WaterDepth } from '@/types';
import {
  PRACHINBURI_DISTRICTS,
  PRACHINBURI_CENTER,
  WATER_DEPTH_PRESETS,
} from '@/data/prachinburi-locations';
import { compressImage, formatFileSize } from '@/lib/storage';

interface ReportFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    report: Omit<FloodReport, 'id' | 'created_at' | 'upvotes'>,
    imageBlob?: Blob
  ) => Promise<void>;
}

export const ReportFormModal: React.FC<ReportFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [district, setDistrict] = useState(PRACHINBURI_DISTRICTS[1].name_th); // Default Kabin Buri
  const [subdistrict, setSubdistrict] = useState(PRACHINBURI_DISTRICTS[1].subdistricts[0]);
  const [locationName, setLocationName] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('orange');
  const [waterDepthCode, setWaterDepthCode] = useState<WaterDepth>('knee');
  const [passableForVehicles, setPassableForVehicles] = useState<boolean>(false);
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState<number>(PRACHINBURI_DISTRICTS[1].lat);
  const [longitude, setLongitude] = useState<number>(PRACHINBURI_DISTRICTS[1].lng);
  const [reporterName, setReporterName] = useState('');
  const [reporterType, setReporterType] = useState<'citizen' | 'official' | 'foundation'>('citizen');

  // Photo state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: number;
    compressedSize: number;
  } | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isFetchingGps, setIsFetchingGps] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update subdistricts when district changes
  const selectedDistrictData = PRACHINBURI_DISTRICTS.find((d) => d.name_th === district);
  const subdistrictsList = selectedDistrictData ? selectedDistrictData.subdistricts : [];

  useEffect(() => {
    if (selectedDistrictData && !selectedDistrictData.subdistricts.includes(subdistrict)) {
      setSubdistrict(selectedDistrictData.subdistricts[0] || '');
      setLatitude(selectedDistrictData.lat);
      setLongitude(selectedDistrictData.lng);
    }
  }, [district, selectedDistrictData, subdistrict]);

  // Sync passability default with severity
  useEffect(() => {
    if (severity === 'red' || severity === 'orange') {
      setPassableForVehicles(false);
    } else {
      setPassableForVehicles(true);
    }
  }, [severity]);

  // Auto fetch user GPS when modal opens
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      setIsFetchingGps(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(Number(pos.coords.latitude.toFixed(5)));
          setLongitude(Number(pos.coords.longitude.toFixed(5)));
          setIsFetchingGps(false);
        },
        () => {
          setIsFetchingGps(false);
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('เบราว์เซอร์ไม่รองรับ GPS');
      return;
    }
    setIsFetchingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(Number(pos.coords.latitude.toFixed(5)));
        setLongitude(Number(pos.coords.longitude.toFixed(5)));
        setIsFetchingGps(false);
      },
      (err) => {
        setIsFetchingGps(false);
        alert('ไม่สามารถดึงตำแหน่งพิกัดได้: ' + err.message);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const res = await compressImage(file, 1200, 1200, 0.75);
      setImagePreview(res.dataUrl);
      setImageBlob(res.blob);
      setCompressionStats({
        originalSize: res.originalSize,
        compressedSize: res.compressedSize,
      });
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการบีบอัดรูปภาพ');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageBlob(null);
    setCompressionStats(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName.trim()) {
      setErrorMsg('กรุณาระบุชื่อสถานที่ หรือจุดสังเกต');
      return;
    }

    if (!imagePreview) {
      setErrorMsg('⚠️ เพื่อป้องกันการแจ้งข้อมูลเท็จหรือรายงานมั่ว กรุณาแนบรูปถ่ายสถานการณ์จริงหน้างาน');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const depthPreset = WATER_DEPTH_PRESETS.find((p) => p.code === waterDepthCode);
    const depthLabel = depthPreset ? depthPreset.label : 'ระดับหัวเข่า';

    try {
      await onSubmit(
        {
          district,
          subdistrict,
          location_name: locationName.trim(),
          latitude,
          longitude,
          severity,
          water_depth_label: depthLabel,
          water_depth_code: waterDepthCode,
          passable_for_vehicles: passableForVehicles,
          description: description.trim(),
          image_url: imagePreview || undefined,
          is_verified: reporterType === 'official' || reporterType === 'foundation',
          reporter_type: reporterType,
          reporter_name: reporterName.trim() || undefined,
        },
        imageBlob || undefined
      );

      // Reset form
      setLocationName('');
      setDescription('');
      handleRemoveImage();
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  const severityConfigs: {
    level: SeverityLevel;
    title: string;
    sub: string;
    color: string;
    border: string;
    bg: string;
  }[] = [
    {
      level: 'red',
      title: 'วิกฤต / ช่วยเหลือด่วน',
      sub: 'น้ำท่วมสูงมาก ต้องการเรือ/อพยพ',
      color: 'text-red-700',
      border: 'border-red-400',
      bg: 'bg-red-500',
    },
    {
      level: 'orange',
      title: 'รถเล็กผ่านไม่ได้',
      sub: 'น้ำสูง 30-80 ซม. สัญจรลำบาก',
      color: 'text-orange-700',
      border: 'border-orange-400',
      bg: 'bg-orange-500',
    },
    {
      level: 'yellow',
      title: 'รถเล็กผ่านได้',
      sub: 'น้ำท่วมขังผิวถนน 10-25 ซม.',
      color: 'text-amber-700',
      border: 'border-amber-400',
      bg: 'bg-amber-400',
    },
    {
      level: 'green',
      title: 'เฝ้าระวัง / น้ำแห้งแล้ว',
      sub: 'ระดับน้ำปกติ สัญจรได้สะดวก',
      color: 'text-emerald-700',
      border: 'border-emerald-400',
      bg: 'bg-emerald-500',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-xl max-h-[92vh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">แจ้งสถานการณ์น้ำท่วม</h2>
              <p className="text-xs text-slate-500">ข้อมูลชุมชนเพื่อช่วยเหลือชาวปราจีนบุรี</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4 text-sm flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center gap-2 text-xs">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Location Details */}
          <div className="space-y-2">
            <label className="block font-semibold text-slate-800 text-xs tracking-wide">
              1. สถานที่และพิกัด <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">อำเภอ</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {PRACHINBURI_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.name_th}>
                      {d.name_th}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-1">ตำบล</label>
                <select
                  value={subdistrict}
                  onChange={(e) => setSubdistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {subdistrictsList.map((sub) => (
                    <option key={sub} value={sub}>
                      ตำบล{sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-2">
              <input
                type="text"
                required
                placeholder="ชื่อจุดเกิดเหตุ เช่น ชุมชนตลาดเก่ากบินทร์, ถนน 304 แยกพระพรหม"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            {/* GPS coordinates with Auto-locate button */}
            <div className="flex items-center justify-between p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs">
              <div className="flex items-center gap-1.5 text-blue-900 font-mono">
                <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span>
                  {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={isFetchingGps}
                className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-700 rounded-lg border border-blue-200 font-medium text-[11px] transition-all"
              >
                {isFetchingGps ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Navigation className="w-3 h-3 text-blue-600" />
                )}
                <span>ดึงพิกัด GPS ฉัน</span>
              </button>
            </div>
          </div>

          {/* 2. Severity Selection */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-800 text-xs tracking-wide">
              2. ระดับความรุนแรง <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {severityConfigs.map((cfg) => {
                const isSelected = severity === cfg.level;
                return (
                  <button
                    key={cfg.level}
                    type="button"
                    onClick={() => setSeverity(cfg.level)}
                    className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? `bg-white shadow-md ring-2 ring-blue-600 ${cfg.border}`
                        : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-3 h-3 rounded-full ${cfg.bg}`} />
                        <span className={`font-semibold text-xs ${cfg.color}`}>{cfg.title}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug">{cfg.sub}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Water Depth Preset */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-800 text-xs tracking-wide">
              3. ประมาณการระดับความลึกของน้ำ
            </label>
            <select
              value={waterDepthCode}
              onChange={(e) => setWaterDepthCode(e.target.value as WaterDepth)}
              className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {WATER_DEPTH_PRESETS.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Passability for small vehicles */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-800 text-xs tracking-wide">
              4. สภาพการสัญจร
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPassableForVehicles(false)}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  !passableForVehicles
                    ? 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-400 font-semibold'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>รถเล็กผ่านไม่ได้</span>
              </button>

              <button
                type="button"
                onClick={() => setPassableForVehicles(true)}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  passableForVehicles
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-400 font-semibold'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <Car className="w-4 h-4 text-emerald-500" />
                <span>รถเล็กผ่านได้</span>
              </button>
            </div>
          </div>

          {/* 5. Photo Upload with Compression */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-800 text-xs tracking-wide flex items-center gap-1.5">
                <span>5. แนบรูปถ่ายหน้างานจริง</span>
                <span className="text-red-500 font-bold">*จำเป็น</span>
              </label>
              <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                🛡️ ป้องกันข้อมูลเท็จ
              </span>
            </div>

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group">
                {/* Preview Image */}
                <img
                  src={imagePreview}
                  alt="ตัวอย่างรูปภาพ"
                  className="w-full h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {compressionStats && (
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/75 backdrop-blur-sm rounded-lg text-[11px] text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      ลดขนาดจาก {formatFileSize(compressionStats.originalSize)} เหลือ{' '}
                      <strong className="text-emerald-300">
                        {formatFileSize(compressionStats.compressedSize)}
                      </strong>
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/30"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {isCompressing ? (
                  <div className="flex flex-col items-center gap-2 text-blue-600">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-xs font-medium">กำลังบีบอัดรูปภาพหน้างาน...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-slate-500">
                    <Camera className="w-6 h-6 text-slate-400" />
                    <span className="text-xs font-medium text-slate-700">
                      แตะเพื่อถ่ายภาพ หรือเลือกรูปจากคลัง
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ระบบจะย่อรูปให้เล็กลงอัตโนมัติ เพื่อส่งได้แม้อยู่ในจุดสัญญาณอ่อน
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 6. Short Description */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-800 text-xs tracking-wide">
              6. รายละเอียดเพิ่มเติม / ข้อความเตือนภัย
            </label>
            <textarea
              rows={2}
              placeholder="เช่น มีน้ำไหลเชี่ยว, มีผู้ป่วยติดเตียงต้องการเรือ, เสาไฟหักขวางทาง ฯลฯ"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
            />
          </div>

          {/* 7. Reporter Type & Name */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">ผู้รายงาน:</span>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="reporterType"
                    checked={reporterType === 'citizen'}
                    onChange={() => setReporterType('citizen')}
                    className="text-blue-600"
                  />
                  <span>ประชาชน</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="reporterType"
                    checked={reporterType === 'official'}
                    onChange={() => setReporterType('official')}
                    className="text-blue-600"
                  />
                  <span>เจ้าหน้าที่ / กู้ภัย</span>
                </label>
              </div>
            </div>
            <input
              type="text"
              placeholder="ชื่อผู้รายงาน หรือหน่วยงาน (ไม่บังคับ)"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs placeholder-slate-400 outline-none"
            />
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-semibold transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || isCompressing}
            className="flex-[2] py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>กำลังส่งรายงาน...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>ยืนยันและส่งรายงาน</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
