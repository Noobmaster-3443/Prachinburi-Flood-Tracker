'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { TelemetryStation, HighwayDisasterAlert, SeverityLevel } from '@/types/telemetry';
import { PRACHINBURI_CENTER, PRACHINBURI_DISTRICTS } from '@/data/prachinburi-locations';
import prachinburiDistrictsGeoJson from '@/data/prachinburi-districts.json';
import { 
  Navigation, 
  Layers, 
  MapPin, 
  Grid, 
  Check, 
  Satellite, 
  Activity, 
  Waves, 
  CloudRain, 
  Car, 
  ShieldCheck, 
  Eye, 
  EyeOff 
} from 'lucide-react';

interface TelemetryMapProps {
  stations: TelemetryStation[];
  highwayAlerts: HighwayDisasterAlert[];
  gistdaGeoJson: GeoJSON.FeatureCollection | null;
  selectedStation: TelemetryStation | null;
  selectedHighwayAlert: HighwayDisasterAlert | null;
  onSelectStation: (station: TelemetryStation | null) => void;
  onSelectHighwayAlert: (alert: HighwayDisasterAlert | null) => void;
  selectedDistrict: string;
}

const severityColors: Record<SeverityLevel, { hex: string; border: string; label: string }> = {
  red: { hex: '#ef4444', border: '#b91c1c', label: 'วิกฤต/ล้นตลิ่ง' },
  orange: { hex: '#f97316', border: '#c2410c', label: 'เตือนภัย/เฝ้าระวังสูง' },
  yellow: { hex: '#eab308', border: '#a16207', label: 'เฝ้าระวัง' },
  green: { hex: '#10b981', border: '#047857', label: 'ระดับน้ำปกติ' },
};

