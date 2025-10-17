'use client';

import { WeeklySummary } from '@/types';
import { Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface WeeklySummaryCardProps {
  summary: WeeklySummary;
}

export default function WeeklySummaryCard({ summary }: WeeklySummaryCardProps) {
  const stats = [
    {
      label: 'Total Meetings',
      value: summary.total,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Scheduled',
      value: summary.scheduled,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Completed',
      value: summary.done,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Canceled',
      value: summary.canceled,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-5 hover:shadow-lg-soft transition-all duration-300 hover:-translate-y-0.5 shadow-md-soft"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-xl ${stat.bgColor} shadow-md-soft`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">{stat.value}</p>
            <p className="text-sm text-gray-600 font-semibold">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
