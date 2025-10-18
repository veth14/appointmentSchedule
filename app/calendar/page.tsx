'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Search, Calendar as CalendarIcon, Filter, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { Meeting, MeetingFormData } from '@/types/meeting';
import { Hospital } from '@/types/hospital';
import { Button } from '@/components/ui';
import MeetingFormModal from '@/components/MeetingFormModal';
import CalendarWeekView from '@/components/calendar/CalendarWeekView';
import CalendarMonthView from '@/components/calendar/CalendarMonthView';
import UpcomingAppointments from '@/components/calendar/UpcomingAppointments';
import LoadingScreen from '@/components/LoadingScreen';
import {
  getMeetingsByWeek,
  getAllMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  updateMeetingStatus,
} from '@/lib/services/meetingsService';
import { getAllHospitals } from '@/lib/services/hospitalsService';
import dayjs from 'dayjs';

type ViewMode = 'week' | 'month';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [allMeetings, setAllMeetings] = useState<Meeting[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [initialDateTime, setInitialDateTime] = useState<Date | undefined>(undefined);
  const [filteredStatuses, setFilteredStatuses] = useState<string[]>(['scheduled', 'done', 'canceled']);

  useEffect(() => {
    loadData();
  }, [currentDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [allMeetingsData, hospitalsData] = await Promise.all([
        getAllMeetings(),
        getAllHospitals(),
      ]);

      setAllMeetings(allMeetingsData);
      setMeetings(allMeetingsData); // Use all meetings for display
      setHospitals(hospitalsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (viewMode === 'week') {
      setCurrentDate(dayjs(currentDate).subtract(1, 'week').toDate());
    } else {
      setCurrentDate(dayjs(currentDate).subtract(1, 'month').toDate());
    }
  };

  const handleNext = () => {
    if (viewMode === 'week') {
      setCurrentDate(dayjs(currentDate).add(1, 'week').toDate());
    } else {
      setCurrentDate(dayjs(currentDate).add(1, 'month').toDate());
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleCreateMeeting = async (data: MeetingFormData) => {
    await createMeeting(data);
    await loadData();
  };

  const handleEditMeeting = async (data: MeetingFormData) => {
    if (selectedMeeting) {
      await updateMeeting(selectedMeeting.id, data);
      await loadData();
      setSelectedMeeting(null);
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    await deleteMeeting(id);
    await loadData();
  };

  const handleStatusChange = async (id: string, status: Meeting['status']) => {
    await updateMeetingStatus(id, status);
    await loadData();
  };

  const openEditModal = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setInitialDateTime(undefined);
    setIsModalOpen(true);
  };

  const handleTimeSlotClick = (date: Date, hour: number) => {
    const dateWithTime = dayjs(date).hour(hour).minute(0).second(0).toDate();
    setInitialDateTime(dateWithTime);
    setSelectedMeeting(null);
    setIsModalOpen(true);
  };

  const handleDayClick = (date: Date) => {
    // Set time to 9 AM by default when clicking a day in month view
    const dateWithTime = dayjs(date).hour(9).minute(0).second(0).toDate();
    setInitialDateTime(dateWithTime);
    setSelectedMeeting(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMeeting(null);
    setInitialDateTime(undefined);
  };

  const getDateRangeText = () => {
    if (viewMode === 'week') {
      const weekStart = dayjs(currentDate).startOf('week');
      const weekEnd = dayjs(currentDate).endOf('week');
      return `${weekStart.format('MMM D')} - ${weekEnd.format('MMM D, YYYY')}`;
    } else {
      return dayjs(currentDate).format('MMMM YYYY');
    }
  };

  const filteredMeetings = meetings.filter(m => filteredStatuses.includes(m.status));

  if (loading) {
    return <LoadingScreen />;
  }

  // Calculate stats and upcoming meetings from all meetings
  const scheduledCount = allMeetings.filter(m => m.status === 'scheduled').length;
  const completedCount = allMeetings.filter(m => m.status === 'done').length;
  const canceledCount = allMeetings.filter(m => m.status === 'canceled').length;
  const upcomingMeetings = allMeetings
    .filter(m => m.status === 'scheduled' && dayjs(m.dateTime).isAfter(dayjs()))
    .sort((a, b) => dayjs(a.dateTime).diff(dayjs(b.dateTime)))
    .slice(0, 5);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToday}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  Today
                </button>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevious}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  {getDateRangeText()}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-64 bg-white"
                  />
                </div>

                {/* View Mode Switcher */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('week')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      viewMode === 'week'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setViewMode('month')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      viewMode === 'month'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Month
                  </button>
                </div>

                {/* New Appointment Button */}
                <Button
                  variant="primary"
                  icon={<Plus className="w-5 h-5" />}
                  onClick={() => {
                    setInitialDateTime(undefined);
                    setSelectedMeeting(null);
                    setIsModalOpen(true);
                  }}
                  className="shadow-md"
                >
                  New Appointment
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar View and Sidebar Container */}
        <div className="flex-1 flex overflow-hidden bg-gray-50">
          {/* Calendar View */}
          <div className="flex-1 overflow-auto p-6 bg-gray-50" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
            {viewMode === 'week' ? (
              <CalendarWeekView
                currentDate={currentDate}
                meetings={filteredMeetings}
                onMeetingClick={openEditModal}
                onStatusChange={handleStatusChange}
                onDeleteMeeting={handleDeleteMeeting}
                onTimeSlotClick={handleTimeSlotClick}
              />
            ) : (
              <CalendarMonthView
                currentDate={currentDate}
                meetings={filteredMeetings}
                onMeetingClick={openEditModal}
                onDayClick={handleDayClick}
              />
            )}
          </div>

          {/* Right Sidebar - Upcoming Appointments */}
          <div className="flex-shrink-0 flex py-6">
            <UpcomingAppointments
              meetings={upcomingMeetings}
              onMeetingClick={openEditModal}
            />
          </div>
        </div>
      </div>

      {/* Meeting Form Modal */}
      <MeetingFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={selectedMeeting ? handleEditMeeting : handleCreateMeeting}
        hospitals={hospitals}
        meeting={selectedMeeting}
        initialDateTime={initialDateTime}
      />
    </div>
  );
}
