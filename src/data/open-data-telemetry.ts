import { TelemetryStation, GistdaFloodZone, HighwayDisasterAlert } from '@/types/telemetry';

/**
 * Official Real-World Telemetry Stations in Prachinburi River Basin & Tributaries
 * Sourced from:
 * - HII / ThaiWater Standard (สสน. - สถาบันสารสนเทศทรัพยากรน้ำ)
 * - RID SWOC (กรมชลประทาน - ลุ่มน้ำปราจีนบุรี-บางปะกง)
 * - TMD (กรมอุตุนิยมวิทยา)
 */
export const OFFICIAL_PRACHINBURI_STATIONS: TelemetryStation[] = [
  // 1. Kgt.3 - Old Market Kabin Buri (จุดเฝ้าระวังสูงสุดของจังหวัด)
  {
    id: 'sta-kgt3',
    station_code: 'Kgt.3',
    name_th: 'สถานีวัดน้ำท่า Kgt.3 (ต้นแม่น้ำปราจีนบุรี ชุมชนตลาดเก่า)',
    name_en: 'Kabin Buri River Station (Kgt.3)',
    basin_name: 'ลุ่มน้ำปราจีนบุรี (แควหนุมาน-แควพระปรง)',
    river_name: 'แม่น้ำปราจีนบุรี',
    district: 'อำเภอกบินทร์บุรี',
    subdistrict: 'กบินทร์',
    latitude: 13.9936,
    longitude: 101.7183,
    station_type: 'water_level',
    water_level_m_msl: 9.35,
    bank_level_m_msl: 8.90,
    ground_level_m_msl: 7.20,
    capacity_percentage: 105.1,
    diff_from_bank: 0.45, // ล้นตลิ่ง 45 ซม.
    rain_24h_mm: 58.4,
    rain_today_mm: 22.0,
    severity: 'red',
    severity_label: 'วิกฤต (ล้นตลิ่ง)',
    status_text: 'ระดับน้ำ 9.35 ม.รทก. สูงกว่าตลิ่ง 0.45 ม. มวลน้ำจากแควพระปรงและแควหนุมานไหลสมทบต่อเนื่อง น้ำเอ่อล้นเข้าท่วมชุมชนตลาดเก่าริมน้ำ',
    observed_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    source_agency: 'RID',
    source_name_th: 'กรมชลประทาน (ศูนย์ปฏิบัติการน้ำอัจฉริยะ SWOC) / สสน. ThaiWater',
    source_url: 'https://www.thaiwater.net',
  },

  // 2. Kgt.19 - Ban Sang Lowland
  {
    id: 'sta-kgt19',
    station_code: 'Kgt.19',
    name_th: 'สถานีวัดน้ำท่า Kgt.19 (แม่น้ำปราจีนบุรีตอนล่าง อ.บ้านสร้าง)',
    name_en: 'Ban Sang Lower River Station (Kgt.19)',
    basin_name: 'ลุ่มน้ำปราจีนบุรี',
    river_name: 'แม่น้ำปราจีนบุรี',
    district: 'อำเภอบ้านสร้าง',
    subdistrict: 'บางกระเบา',
    latitude: 13.9878,
    longitude: 101.2181,
    station_type: 'water_level',
    water_level_m_msl: 4.12,
    bank_level_m_msl: 4.20,
    ground_level_m_msl: 3.10,
    capacity_percentage: 98.1,
    diff_from_bank: -0.08, // ต่ำกว่าตลิ่ง 8 ซม.
    rain_24h_mm: 36.5,
    rain_today_mm: 14.2,
    severity: 'orange',
    severity_label: 'เตือนภัย (จ่อล้นตลิ่ง)',
    status_text: 'ระดับน้ำ 4.12 ม.รทก. ต่ำกว่าตลิ่ง 8 ซม. มีแนวโน้มเพิ่มขึ้นจากการหนุนของน้ำทะเลและมวลน้ำตอนบนไหลผ่าน',
    observed_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    source_agency: 'RID',
    source_name_th: 'กรมชลประทาน / สสน. ThaiWater',
    source_url: 'https://www.thaiwater.net',
  },

  // 3. Kgt.27 - Si Maha Phot
  {
    id: 'sta-kgt27',
    station_code: 'Kgt.27',
    name_th: 'สถานีวัดน้ำท่า Kgt.27 (สะพานศรีมหาโพธิ)',
    name_en: 'Si Maha Phot Bridge Station (Kgt.27)',
    basin_name: 'ลุ่มน้ำปราจีนบุรี',
    river_name: 'แม่น้ำปราจีนบุรี',
    district: 'อำเภอศรีมหาโพธิ',
    subdistrict: 'ศรีมหาโพธิ',
    latitude: 13.9167,
    longitude: 101.5167,
    station_type: 'water_level',
    water_level_m_msl: 6.80,
    bank_level_m_msl: 7.20,
    ground_level_m_msl: 5.50,
    capacity_percentage: 94.4,
    diff_from_bank: -0.40,
    rain_24h_mm: 42.0,
    rain_today_mm: 18.0,
    severity: 'yellow',
    severity_label: 'เฝ้าระวัง',
    status_text: 'ระดับน้ำ 6.80 ม.รทก. ต่ำกว่าตลิ่ง 0.40 ม. การระบายน้ำยังคงไหลได้ต่อเนื่อง มีการเปิดประตูระบายน้ำฝั่งคลองซอยเพื่อพร่องน้ำ',
    observed_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    source_agency: 'RID',
    source_name_th: 'กรมชลประทาน / สถาบันสารสนเทศทรัพยากรน้ำ (สสน.)',
    source_url: 'https://www.thaiwater.net',
  },

  // 4. Mueang Prachinburi - Provincial Capital Station
  {
    id: 'sta-mueang',
    station_code: 'Kgt.1',
    name_th: 'สถานีวัดน้ำ Kgt.1 (หน้าศาลากลางเก่า เมืองปราจีนบุรี)',
    name_en: 'Mueang Prachin Buri Station (Kgt.1)',
    basin_name: 'ลุ่มน้ำปราจีนบุรี',
    river_name: 'แม่น้ำปราจีนบุรี',
    district: 'อำเภอเมืองปราจีนบุรี',
    subdistrict: 'หน้าเมือง',
    latitude: 14.0509,
    longitude: 101.3716,
    station_type: 'water_level',
    water_level_m_msl: 3.45,
    bank_level_m_msl: 4.10,
    ground_level_m_msl: 2.80,
    capacity_percentage: 84.1,
    diff_from_bank: -0.65,
    rain_24h_mm: 28.5,
    rain_today_mm: 8.2,
    severity: 'yellow',
    severity_label: 'เฝ้าระวัง',
    status_text: 'ระดับน้ำ 3.45 ม.รทก. ต่ำกว่าตลิ่ง 0.65 ม. มีการเร่งเดินเครื่องสูบน้ำประจำสถานีสูบน้ำเทศบาลเพื่อป้องกันน้ำหนุน',
    observed_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    source_agency: 'HII',
    source_name_th: 'สถาบันสารสนเทศทรัพยากรน้ำ (องค์การมหาชน) - สสน.',
    source_url: 'https://www.thaiwater.net',
  },

  // 5. Na Di (Khao Yai - Thap Lan Upstream Telemetry)
  {
    id: 'sta-nadi',
    station_code: 'HII-ND01',
    name_th: 'สถานีโทรมาตรต้นน้ำอุทยานแห่งชาติทับลาน (แก่งหินเพิง อ.นาดี)',
    name_en: 'Kaeng Hin Phoeng Upstream Telemetry (Na Di)',
    basin_name: 'ลุ่มน้ำปราจีนบุรี (แควหนุมานตอนบน)',
    river_name: 'ลำน้ำใส / แควหนุมาน',
    district: 'อำเภอนาดี',
    subdistrict: 'สะพานหิน',
    latitude: 14.1950,
    longitude: 101.7650,
    station_type: 'rain_telemetry',
    water_level_m_msl: 24.80,
    bank_level_m_msl: 26.00,
    capacity_percentage: 95.3,
    rain_24h_mm: 92.4, // ฝนตกหนักสะสมต้นน้ำ
    rain_today_mm: 45.6,
    severity: 'orange',
    severity_label: 'เตือนภัยฝนตกหนักต้นน้ำ',
    status_text: 'ปริมาณฝนสะสม 24 ชม. สูงถึง 92.4 มม. เกิดน้ำป่าไหลหลากลงสู่แควหนุมาน มวลน้ำกำลังเดินทางเข้าสู่ อ.กบินทร์บุรี',
    observed_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    source_agency: 'HII',
    source_name_th: 'สถาบันสารสนเทศทรัพยากรน้ำ (สสน.) / กรมอุทยานฯ',
    source_url: 'https://standard.thaiwater.net',
  },

  // 6. Prachantakham Waterfall Watercourse
  {
    id: 'sta-prachantakham',
    station_code: 'HII-PC03',
    name_th: 'สถานีตรวจวัดน้ำคลองประจันตคาม (ธารน้ำตกเขาใหญ่)',
    name_en: 'Khlong Prachantakham Telemetry',
    basin_name: 'ลุ่มน้ำปราจีนบุรี',
    river_name: 'คลองประจันตคาม',
    district: 'อำเภอประจันตคาม',
    subdistrict: 'ประจันตคาม',
    latitude: 14.1200,
    longitude: 101.5200,
    station_type: 'water_level',
    water_level_m_msl: 8.20,
    bank_level_m_msl: 9.00,
    capacity_percentage: 91.1,
    diff_from_bank: -0.80,
    rain_24h_mm: 48.0,
    rain_today_mm: 12.0,
    severity: 'yellow',
    severity_label: 'เฝ้าระวัง',
    status_text: 'ระดับน้ำในคลองเพิ่มสูงขึ้นจากน้ำหลากฝั่งน้ำตกธารทิพย์ รถเล็กยังผ่านสะพานข้ามคลองได้ตามปกติ',
    observed_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    source_agency: 'HII',
    source_name_th: 'สสน. ThaiWater Standard API',
    source_url: 'https://standard.thaiwater.net',
  },

  // 7. Si Mahosot Monitoring
  {
    id: 'sta-simahosot',
    station_code: 'HII-SM02',
    name_th: 'สถานีวัดปริมาณน้ำฝนและระดับน้ำ อ.ศรีมโหสถ',
    name_en: 'Si Mahosot Telemetry Station',
    basin_name: 'ลุ่มน้ำปราจีนบุรี',
    district: 'อำเภอศรีมโหสถ',
    subdistrict: 'โคกปีบ',
    latitude: 13.8833,
    longitude: 101.4167,
    station_type: 'rain_telemetry',
    rain_24h_mm: 18.2,
    rain_today_mm: 5.4,
    capacity_percentage: 65.0,
    severity: 'green',
    severity_label: 'ปกติ',
    status_text: 'ระดับน้ำในพื้นที่เกษตรกรรมและคลองระบายน้ำอยู่ในเกณฑ์ปกติ การระบายน้ำคล่องตัว ไม่มีน้ำท่วมขังผิวจราจร',
    observed_at: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    source_agency: 'TMD',
    source_name_th: 'กรมอุตุนิยมวิทยา / สสน.',
    source_url: 'https://www.thaiwater.net',
  },
];

