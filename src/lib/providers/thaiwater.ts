/**
 * ThaiWater (HII) Official Telemetry Provider
 * Sourced directly from Hydro-Informatics Institute (HII / สสน.) Open Data APIs.
 * Covers official real-time water level and rainfall telemetry across all 77 provinces.
 */

import { TelemetryStation, SeverityLevel } from '@/types/telemetry';
import { DataResult, DataStatus } from './types';
import { findProvinceByCode, findProvinceByName, findClosestProvince } from '@/data/thailand-provinces';

const THAIWATER_WATERLEVEL_URL = 'https://api-v3.thaiwater.net/api/v1/thaiwater30/public/waterlevel_load';
const THAIWATER_RAIN_URL = 'https://api-v3.thaiwater.net/api/v1/thaiwater30/public/rain_24h';

function determineSeverity(level?: number, diffText?: string, storagePercent?: number): { severity: SeverityLevel; label: string } {
  if (diffText && diffText.includes('ล้นตลิ่ง')) {
    return { severity: 'red', label: 'วิกฤต (ล้นตลิ่ง)' };
  }
  if (level === 5 || level === 4 || (storagePercent && storagePercent >= 100)) {
    return { severity: 'red', label: 'วิกฤต (ล้นตลิ่ง)' };
  }
  if (level === 3 || (storagePercent && storagePercent >= 90)) {
    return { severity: 'orange', label: 'เตือนภัย (จ่อล้นตลิ่ง)' };
  }
  if (level === 2 || (storagePercent && storagePercent >= 80)) {
    return { severity: 'yellow', label: 'เฝ้าระวัง' };
  }
  return { severity: 'green', label: 'ระดับน้ำปกติ' };
}

function determineRainSeverity(rain24h?: number): { severity: SeverityLevel; label: string } {
  if (!rain24h || rain24h < 10) return { severity: 'green', label: 'ฝนเล็กน้อย/ปกติ' };
  if (rain24h >= 90) return { severity: 'red', label: 'วิกฤต (ฝนตกหนักมาก >90 มม.)' };
  if (rain24h >= 50) return { severity: 'orange', label: 'เตือนภัย (ฝนตกหนัก >50 มม.)' };
  if (rain24h >= 25) return { severity: 'yellow', label: 'เฝ้าระวัง (ฝนปานกลาง)' };
  return { severity: 'green', label: 'ระดับน้ำปกติ' };
}

/**
 * Fetch official verified water level telemetry stations from ThaiWater API
 */
