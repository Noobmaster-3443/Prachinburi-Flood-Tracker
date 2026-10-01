'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { FloodReport, SeverityLevel } from '@/types';
import { PRACHINBURI_CENTER, PRACHINBURI_DISTRICTS } from '@/data/prachinburi-locations';
import prachinburiDistrictsGeoJson from '@/data/prachinburi-districts.json';
import { Navigation, Plus, Minus, Compass, Layers, MapPin, Grid, Check } from 'lucide-react';

interface FloodMapProps {
  reports: FloodReport[];
  selectedReport: FloodReport | null;
  onSelectReport: (report: FloodReport) => void;
  selectedDistrict: string;
}

const severityConfig: Record<
  SeverityLevel,
  { bg: string; border: string; pulse: boolean; icon: string; title: string }
> = {
  red: {
    bg: '#ef4444',
    border: '#b91c1c',
    pulse: true,
    icon: '🚨',
    title: 'วิกฤต',
  },
  orange: {
    bg: '#f97316',
    border: '#c2410c',
    pulse: true,
    icon: '🌊',
    title: 'รถเล็กผ่านไม่ได้',
  },
  yellow: {
    bg: '#eab308',
    border: '#a16207',
    pulse: false,
    icon: '⚠️',
    title: 'น้ำขังเล็กน้อย',
  },
  green: {
    bg: '#10b981',
    border: '#047857',
    pulse: false,
    icon: '✅',
    title: 'ปกติ / แห้งแล้ว',
  },
};