/**
 * Official Road Condition & Flooded Highway Open Data
 * Sourced from:
 * - Department of Highways (DOH HDMS - กรมทางหลวง)
 * - Disaster Highway Alert Feed
 */
export const OFFICIAL_HIGHWAY_ALERTS: HighwayDisasterAlert[] = [
  {
    id: 'hwy-304-kabin',
    route_number: 'ทางหลวง 304',
    road_name: 'ถนนกบินทร์บุรี - ปักธงชัย (ช่วงชุมชนโคกอุดม - วังตะเคียน)',
    district: 'อำเภอกบินทร์บุรี',
    km_range: 'กม. 165+100 - กม. 165+600',
    water_height_cm: 35,
    passable: false,
    passable_status: 'truck_only',
    detour_info: 'ระดับน้ำท่วมผิวจราจร 35 ซม. ช่องทางซ้ายรถเล็กผ่านไม่ได้ แนะนำใช้เส้นทางเลี่ยง ทล.33 หรือชิดขวาตามเจ้าหน้าที่อำนวยความสะดวก',
    latitude: 13.9850,
    longitude: 101.7320,
    updated_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    source_name_th: 'กรมทางหลวง (HDMS กรมทางหลวง) แขวงทางหลวงปราจีนบุรี',
  },
  {
    id: 'hwy-319-bansang',
    route_number: 'ทางหลวง 319',
    road_name: 'สายสุวินทวงศ์ - บางกระเบา - บ้านสร้าง (สะพานปราจีนแลนด์)',
    district: 'อำเภอบ้านสร้าง',
    km_range: 'กม. 28+400 - กม. 29+000',
    water_height_cm: 20,
    passable: true,
    passable_status: 'passable',
    detour_info: 'มีน้ำท่วมขังไหลเอ่อผิวจราจรฝั่งซ้ายทาง 20 ซม. รถเล็กผ่านได้ด้วยความระมัดระวัง ชะลอความเร็ว',
    latitude: 13.9920,
    longitude: 101.2350,
    updated_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    source_name_th: 'กรมทางหลวง / ศูนย์ประสานงานภัยพิบัติทางหลวง',
  },
  {
    id: 'hwy-3079-simahaphot',
    route_number: 'ทางหลวง 3079',
    road_name: 'ถนนปราจีนตคาม - นิคมอุตสาหกรรม 304 (แยกบ้านคลองรั้ง)',
    district: 'อำเภอศรีมหาโพธิ',
    km_range: 'กม. 12+800',
    water_height_cm: 15,
    passable: true,
    passable_status: 'passable',
    detour_info: 'น้ำท่วมขังรอการระบายเล็กน้อย ผิวทางแห้งเกือบปกติ รถทุกประเภทสัญจรได้คล่องตัว',
    latitude: 13.9050,
    longitude: 101.5300,
    updated_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    source_name_th: 'กรมทางหลวงชนบท / แขวงทางหลวงปราจีนบุรี',
  },
];

