import React, { useMemo } from 'react';
import { Meeting, MeetingStatus } from '@/types/meeting';
import { getRelativeTime } from '@/lib/utils/dateHelpers';
import { Clock, MapPin, CheckCircle2 } from 'lucide-react';
import StatusBadge from './ui/StatusBadge';

interface NextUpCardProps {
  meetings: Meeting[];
  onEdit: (m: Meeting) => void;
  onStatusChange: (id: string, status: MeetingStatus) => void;
}

export default function NextUpCard({ meetings, onEdit, onStatusChange }: NextUpCardProps) {
  const nextMeeting = useMemo(() => {
    const now = new Date();
    const upcoming = meetings
      .filter(m => m.status === 'scheduled' && new Date(m.dateTime) > now)
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    return upcoming[0] || null;
  }, [meetings]);

  if (!nextMeeting) {
    return (
      <div className="bg-surface/80 backdrop-blur-sm border border-border rounded-xl p-4">
        <h4 className="text-sm font-semibold text-foreground">No upcoming meetings</h4>
        <p className="text-xs text-muted mt-1">You have no more scheduled meetings for now.</p>
      </div>
    );
  }

  const startsIn = getRelativeTime(new Date(nextMeeting.dateTime));

  return (
    <div className="bg-gradient-to-br from-surface/80 to-surface/60 backdrop-blur-sm border border-border rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground truncate">{nextMeeting.doctorName}</h4>
            <StatusBadge status={nextMeeting.status} size="sm" />
          </div>
          <p className="text-xs text-muted mt-1 truncate">{nextMeeting.hospitalName}</p>
        </div>

        <div className="text-right">
          <div className="text-xs text-muted flex items-center gap-1 justify-end">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{startsIn}</span>
          </div>
          <p className="text-xs text-muted mt-1">{new Date(nextMeeting.dateTime).toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={() => onStatusChange(nextMeeting.id, 'done')}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-success/10 text-success rounded-md text-sm"
        >
          <CheckCircle2 className="w-4 h-4" />
          Mark Done
        </button>

        <button onClick={() => onEdit(nextMeeting)} className="px-3 py-1.5 bg-surface/50 rounded-md text-sm">
          Edit
        </button>
        <div className="ml-auto text-xs text-muted flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{nextMeeting.hospitalAddress}</span>
        </div>
      </div>
    </div>
  );
}
