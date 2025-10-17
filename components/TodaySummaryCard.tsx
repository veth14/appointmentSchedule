'use client';

import { WeeklySummary } from '@/types';
import { Clock } from 'lucide-react';

interface Props {
  total: number;
  scheduled: number;
  done: number;
  canceled: number;
  nextUpTime?: string | null;
}

export default function TodaySummaryCard({ total, scheduled, done, canceled, nextUpTime }: Props) {
  return (
    <div className="bg-white border border-gray-200/60 rounded-xl p-5 shadow-sm">
      <div className="mb-4">
        <h4 className="text-lg font-bold text-gray-900 mb-1">Today</h4>
        <p className="text-sm text-gray-600">Quick summary for today</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-gray-900">{total}</div>
          <div className="text-xs text-gray-600 mt-0.5">meetings</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-600">{scheduled}</div>
          <div className="text-xs text-gray-600 mt-0.5">scheduled</div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>{done} done</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span>{canceled} canceled</span>
        </div>
      </div>

      {nextUpTime ? (
        <div className="pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-600 mb-1">No upcoming meetings for today</div>
        </div>
      ) : (
        <div className="pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-600 mb-1">No upcoming meetings for today</div>
        </div>
      )}
    </div>
  );
}