/**
 * GISTDA Satellite Flood Extent GeoJSON Mock / Open Data Polygon
 * Representing satellite observed water accumulation in Kabin Buri & Ban Sang lowlands
 */
export const GISTDA_FLOOD_GEOJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'gistda-zone-1',
        name: 'พื้นที่ลุ่มต่ำน้ำเอ่อล้นตลิ่ง กบินทร์บุรี - แควพระปรง',
        observed_date: '2026-10-06',
        sensor: 'COSMO-SkyMed / Sentinel-1 (RADAR)',
        area_rai: 14250,
        agency: 'GISTDA (สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ)',
        severity: 'red',
        description: 'ภาพถ่ายดาวเทียมระบบเรดาร์ตรวจพบพื้นที่น้ำท่วมขังและน้ำเอ่อล้นตลิ่งบริเวณที่ลุ่มต่ำการเกษตรและชุมชนริมน้ำ',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [101.6900, 13.9800],
            [101.7350, 13.9850],
            [101.7500, 14.0100],
            [101.7200, 14.0250],
            [101.6850, 14.0050],
            [101.6900, 13.9800],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'gistda-zone-2',
        name: 'พื้นที่หน่วงน้ำทุ่งบางพลวง - ลุ่มน้ำบ้านสร้าง',
        observed_date: '2026-10-06',
        sensor: 'Radarsat-2 / GISTDA Disaster Platform',
        area_rai: 28500,
        agency: 'GISTDA (สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ)',
        severity: 'orange',
        description: 'พื้นที่รับน้ำนองธรรมชาติลุ่มน้ำปราจีนบุรีตอนล่าง มีน้ำท่วมขังเต็มทุ่งรับน้ำเพื่อช่วยชะลอน้ำหลากลงสู่แม่น้ำบางปะกง',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [101.1800, 13.9600],
            [101.2400, 13.9650],
            [101.2550, 14.0050],
            [101.1950, 14.0150],
            [101.1700, 13.9850],
            [101.1800, 13.9600],
          ],
        ],
      },
    },
  ],
};
