'use client';

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui';
import { formatDate, getCurrentWeek, getWeekNumber, getYear } from '@/lib/utils/dateHelpers';
import dayjs from 'dayjs';

interface WeekNavigationProps {
  currentWeek: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
}

export default function WeekNavigation({
  currentWeek,
  onPreviousWeek,
  onNextWeek,
  onToday,
}: WeekNavigationProps) {
  const weekStart = dayjs(currentWeek).startOf('isoWeek');
  const weekEnd = dayjs(currentWeek).endOf('isoWeek');
  const weekNumber = getWeekNumber(currentWeek);
  const year = getYear(currentWeek);

  const isCurrentWeek = () => {
    const { start } = getCurrentWeek();
    return dayjs(weekStart).isSame(dayjs(start), 'day');
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-gray-200/50 shadow-lg-soft">
      {/* Week Info */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-md-soft">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">
            {formatDate(weekStart.toDate(), 'MMM D')} - {formatDate(weekEnd.toDate(), 'MMM D, YYYY')}
          </h2>
          <p className="text-sm text-gray-600 font-medium">
            Week {weekNumber}, {year}
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousWeek}
          icon={<ChevronLeft className="w-4 h-4" />}
        >
          Previous
        </Button>

        {!isCurrentWeek() && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToday}
          >
            Today
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onNextWeek}
          icon={<ChevronRight className="w-4 h-4" />}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
