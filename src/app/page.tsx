'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TelemetryNavbar } from '@/components/Navbar/TelemetryNavbar';
import { DynamicTelemetryMap } from '@/components/Map/DynamicTelemetryMap';
import { TelemetryFilterBar } from '@/components/Filters/TelemetryFilterBar';
import { TelemetryStationFeedList } from '@/components/Feed/TelemetryStationFeedList';
import { TelemetryDetailDrawer } from '@/components/ReportDrawer/TelemetryDetailDrawer';
import { EmergencyDrawer } from '@/components/Emergency/EmergencyDrawer';
import { TelemetryStation, HighwayDisasterAlert, DashboardFilterState } from '@/types/telemetry';
import { getAutomatedTelemetryData } from '@/lib/telemetry-service';
import { MetricBanner } from '@/components/Dashboard/MetricBanner';
import { CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [stations, setStations] = useState<TelemetryStation[]>([]);
  const [highwayAlerts, setHighwayAlerts] = useState<HighwayDisasterAlert[]>([]);
  const [gistdaGeoJson, setGistdaGeoJson] = useState<GeoJSON.FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(true);

  const [currentView, setCurrentView] = useState<'map' | 'list'>('map');
  const [selectedStation, setSelectedStation] = useState<TelemetryStation | null>(null);
  const [selectedHighwayAlert, setSelectedHighwayAlert] = useState<HighwayDisasterAlert | null>(null);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter state
  const [filter, setFilter] = useState<DashboardFilterState>({
    district: 'all',
    stationType: 'all',
    severity: 'all',
    searchQuery: '',
  });

  // Fetch telemetry data function
  const fetchData = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const data = await getAutomatedTelemetryData();
      setStations(data.stations);
      setHighwayAlerts(data.highwayAlerts);
      setGistdaGeoJson(data.gistdaGeoJson);
      setLastUpdated(data.lastUpdated);

      if (isManual) {
        setToastMessage('อัปเดตข้อมูลโทรมาตร สสน. และทางหลวงเรียบร้อย');
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

  // Filter logic
  const filteredStations = useMemo(() => {
    return stations.filter((sta) => {
      // District filter
      if (filter.district !== 'all' && sta.district !== filter.district) {
        return false;
      }

      // Severity filter
      if (filter.severity !== 'all' && sta.severity !== filter.severity) {
        return false;
      }

      // Search query
      if (filter.searchQuery.trim() !== '') {
        const query = filter.searchQuery.toLowerCase();
        const matchName = sta.name_th.toLowerCase().includes(query);
        const matchCode = sta.station_code.toLowerCase().includes(query);
        const matchDistrict = sta.district.toLowerCase().includes(query);
        const matchSubdistrict = sta.subdistrict.toLowerCase().includes(query);
        const matchRiver = sta.river_name?.toLowerCase().includes(query) ?? false;
        if (!matchName && !matchCode && !matchDistrict && !matchSubdistrict && !matchRiver) {
          return false;
        }
      }

      return true;
    });
  }, [stations, filter]);

  // Filtered Highway Alerts
  const filteredHighwayAlerts = useMemo(() => {
    return highwayAlerts.filter((alert) => {
      if (filter.district !== 'all' && alert.district !== filter.district) {
        return false;
      }
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
        stations={stations}
        highwayAlerts={highwayAlerts}
        isAutoRefresh={isAutoRefresh}
      />

      {/* Main Content Area */}
      {currentView === 'map' ? (
        <>
          {/* Floating Filter Bar & Top Quick Metrics (Map View Only) */}
          <div className="fixed top-[60px] sm:top-20 left-0 right-0 z-20 px-2 sm:px-4 pointer-events-none space-y-1.5 sm:space-y-2">
            <div className="pointer-events-auto max-w-5xl mx-auto space-y-1.5 sm:space-y-2">
              <MetricBanner
                stations={stations}
                highwayAlerts={highwayAlerts}
                onFilterSeverity={(sev) => setFilter({ ...filter, severity: sev as any })}
                onFilterRoad={() => setCurrentView('list')}
              />

              <TelemetryFilterBar
                filter={filter}
                onFilterChange={setFilter}
                totalStations={filteredStations.length}
                isAutoRefresh={isAutoRefresh}
                onToggleAutoRefresh={() => setIsAutoRefresh(!isAutoRefresh)}
                onManualRefresh={() => fetchData(true)}
                isRefreshing={isRefreshing}
                lastUpdated={lastUpdated}
              />
            </div>
          </div>

          <main className="flex-1 w-full h-full pt-14 sm:pt-16 relative">
            <div className="w-full h-full">
              <DynamicTelemetryMap
                stations={filteredStations}
                highwayAlerts={filteredHighwayAlerts}
                gistdaGeoJson={gistdaGeoJson}
                selectedStation={selectedStation}
                selectedHighwayAlert={selectedHighwayAlert}
                onSelectStation={(s) => {
                  setSelectedStation(s);
                  setSelectedHighwayAlert(null);
                }}
                onSelectHighwayAlert={(h) => {
                  setSelectedHighwayAlert(h);
                  setSelectedStation(null);
                }}
                selectedDistrict={filter.district}
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
              stations={stations}
              highwayAlerts={highwayAlerts}
              onFilterSeverity={(sev) => setFilter({ ...filter, severity: sev as any })}
              onFilterRoad={() => {}}
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
            />

            {/* Feed List Items */}
            <TelemetryStationFeedList
              stations={filteredStations}
              highwayAlerts={filteredHighwayAlerts}
              onSelectStation={(s) => {
                setSelectedStation(s);
                setCurrentView('map');
              }}
              onSelectHighwayAlert={(h) => {
                setSelectedHighwayAlert(h);
                setCurrentView('map');
              }}
            />
          </div>
        </main>
      )}

      {/* Detail Slide Drawer */}
      <TelemetryDetailDrawer
        station={selectedStation}
        highwayAlert={selectedHighwayAlert}
        onClose={() => {
          setSelectedStation(null);
          setSelectedHighwayAlert(null);
        }}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
      />

      {/* Emergency Hotline Modal */}
      <EmergencyDrawer
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </div>
  );
}
