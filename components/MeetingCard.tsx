'use client';

import { Meeting, MeetingStatus } from '@/types/meeting';
import { StatusBadge } from '@/components/ui';
import { formatTime, isToday, isPast } from '@/lib/utils/dateHelpers';
import { MapPin, Clock, MoreVertical, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface MeetingCardProps {
  meeting: Meeting;
  onEdit: (meeting: Meeting) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: MeetingStatus) => void;
}

export default function MeetingCard({
  meeting,
  onEdit,
  onDelete,
  onStatusChange,
}: MeetingCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const meetingTime = formatTime(meeting.dateTime);
  const isCurrentDay = isToday(meeting.dateTime);
  const isPastMeeting = isPast(meeting.dateTime);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      onDelete(meeting.id);
    }
    setShowMenu(false);
  };

  return (
    <div
      className={`
        relative bg-white/90 backdrop-blur-sm border rounded-2xl p-4 shadow-md-soft 
        transition-all duration-300 hover:shadow-lg-soft hover:-translate-y-0.5
        ${isCurrentDay ? 'ring-2 ring-blue-400/50 border-blue-200' : 'border-gray-200/50'}
        ${meeting.status === 'canceled' ? 'opacity-70' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base truncate mb-1">
            {meeting.doctorName}
          </h3>
          <StatusBadge status={meeting.status} size="sm" />
        </div>
        
        {/* Menu Button */}
        <div className="relative ml-2" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl-soft border border-gray-200/50 py-1 z-10">
              <button
                onClick={() => {
                  onEdit(meeting);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <Edit2 className="w-4 h-4 text-blue-500" />
                Edit Meeting
              </button>
              
              {meeting.status !== 'done' && (
                <button
                  onClick={() => {
                    onStatusChange(meeting.id, 'done');
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Mark as Done
                </button>
              )}
              
              {meeting.status !== 'canceled' && (
                <button
                  onClick={() => {
                    onStatusChange(meeting.id, 'canceled');
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <XCircle className="w-4 h-4 text-red-500" />
                  Cancel Meeting
                </button>
              )}
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Meeting
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Time */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <Clock className="w-4 h-4 text-blue-500" />
        <span className="font-semibold">{meetingTime}</span>
      </div>

      {/* Hospital */}
      <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
        <MapPin className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{meeting.hospitalName}</p>
          <p className="text-xs text-gray-500 truncate">{meeting.hospitalAddress}</p>
        </div>
      </div>

      {/* Purpose */}
      {meeting.purpose && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-3 py-2 mb-2">
          <p className="text-xs font-medium text-blue-900 truncate">
            {meeting.purpose}
          </p>
        </div>
      )}

      {/* Notes */}
      {meeting.notes && (
        <div className="bg-gray-50/80 rounded-lg px-3 py-2 border border-gray-100">
          <p className="text-xs text-gray-600 line-clamp-2">
            {meeting.notes}
          </p>
        </div>
      )}

      {/* Current day indicator */}
      {isCurrentDay && meeting.status === 'scheduled' && (
        <div className="absolute top-2 left-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      )}
    </div>
  );
}
