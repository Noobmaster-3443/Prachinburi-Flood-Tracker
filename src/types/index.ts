export type SeverityLevel = 'green' | 'yellow' | 'orange' | 'red';

export type WaterDepth = 
  | 'ankle'     // ~10-20 cm (ข้อเท้า)
  | 'shin'      // ~20-35 cm (หน้าแข้ง)
  | 'knee'      // ~40-60 cm (หัวเข่า)
  | 'waist'     // ~80-100 cm (เอว)
  | 'chest'     // ~120-140 cm (อก)
  | 'submerged' // >150 cm (มิดหลังคารถ/ท่วมบ้าน)
  | 'dry';      // น้ำแห้งแล้ว

export interface FloodReport {
  id: string;
  created_at: string;
  updated_at?: string;
  latitude: number;
  longitude: number;
  district: string;       // อำเภอ
  subdistrict: string;    // ตำบล
  location_name: string;  // สถานที่ / จุดสังเกต (เช่น ชุมชนตลาดเก่ากบินทร์บุรี)
  severity: SeverityLevel;
  water_depth_label: string; // e.g. "ระดับหัวเข่า (ประมาณ 40-50 ซม.)"
  water_depth_code?: WaterDepth;
  description?: string;
  image_url?: string;
  passable_for_vehicles: boolean; // รถเล็กผ่านได้หรือไม่
  passable_trucks_only?: boolean; // เฉพาะรถยกสูง / รถบรรทุก
  is_verified: boolean;   // ผ่านการตรวจสอบโดย จนท. / ปภ.
  reporter_type: 'citizen' | 'official' | 'foundation';
  reporter_name?: string;
  upvotes?: number;
}

export interface DistrictInfo {
  id: string;
  name_th: string;
  name_en: string;
  lat: number;
  lng: number;
  zoom: number;
  subdistricts: string[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  description: string;
  phone: string;
  district?: string;
  category: 'rescue' | 'hospital' | 'government' | 'dam_water';
  is_24h: boolean;
  is_approved: boolean; // true = approved and visible to public, false = pending admin approval
  is_official?: boolean; // true for 1784 & 1669
  submitted_by?: string;
  created_at?: string;
}

export interface FilterState {
  district: string; // 'all' or district name
  severity: SeverityLevel | 'all';
  onlyPassable: boolean | null; // true, false, or null (all)
  searchQuery: string;
  onlyVerified: boolean;
}
