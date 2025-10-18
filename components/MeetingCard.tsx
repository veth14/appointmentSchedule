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
  onClick?: (meeting: Meeting) => void;
  isNext?: boolean;
  isPinned?: boolean;
}

export default function MeetingCard({
  meeting,
  onEdit,
  onDelete,
  onStatusChange,
  onClick,
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
      onClick={() => onClick?.(meeting)}
      className={`group relative flex items-center gap-3 bg-white border rounded-xl px-4 py-3 transform transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${
        meeting.status === 'canceled' ? 'opacity-60' : ''
      } ${
        isPinned 
          ? 'shadow-lg border-blue-500/40 bg-gradient-to-br from-white via-blue-50/30 to-white ring-2 ring-blue-500/20' 
          : 'shadow-sm border-gray-200/60 hover:border-gray-300/80'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Enhanced Status accent bar with gradient */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl`}
        style={{
          background:
            meeting.status === 'done'
              ? 'linear-gradient(180deg, #10B981 0%, #059669 100%)'
              : meeting.status === 'canceled'
              ? 'linear-gradient(180deg, #EF4444 0%, #DC2626 100%)'
              : 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)',
        }}
      />

      <div className="flex-1 min-w-0 pl-1">
        {/* Header: Name and Hospital */}
        <div className="flex items-start gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-bold text-gray-900 truncate mb-0.5">
              {meeting.doctorName}
            </h4>
            <span className="text-xs text-gray-600 font-medium truncate block">
              {meeting.hospitalName}
            </span>
          </div>
        </div>

        {/* Time and Location - More compact */}
        <div className="flex items-center gap-3 text-xs text-gray-700 mb-2">
          <div className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold">{meetingTime}</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-500" />
            <span className="truncate font-medium">{meeting.hospitalAddress}</span>
          </div>
        </div>

        {/* Purpose - Compact */}
        {meeting.purpose && (
          <div className="text-xs text-gray-700 font-medium line-clamp-1">
            {meeting.purpose}
          </div>
        )}
      </div>

      {/* Status Badge and Actions - Right aligned */}
      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
        <StatusBadge status={meeting.status} size="sm" />
        
        {meeting.status !== 'done' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(meeting.id, 'done');
            }}
            className="p-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200 flex items-center justify-center"
            title="Mark as done"
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