export const FloodMap: React.FC<FloodMapProps> = ({
  reports,
  selectedReport,
  onSelectReport,
  selectedDistrict,
}) => {
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');
  const [showBoundaries, setShowBoundaries] = useState<boolean>(true);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null);
  const labelsLayerRef = useRef<L.LayerGroup | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: [PRACHINBURI_CENTER.lat, PRACHINBURI_CENTER.lng],
      zoom: PRACHINBURI_CENTER.zoom,
      zoomControl: false,
      attributionControl: true,
    });

    // Clean OpenStreetMap standard tile layer (100% Free, No Watermark, No API Key Required)
    const initialTile = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        subdomains: ['a', 'b', 'c'],
        maxZoom: 19,
      }
    ).addTo(map);

    tileLayerRef.current = initialTile;
    geojsonLayerRef.current = L.geoJSON().addTo(map);
    labelsLayerRef.current = L.layerGroup().addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Switch between Street and Satellite
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    if (mapType === 'satellite') {
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution:
            'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          maxZoom: 19,
        }
      ).addTo(map);
    } else {
      tileLayerRef.current = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
          subdomains: ['a', 'b', 'c'],
          maxZoom: 19,
        }
      ).addTo(map);
    }
  }, [mapType]);

  // Handle Boundaries and Labels Rendering
  useEffect(() => {
    const map = mapInstanceRef.current;
    const geoLayer = geojsonLayerRef.current;
    const labelsLayer = labelsLayerRef.current;
    if (!map || !geoLayer || !labelsLayer) return;

    geoLayer.clearLayers();
    labelsLayer.clearLayers();

    // If turned off, keep layers empty
    if (!showBoundaries) {
      return;
    }

    // 1. Render District Boundaries
    // @ts-expect-error GeoJSON typing
    const districtGeo = L.geoJSON(prachinburiDistrictsGeoJson, {
        style: (feature) => {
          const ampName = feature?.properties?.amp_th || '';
          const isSelected =
            selectedDistrict !== 'all' && selectedDistrict.includes(ampName);

          return {
            color: isSelected ? '#ef4444' : '#2563eb',
            weight: isSelected ? 3.5 : 2.2,
            dashArray: isSelected ? undefined : '5, 4',
            fillColor: isSelected ? '#ef4444' : '#3b82f6',
            fillOpacity: isSelected ? 0.22 : 0.06,
          };
        },
        onEachFeature: (feature, layer) => {
          const ampName = feature?.properties?.amp_th || '';
          const area = feature?.properties?.area_sqkm
            ? Math.round(feature.properties.area_sqkm).toLocaleString()
            : '';

          // Tooltip on Hover
          layer.bindTooltip(
            `<div class="font-bold text-xs text-slate-900 leading-tight">อำเภอ${ampName}</div>
             <div class="text-[10px] text-slate-500">จ.ปราจีนบุรี ${area ? `• ${area} ตร.กม.` : ''}</div>`,
            {
              sticky: true,
              direction: 'auto',
              className: 'rounded-xl shadow-lg border border-slate-200 p-2',
            }
          );

          layer.on({
            mouseover: (e) => {
              const l = e.target;
              l.setStyle({
                weight: 3.5,
                color: '#1d4ed8',
                fillOpacity: 0.16,
              });
            },
            mouseout: (e) => {
              districtGeo.resetStyle(e.target);
            },
            click: (e) => {
              if (e.originalEvent?.target && 'blur' in e.originalEvent.target) {
                (e.originalEvent.target as HTMLElement).blur();
              }
              map.fitBounds(e.target.getBounds(), {
                padding: [40, 40],
                maxZoom: 13,
              });
            },
          });
        },
      });

      geoLayer.addLayer(districtGeo);

      // 2. Add District Center Permanent Labels
      PRACHINBURI_DISTRICTS.forEach((d) => {
        const isSelected = selectedDistrict !== 'all' && selectedDistrict.includes(d.name_th);

        const labelIcon = L.divIcon({
          className: 'district-badge-marker',
          html: `
            <div class="px-2.5 py-1 rounded-xl shadow-md border text-[11px] font-bold whitespace-nowrap pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-all ${
              isSelected
                ? 'bg-red-600 text-white border-white ring-2 ring-red-400 scale-110'
                : 'bg-white/95 backdrop-blur-md text-blue-950 border-blue-300/80 hover:bg-white'
            }">
              📍 ${d.name_th}
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        L.marker([d.lat, d.lng], {
          icon: labelIcon,
          interactive: false,
        }).addTo(labelsLayer);
      });
  }, [showBoundaries, selectedDistrict]);

  // Update Markers when reports or selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    reports.forEach((report) => {
      const conf = severityConfig[report.severity] || severityConfig.yellow;
      const isSelected = selectedReport?.id === report.id;

      // Custom HTML Marker Element
      const customIconHtml = `
        <div class="marker-pin-wrapper group">
          ${
            conf.pulse
              ? `<div class="marker-pulse-ring" style="background-color: ${conf.bg};"></div>`
              : ''
          }
          <div 
            class="relative flex items-center justify-center w-9 h-9 rounded-full shadow-lg transition-transform duration-200 ${
              isSelected ? 'scale-125 ring-4 ring-blue-500' : ''
            }" 
            style="background: ${conf.bg}; border: 2.5px solid white;"
          >
            <span class="text-sm select-none">${conf.icon}</span>
            ${
              report.is_verified
                ? `<div class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-600 rounded-full border border-white flex items-center justify-center text-[9px] text-white">✓</div>`
                : ''
            }
          </div>
          <div class="absolute top-10 whitespace-nowrap bg-slate-900/90 text-white text-[11px] font-medium px-2 py-0.5 rounded shadow pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            ${report.location_name}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-flood-marker',
        html: customIconHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });

      const marker = L.marker([report.latitude, report.longitude], {
        icon: customIcon,
        title: report.location_name,
      });

      marker.on('click', () => {
        onSelectReport(report);
        map.panTo([report.latitude, report.longitude], {
          animate: true,
          duration: 0.5,
        });
      });

      marker.addTo(markersLayer);
    });
  }, [reports, selectedReport, onSelectReport]);

  // Pan to selected district center when filter changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedDistrict === 'all') {
      map.setView([PRACHINBURI_CENTER.lat, PRACHINBURI_CENTER.lng], PRACHINBURI_CENTER.zoom, {
        animate: true,
      });
    } else {
      const dist = PRACHINBURI_DISTRICTS.find((d) => d.name_th === selectedDistrict);
      if (dist) {
        map.setView([dist.lat, dist.lng], dist.zoom, {
          animate: true,
        });
      }
    }
  }, [selectedDistrict]);

  // Handle locate user GPS
  const handleLocateMe = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!navigator.geolocation) {
      alert('เบราว์เซอร์ไม่รองรับการระบุตำแหน่ง GPS');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.flyTo([latitude, longitude], 15, { duration: 1.5 });

        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng([latitude, longitude]);
        } else {
          const userIcon = L.divIcon({
            className: 'custom-flood-marker',
            html: `
              <div class="relative flex items-center justify-center w-6 h-6">
                <div class="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></div>
                <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md"></div>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });
          userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon }).addTo(map);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        alert('ไม่สามารถดึงตำแหน่งพิกัด GPS ได้ โปรดอนุญาตสิทธิ์เข้าถึงตำแหน่ง');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => {
    mapInstanceRef.current?.setView(
      [PRACHINBURI_CENTER.lat, PRACHINBURI_CENTER.lng],
      PRACHINBURI_CENTER.zoom,
      { animate: true }
    );
  };

  return (
    <div className="relative w-full h-full min-h-[500px]">
      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Map Controls on Right Side */}
      <div className="absolute right-4 bottom-24 sm:bottom-8 z-20 flex flex-col gap-2">
        {/* Layer Switcher (Street / Satellite) */}
        <button
          onClick={() => setMapType((prev) => (prev === 'street' ? 'satellite' : 'street'))}
          className={`w-11 h-11 rounded-xl shadow-lg border flex flex-col items-center justify-center transition-all active:scale-95 ${
            mapType === 'satellite'
              ? 'bg-slate-900 text-amber-400 border-slate-700 ring-2 ring-amber-400/50'
              : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 border-slate-200/80'
          }`}
          title={mapType === 'satellite' ? 'สลับเป็นแผนที่ถนน' : 'สลับเป็นภาพถ่ายดาวเทียม'}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[9px] font-bold leading-none mt-0.5">
            {mapType === 'satellite' ? 'ดาวเทียม' : 'ถนน'}
          </span>
        </button>

        {/* Boundary Border Quick On/Off Toggle Button */}
        <button
          onClick={() => setShowBoundaries((prev) => !prev)}
          className={`w-11 h-11 rounded-xl shadow-lg border flex flex-col items-center justify-center transition-all active:scale-95 ${
            showBoundaries
              ? 'bg-blue-600 text-white border-blue-700 shadow-blue-500/25 ring-2 ring-blue-400/40'
              : 'bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 border-slate-200/80'
          }`}
          title={showBoundaries ? 'แตะเพื่อปิดเส้นขอบเขตอำเภอ' : 'แตะเพื่อเปิดเส้นขอบเขตอำเภอ'}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[9px] font-bold leading-none mt-0.5">
            {showBoundaries ? 'ขอบเขต' : 'ปิด'}
          </span>
        </button>

        {/* Locate Me Button */}
        <button
          onClick={handleLocateMe}
          className="w-11 h-11 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 rounded-xl shadow-lg border border-slate-200/80 flex items-center justify-center transition-all active:scale-95"
          title="ตำแหน่งปัจจุบันของฉัน"
        >
          <Navigation className="w-5 h-5" />
        </button>

        {/* Reset View Button */}
        <button
          onClick={handleResetView}
          className="w-11 h-11 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 rounded-xl shadow-lg border border-slate-200/80 flex items-center justify-center transition-all active:scale-95"
          title="มองภาพรวมทั้งปราจีนบุรี"
        >
          <Compass className="w-5 h-5" />
        </button>

        {/* Zoom In/Out */}
        <div className="flex flex-col bg-white rounded-xl shadow-lg border border-slate-200/80 overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="w-11 h-10 hover:bg-slate-50 text-slate-700 flex items-center justify-center border-b border-slate-100 transition-colors"
            title="ขยายแผนที่"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-11 h-10 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors"
            title="ย่อแผนที่"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Legend Overlay (Bottom Left) */}
      <div className="absolute left-4 bottom-24 sm:bottom-8 z-20 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/80 p-2.5 sm:p-3 text-[11px] sm:text-xs pointer-events-auto max-w-[210px] sm:max-w-none">
        <div className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
          <span>สัญลักษณ์สถานการณ์น้ำ</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-sm flex-shrink-0 animate-pulse"></span>
            <span className="truncate">วิกฤต / ขอความช่วยเหลือ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500 border border-white shadow-sm flex-shrink-0"></span>
            <span className="truncate">รถเล็กผ่านไม่ได้</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 border border-white shadow-sm flex-shrink-0"></span>
            <span className="truncate">น้ำท่วมขังเล็กน้อย</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white shadow-sm flex-shrink-0"></span>
            <span className="truncate">เฝ้าระวัง / น้ำแห้งแล้ว</span>
          </div>
        </div>

        {/* Boundary On/Off Switch in Legend */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700">
            <span className="w-3.5 h-0.5 bg-blue-600 border-b border-dashed border-blue-400"></span>
            <span>เส้นขอบเขต 7 อำเภอ</span>
          </div>
          <button
            onClick={() => setShowBoundaries(!showBoundaries)}
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
              showBoundaries
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
            }`}
          >
            {showBoundaries ? '● เปิดอยู่' : '○ ปิดอยู่'}
          </button>
        </div>
      </div>
    </div>
  );
};
