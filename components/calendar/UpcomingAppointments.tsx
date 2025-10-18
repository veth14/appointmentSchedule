'use client';

import { Meeting } from '@/types/meeting';
import dayjs from 'dayjs';

interface UpcomingAppointmentsProps {
  meetings: Meeting[];
  onMeetingClick: (meeting: Meeting) => void;
}

export default function UpcomingAppointments({
  meetings,
  onMeetingClick,
}: UpcomingAppointmentsProps) {
  // Calculate status counts
  const scheduledCount = meetings.filter(m => m.status === 'scheduled').length;
  const doneCount = meetings.filter(m => m.status === 'done').length;
  
  return (
    <div className="w-80 mr-6 bg-white border-2 border-gray-300 rounded-xl shadow-lg flex flex-col overflow-hidden">
      <div className="p-3 border-b-2 border-gray-300 bg-gray-100">
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider text-center">
          Upcoming Appointments
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {meetings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400 italic">No upcoming meetings</p>
            </div>
          ) : (
            meetings.map(meeting => (
              <div
                key={meeting.id}
                onClick={() => onMeetingClick(meeting)}
                className="p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-gray-200 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {meeting.doctorName}
                  </p>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                    {dayjs(meeting.dateTime).format('MMM D')}
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 mb-2">
                  {meeting.hospitalName}
                </p>
                
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-gray-700 font-medium">
                    {dayjs(meeting.dateTime).format('h:mm A')}
                  </p>
                </div>

                {meeting.purpose && (
                  <p className="text-xs text-gray-500 mt-2 truncate italic">
                    {meeting.purpose}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Status Summary */}
      <div className="border-t-2 border-gray-300 p-4 bg-gradient-to-br from-gray-50 to-white">
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Status Overview
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-blue-100 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm"></div>
              <span className="text-xs font-semibold text-gray-700">Scheduled</span>
            </div>
            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{scheduledCount}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-green-100 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm"></div>
              <span className="text-xs font-semibold text-gray-700">Completed</span>
            </div>
            <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{doneCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
