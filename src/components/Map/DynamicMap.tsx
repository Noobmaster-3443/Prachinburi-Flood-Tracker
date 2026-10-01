'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Loader2 } from 'lucide-react';
import { FloodReport } from '@/types';

interface DynamicMapProps {
  reports: FloodReport[];
  selectedReport: FloodReport | null;
  onSelectReport: (report: FloodReport) => void;
  selectedDistrict: string;
}

const FloodMap = dynamic(
  () => import('./FloodMap').then((mod) => mod.FloodMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[500px] bg-slate-100 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium">กำลังโหลดแผนที่จังหวัดปราจีนบุรี...</p>
      </div>
    ),
  }
);

export const DynamicMap: React.FC<DynamicMapProps> = (props) => {
  return <FloodMap {...props} />;
};
