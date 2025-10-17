'use client';

import { Meeting } from '@/types/meeting';
import { X, Calendar, Clock, MapPin, Building2, FileText, User, Edit2, Trash2 } from 'lucide-react';
import { formatTime, formatDate } from '@/lib/utils/dateHelpers';
import { StatusBadge } from '@/components/ui';

interface MeetingPreviewPanelProps {
  meeting: Meeting | null;
  onClose: () => void;
  onEdit: (meeting: Meeting) => void;
  onDelete: (id: string) => void;
}

export default function MeetingPreviewPanel({
  meeting,
  onClose,
  onEdit,
  onDelete,
}: MeetingPreviewPanelProps) {
  if (!meeting) {
    return (
      <div className="card-elevated bg-white border border-gray-100 animate-slide-in-up h-[720px] overflow-hidden">
        {/* Empty Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-5 relative">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-0.5">No Meeting Selected</h3>
              <p className="text-xs text-slate-300">Click on a meeting to view details</p>
            </div>
          </div>
        </div>

        {/* Empty Content - Matching the size of filled state */}
        <div className="p-6 space-y-5">
          {/* Placeholder sections to match size */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-8 bg-gray-100 rounded-lg w-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/50 h-24"></div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/50 h-24"></div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200/50 h-28"></div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/50 h-16"></div>
          </div>

          <div className="text-center py-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 font-medium">Select a meeting card to view full details</p>
          </div>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      onDelete(meeting.id);
      onClose();
    }
  };

  return (
    <div className="card-elevated bg-white border border-gray-100 animate-slide-in-up h-[720px] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200"
          title="Close"
        >
          <X className="w-4 h-4 text-white" />
        </button>
        <div className="flex items-start gap-3 pr-12">
          <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-0.5">Meeting Details</h3>
            <p className="text-xs text-blue-100">Full information view</p>
          </div>
        </div>
      </div>

      {/* Content */}
        <div className="p-6 space-y-5">
        {/* Doctor Name & Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1 block">Doctor Name</label>
            <h4 className="text-2xl font-bold text-gray-900">{meeting.doctorName}</h4>
          </div>
          <StatusBadge status={meeting.status} size="md" />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Date</label>
            </div>
            <p className="text-base font-bold text-gray-900">{formatDate(meeting.dateTime, 'MMM D, YYYY')}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Time</label>
            </div>
            <p className="text-base font-bold text-gray-900">{formatTime(meeting.dateTime)}</p>
          </div>
        </div>

        {/* Hospital Info */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200/50">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-5 h-5 text-blue-600" />
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Hospital</label>
          </div>
          <p className="text-lg font-bold text-gray-900 mb-2">{meeting.hospitalName}</p>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700 font-medium">{meeting.hospitalAddress}</p>
          </div>
        </div>

        {/* Purpose */}
        {meeting.purpose && (
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 block">Purpose</label>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/50">
              <p className="text-sm text-gray-900 font-medium leading-relaxed">{meeting.purpose}</p>
            </div>
          </div>
        )}

        {/* Notes - Always show with placeholder */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-gray-600" />
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Notes</label>
          </div>
          <div className={`rounded-xl p-4 border ${meeting.notes ? 'bg-yellow-50/50 border-yellow-200/50' : 'bg-gray-50 border-gray-200/50'}`}>
            <p className={`text-sm leading-relaxed ${meeting.notes ? 'text-gray-700 italic' : 'text-gray-400 italic'}`}>
              {meeting.notes || 'No notes available'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => onEdit(meeting)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Edit2 className="w-4 h-4" />
            Edit Meeting
          </button>
          <button
            onClick={handleDelete}
            className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-200 transition-all duration-200"
            title="Delete meeting"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
