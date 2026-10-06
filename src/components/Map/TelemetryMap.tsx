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

  // Global click & touch capture for popup "ดูรายละเอียด" buttons
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__openStationDrawer = (id: string) => {
        const st = stations.find((s) => s.id === id);
        if (st) {
          onSelectStation(st);
          onSelectHighwayAlert(null);
        }
      };
      (window as any).__openHighwayDrawer = (id: string) => {
        const hw = highwayAlerts.find((h) => h.id === id);
        if (hw) {
          onSelectHighwayAlert(hw);
          onSelectStation(null);
        }
      };
    }

    const handleGlobalPopupClick = (e: MouseEvent | TouchEvent) => {
      const target = (e.target as HTMLElement)?.closest?.('[data-action]');
      if (!target) return;
      const action = target.getAttribute('data-action');
      if (action === 'open-station-detail') {
        const id = target.getAttribute('data-station-id');
        const st = stations.find((s) => s.id === id);
        if (st) {
          onSelectStation(st);
          onSelectHighwayAlert(null);
        }
      } else if (action === 'open-highway-detail') {
        const id = target.getAttribute('data-highway-id');
        const hw = highwayAlerts.find((h) => h.id === id);
        if (hw) {
          onSelectHighwayAlert(hw);
          onSelectStation(null);
        }
      }
    };

    document.addEventListener('click', handleGlobalPopupClick, true);
    document.addEventListener('touchend', handleGlobalPopupClick, true);

    return () => {
      document.removeEventListener('click', handleGlobalPopupClick, true);
      document.removeEventListener('touchend', handleGlobalPopupClick, true);
    };
  }, [stations, highwayAlerts, onSelectStation, onSelectHighwayAlert]);

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

      // District boundaries are rendered cleanly via GeoJSON without redundant center pills
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
      const isWater = station.station_type === 'water_level';

      // SVG Icons for clean rendering instead of OS emojis
      const iconSvg = isWater 
        ? `<svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918"/></svg>`
        : `<svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"/></svg>`;

      const isCritical = station.severity === 'red';

      const markerHtml = `
        <div class="relative flex flex-col items-center cursor-pointer group transition-transform ${isSelected ? 'scale-115 z-50' : 'hover:scale-105'}">
          ${isCritical ? `<div class="absolute -top-1 w-6 h-6 rounded-full animate-ping opacity-75" style="background-color: ${col.hex};"></div>` : ''}
          <div class="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-900/95 text-white shadow-xl border border-white/25 backdrop-blur-md">
            <div class="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 shadow-xs" style="background-color: ${col.hex};">
              ${iconSvg}
            </div>
            <span class="text-[11px] font-bold tracking-tight text-white leading-none whitespace-nowrap">
              ${station.station_code}
            </span>
          </div>
          <div class="w-2 h-2 -mt-1 bg-slate-900/95 rotate-45 border-r border-b border-white/20"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'telemetry-station-pin',
        html: markerHtml,
        iconSize: [80, 34],
        iconAnchor: [40, 32],
      });

      const marker = L.marker([station.latitude, station.longitude], {
        icon: customIcon,
      });

      const popupHtml = `
        <div class="p-1 font-sans min-w-[240px] text-slate-800 select-text">
          <div class="font-bold text-sm text-slate-900 leading-snug">${station.name_th}</div>
          <div class="text-xs text-slate-600 mt-1">
            สถานะ: <b style="color: ${col.hex}">${station.severity_label}</b>
          </div>
          ${
            station.water_level_m_msl
              ? `<div class="text-xs text-slate-700 mt-0.5">ระดับน้ำ: <b>${station.water_level_m_msl} ม.รทก.</b> (ตลิ่ง ${station.bank_level_m_msl} ม.)</div>`
              : ''
          }
          ${
            station.rain_24h_mm
              ? `<div class="text-xs text-slate-700 mt-0.5">ฝน 24 ชม.: <b>${station.rain_24h_mm} มม.</b></div>`
              : ''
          }
          <div class="text-[11px] text-blue-700 mt-2 font-medium flex items-center gap-1 border-t border-slate-100 pt-1.5">
            <span>✓ ${station.source_name_th}</span>
          </div>

          <button 
            type="button"
            data-action="open-station-detail" 
            data-station-id="${station.id}"
            onclick="if(window.__openStationDrawer){window.__openStationDrawer('${station.id}')}"
            class="w-full mt-2.5 py-2 px-3 rounded-xl bg-blue-600 active:bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer pointer-events-auto select-none"
          >
            <span>ดูรายละเอียด</span>
            <svg class="w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        offset: [0, -28],
        closeButton: true,
        autoPan: true,
      });

      marker.bindTooltip(
        `<div class="text-xs font-bold text-slate-900">${station.name_th}</div>`,
        { direction: 'top', offset: [0, -30] }
      );

      marker.on('click', () => {
        onSelectStation(station);
        onSelectHighwayAlert(null);
        marker.openPopup();
      });

      if (isSelected) {
        setTimeout(() => {
          marker.openPopup();
        }, 150);
      }

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
        <div class="relative flex flex-col items-center cursor-pointer group transition-transform ${isSelected ? 'scale-115 z-50' : 'hover:scale-105'}">
          <div class="flex items-center gap-1.5 px-2 py-1 rounded-full text-white shadow-xl backdrop-blur-md border border-white/25 ${
            isImpassable ? 'bg-red-600 ring-2 ring-red-400' : 'bg-amber-600 ring-1 ring-amber-300'
          }">
            <div class="w-4 h-4 rounded-full bg-white/25 flex items-center justify-center flex-shrink-0">
              <svg class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
            </div>
            <span class="text-[11px] font-bold text-white tracking-wide leading-none whitespace-nowrap">
              ${alert.route_number.replace('ทางหลวง', 'ทล.').trim()}
            </span>
          </div>
          <div class="w-2 h-2 -mt-1 rotate-45 border-r border-b border-white/20 ${isImpassable ? 'bg-red-600' : 'bg-amber-600'}"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'highway-alert-pin',
        html: markerHtml,
        iconSize: [80, 34],
        iconAnchor: [40, 32],
      });

      const marker = L.marker([alert.latitude, alert.longitude], {
        icon: customIcon,
      });

      const popupHtml = `
        <div class="p-1 font-sans min-w-[240px] text-slate-800 select-text">
          <div class="font-bold text-sm text-slate-900 leading-snug">${alert.route_number} (${alert.road_name})</div>
          <div class="text-xs mt-1 ${isImpassable ? 'text-red-600 font-bold' : 'text-amber-700 font-bold'}">
            สถานะ: ${isImpassable ? '⛔ น้ำท่วมทาง รถเล็กผ่านไม่ได้' : '⚠️ มีน้ำท่วมขัง เฝ้าระวัง'}
          </div>
          <div class="text-xs text-slate-700 mt-0.5">ระดับน้ำท่วมผิวทาง: <b>${alert.water_height_cm} ซม.</b></div>
          <div class="text-xs text-slate-600 mt-0.5">ช่วง กม.: ${alert.km_range} (${alert.district})</div>
          <div class="text-[11px] text-blue-700 mt-2 font-medium border-t border-slate-100 pt-1.5">
            ✓ ${alert.source_name_th}
          </div>

          <button 
            type="button"
            data-action="open-highway-detail" 
            data-highway-id="${alert.id}"
            onclick="if(window.__openHighwayDrawer){window.__openHighwayDrawer('${alert.id}')}"
            class="w-full mt-2.5 py-2 px-3 rounded-xl bg-blue-600 active:bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer pointer-events-auto select-none"
          >
            <span>ดูรายละเอียด</span>
            <svg class="w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        offset: [0, -28],
        closeButton: true,
        autoPan: true,
      });

      marker.bindTooltip(
        `<div class="text-xs font-bold text-slate-900">${alert.route_number}</div>`,
        { direction: 'top', offset: [0, -28] }
      );

      marker.on('click', () => {
        onSelectHighwayAlert(alert);
        onSelectStation(null);
        marker.openPopup();
      });

      if (isSelected) {
        setTimeout(() => {
          marker.openPopup();
        }, 150);
      }

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

      {/* Floating Map Controls (Bottom Right - thumb accessible, zero overlap) */}
      <div className="absolute bottom-6 right-3 sm:right-4 z-[400] flex flex-col items-end gap-2">
        {/* Layer Switches Box (Collapsible / Expandable) */}
        {isLayersOpen && (
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 space-y-2 text-xs text-slate-700 w-64 animate-in fade-in duration-200 mb-1">
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

        {/* Toggle Layers Button */}
        <button
          onClick={() => setIsLayersOpen(!isLayersOpen)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl sm:rounded-2xl shadow-md border text-xs font-bold transition-all cursor-pointer ${
            isLayersOpen
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4 text-blue-500" />
          <span>ชั้นข้อมูล</span>
          <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full font-bold ml-0.5">
            {[mapType === 'satellite', showGistdaLayer, showRoadAlerts, showBoundaries].filter(Boolean).length}
          </span>
        </button>

        {/* Reset View Button */}
        <button
          onClick={handleResetCenter}
          className="p-2.5 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 text-slate-700 shadow-md border border-slate-200 transition-all flex items-center justify-center cursor-pointer"
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