export async function fetchThaiWaterWaterLevels(timeoutMs: number = 8000): Promise<DataResult<TelemetryStation[]>> {
  const fetchedAt = new Date().toISOString();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(THAIWATER_WATERLEVEL_URL, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PrachinburiFloodTracker/1.0',
        Accept: 'application/json',
      },
      next: { revalidate: 300 }, // 5 min cache
    });

    clearTimeout(timer);

    if (!res.ok) {
      return {
        data: null,
        source: 'ThaiWater (HII) Water Level',
        sourceAgency: 'HII',
        status: 'UNAVAILABLE',
        fetchedAt,
        observedAt: null,
        error: `HTTP ${res.status}: ${res.statusText}`,
      };
    }

    const json = await res.json();
    const rawStations: any[] = json?.waterlevel_data?.data || [];

    if (!Array.isArray(rawStations) || rawStations.length === 0) {
      return {
        data: null,
        source: 'ThaiWater (HII) Water Level',
        sourceAgency: 'HII',
        status: 'UNAVAILABLE',
        fetchedAt,
        observedAt: null,
        error: 'Empty response array from ThaiWater API',
      };
    }

    let latestObservedAt: string | null = null;

    const normalizedStations: TelemetryStation[] = rawStations
      .filter((item) => {
        const lat = Number(item?.station?.tele_station_lat);
        const lng = Number(item?.station?.tele_station_long);
        return !isNaN(lat) && !isNaN(lng) && lat > 5 && lat < 21 && lng > 97 && lng < 106;
      })
      .map((item) => {
        const lat = Number(item.station.tele_station_lat);
        const lng = Number(item.station.tele_station_long);
        
        // Match province by official DOPA code or name, fallback to GPS nearest
        const provByCode = findProvinceByCode(item.geocode?.province_code);
        const provByName = findProvinceByName(item.geocode?.province_name?.th);
        const matchedProv = provByCode || provByName || findClosestProvince(lat, lng);
        const provinceId = matchedProv.id;

        const waterLevelMsl = item.waterlevel_msl !== null && item.waterlevel_msl !== undefined 
          ? Number(item.waterlevel_msl) 
          : undefined;
        
        const storagePercent = item.storage_percent !== null && item.storage_percent !== undefined
          ? Number(item.storage_percent)
          : undefined;

        const diffFromBank = item.diff_wl_bank !== null && item.diff_wl_bank !== undefined
          ? Number(item.diff_wl_bank)
          : undefined;

        const { severity, label } = determineSeverity(
          item.situation_level,
          item.diff_wl_bank_text,
          storagePercent
        );

        const observedAt = item.waterlevel_datetime || fetchedAt;
        if (!latestObservedAt || observedAt > latestObservedAt) {
          latestObservedAt = observedAt;
        }

        const agencyName = item.agency?.agency_name?.th || 'กรมชลประทาน / สสน.';
        const agencyCode = item.agency?.agency_shortname?.en || item.agency?.agency_shortname?.th || 'HII';

        let statusText = `ระดับน้ำ ${waterLevelMsl !== undefined ? `${waterLevelMsl.toFixed(2)} ม.รทก.` : 'ปกติ'}`;
        if (item.diff_wl_bank_text && diffFromBank !== undefined) {
          statusText += ` (${item.diff_wl_bank_text} ${Math.abs(diffFromBank).toFixed(2)} ม.)`;
        }
        if (storagePercent !== undefined) {
          statusText += ` ความจุลำน้ำ ${storagePercent.toFixed(0)}%`;
        }

        return {
          id: `tw-wl-${item.station?.id || item.id}`,
          station_code: item.station?.tele_station_oldcode || String(item.station?.id || item.id),
          name_th: item.station?.tele_station_name?.th || `สถานีวัดน้ำท่า ${matchedProv.name_th}`,
          name_en: item.station?.tele_station_name?.en || item.station?.tele_station_name?.th,
          basin_name: item.basin?.basin_name?.th || 'ลุ่มน้ำหลัก',
          river_name: item.basin?.basin_name?.th || '',
          province: provinceId,
          district: item.geocode?.amphoe_name?.th || 'เมือง',
          subdistrict: item.geocode?.tumbon_name?.th || '',
          latitude: lat,
          longitude: lng,
          station_type: 'water_level',
          water_level_m_msl: waterLevelMsl,
          bank_level_m_msl: Number(item.station?.min_bank || item.station?.left_bank) || undefined,
          ground_level_m_msl: Number(item.station?.ground_level) || undefined,
          capacity_percentage: storagePercent,
          diff_from_bank: diffFromBank,
          severity,
          severity_label: label,
          status_text: statusText,
          observed_at: observedAt,
          fetched_at: fetchedAt,
          data_status: 'LIVE' as DataStatus,
          source_agency: agencyCode,
          source_name_th: agencyName,
          source_url: 'https://www.thaiwater.net',
        };
      });

    return {
      data: normalizedStations,
      source: 'ThaiWater (HII) Water Level Telemetry',
      sourceAgency: 'HII',
      status: 'LIVE',
      fetchedAt,
      observedAt: latestObservedAt,
    };
  } catch (err: any) {
    clearTimeout(timer);
    return {
      data: null,
      source: 'ThaiWater (HII) Water Level',
      sourceAgency: 'HII',
      status: 'UNAVAILABLE',
      fetchedAt,
      observedAt: null,
      error: err?.message || 'Network exception connecting to ThaiWater API',
    };
  }
}

/**
 * Fetch official verified 24h rainfall telemetry stations from ThaiWater API
 */
