'use client';

import { Meeting } from '@/types/meeting';
import { StatusBadge } from '@/components/ui';
import { Clock } from 'lucide-react';
import dayjs from 'dayjs';

interface CalendarMonthViewProps {
  currentDate: Date;
  meetings: Meeting[];
  onMeetingClick: (meeting: Meeting) => void;
  onDayClick?: (date: Date) => void;
}

export default function CalendarMonthView({
  currentDate,
  meetings,
  onMeetingClick,
  onDayClick,
}: CalendarMonthViewProps) {
  const monthStart = dayjs(currentDate).startOf('month');
  const monthEnd = dayjs(currentDate).endOf('month');
  const calendarStart = monthStart.startOf('week');
  const calendarEnd = monthEnd.endOf('week');

  const weeks: dayjs.Dayjs[][] = [];
  let currentWeek: dayjs.Dayjs[] = [];
  let day = calendarStart;

  while (day.isBefore(calendarEnd, 'day') || day.isSame(calendarEnd, 'day')) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    day = day.add(1, 'day');
  }

  const getMeetingsForDay = (day: dayjs.Dayjs) => {
    return meetings.filter((meeting) =>
      dayjs(meeting.dateTime).isSame(day, 'day')
    );
  };

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 border-l-4 border-green-500';
      case 'canceled':
        return 'bg-red-100 border-l-4 border-red-500';
      default:
        return 'bg-blue-100 border-l-4 border-blue-500';
    }
  };

  const today = dayjs();

  return (
    <div className="calendar-month-view rounded-xl border-2 border-gray-300 overflow-hidden shadow-lg bg-white h-full flex flex-col">
      {/* Week Days Header */}
      <div className="grid grid-cols-7 border-b-2 border-gray-300 flex-shrink-0">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="bg-gray-100 p-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider border-r border-gray-300 last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 flex-1">
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            const isCurrentMonth = day.isSame(monthStart, 'month');
            const isToday = day.isSame(today, 'day');
            const dayMeetings = getMeetingsForDay(day);

            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                onClick={(e) => {
                  // Only trigger if clicking the day cell, not a meeting
                  if (e.target === e.currentTarget || !(e.target as HTMLElement).closest('.meeting-item')) {
                    onDayClick?.(day.toDate());
                  }
                }}
                className={`bg-white min-h-[140px] p-3 cursor-pointer transition-all hover:bg-blue-50 group relative border-r border-b border-gray-200 ${
                  !isCurrentMonth ? 'opacity-40 bg-gray-50' : ''
                }`}
              >
                {/* Hover indicator for adding */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1.5 rounded-lg shadow-md border border-blue-300">
                    + Add
                  </div>
                </div>
                {/* Date Number */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-sm font-bold ${
                      isToday
                        ? 'bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md'
                        : isCurrentMonth
                        ? 'text-gray-900 w-8 h-8 flex items-center justify-center'
                        : 'text-gray-400 w-8 h-8 flex items-center justify-center'
                    }`}
                  >
                    {day.format('D')}
                  </span>
                  {dayMeetings.length > 0 && (
                    <span className="text-xs font-bold text-white bg-blue-500 px-2 py-0.5 rounded-full">
                      {dayMeetings.length}
                    </span>
                  )}
                </div>

                {/* Meetings */}
                <div className="space-y-2">
                  {dayMeetings.slice(0, 3).map((meeting) => (
                    <div
                      key={meeting.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMeetingClick(meeting);
                      }}
                      className={`meeting-item p-2 rounded-lg text-xs cursor-pointer hover:shadow-lg transition-all shadow-md ${getStatusColor(
                        meeting.status
                      )}`}
                    >
                      <div className="font-semibold text-gray-900 truncate mb-0.5">
                        {meeting.doctorName}
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{dayjs(meeting.dateTime).format('h:mm A')}</span>
                      </div>
                      <div className="text-gray-700 truncate mt-0.5">
                        {meeting.hospitalName}
                      </div>
                    </div>
                  ))}
                  {dayMeetings.length > 3 && (
                    <div className="text-xs text-blue-700 font-bold pl-2 hover:text-blue-800 cursor-pointer bg-blue-50 py-1 rounded">
                      +{dayMeetings.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
