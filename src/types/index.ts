export * from './telemetry';

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
  severity: import('./telemetry').SeverityLevel;
  water_depth_label: string;
  water_depth_code?: WaterDepth;
  description?: string;
  image_url?: string;
  passable_for_vehicles: boolean;
  passable_trucks_only?: boolean;
  is_verified: boolean;
  reporter_type: 'citizen' | 'official' | 'foundation';
  reporter_name?: string;
  upvotes?: number;
}

export interface FilterState {
  district: string;
  severity: import('./telemetry').SeverityLevel | 'all';
  onlyPassable: boolean | null;
  searchQuery: string;
  onlyVerified: boolean;
}
