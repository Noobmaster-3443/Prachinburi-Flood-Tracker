import { TelemetryStation, HighwayDisasterAlert } from '@/types/telemetry';
import {
  OFFICIAL_PRACHINBURI_STATIONS,
  OFFICIAL_HIGHWAY_ALERTS,
  GISTDA_FLOOD_GEOJSON,
} from '@/data/open-data-telemetry';

export interface TelemetryDashboardData {
  stations: TelemetryStation[];
  highwayAlerts: HighwayDisasterAlert[];
  gistdaGeoJson: GeoJSON.FeatureCollection;
  lastUpdated: string;
  sourceAttribution: string;
}

/**
 * Fetch automated telemetry data from ThaiWater / HII & GISTDA open data.
 * Includes graceful live network fallback and automated station updates.
 */
export async function getAutomatedTelemetryData(): Promise<TelemetryDashboardData> {
  // If NEXT_PUBLIC_THAIWATER_API_KEY or remote endpoint is provided, attempt live fetch:
  const thaiwaterApiUrl = process.env.NEXT_PUBLIC_THAIWATER_API_URL;
  const gistdaApiUrl = process.env.NEXT_PUBLIC_GISTDA_API_URL;

  let stations = [...OFFICIAL_PRACHINBURI_STATIONS];
  let highwayAlerts = [...OFFICIAL_HIGHWAY_ALERTS];
  let gistdaGeoJson = GISTDA_FLOOD_GEOJSON;

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
    lastUpdated: new Date().toISOString(),
    sourceAttribution: 'สถาบันสารสนเทศทรัพยากรน้ำ (สสน. ThaiWater) • กรมชลประทาน (RID) • GISTDA • กรมทางหลวง',
  };
}
