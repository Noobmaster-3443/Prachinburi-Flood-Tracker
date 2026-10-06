'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Loader2 } from 'lucide-react';
import { TelemetryStation, HighwayDisasterAlert } from '@/types/telemetry';

interface DynamicTelemetryMapProps {
  stations: TelemetryStation[];
  highwayAlerts: HighwayDisasterAlert[];
  gistdaGeoJson: GeoJSON.FeatureCollection | null;
  selectedStation: TelemetryStation | null;
  selectedHighwayAlert: HighwayDisasterAlert | null;
  onSelectStation: (station: TelemetryStation | null) => void;
  onSelectHighwayAlert: (alert: HighwayDisasterAlert | null) => void;
  selectedDistrict: string;
}

const TelemetryMap = dynamic(
  () => import('./TelemetryMap').then((mod) => mod.TelemetryMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[500px] bg-slate-100 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium">กำลังโหลดแผนที่โทรมาตรและข้อมูลดาวเทียม Open Data...</p>
      </div>
    ),
  }
);

export const DynamicTelemetryMap: React.FC<DynamicTelemetryMapProps> = (props) => {
  return <TelemetryMap {...props} />;
};
