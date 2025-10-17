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
  isNext?: boolean;
  isPinned?: boolean;
}

export default function MeetingCard({
  meeting,
  onEdit,
  onDelete,
  onStatusChange,
  isNext = false,
  isPinned = false,
}: MeetingCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const didAutoScrollRef = useRef(false);

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

  // If this is the next meeting, scroll it into view on mount
  // Use a ref guard so the effect only triggers once and keep the dependency array length stable.
  useEffect(() => {
    // Don't auto-scroll pinned items (they are already shown above the list)
    if (!didAutoScrollRef.current && isNext && !isPinned && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      didAutoScrollRef.current = true;
    }
    // We intentionally only depend on `isNext` to keep the deps array size stable across HMR/refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNext]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      onDelete(meeting.id);
    }
    setShowMenu(false);
  };

  return (
    <div
      ref={cardRef}
      className={`group relative flex items-start gap-4 bg-white border border-gray-200/60 rounded-xl px-4 py-4 transform transition-all duration-200 hover:shadow-lg hover:border-gray-300/80 ${
        meeting.status === 'canceled' ? 'opacity-60' : ''
      } ${isPinned ? 'shadow-lg border-blue-400/60 bg-blue-50/30' : 'shadow-sm'}`}
    >
      {/* Status accent bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl`}
        style={{
          background:
            meeting.status === 'done'
              ? '#10B981'
              : meeting.status === 'canceled'
              ? '#EF4444'
              : '#3B82F6',
        }}
      />

      <div className="flex-1 min-w-0 pl-2">
        {/* Header: Name and Hospital */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-base font-semibold text-gray-900 truncate">
                {meeting.doctorName}
              </h4>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600 truncate">
                {meeting.hospitalName}
              </span>
            </div>
          </div>

          <StatusBadge status={meeting.status} size="sm" />
        </div>

        {/* Time and Location */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mb-2">
          <div className="inline-flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{meetingTime}</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="truncate">{meeting.hospitalAddress}</span>
          </div>
        </div>

        {/* Purpose */}
        {meeting.purpose && (
          <div className="text-sm text-gray-700 mb-1">{meeting.purpose}</div>
        )}

        {/* Notes */}
        {meeting.notes && (
          <div className="text-sm text-gray-500 line-clamp-1">{meeting.notes}</div>
        )}
      </div>

      {/* Actions: Mark Done is always visible for non-done meetings; edit/delete remain hover actions */}
      <div className="flex items-center gap-2">
        {meeting.status !== 'done' && (
          <button
            onClick={() => onStatusChange(meeting.id, 'done')}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 text-green-700 rounded-md text-sm font-semibold shadow-sm hover:bg-green-100 transition"
            title="Mark as done"
          >
            <CheckCircle2 className="w-4 h-4" />
            Done
          </button>
        )}

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(meeting)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
