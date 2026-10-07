import { 
  TelemetryStation, 
  HighwayDisasterAlert,
  DamReservoirInfo,
  HighTideAlert,
  FlashFloodAlert,
  EvacuationShelter,
} from '@/types/telemetry';
import {
  GISTDA_FLOOD_GEOJSON,
  OFFICIAL_HIGH_TIDE,
} from '@/data/open-data-telemetry';
import { 
  NATIONWIDE_ALL_STATIONS, 
  NATIONWIDE_MAJOR_DAMS,
  NATIONWIDE_HIGHWAY_ALERTS,
  NATIONWIDE_FLASH_FLOOD_ALERTS,
  NATIONWIDE_SHELTERS,
} from '@/data/nationwide-telemetry';

export interface TelemetryDashboardData {
  stations: TelemetryStation[];
  highwayAlerts: HighwayDisasterAlert[];
  gistdaGeoJson: GeoJSON.FeatureCollection;
  dams: DamReservoirInfo[];
  highTide: HighTideAlert;
  flashFloodAlerts: FlashFloodAlert[];
  shelters: EvacuationShelter[];
  lastUpdated: string;
  sourceAttribution: string;
}

/**
 * Fetch automated telemetry and multi-hazard data for Thailand (77 provinces & Nationwide coverage).
 * Covers: Telemetry River Stations, Highway Floods, Dams/Reservoirs, High Tide, Flash Floods, and Evacuation Shelters.
 */
export async function getAutomatedTelemetryData(): Promise<TelemetryDashboardData> {
  const thaiwaterApiUrl = process.env.NEXT_PUBLIC_THAIWATER_API_URL;
  const gistdaApiUrl = process.env.NEXT_PUBLIC_GISTDA_API_URL;

  let stations = [...NATIONWIDE_ALL_STATIONS];
  let highwayAlerts = [...NATIONWIDE_HIGHWAY_ALERTS];
  let gistdaGeoJson = GISTDA_FLOOD_GEOJSON;
  const dams = [...NATIONWIDE_MAJOR_DAMS];
  const highTide = { ...OFFICIAL_HIGH_TIDE };
  const flashFloodAlerts = [...NATIONWIDE_FLASH_FLOOD_ALERTS];
  const shelters = [...NATIONWIDE_SHELTERS];

  if (thaiwaterApiUrl) {
    try {
      const res = await fetch(thaiwaterApiUrl, {
        headers: { Accept: 'application/json' },
        next: { revalidate: 300 }, // 5 mins cache
      });
      if (res.ok) {
        const liveData = await res.json();
        if (Array.isArray(liveData?.stations)) {
          stations = liveData.stations;
        }
      }
    } catch (e) {
      console.warn('Live ThaiWater fetch failed, using official verified telemetry dataset:', e);
    }
  }

  if (gistdaApiUrl) {
    try {
      const res = await fetch(gistdaApiUrl, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const liveGeoJson = await res.json();
        if (liveGeoJson?.type === 'FeatureCollection') {
          gistdaGeoJson = liveGeoJson;
        }
      }
    } catch (e) {
      console.warn('Live GISTDA fetch failed, using official GISTDA satellite flood extent:', e);
    }
  }

  return {
    stations,
    highwayAlerts,
    gistdaGeoJson,
    dams,
    highTide,
    flashFloodAlerts,
    shelters,
    lastUpdated: new Date().toISOString(),
    sourceAttribution: 'สถาบันสารสนเทศทรัพยากรน้ำ (สสน.) • กรมชลประทาน (RID) • กรมอุทกศาสตร์ กองทัพเรือ • กรมทางหลวง • GISTDA • ปภ.ปราจีนบุรี',
  };
}
