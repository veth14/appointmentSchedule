'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Meeting, MeetingFormData, MeetingStatus } from '@/types/meeting';
import { Hospital } from '@/types/hospital';
import { WeeklySummary } from '@/types';
import { Button } from '@/components/ui';
import MeetingCard from '@/components/MeetingCard';
import MeetingFormModal from '@/components/MeetingFormModal';
// WeekNavigation removed per request
import FilterSearchBar from '@/components/FilterSearchBar';
import TodaySummaryCard from '@/components/TodaySummaryCard';
import {
  getMeetingsByWeek,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  updateMeetingStatus,
} from '@/lib/services/meetingsService';
import { getAllHospitals } from '@/lib/services/hospitalsService';
import {
  getCurrentWeek,
  getPreviousWeek,
  getNextWeek,
  getWeekDays,
  formatDate,
  getDayName,
  isSameDay,
  isToday,
} from '@/lib/utils/dateHelpers';

export default function DashboardPage() {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);

  // Refresh data helper used by effect and handlers
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [meetingsData, hospitalsData] = await Promise.all([
        getMeetingsByWeek(currentWeek),
        getAllHospitals(),
      ]);
      setMeetings(meetingsData);
      setFilteredMeetings(meetingsData);
      setHospitals(hospitalsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentWeek]);

  useEffect(() => {
    // call the stable refreshData callback
    refreshData();
  }, [refreshData]);

  // Calculate weekly summary
  const weeklySummary: WeeklySummary = {
    total: filteredMeetings.length,
    scheduled: filteredMeetings.filter(m => m.status === 'scheduled').length,
    done: filteredMeetings.filter(m => m.status === 'done').length,
    canceled: filteredMeetings.filter(m => m.status === 'canceled').length,
  };

  // Get week days and filter to weekdays (Mon-Fri)
  const weekDays = getWeekDays(currentWeek).filter((d) => {
    const day = d.getDay();
    // getDay(): 0 = Sunday, 6 = Saturday -> keep 1..5
    return day >= 1 && day <= 5;
  });

  // Get meetings for a specific day
  const getMeetingsForDay = (day: Date) => {
    const meetingsForDay = filteredMeetings.filter(meeting => isSameDay(meeting.dateTime, day));

    const now = new Date();

    // Upcoming (at or after now) sorted soonest-first
    const upcoming = meetingsForDay
      .filter(m => new Date(m.dateTime) >= now)
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

    // Past (before now) sorted most-recent-first so the closest past items appear above older ones
    const past = meetingsForDay
      .filter(m => new Date(m.dateTime) < now)
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

    return [...upcoming, ...past];
  };

  // Determine the next upcoming meeting for today (scheduled and in the future) and pin it
  // Use filteredMeetings so the pin respects search/filters
  const pinnedMeeting = (() => {
    const now = new Date();
    const today = new Date();
    const upcomingToday = filteredMeetings
      .filter(
        (m) =>
          m.status === 'scheduled' &&
          isSameDay(m.dateTime, today) &&
          new Date(m.dateTime) > now
      )
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

    return upcomingToday[0] ?? null;
  })();

  // Handlers
  const handleCreateMeeting = async (data: MeetingFormData) => {
    await createMeeting(data);
    await refreshData();
  };

  const handleUpdateMeeting = async (data: MeetingFormData) => {
    if (editingMeeting) {
      await updateMeeting(editingMeeting.id, data);
      await refreshData();
      setEditingMeeting(null);
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    await deleteMeeting(id);
    await refreshData();
  };

  const handleStatusChange = async (id: string, status: MeetingStatus) => {
    await updateMeetingStatus(id, status);
    await refreshData();
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingMeeting(null);
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredMeetings(meetings);
      return;
    }
    const lowerQuery = query.toLowerCase();
    setFilteredMeetings(
      meetings.filter(
        m =>
          m.doctorName.toLowerCase().includes(lowerQuery) ||
          m.hospitalName.toLowerCase().includes(lowerQuery) ||
          m.hospitalAddress.toLowerCase().includes(lowerQuery) ||
          m.purpose?.toLowerCase().includes(lowerQuery) ||
          m.notes?.toLowerCase().includes(lowerQuery)
      )
    );
  };

  const handleFilterStatus = (status: MeetingStatus | 'all') => {
    if (status === 'all') {
      setFilteredMeetings(meetings);
    } else {
      setFilteredMeetings(meetings.filter(m => m.status === status));
    }
  };

  const handleFilterHospital = (hospitalId: string) => {
    if (hospitalId === 'all') {
      setFilteredMeetings(meetings);
    } else {
      setFilteredMeetings(meetings.filter(m => m.hospitalId === hospitalId));
    }
  };

  return (
  // Full width container closer to the sidebar
  <div className="w-full px-6 md:px-8 lg:px-10 xl:px-12 pb-10 overflow-x-hidden bg-gray-50/50">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6 pt-6">
        <div className="flex-1 max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
            Tasks for Today
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            Manage your doctor meetings across hospitals
          </p>

          {/* Move search bar to the top */}
          <div className="w-full">
            <FilterSearchBar
              onSearch={handleSearch}
              onFilterStatus={handleFilterStatus}
              onFilterHospital={handleFilterHospital}
              hospitals={hospitals}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            icon={<Plus className="w-5 h-5" />}
            onClick={() => setIsModalOpen(true)}
            className="shadow-sm"
          >
            New Meeting
          </Button>
        </div>
      </div>

      {/* Two-column layout: left = today's vertical list (bounded & scrollable), right = controls (sticky) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Today's meetings - occupy 8/12 on large screens */}
        <div className="col-span-1 lg:col-span-8 flex flex-col">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading meetings...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 h-full">
              {(() => {
                const today = new Date();
                const dayMeetings = getMeetingsForDay(today);

                return (
                  <div className="w-full flex flex-col min-h-0">
                    <div className="bg-white border border-gray-200/60 rounded-xl p-4 shadow-sm mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            Today — {formatDate(today, 'ddd, MMM D')}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(today, 'YYYY')}
                          </p>
                        </div>
                        <div className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white">
                          {dayMeetings.length} {dayMeetings.length === 1 ? 'meeting' : 'meetings'}
                        </div>
                      </div>
                    </div>

                    {/* Pinned next-up meeting (if any) - shown above the scrollable list */}
                    {pinnedMeeting && (
                      <div className="mb-4">
                        <MeetingCard
                          meeting={pinnedMeeting}
                          onEdit={handleEditMeeting}
                          onDelete={handleDeleteMeeting}
                          onStatusChange={handleStatusChange}
                          isPinned
                        />
                      </div>
                    )}

                    {/* Bounded scrollable list to prevent endless page scrolling */}
                    <div className="overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 max-h-[calc(100vh-20rem)]">
                      {dayMeetings.length > 0 ? (
                        dayMeetings
                          .filter((m) => m.id !== pinnedMeeting?.id)
                          .map((meeting) => (
                            <MeetingCard
                              key={meeting.id}
                              meeting={meeting}
                              onEdit={handleEditMeeting}
                              onDelete={handleDeleteMeeting}
                              onStatusChange={handleStatusChange}
                            />
                          ))
                      ) : (
                        <div className="bg-white rounded-xl p-8 border border-gray-200/60 text-center">
                          <p className="text-sm text-gray-600">No meetings scheduled for today</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Right column: Controls - occupy 4/12 on large screens */}
        <aside className="col-span-1 lg:col-span-4">
          <div className="sticky top-24 space-y-4">
            <TodaySummaryCard
              total={filteredMeetings.filter(m => isToday(m.dateTime)).length}
              scheduled={filteredMeetings.filter(m => isToday(m.dateTime) && m.status === 'scheduled').length}
              done={filteredMeetings.filter(m => isToday(m.dateTime) && m.status === 'done').length}
              canceled={filteredMeetings.filter(m => isToday(m.dateTime) && m.status === 'canceled').length}
              nextUpTime={pinnedMeeting ? new Date(pinnedMeeting.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null}
            />
          </div>
        </aside>
      </div>

      {/* Meeting Form Modal */}
      <MeetingFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={editingMeeting ? handleUpdateMeeting : handleCreateMeeting}
        hospitals={hospitals}
        meeting={editingMeeting}
      />
    </div>
  );
}