export const TelemetryMap: React.FC<TelemetryMapProps> = ({
  stations,
  highwayAlerts,
  gistdaGeoJson,
  selectedStation,
  selectedHighwayAlert,
  onSelectStation,
  onSelectHighwayAlert,
  selectedDistrict,
}) => {
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');
  const [showBoundaries, setShowBoundaries] = useState<boolean>(true);
  const [showGistdaLayer, setShowGistdaLayer] = useState<boolean>(true);
  const [gistdaOpacity, setGistdaOpacity] = useState<number>(0.35);
  const [showRoadAlerts, setShowRoadAlerts] = useState<boolean>(true);
  const [isLayersOpen, setIsLayersOpen] = useState<boolean>(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null);
  const gistdaLayerRef = useRef<L.GeoJSON | null>(null);
  const labelsLayerRef = useRef<L.LayerGroup | null>(null);
  const stationsLayerRef = useRef<L.LayerGroup | null>(null);
  const highwaysLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [PRACHINBURI_CENTER.lat, PRACHINBURI_CENTER.lng],
      zoom: PRACHINBURI_CENTER.zoom,
      zoomControl: false,
      attributionControl: true,
    });

    const initialTile = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> | HII ThaiWater & GISTDA',
        subdomains: ['a', 'b', 'c'],
        maxZoom: 19,
      }
    ).addTo(map);

    tileLayerRef.current = initialTile;
    geojsonLayerRef.current = L.geoJSON().addTo(map);
    gistdaLayerRef.current = L.geoJSON().addTo(map);
    labelsLayerRef.current = L.layerGroup().addTo(map);
    stationsLayerRef.current = L.layerGroup().addTo(map);
    highwaysLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Switch Base Map Tile (OpenStreetMap vs Esri Satellite)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    if (mapType === 'satellite') {
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution:
            '&copy; <a href="https://www.esri.com" target="_blank">Esri</a>, Maxar, Earthstar Geographics',
          maxZoom: 19,
        }
      ).addTo(map);
    } else {
      tileLayerRef.current = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
          subdomains: ['a', 'b', 'c'],
          maxZoom: 19,
        }
      ).addTo(map);
    }
  }, [mapType]);

  // District Boundaries Layer
  useEffect(() => {
    if (!geojsonLayerRef.current || !labelsLayerRef.current || !mapInstanceRef.current) return;

    geojsonLayerRef.current.clearLayers();
    labelsLayerRef.current.clearLayers();

    if (!showBoundaries) return;

    if (prachinburiDistrictsGeoJson) {
      geojsonLayerRef.current.addData(prachinburiDistrictsGeoJson as any);
      geojsonLayerRef.current.setStyle((feature: any) => {
        const districtName = feature?.properties?.name || '';
        const isSelected = selectedDistrict !== 'all' && districtName.includes(selectedDistrict);

        return {
          color: isSelected ? '#2563eb' : '#0284c7',
          weight: isSelected ? 3 : 1.75,
          opacity: 0.85,
          fillColor: isSelected ? '#3b82f6' : '#0284c7',
          fillOpacity: isSelected ? 0.14 : 0.04,
          dashArray: isSelected ? undefined : '5, 5',
        };
      });

      // District center label badges
      PRACHINBURI_DISTRICTS.forEach((d) => {
        const labelHtml = `
          <div class="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[11px] font-bold text-slate-800 shadow-sm border border-slate-300 pointer-events-none whitespace-nowrap text-center">
            ${d.name_th.replace('อำเภอ', 'อ.')}
          </div>
        `;
        const icon = L.divIcon({
          className: 'custom-district-badge',
          html: labelHtml,
          iconSize: [80, 20],
          iconAnchor: [40, 10],
        });
        L.marker([d.lat, d.lng], { icon, interactive: false }).addTo(labelsLayerRef.current!);
      });
    }
  }, [showBoundaries, selectedDistrict]);

  // GISTDA Satellite Flood Extent Layer
  useEffect(() => {
    if (!gistdaLayerRef.current || !mapInstanceRef.current) return;

    gistdaLayerRef.current.clearLayers();

    if (!showGistdaLayer || !gistdaGeoJson) return;

    gistdaLayerRef.current.addData(gistdaGeoJson as any);
    gistdaLayerRef.current.setStyle((feature: any) => {
      const sev = feature?.properties?.severity || 'red';
      const color = sev === 'red' ? '#dc2626' : '#ea580c';

      return {
        color: color,
        weight: 2,
        opacity: 0.9,
        fillColor: color,
        fillOpacity: gistdaOpacity,
        dashArray: '3, 6',
      };
    });

    gistdaLayerRef.current.eachLayer((layer: any) => {
      const props = layer.feature?.properties;
      if (props) {
        layer.bindTooltip(
          `
          <div class="p-1.5 text-xs font-sans">
            <div class="font-bold text-blue-900 flex items-center gap-1">
              <span>🛰️ ${props.name}</span>
            </div>
            <div class="text-[11px] text-slate-600 mt-0.5">
              พื้นที่น้ำท่วมขัง: <b>${props.area_rai?.toLocaleString()} ไร่</b>
            </div>
            <div class="text-[10px] text-slate-500 mt-0.5">
              ดาวเทียม: ${props.sensor} (${props.observed_date})
            </div>
            <div class="text-[10px] text-emerald-700 font-semibold mt-1">
              ✓ ข้อมูลจาก: ${props.agency}
            </div>
          </div>
          `,
          { sticky: true, opacity: 0.95 }
        );
      }
    });
  }, [showGistdaLayer, gistdaGeoJson]);

  // Telemetry Stations Layer (HII / RID / TMD)
  useEffect(() => {
    if (!stationsLayerRef.current || !mapInstanceRef.current) return;

    stationsLayerRef.current.clearLayers();

    stations.forEach((station) => {
      const col = severityColors[station.severity] || severityColors.yellow;
      const isSelected = selectedStation?.id === station.id;

      const isWaterLevel = station.station_type === 'water_level';
      const iconEmoji = isWaterLevel ? '🌊' : '🌧️';

      // Pulse ring for critical / warning stations
      const hasPulse = station.severity === 'red' || station.severity === 'orange';
      const pulseHtml = hasPulse
        ? `<div class="absolute -inset-2 rounded-full animate-ping opacity-75" style="background-color: ${col.hex};"></div>`
        : '';

      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          ${pulseHtml}
          <div class="relative w-8 h-8 rounded-full border-2 shadow-lg flex items-center justify-center text-white font-bold text-xs transition-transform transform group-hover:scale-110 ${
            isSelected ? 'scale-125 ring-4 ring-blue-500 ring-offset-2' : ''
          }" style="background-color: ${col.hex}; border-color: ${col.border};">
            <span class="text-sm">${iconEmoji}</span>
          </div>
          <div class="absolute -bottom-5 whitespace-nowrap bg-white/95 px-1.5 py-0.5 rounded shadow-xs text-[10px] font-bold text-slate-800 border border-slate-200 pointer-events-none">
            ${station.station_code}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'telemetry-station-icon',
        html: markerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([station.latitude, station.longitude], {
        icon: customIcon,
      });

      marker.on('click', () => {
        onSelectStation(station);
        onSelectHighwayAlert(null);
      });

      marker.bindTooltip(
        `
        <div class="p-1.5 text-xs font-sans">
          <div class="font-bold text-slate-900">${station.name_th}</div>
          <div class="text-[11px] text-slate-600">สถานะ: <b style="color: ${col.hex}">${station.severity_label}</b></div>
          ${
            station.water_level_m_msl
              ? `<div class="text-[11px] text-slate-700">ระดับน้ำ: <b>${station.water_level_m_msl} ม.รทก.</b> (ตลิ่ง ${station.bank_level_m_msl} ม.)</div>`
              : ''
          }
          ${
            station.rain_24h_mm
              ? `<div class="text-[11px] text-slate-700">ฝน 24 ชม.: <b>${station.rain_24h_mm} มม.</b></div>`
              : ''
          }
          <div class="text-[10px] text-blue-700 mt-1 font-medium">✓ ${station.source_name_th}</div>
        </div>
        `,
        { direction: 'top', offset: [0, -18] }
      );

      marker.addTo(stationsLayerRef.current!);
    });
  }, [stations, selectedStation, onSelectStation, onSelectHighwayAlert]);

  // Highway / Roads Flood Alert Layer (DOH)
  useEffect(() => {
    if (!highwaysLayerRef.current || !mapInstanceRef.current) return;

    highwaysLayerRef.current.clearLayers();

    if (!showRoadAlerts) return;

    highwayAlerts.forEach((alert) => {
      const isSelected = selectedHighwayAlert?.id === alert.id;
      const isImpassable = !alert.passable;

      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="w-8 h-8 rounded-xl border-2 shadow-lg flex items-center justify-center text-white transition-transform transform group-hover:scale-110 ${
            isImpassable ? 'bg-red-600 border-red-800 animate-bounce' : 'bg-amber-500 border-amber-700'
          } ${isSelected ? 'scale-125 ring-4 ring-red-400 ring-offset-2' : ''}">
            <span class="text-sm">🚧</span>
          </div>
          <div class="absolute -bottom-5 whitespace-nowrap bg-white/95 px-1.5 py-0.5 rounded shadow-xs text-[10px] font-bold text-slate-800 border border-slate-200 pointer-events-none">
            ${alert.route_number}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'highway-alert-icon',
        html: markerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([alert.latitude, alert.longitude], {
        icon: customIcon,
      });

      marker.on('click', () => {
        onSelectHighwayAlert(alert);
        onSelectStation(null);
      });

      marker.bindTooltip(
        `
        <div class="p-1.5 text-xs font-sans">
          <div class="font-bold text-slate-900">${alert.route_number} (${alert.road_name})</div>
          <div class="text-[11px] ${isImpassable ? 'text-red-600 font-bold' : 'text-amber-700 font-bold'}">
            ${isImpassable ? '⛔ รถเล็กผ่านไม่ได้ (น้ำท่วมผิวทาง)' : '⚠️ รถเล็กผ่านได้ด้วยความระมัดระวัง'}
          </div>
          <div class="text-[11px] text-slate-600">ระดับน้ำท่วมทาง: <b>${alert.water_height_cm} ซม.</b> (${alert.km_range})</div>
          <div class="text-[10px] text-blue-700 mt-1 font-medium">✓ ${alert.source_name_th}</div>
        </div>
        `,
        { direction: 'top', offset: [0, -18] }
      );

      marker.addTo(highwaysLayerRef.current!);
    });
  }, [highwayAlerts, showRoadAlerts, selectedHighwayAlert, onSelectHighwayAlert, onSelectStation]);

  // Center on selected item
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (selectedStation) {
      mapInstanceRef.current.flyTo([selectedStation.latitude, selectedStation.longitude], 13, {
        duration: 1.2,
      });
    } else if (selectedHighwayAlert) {
      mapInstanceRef.current.flyTo([selectedHighwayAlert.latitude, selectedHighwayAlert.longitude], 13, {
        duration: 1.2,
      });
    }
  }, [selectedStation, selectedHighwayAlert]);

  // Reset View to Prachinburi center
  const handleResetCenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([PRACHINBURI_CENTER.lat, PRACHINBURI_CENTER.lng], PRACHINBURI_CENTER.zoom, {
      duration: 1,
    });
  };

  return (
    <div className="w-full h-full relative font-sans">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Controls (Top Right) */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col items-end gap-2">
        {/* Toggle Layers Button (Mobile & Compact) */}
        <button
          onClick={() => setIsLayersOpen(!isLayersOpen)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl shadow-lg border text-xs font-bold backdrop-blur-md transition-all ${
            isLayersOpen
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white/95 text-slate-800 border-slate-200 hover:bg-white'
          }`}
        >
          <Layers className="w-4 h-4 text-blue-500" />
          <span>ชั้นข้อมูล</span>
          <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full font-bold ml-0.5">
            {[mapType === 'satellite', showGistdaLayer, showRoadAlerts, showBoundaries].filter(Boolean).length}
          </span>
        </button>

        {/* Layer Switches Box (Collapsible / Expandable) */}
        {isLayersOpen && (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 p-2.5 space-y-2 text-xs text-slate-700 w-64 animate-in fade-in duration-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1 pb-1 border-b border-slate-100 flex items-center justify-between">
              <span>เลือกชั้นข้อมูลแสดงผล</span>
              <button 
                onClick={() => setIsLayersOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-[11px]"
              >
                ✕ ปิด
              </button>
            </div>

            {/* Toggle Satellite */}
            <button
              onClick={() => setMapType(mapType === 'street' ? 'satellite' : 'street')}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-xl transition-all ${
                mapType === 'satellite'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Satellite className="w-3.5 h-3.5" />
                <span>ภาพถ่ายดาวเทียม (Esri)</span>
              </span>
              {mapType === 'satellite' && <Check className="w-3.5 h-3.5" />}
            </button>

            {/* Toggle GISTDA Flood Satellite Extent */}
            <div className="space-y-1 bg-slate-50/80 p-2 rounded-xl border border-slate-200/60">
              <button
                onClick={() => setShowGistdaLayer(!showGistdaLayer)}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Activity className="w-3.5 h-3.5 text-red-600" />
                  <span>พื้นที่ท่วมดาวเทียม GISTDA</span>
                </span>
                {showGistdaLayer ? <Eye className="w-3.5 h-3.5 text-red-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
              </button>

              {showGistdaLayer && (
                <div className="pt-1.5 space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>ความโปร่งใส (Opacity):</span>
                    <span className="font-bold">{Math.round(gistdaOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={gistdaOpacity}
                    onChange={(e) => setGistdaOpacity(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              )}
            </div>

            {/* Toggle Highway Alerts */}
            <button
              onClick={() => setShowRoadAlerts(!showRoadAlerts)}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-xl transition-all ${
                showRoadAlerts
                  ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-amber-600" />
                <span>จุดเตือนน้ำท่วมทางหลวง (DOH)</span>
              </span>
              {showRoadAlerts ? <Eye className="w-3.5 h-3.5 text-amber-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {/* Toggle District Boundaries */}
            <button
              onClick={() => setShowBoundaries(!showBoundaries)}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-xl transition-all ${
                showBoundaries
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5 text-blue-600" />
                <span>เส้นขอบเขต 7 อำเภอ</span>
              </span>
              {showBoundaries ? <Eye className="w-3.5 h-3.5 text-blue-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          </div>
        )}

        {/* Reset View Button */}
        <button
          onClick={handleResetCenter}
          className="p-2.5 rounded-2xl bg-white/95 backdrop-blur-md hover:bg-white text-slate-700 shadow-lg border border-slate-200/90 transition-all flex items-center justify-center"
          title="จัดมุมมองศูนย์กลางปราจีนบุรี"
        >
          <Navigation className="w-4 h-4 text-blue-600" />
        </button>
      </div>

      {/* Map Legend (Bottom Left) */}
      <div className="absolute bottom-6 left-4 z-[400] bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/90 p-3 max-w-xs hidden sm:block text-xs space-y-2">
        <div className="font-bold text-slate-800 flex items-center justify-between border-b border-slate-100 pb-1.5">
          <span>สัญลักษณ์สถานการณ์น้ำท่า (สสน./กรมชลฯ)</span>
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
            <span className="font-semibold text-red-700">🔴 วิกฤต/ล้นตลิ่ง</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="font-semibold text-orange-700">🟠 เตือนภัย/จ่อล้น</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="font-semibold text-yellow-800">🟡 เฝ้าระวัง</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-emerald-700">🟢 ระดับน้ำปกติ</span>
          </div>
        </div>
        <div className="pt-1 border-t border-slate-100 text-[10px] text-slate-500 flex items-center gap-2">
          <span>🚧 จุดเตือนผิวทาง (กรมทางหลวง)</span>
          <span>🛰️ น้ำท่วมดาวเทียม (GISTDA)</span>
        </div>
      </div>
    </div>
  );
};
