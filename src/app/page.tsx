'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TelemetryNavbar } from '@/components/Navbar/TelemetryNavbar';
import { DynamicTelemetryMap } from '@/components/Map/DynamicTelemetryMap';
import { TelemetryFilterBar } from '@/components/Filters/TelemetryFilterBar';
import { TelemetryStationFeedList } from '@/components/Feed/TelemetryStationFeedList';
import { TelemetryDetailDrawer } from '@/components/ReportDrawer/TelemetryDetailDrawer';
import { EmergencyDrawer } from '@/components/Emergency/EmergencyDrawer';
import { WeatherForecastModal } from '@/components/Weather/WeatherForecastModal';
import { 
  TelemetryStation, 
  HighwayDisasterAlert, 
  DashboardFilterState,
  DamReservoirInfo,
  HighTideAlert,
  FlashFloodAlert,
  EvacuationShelter,
} from '@/types/telemetry';
import { getAutomatedTelemetryData } from '@/lib/telemetry-service';
import { MetricBanner } from '@/components/Dashboard/MetricBanner';
import { THAILAND_PROVINCES } from '@/data/thailand-provinces';
import { PRACHINBURI_DISTRICTS } from '@/data/prachinburi-locations';
import { CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [stations, setStations] = useState<TelemetryStation[]>([]);
  const [highwayAlerts, setHighwayAlerts] = useState<HighwayDisasterAlert[]>([]);
  const [gistdaGeoJson, setGistdaGeoJson] = useState<GeoJSON.FeatureCollection | null>(null);
  const [dams, setDams] = useState<DamReservoirInfo[]>([]);
  const [highTide, setHighTide] = useState<HighTideAlert | null>(null);
  const [flashFloodAlerts, setFlashFloodAlerts] = useState<FlashFloodAlert[]>([]);
  const [shelters, setShelters] = useState<EvacuationShelter[]>([]);

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(true);

  const [currentView, setCurrentView] = useState<'map' | 'list'>('map');

  // Selected hazard detail drawers
  const [selectedStation, setSelectedStation] = useState<TelemetryStation | null>(null);
  const [selectedHighwayAlert, setSelectedHighwayAlert] = useState<HighwayDisasterAlert | null>(null);
  const [selectedDam, setSelectedDam] = useState<DamReservoirInfo | null>(null);
  const [selectedFlashFlood, setSelectedFlashFlood] = useState<FlashFloodAlert | null>(null);
  const [selectedShelter, setSelectedShelter] = useState<EvacuationShelter | null>(null);
  const [selectedHighTide, setSelectedHighTide] = useState<HighTideAlert | null>(null);

  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const clearAllSelections = useCallback(() => {
    setSelectedStation(null);
    setSelectedHighwayAlert(null);
    setSelectedDam(null);
    setSelectedFlashFlood(null);
    setSelectedShelter(null);
    setSelectedHighTide(null);
  }, []);

  // Filter state - defaults to nationwide ('all')
  const [filter, setFilter] = useState<DashboardFilterState>({
    province: 'all',
    district: 'all',
    stationType: 'all',
    severity: 'all',
    searchQuery: '',
  });

  // Calculate available districts for the selected province
  const availableDistricts = useMemo(() => {
    if (filter.province && filter.province !== 'all') {
      const provStations = stations.filter(
        (s) => (s.province || 'prachinburi') === filter.province
      );
      const districtSet = new Set<string>();
      provStations.forEach((s) => {
        if (s.district) districtSet.add(s.district);
      });
      if (filter.province === 'prachinburi') {
        PRACHINBURI_DISTRICTS.forEach((d) => districtSet.add(d.name_th));
      }
      return Array.from(districtSet).sort();
    }
    return [];
  }, [stations, filter.province]);

  // Fetch telemetry & multi-hazard data
  const fetchData = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const data = await getAutomatedTelemetryData();
      setStations(data.stations);
      setHighwayAlerts(data.highwayAlerts);
      setGistdaGeoJson(data.gistdaGeoJson);
      setDams(data.dams);
      setHighTide(data.highTide);
      setFlashFloodAlerts(data.flashFloodAlerts);
      setShelters(data.shelters);
      setLastUpdated(data.lastUpdated);

      if (isManual) {
        setToastMessage('อัปเดตข้อมูลโทรมาตร, เขื่อน, น้ำหนุน และศูนย์พักพิงเรียบร้อย');
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to load automated telemetry data:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh interval (every 60 seconds)
  useEffect(() => {
    if (!isAutoRefresh) return;
    const interval = setInterval(() => {
      fetchData(false);
    }, 60000);
    return () => clearInterval(interval);
  }, [isAutoRefresh, fetchData]);

  // Global Detail Drawer Openers - connects map popups & feed list items directly to drawer state
  useEffect(() => {
    (window as any).__openTelemetryStationById = (stationId: string) => {
      const st = stations.find((s) => s.id === stationId);
      if (st) {
        clearAllSelections();
        setSelectedStation(st);
      }
    };

    (window as any).__openTelemetryHighwayById = (highwayId: string) => {
      const hw = highwayAlerts.find((h) => h.id === highwayId);
      if (hw) {
        clearAllSelections();
        setSelectedHighwayAlert(hw);
      }
    };

    (window as any).__openTelemetryDamById = (damId: string) => {
      const d = dams.find((item) => item.id === damId);
      if (d) {
        clearAllSelections();
        setSelectedDam(d);
      }
    };

    (window as any).__openTelemetryFlashById = (flashId: string) => {
      const f = flashFloodAlerts.find((item) => item.id === flashId);
      if (f) {
        clearAllSelections();
        setSelectedFlashFlood(f);
      }
    };

    (window as any).__openTelemetryShelterById = (shelterId: string) => {
      const s = shelters.find((item) => item.id === shelterId);
      if (s) {
        clearAllSelections();
        setSelectedShelter(s);
      }
    };

    const handleCustomDrawerOpen = (e: any) => {
      const detail = e.detail;
      clearAllSelections();
      if (detail?.type === 'station') {
        const st = detail.station || stations.find((s) => s.id === detail.id || s.id === detail.stationId);
        if (st) setSelectedStation(st);
      } else if (detail?.type === 'highway') {
        const hw = detail.highway || highwayAlerts.find((h) => h.id === detail.id || h.id === detail.highwayId);
        if (hw) setSelectedHighwayAlert(hw);
      } else if (detail?.type === 'dam') {
        const d = detail.dam || dams.find((item) => item.id === detail.id);
        if (d) setSelectedDam(d);
      } else if (detail?.type === 'flashFlood') {
        const f = detail.flashFlood || flashFloodAlerts.find((item) => item.id === detail.id);
        if (f) setSelectedFlashFlood(f);
      } else if (detail?.type === 'shelter') {
        const s = detail.shelter || shelters.find((item) => item.id === detail.id);
        if (s) setSelectedShelter(s);
      } else if (detail?.type === 'highTide') {
        if (highTide) setSelectedHighTide(highTide);
      }
    };

    window.addEventListener('open-telemetry-drawer', handleCustomDrawerOpen as any);
    return () => {
      window.removeEventListener('open-telemetry-drawer', handleCustomDrawerOpen as any);
    };
  }, [stations, highwayAlerts, dams, flashFloodAlerts, shelters, highTide, clearAllSelections]);

  // Filter logic
  const filteredStations = useMemo(() => {
    return stations.filter((sta) => {
      // Province filter
      if (filter.province && filter.province !== 'all') {
        const staProv = sta.province || 'prachinburi';
        if (staProv !== filter.province) return false;
      }

      // District or Regional filter
      if (filter.district !== 'all') {
        if (filter.province === 'all') {
          // In nationwide mode, filter.district can be a region (e.g. 'central', 'north')
          const staProv = sta.province || 'prachinburi';
          const provMeta = THAILAND_PROVINCES.find((p) => p.id === staProv);
          if (provMeta && provMeta.region !== filter.district) {
            return false;
          }
        } else {
          // In specific province mode, filter by district name
          const normSta = sta.district.replace(/^อ\./, '').trim();
          const normFilter = filter.district.replace(/^อ\./, '').trim();
          if (normSta !== normFilter) return false;
        }
      }

      if (filter.severity !== 'all' && sta.severity !== filter.severity) return false;
      if (filter.searchQuery.trim() !== '') {
        const query = filter.searchQuery.toLowerCase();
        const matchName = sta.name_th.toLowerCase().includes(query);
        const matchCode = sta.station_code.toLowerCase().includes(query);
        const matchDistrict = sta.district.toLowerCase().includes(query);
        const matchSubdistrict = sta.subdistrict.toLowerCase().includes(query);
        const matchRiver = sta.river_name?.toLowerCase().includes(query) ?? false;
        const matchProv = (sta.province || '').toLowerCase().includes(query);
        if (!matchName && !matchCode && !matchDistrict && !matchSubdistrict && !matchRiver && !matchProv) {
          return false;
        }
      }
      return true;
    });
  }, [stations, filter]);

  const filteredDams = useMemo(() => {
    return dams.filter((dam) => {
      // Province filter
      if (filter.province && filter.province !== 'all') {
        const damProv = dam.province || (dam.id.includes('narubodin') ? 'prachinburi' : '');
        if (damProv && damProv !== filter.province) return false;
      }
      if (filter.severity !== 'all' && dam.severity !== filter.severity) return false;
      if (filter.searchQuery.trim() !== '') {
        const query = filter.searchQuery.toLowerCase();
        const matchName = dam.name_th.toLowerCase().includes(query);
        const matchEn = dam.name_en.toLowerCase().includes(query);
        const matchDist = dam.district.toLowerCase().includes(query);
        if (!matchName && !matchEn && !matchDist) return false;
      }
      return true;
    });
  }, [dams, filter]);

  const filteredHighwayAlerts = useMemo(() => {
    return highwayAlerts.filter((alert) => {
      if (filter.province && filter.province !== 'all') {
        const prov = alert.province || 'prachinburi';
        if (prov !== filter.province) return false;
      }
      if (filter.district !== 'all' && alert.district !== filter.district) return false;
      if (filter.searchQuery.trim() !== '') {
        const query = filter.searchQuery.toLowerCase();
        const matchRoad = alert.road_name.toLowerCase().includes(query);
        const matchRoute = alert.route_number.toLowerCase().includes(query);
        const matchDist = alert.district.toLowerCase().includes(query);
        if (!matchRoad && !matchRoute && !matchDist) return false;
      }
      return true;
    });
  }, [highwayAlerts, filter]);

  const filteredShelters = useMemo(() => {
    return shelters.filter((s) => {
      if (filter.province && filter.province !== 'all') {
        const prov = s.province || 'prachinburi';
        if (prov !== filter.province) return false;
      }
      if (filter.district !== 'all' && s.district !== filter.district) return false;
      return true;
    });
  }, [shelters, filter]);

  const filteredFlashFloodAlerts = useMemo(() => {
    return flashFloodAlerts.filter((f) => {
      if (filter.province && filter.province !== 'all') {
        const prov = f.province || 'prachinburi';
        if (prov !== filter.province) return false;
      }
      return true;
    });
  }, [flashFloodAlerts, filter]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <TelemetryNavbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenWeatherModal={() => setIsWeatherModalOpen(true)}
        stations={stations}
        highwayAlerts={highwayAlerts}
        isAutoRefresh={isAutoRefresh}
        selectedProvince={filter.province || 'all'}
      />

      {/* Main Content Area */}
      {currentView === 'map' ? (
        <>
          {/* Floating Filter Bar (Map View Only) */}
          <div className="fixed top-[58px] sm:top-[72px] left-0 right-0 z-20 px-2 sm:px-4 pointer-events-none">
            <div className="pointer-events-auto max-w-xl sm:max-w-2xl mx-auto space-y-1.5">
              <TelemetryFilterBar
                filter={filter}
                onFilterChange={setFilter}
                totalStations={filteredStations.length}
                isAutoRefresh={isAutoRefresh}
                onToggleAutoRefresh={() => setIsAutoRefresh(!isAutoRefresh)}
                onManualRefresh={() => fetchData(true)}
                isRefreshing={isRefreshing}
                lastUpdated={lastUpdated}
                availableDistricts={availableDistricts}
              />

              {/* Compact Floating Alert Badges (Only shown if there's high tide or critical flash flood) */}
              {(highTide || flashFloodAlerts.some((f) => f.severity === 'red')) && (
                <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                  {highTide && (
                    <button
                      type="button"
                      onClick={() => {
                        clearAllSelections();
                        setSelectedHighTide(highTide);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/95 hover:bg-blue-700 text-white shadow-md backdrop-blur-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      <span>🌊</span>
                      <span>น้ำทะเลหนุนสูง (+{highTide.morning_peak_m_msl}ม.)</span>
                      <span className="text-blue-200 text-xs ml-0.5 font-bold">›</span>
                    </button>
                  )}
                  {flashFloodAlerts
                    .filter((f) => f.severity === 'red')
                    .slice(0, 1)
                    .map((flash) => (
                      <button
                        key={flash.id}
                        type="button"
                        onClick={() => {
                          clearAllSelections();
                          setSelectedFlashFlood(flash);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-600/95 hover:bg-rose-700 text-white shadow-md backdrop-blur-md transition-all active:scale-95 animate-pulse cursor-pointer whitespace-nowrap"
                      >
                        <span>🚨</span>
                        <span>เตือนน้ำป่า ({flash.district})</span>
                        <span className="text-rose-200 text-xs ml-0.5 font-bold">›</span>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          <main className="flex-1 w-full h-full pt-14 sm:pt-16 relative">
            <div className="w-full h-full">
              <DynamicTelemetryMap
                stations={filteredStations}
                highwayAlerts={filteredHighwayAlerts}
                gistdaGeoJson={gistdaGeoJson}
                dams={filteredDams}
                flashFloodAlerts={filteredFlashFloodAlerts}
                shelters={filteredShelters}
                selectedStation={selectedStation}
                selectedHighwayAlert={selectedHighwayAlert}
                selectedDam={selectedDam}
                selectedFlashFlood={selectedFlashFlood}
                selectedShelter={selectedShelter}
                onSelectStation={(s) => {
                  clearAllSelections();
                  setSelectedStation(s);
                }}
                onSelectHighwayAlert={(h) => {
                  clearAllSelections();
                  setSelectedHighwayAlert(h);
                }}
                onSelectDam={(d) => {
                  clearAllSelections();
                  setSelectedDam(d);
                }}
                onSelectFlashFlood={(f) => {
                  clearAllSelections();
                  setSelectedFlashFlood(f);
                }}
                onSelectShelter={(s) => {
                  clearAllSelections();
                  setSelectedShelter(s);
                }}
                selectedDistrict={filter.district}
                selectedProvince={filter.province || 'all'}
                onOpenWeatherModal={() => setIsWeatherModalOpen(true)}
              />
            </div>
          </main>
        </>
      ) : (
        /* List View: Natural clean scrolling without floating overlap */
        <main className="flex-1 w-full h-full pt-14 sm:pt-16 overflow-y-auto bg-slate-50">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-3 font-sans">
            {/* Provincial Key Metrics */}
            <MetricBanner
              stations={filteredStations}
              highwayAlerts={filteredHighwayAlerts}
              highTide={highTide ?? undefined}
              flashFloodAlerts={filteredFlashFloodAlerts}
              dams={filteredDams}
              selectedProvince={filter.province || 'all'}
              onFilterSeverity={(sev) => setFilter({ ...filter, severity: sev as any })}
              onFilterRoad={() => {}}
              onOpenHighTide={() => {
                clearAllSelections();
                if (highTide) setSelectedHighTide(highTide);
              }}
              onOpenFlashFlood={(flash) => {
                clearAllSelections();
                setSelectedFlashFlood(flash);
              }}
              onOpenDam={(d) => {
                clearAllSelections();
                setSelectedDam(d);
              }}
            />

            {/* Filter Bar */}
            <TelemetryFilterBar
              filter={filter}
              onFilterChange={setFilter}
              totalStations={filteredStations.length}
              isAutoRefresh={isAutoRefresh}
              onToggleAutoRefresh={() => setIsAutoRefresh(!isAutoRefresh)}
              onManualRefresh={() => fetchData(true)}
              isRefreshing={isRefreshing}
              lastUpdated={lastUpdated}
              availableDistricts={availableDistricts}
            />

            {/* Feed List Items */}
            <TelemetryStationFeedList
              stations={filteredStations}
              highwayAlerts={filteredHighwayAlerts}
              dams={filteredDams}
              flashFloodAlerts={filteredFlashFloodAlerts}
              shelters={filteredShelters}
              highTide={highTide ?? undefined}
              onSelectStation={(s) => {
                clearAllSelections();
                setSelectedStation(s);
                setCurrentView('map');
              }}
              onSelectHighwayAlert={(h) => {
                clearAllSelections();
                setSelectedHighwayAlert(h);
                setCurrentView('map');
              }}
              onSelectDam={(d) => {
                clearAllSelections();
                setSelectedDam(d);
                setCurrentView('map');
              }}
              onSelectFlashFlood={(f) => {
                clearAllSelections();
                setSelectedFlashFlood(f);
                setCurrentView('map');
              }}
              onSelectShelter={(s) => {
                clearAllSelections();
                setSelectedShelter(s);
                setCurrentView('map');
              }}
              onSelectHighTide={(t) => {
                clearAllSelections();
                setSelectedHighTide(t);
              }}
            />
          </div>
        </main>
      )}

      {/* Detail Slide Drawer */}
      <TelemetryDetailDrawer
        station={selectedStation}
        highwayAlert={selectedHighwayAlert}
        dam={selectedDam}
        flashFlood={selectedFlashFlood}
        shelter={selectedShelter}
        highTide={selectedHighTide}
        onClose={clearAllSelections}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
      />

      {/* Emergency Hotline Modal */}
      <EmergencyDrawer
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      {/* Weather Forecast Modal */}
      <WeatherForecastModal
        isOpen={isWeatherModalOpen}
        onClose={() => setIsWeatherModalOpen(false)}
        initialProvince={filter.province || 'prachinburi'}
      />
    </div>
  );
}
