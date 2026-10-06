export type SeverityLevel = 'green' | 'yellow' | 'orange' | 'red';

export type StationType = 'water_level' | 'rain_telemetry' | 'dam' | 'highway_flood';

export interface TelemetryStation {
  id: string;
  station_code: string;
  name_th: string;
  name_en?: string;
  basin_name?: string;
  river_name?: string;
  district: string;
  subdistrict: string;
  latitude: number;
  longitude: number;
  station_type: StationType;
  
  // Water Level Metrics
  water_level_m_msl?: number;      // ระดับน้ำ ม.(รทก.)
  bank_level_m_msl?: number;       // ระดับตลิ่ง ม.(รทก.)
  ground_level_m_msl?: number;     // ระดับดินเดิม
  capacity_percentage?: number;    // % ความจุลำน้ำ
  diff_from_bank?: number;         // ต่ำกว่าหรือสูงกว่าตลิ่ง (เมตร)
  
  // Rain Metrics (mm)
  rain_24h_mm?: number;
  rain_today_mm?: number;

  // Road / Highway info (if station_type === 'highway_flood')
  route_number?: string;           // เช่น ทางหลวงหมายเลข 304, 33
  km_point?: string;               // กม.ที่ 124+200
  passable_for_vehicles?: boolean;
  water_depth_cm?: number;

  severity: SeverityLevel;
  severity_label: string;
  status_text: string;
  observed_at: string;
  source_agency: 'HII' | 'RID' | 'TMD' | 'DOH' | 'GISTDA';
  source_name_th: string;
  source_url?: string;
}

export interface GistdaFloodZone {
  id: string;
  province: string;
  district: string;
  subdistrict?: string;
  area_sqkm: number;
  area_rai: number;
  observed_date: string;
  satellite_source: string;
  severity: SeverityLevel;
  source_name_th: string;
}

export interface HighwayDisasterAlert {
  id: string;
  route_number: string;
  road_name: string;
  district: string;
  km_range: string;
  water_height_cm: number;
  passable: boolean;
  passable_status: 'passable' | 'truck_only' | 'impassable';
  detour_info?: string;
  latitude: number;
  longitude: number;
  updated_at: string;
  source_name_th: string;
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
  is_approved: boolean;
  is_official?: boolean;
  submitted_by?: string;
  created_at?: string;
}

export interface DashboardFilterState {
  district: string;
  stationType: 'all' | 'water_level' | 'rain_telemetry' | 'highway_flood';
  severity: SeverityLevel | 'all';
  searchQuery: string;
}