export async function fetchThaiWaterRainfall(timeoutMs: number = 8000): Promise<DataResult<TelemetryStation[]>> {
  const fetchedAt = new Date().toISOString();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(THAIWATER_RAIN_URL, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PrachinburiFloodTracker/1.0',
        Accept: 'application/json',
      },
      next: { revalidate: 300 },
    });

    clearTimeout(timer);

    if (!res.ok) {
      return {
        data: null,
        source: 'ThaiWater (HII) Rainfall',
        sourceAgency: 'HII',
        status: 'UNAVAILABLE',
        fetchedAt,
        observedAt: null,
        error: `HTTP ${res.status}: ${res.statusText}`,
      };
    }

    const json = await res.json();
    const rawStations: any[] = json?.data || [];

    if (!Array.isArray(rawStations) || rawStations.length === 0) {
      return {
        data: null,
        source: 'ThaiWater (HII) Rainfall',
        sourceAgency: 'HII',
        status: 'UNAVAILABLE',
        fetchedAt,
        observedAt: null,
        error: 'Empty response array from ThaiWater rainfall API',
      };
    }

    let latestObservedAt: string | null = null;

    const normalizedRainStations: TelemetryStation[] = rawStations
      .filter((item) => {
        const lat = Number(item?.station?.tele_station_lat);
        const lng = Number(item?.station?.tele_station_long);
        return !isNaN(lat) && !isNaN(lng) && lat > 5 && lat < 21 && lng > 97 && lng < 106;
      })
      .map((item) => {
        const lat = Number(item.station.tele_station_lat);
        const lng = Number(item.station.tele_station_long);

        const provByCode = findProvinceByCode(item.geocode?.province_code);
        const provByName = findProvinceByName(item.geocode?.province_name?.th);
        const matchedProv = provByCode || provByName || findClosestProvince(lat, lng);
        const provinceId = matchedProv.id;

        const rain24h = item.rain_24h !== null && item.rain_24h !== undefined ? Number(item.rain_24h) : 0;
        const { severity, label } = determineRainSeverity(rain24h);

        const observedAt = item.rainfall_datetime || fetchedAt;
        if (!latestObservedAt || observedAt > latestObservedAt) {
          latestObservedAt = observedAt;
        }

        const agencyName = item.agency?.agency_name?.th || 'กรมอุตุนิยมวิทยา / กรมทรัพยากรน้ำ';
        const agencyCode = item.agency?.agency_shortname?.en || item.agency?.agency_shortname?.th || 'DWR';

        return {
          id: `tw-rain-${item.station?.id || item.id}`,
          station_code: item.station?.tele_station_oldcode || String(item.station?.id || item.id),
          name_th: item.station?.tele_station_name?.th || `สถานีวัดน้ำฝน ${matchedProv.name_th}`,
          name_en: item.station?.tele_station_name?.en || item.station?.tele_station_name?.th,
          basin_name: item.basin?.basin_name?.th || '',
          province: provinceId,
          district: item.geocode?.amphoe_name?.th || 'เมือง',
          subdistrict: item.geocode?.tumbon_name?.th || '',
          latitude: lat,
          longitude: lng,
          station_type: 'rain_telemetry',
          rain_24h_mm: rain24h,
          severity,
          severity_label: label,
          status_text: `ฝนสะสม 24 ชม. ${rain24h.toFixed(1)} มม.`,
          observed_at: observedAt,
          fetched_at: fetchedAt,
          data_status: 'LIVE' as DataStatus,
          source_agency: agencyCode,
          source_name_th: agencyName,
          source_url: 'https://www.thaiwater.net',
        };
      });

    return {
      data: normalizedRainStations,
      source: 'ThaiWater (HII) 24h Rainfall Telemetry',
      sourceAgency: 'HII',
      status: 'LIVE',
      fetchedAt,
      observedAt: latestObservedAt,
    };
  } catch (err: any) {
    clearTimeout(timer);
    return {
      data: null,
      source: 'ThaiWater (HII) Rainfall',
      sourceAgency: 'HII',
      status: 'UNAVAILABLE',
      fetchedAt,
      observedAt: null,
      error: err?.message || 'Network exception connecting to ThaiWater API',
    };
  }
}
