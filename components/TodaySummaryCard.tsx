'use client';

import { WeeklySummary } from '@/types';
import { Clock, Calendar, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

interface Props {
  total: number;
  scheduled: number;
  done: number;
  canceled: number;
  nextUpTime?: string | null;
}

export default function TodaySummaryCard({ total, scheduled, done, canceled, nextUpTime }: Props) {
  return (
    <div className="card-elevated p-6 bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 animate-slide-in-up">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-gray-900">Today's Summary</h4>
          <p className="text-xs text-gray-600 font-medium">Quick overview</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-200/50 shadow-sm">
          <div className="text-3xl font-extrabold text-gray-900 mb-1">{total}</div>
          <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Total</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/50 shadow-sm">
          <div className="text-3xl font-extrabold text-blue-700 mb-1">{scheduled}</div>
          <div className="text-xs text-blue-600 font-semibold uppercase tracking-wide">Pending</div>
        </div>
      </div>

      <div className="space-y-3 mb-5">
        <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-xl border border-green-100/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Completed</span>
          </div>
          <span className="text-lg font-bold text-green-700">{done}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <XCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Canceled</span>
          </div>
          <span className="text-lg font-bold text-red-700">{canceled}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200/50">
        {nextUpTime ? (
          <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/30">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Next Up</div>
              <div className="text-sm font-bold text-gray-900">{nextUpTime}</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-600 justify-center p-3">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">All caught up!</span>
          </div>
        )}
      </div>
    </div>
  );
}
