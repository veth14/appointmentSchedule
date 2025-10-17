'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Meeting, MeetingFormData, MeetingStatus } from '@/types/meeting';
import { Hospital } from '@/types/hospital';
import { WeeklySummary } from '@/types';
import { Button } from '@/components/ui';
import MeetingCard from '@/components/MeetingCard';
import MeetingFormModal from '@/components/MeetingFormModal';
import WeekNavigation from '@/components/WeekNavigation';
import FilterSearchBar from '@/components/FilterSearchBar';
import WeeklySummaryCard from '@/components/WeeklySummaryCard';
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

  // Load data
  useEffect(() => {
    loadData();
  }, [currentWeek]);

  const loadData = async () => {
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
  };

  // Calculate weekly summary
  const weeklySummary: WeeklySummary = {
    total: filteredMeetings.length,
    scheduled: filteredMeetings.filter(m => m.status === 'scheduled').length,
    done: filteredMeetings.filter(m => m.status === 'done').length,
    canceled: filteredMeetings.filter(m => m.status === 'canceled').length,
  };

  // Get week days
  const weekDays = getWeekDays(currentWeek);

  // Get meetings for a specific day
  const getMeetingsForDay = (day: Date) => {
    return filteredMeetings.filter(meeting =>
      isSameDay(meeting.dateTime, day)
    ).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  };

  // Handlers
  const handleCreateMeeting = async (data: MeetingFormData) => {
    await createMeeting(data);
    await loadData();
  };

  const handleUpdateMeeting = async (data: MeetingFormData) => {
    if (editingMeeting) {
      await updateMeeting(editingMeeting.id, data);
      await loadData();
      setEditingMeeting(null);
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    await deleteMeeting(id);
    await loadData();
  };

  const handleStatusChange = async (id: string, status: MeetingStatus) => {
    await updateMeetingStatus(id, status);
    await loadData();
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
    <div className="max-w-7xl mx-auto space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">
            Meeting Schedule
          </h1>
          <p className="text-gray-600 font-medium">
            Manage your doctor meetings across hospitals
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => setIsModalOpen(true)}
          className="shadow-lg-soft"
        >
          New Meeting
        </Button>
      </div>

      {/* Week Navigation */}
      <WeekNavigation
        currentWeek={currentWeek}
        onPreviousWeek={() => setCurrentWeek(getPreviousWeek(currentWeek))}
        onNextWeek={() => setCurrentWeek(getNextWeek(currentWeek))}
        onToday={() => setCurrentWeek(getCurrentWeek().start)}
      />

      {/* Weekly Summary */}
      <WeeklySummaryCard summary={weeklySummary} />

      {/* Search and Filters */}
      <FilterSearchBar
        onSearch={handleSearch}
        onFilterStatus={handleFilterStatus}
        onFilterHospital={handleFilterHospital}
        hospitals={hospitals}
      />

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading meetings...</p>
        </div>
      ) : (
        <>
          {/* Week View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {weekDays.map((day) => {
              const dayMeetings = getMeetingsForDay(day);
              const isCurrentDay = isToday(day);
              
              return (
                <div key={day.toISOString()} className="flex flex-col h-[calc(100vh-28rem)]">
                  {/* Day Header - Sticky */}
                  <div className={`
                    sticky top-0 z-10 bg-white/90 backdrop-blur-sm border rounded-2xl p-4 shadow-md-soft mb-3
                    ${isCurrentDay ? 'ring-2 ring-blue-400/50 border-blue-200 bg-gradient-to-br from-blue-50/80 to-indigo-50/50' : 'border-gray-200/50'}
                  `}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={`text-lg font-bold ${isCurrentDay ? 'text-blue-900' : 'text-gray-900'} tracking-tight`}>
                          {getDayName(day, true)}
                        </h3>
                        <p className={`text-sm font-semibold ${isCurrentDay ? 'text-blue-700' : 'text-gray-600'}`}>
                          {formatDate(day, 'MMM D')}
                        </p>
                      </div>
                      <div className={`
                        px-3 py-1.5 rounded-full text-xs font-bold
                        ${isCurrentDay 
                          ? 'bg-blue-500 text-white shadow-md-soft' 
                          : 'bg-gray-100 text-gray-700'
                        }
                      `}>
                        {dayMeetings.length} {dayMeetings.length === 1 ? 'meeting' : 'meetings'}
                      </div>
                    </div>
                  </div>

                  {/* Meetings - Scrollable Container */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                    {dayMeetings.length > 0 ? (
                      dayMeetings.map((meeting) => (
                        <MeetingCard
                          key={meeting.id}
                          meeting={meeting}
                          onEdit={handleEditMeeting}
                          onDelete={handleDeleteMeeting}
                          onStatusChange={handleStatusChange}
                        />
                      ))
                    ) : (
                      <div className="bg-white/50 backdrop-blur-sm border border-gray-200/50 border-dashed rounded-2xl p-6 text-center">
                        <p className="text-sm text-gray-500 font-medium">No meetings scheduled</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

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
