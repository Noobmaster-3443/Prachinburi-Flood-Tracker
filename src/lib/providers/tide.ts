/**
 * Hydrographic Department / Royal Thai Navy (กรมอุทกศาสตร์ กองทัพเรือ) Provider
 * Tide and estuarine water level tables.
 * Preserves publication/observation date, marked STATIC for coastal provinces, UNAVAILABLE for inland provinces.
 */

import { HighTideAlert } from '@/types/telemetry';
import { DataResult, DataStatus } from './types';
import { OFFICIAL_HIGH_TIDE } from '@/data/open-data-telemetry';

const COASTAL_PROVINCES = new Set([
  'all', 'bangkok', 'samutprakan', 'samutsakhon', 'samutsongkhram',
  'chachoengsao', 'prachinburi', 'nonthaburi', 'pathumthani', 'chonburi',
  'rayong', 'chanthaburi', 'trat', 'phetchaburi', 'prachuapkhirikhan',
  'chumphon', 'suratthani', 'nakhonsithammarat', 'songkhla', 'pattani',
  'narathiwat', 'ranong', 'phangnga', 'phuket', 'krabi', 'trang', 'satun'
]);

export async function fetchNavyTide(provinceId: string = 'all'): Promise<DataResult<HighTideAlert>> {
  const fetchedAt = new Date().toISOString();

  // If inland province, water tide does not apply
  if (provinceId !== 'all' && !COASTAL_PROVINCES.has(provinceId)) {
    return {
      data: null,
      source: 'กรมอุทกศาสตร์ กองทัพเรือ (Hydrographic Department)',
      sourceAgency: 'Royal Thai Navy',
      status: 'UNAVAILABLE',
      fetchedAt,
      observedAt: null,
      error: 'จังหวัดนี้ไม่มีพื้นที่ติดชายฝั่งทะเลหรือปากแม่น้ำที่ได้รับผลกระทบจากน้ำทะเลหนุน',
    };
  }

  // Coastal / Estuarine tide data from Navy Hydrographic Department publication
  const tideData: HighTideAlert = {
    ...OFFICIAL_HIGH_TIDE,
    data_status: 'STATIC' as DataStatus,
  };

  return {
    data: tideData,
    source: 'กรมอุทกศาสตร์ กองทัพเรือ (ตารางน้ำขึ้น-น้ำลง ประจำสถานีปากแม่น้ำ)',
    sourceAgency: 'Royal Thai Navy',
    status: 'STATIC',
    fetchedAt,
    observedAt: '2026-10-08T06:00:00Z', // Actual publication observation date
  };
}
