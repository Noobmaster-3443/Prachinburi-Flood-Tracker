'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { DynamicMap } from '@/components/Map/DynamicMap';
import { FilterBar } from '@/components/Filters/FilterBar';
import { ReportFeedList } from '@/components/Feed/ReportFeedList';
import { ReportFormModal } from '@/components/ReportModal/ReportFormModal';
import { ReportDetailDrawer } from '@/components/ReportDrawer/ReportDetailDrawer';
import { EmergencyDrawer } from '@/components/Emergency/EmergencyDrawer';
import { FloatingActionButton } from '@/components/ReportModal/FloatingActionButton';
import { FloodReport, FilterState } from '@/types';
import { getReports, createReport, upvoteReport, deleteReport } from '@/lib/reports-store';
import { CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [reports, setReports] = useState<FloodReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'map' | 'list'>('map');
  const [selectedReport, setSelectedReport] = useState<FloodReport | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter state
  const [filter, setFilter] = useState<FilterState>({
    district: 'all',
    severity: 'all',
    onlyPassable: null,
    searchQuery: '',
    onlyVerified: false,
  });

  // Load initial reports
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getReports();
        setReports(data);
      } catch (err) {
        console.error('Failed to load flood reports:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter logic
  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      // District filter
      if (filter.district !== 'all' && rep.district !== filter.district) {
        return false;
      }

      // Severity filter
      if (filter.severity !== 'all' && rep.severity !== filter.severity) {
        return false;
      }

      // Passability filter
      if (filter.onlyPassable !== null) {
        if (filter.onlyPassable === true && !rep.passable_for_vehicles) return false;
        if (filter.onlyPassable === false && rep.passable_for_vehicles) return false;
      }

      // Search query
      if (filter.searchQuery.trim() !== '') {
        const query = filter.searchQuery.toLowerCase();
        const matchName = rep.location_name.toLowerCase().includes(query);
        const matchDistrict = rep.district.toLowerCase().includes(query);
        const matchSubdistrict = rep.subdistrict.toLowerCase().includes(query);
        const matchDesc = rep.description?.toLowerCase().includes(query);
        if (!matchName && !matchDistrict && !matchSubdistrict && !matchDesc) {
          return false;
        }
      }

      return true;
    });
  }, [reports, filter]);

  // Handle report submission
  const handleNewReport = async (
    reportData: Omit<FloodReport, 'id' | 'created_at' | 'upvotes'>,
    imageBlob?: Blob
  ) => {
    const created = await createReport(reportData, imageBlob);
    setReports((prev) => [created, ...prev]);
    setSelectedReport(created);

    // Show success notification
    setToastMessage('ขอบคุณที่ร่วมรายงาน! ข้อมูลของคุณช่วยให้ชาวปราจีนบุรีปลอดภัยยิ่งขึ้น');
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Handle report upvote
  const handleUpvote = async (id: string) => {
    const newCount = await upvoteReport(id);
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: newCount } : r))
    );
    if (selectedReport && selectedReport.id === id) {
      setSelectedReport((prev) => (prev ? { ...prev, upvotes: newCount } : null));
    }
  };

  // Handle report delete (Admin)
  const handleDeleteReport = async (id: string) => {
    const success = await deleteReport(id);
    if (success) {
      setReports((prev) => prev.filter((r) => r.id !== id));
      setSelectedReport(null);
      setToastMessage('ลบรายงานออกจากระบบเรียบร้อยแล้ว');
      setTimeout(() => {
        setToastMessage(null);
      }, 3500);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-slate-100">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        reports={reports}
      />

      {/* Floating Filter Bar under Navbar */}
      <div className="fixed top-18 sm:top-20 left-0 right-0 z-20 px-3 sm:px-4 pointer-events-none">
        <div className="pointer-events-auto">
          <FilterBar
            filter={filter}
            onFilterChange={setFilter}
            totalResults={filteredReports.length}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full h-full pt-16 relative">
        {currentView === 'map' ? (
          <div className="w-full h-full">
            <DynamicMap
              reports={filteredReports}
              selectedReport={selectedReport}
              onSelectReport={setSelectedReport}
              selectedDistrict={filter.district}
            />
          </div>
        ) : (
          <div className="w-full h-full overflow-y-auto pt-24 pb-20">
            <ReportFeedList
              reports={filteredReports}
              onSelectReport={(r) => {
                setSelectedReport(r);
              }}
            />
          </div>
        )}
      </main>

      {/* Mobile Floating Action Button (FAB) */}
      <FloatingActionButton onClick={() => setIsReportModalOpen(true)} />

      {/* Detail Slide Drawer / Popup */}
      <ReportDetailDrawer
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onUpvote={handleUpvote}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
        onDeleteReport={handleDeleteReport}
      />

      {/* Submission Modal */}
      <ReportFormModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleNewReport}
      />

      {/* Emergency Hotline Modal */}
      <EmergencyDrawer
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      {/* Success Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm animate-in fade-in slide-in-from-top-2 border border-slate-700 max-w-sm sm:max-w-md mx-auto">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
