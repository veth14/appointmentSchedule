'use client';

import { Meeting } from '@/types/meeting';
import { StatusBadge } from '@/components/ui';
import { Clock, MapPin, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils/dateHelpers';
import dayjs from 'dayjs';

interface CalendarWeekViewProps {
  currentDate: Date;
  meetings: Meeting[];
  onMeetingClick: (meeting: Meeting) => void;
  onStatusChange: (id: string, status: Meeting['status']) => void;
  onDeleteMeeting: (id: string) => void;
  onTimeSlotClick?: (date: Date, hour: number) => void;
}

export default function CalendarWeekView({
  currentDate,
  meetings,
  onMeetingClick,
  onStatusChange,
  onDeleteMeeting,
  onTimeSlotClick,
}: CalendarWeekViewProps) {
  const weekStart = dayjs(currentDate).startOf('week');
  const weekDays = Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day'));
  // Only show business hours: 6 AM to 8 PM
  const hours = Array.from({ length: 15 }, (_, i) => i + 6);

  const getMeetingsForDayAndHour = (day: dayjs.Dayjs, hour: number) => {
    return meetings.filter((meeting) => {
      const meetingDate = dayjs(meeting.dateTime);
      return (
        meetingDate.isSame(day, 'day') &&
        meetingDate.hour() === hour
      );
    });
  };

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 border-green-400 hover:bg-green-200';
      case 'canceled':
        return 'bg-red-100 border-red-400 hover:bg-red-200';
      default:
        return 'bg-blue-100 border-blue-400 hover:bg-blue-200';
    }
  };

  const today = dayjs();

  return (
    <div className="calendar-week-view rounded-xl border border-gray-300 shadow-lg bg-white overflow-hidden">
      {/* Week Header */}
      <div className="grid grid-cols-8 border-b-2 border-gray-300 sticky top-0 bg-white z-10">
        <div className="p-4 text-sm font-bold text-gray-500 border-r border-gray-200 bg-gray-50 text-center flex items-center justify-center gap-2">
          <Clock className="w-4 h-4" />
          <span>TIME</span>
        </div>
        {weekDays.map((day) => {
          const isToday = day.isSame(today, 'day');
          const dayMeetingsCount = meetings.filter((m) => {
            const meetingDate = dayjs(m.dateTime);
            return meetingDate.isSame(day, 'day');
          }).length;
          
          return (
            <div
              key={day.format('YYYY-MM-DD')}
              className={`p-4 text-center border-r border-gray-200 ${
                isToday ? 'bg-blue-500' : 'bg-gray-50'
              }`}
            >
              <div className={`text-xs font-bold uppercase tracking-wider ${
                isToday ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {day.format('ddd')}
              </div>
              <div
                className={`text-2xl font-bold mt-1 ${
                  isToday ? 'text-white' : 'text-gray-900'
                }`}
              >
                {day.format('D')}
              </div>
              <div className={`text-xs font-semibold mt-1 ${
                isToday ? 'text-blue-100' : 'text-gray-600'
              }`}>
                {dayMeetingsCount} {dayMeetingsCount === 1 ? 'event' : 'events'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time Slots */}
      <div className="relative bg-gray-50 overflow-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-gray-200">
            {/* Time Label */}
            <div className="p-4 border-r border-gray-200 bg-white flex items-center justify-center">
              <div className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-md">
                {dayjs().hour(hour).minute(0).format('h:mm A')}
              </div>
            </div>

            {/* Day Cells */}
            {weekDays.map((day) => {
              const dayMeetings = getMeetingsForDayAndHour(day, hour);
              const isToday = day.isSame(today, 'day');
              const cellDateTime = day.hour(hour).minute(0).second(0).toDate();

              return (
                <div
                  key={`${day.format('YYYY-MM-DD')}-${hour}`}
                  onClick={(e) => {
                    // Only trigger if clicking the empty cell, not a meeting
                    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.time-slot-empty')) {
                      onTimeSlotClick?.(cellDateTime, hour);
                    }
                  }}
                  className={`min-h-[100px] p-3 border-r border-gray-200 relative group cursor-pointer transition-all ${
                    isToday ? 'bg-blue-50/50' : 'bg-white hover:bg-blue-50/40'
                  }`}
                >
                  {/* Hover indicator for empty slots */}
                  {dayMeetings.length === 0 && (
                    <div className="time-slot-empty absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="flex items-center gap-2 text-sm font-bold text-blue-700 bg-blue-100 px-4 py-2.5 rounded-lg shadow-lg border-2 border-blue-400">
                        <span className="text-xl">+</span>
                        <span>Add Event</span>
                      </div>
                    </div>
                  )}
                  {dayMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMeetingClick(meeting);
                      }}
                      className={`mb-2 p-3 rounded-lg border-l-[3px] cursor-pointer transition-all hover:shadow-lg ${getStatusColor(
                        meeting.status
                      )} meeting-card group`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-bold text-gray-900 truncate leading-tight">
                          {meeting.doctorName}
                        </h4>
                        <StatusBadge status={meeting.status} size="sm" />
                      </div>

                      <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span className="font-semibold">{dayjs(meeting.dateTime).format('h:mm A')}</span>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{meeting.hospitalName}</span>
                      </div>

                      {meeting.purpose && (
                        <p className="text-xs text-gray-500 mt-1 truncate">{meeting.purpose}</p>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
