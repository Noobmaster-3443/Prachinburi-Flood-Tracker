'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  PhoneCall,
  Copy,
  Check,
  ShieldAlert,
  HeartPulse,
  Plus,
  Loader2,
  CheckCircle2,
  Clock,
  MapPin,
  LifeBuoy,
} from 'lucide-react';
import { EmergencyContact } from '@/types';
import { getEmergencyContacts, suggestEmergencyContact } from '@/lib/contacts-store';
import { PRACHINBURI_DISTRICTS } from '@/data/prachinburi-locations';

interface EmergencyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyDrawer: React.FC<EmergencyDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Add form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [district, setDistrict] = useState(PRACHINBURI_DISTRICTS[0].name_th);
  const [submittedBy, setSubmittedBy] = useState('');

  // Load contacts
  useEffect(() => {
    if (isOpen) {
      loadContacts();
    }
  }, [isOpen]);

  const loadContacts = async () => {
    const list = await getEmergencyContacts(false); // Only approved
    setContacts(list);
  };

  if (!isOpen) return null;

  const handleCopy = (id: string, phoneNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phoneNumber.replace(/[^0-9]/g, ''));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSuggest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('กรุณากรอกชื่อหน่วยงานและเบอร์โทรศัพท์');
      return;
    }

    setIsSubmitting(true);
    try {
      await suggestEmergencyContact({
        name: name.trim(),
        phone: phone.trim(),
        description: description.trim() || 'เบอร์ช่วยเหลือฉุกเฉินในพื้นที่',
        district,
        category: 'rescue',
        is_24h: true,
        submitted_by: submittedBy.trim() || 'ประชาชน',
      });

      setShowAddForm(false);
      setName('');
      setPhone('');
      setDescription('');
      setSubmittedBy('');
      setSuccessMsg('ส่งข้อมูลเบอร์โทรเรียบร้อยแล้ว! จะแสดงผลเมื่อได้รับการอนุมัติจากแอดมิน');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Separate official from community-approved
  const officialContacts = contacts.filter((c) => c.is_official);
  const communityApproved = contacts.filter((c) => !c.is_official);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-lg max-h-[90vh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-red-100 flex items-center justify-between bg-red-600 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">เบอร์โทรสายด่วนฉุกเฉิน</h2>
              <p className="text-xs text-red-100">บริการประชาชนตลอด 24 ชั่วโมง ฟรีทุกเครือข่าย</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Top 2 Primary Official Hotlines (1784 & 1669) */}
          <div className="space-y-3">
            {/* 1784 DDPM */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-red-500/30">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-2xl text-red-600 tracking-tight">1784</span>
                      <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        โทรฟรี 24 ชม.
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm mt-0.5">สายด่วน ปภ. รับแจ้งเหตุอุทกภัย</h3>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                แจ้งเตือนสาธารณภัย น้ำท่วมฉับพลัน ขอเรือท้องแบน และอพยพเร่งด่วน
              </p>
              <div className="mt-3 flex items-center gap-2">
                <a
                  href="tel:1784"
                  className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-red-600/20 transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>โทรออก 1784 ทันที</span>
                </a>
                <button
                  onClick={(e) => handleCopy('1784', '1784', e)}
                  className="w-9 h-9 rounded-xl bg-white border border-red-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-colors"
                  title="คัดลอกเบอร์"
                >
                  {copiedId === '1784' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 1669 EMS */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-500/30">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-2xl text-emerald-600 tracking-tight">1669</span>
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        โทรฟรี 24 ชม.
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm mt-0.5">การแพทย์ฉุกเฉิน (EMS)</h3>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                รับแจ้งเหตุเจ็บป่วยฉุกเฉิน อุบัติเหตุทางน้ำ และเรียกรถพยาบาลกู้ชีพ
              </p>
              <div className="mt-3 flex items-center gap-2">
                <a
                  href="tel:1669"
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>โทรออก 1669 ทันที</span>
                </a>
                <button
                  onClick={(e) => handleCopy('1669', '1669', e)}
                  className="w-9 h-9 rounded-xl bg-white border border-emerald-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-colors"
                  title="คัดลอกเบอร์"
                >
                  {copiedId === '1669' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Approved Community Emergency Contacts (if any approved) */}
          {communityApproved.length > 0 && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">
                เบอร์กู้ภัยและหน่วยช่วยเหลือในพื้นที่ (ผ่านการอนุมัติแล้ว):
              </span>
              <div className="space-y-2">
                {communityApproved.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 truncate">{contact.name}</span>
                        {contact.district && (
                          <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded font-medium">
                            {contact.district}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{contact.description}</p>
                      <p className="font-mono font-bold text-blue-600 mt-0.5 text-xs">{contact.phone}</p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={(e) => handleCopy(contact.id, contact.phone, e)}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center"
                      >
                        {copiedId === contact.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <a
                        href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3" /> โทร
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form to Suggest a New Phone Number */}
          <div className="pt-2 border-t border-slate-100">
            {!showAddForm ? (
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="w-full py-2.5 px-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/40 text-slate-700 hover:text-blue-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4 text-blue-600" />
                <span>+ เสนอเพิ่มเบอร์โทรฉุกเฉิน / หน่วยกู้ภัยประจำพื้นที่</span>
              </button>
            ) : (
              <form onSubmit={handleSuggest} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <LifeBuoy className="w-3.5 h-3.5 text-blue-600" />
                    <span>เสนอเพิ่มเบอร์โทรฉุกเฉิน (รอแอดมินอนุมัติ)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ยกเลิก
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block text-[11px] text-slate-600 font-medium mb-1">
                      ชื่อหน่วยงาน / จุดกู้ภัย / ผู้ติดต่อ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น กู้ภัยสว่างบำเพ็ญ จุดบ้านสร้าง, อบต.ท่าตูม"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-600 font-medium mb-1">
                        เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="เช่น 037-xxx-xxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-600 font-medium mb-1">
                        อำเภอในปราจีนบุรี
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                      >
                        {PRACHINBURI_DISTRICTS.map((d) => (
                          <option key={d.id} value={d.name_th}>
                            {d.name_th}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 font-medium mb-1">
                      รายละเอียดการช่วยเหลือ (ไม่บังคับ)
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น มีเรือท้องแบน 2 ลำ, บริการขนย้ายผู้สูงอายุ"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 font-medium mb-1">
                      ชื่อผู้ส่งข้อมูล (ไม่บังคับ)
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น ผู้ใหญ่บ้าน ม.3, จิตอาสา"
                      value={submittedBy}
                      onChange={(e) => setSubmittedBy(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs hover:bg-slate-100"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>ส่งข้อมูลเพื่อรอแอดมินอนุมัติ</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
          เบอร์โทรที่ประชาชนเสนอเข้ามาจะถูกตรวจสอบโดยแอดมินก่อนแสดงผล เพื่อความปลอดภัยและถูกต้อง
        </div>
      </div>
    </div>
  );
};
