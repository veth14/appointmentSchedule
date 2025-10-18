'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Meeting, MeetingFormData, MeetingStatus } from '@/types/meeting';
import { Hospital } from '@/types/hospital';
import { WeeklySummary } from '@/types';
import { Button } from '@/components/ui';
import MeetingCard from '@/components/MeetingCard';
import MeetingFormModal from '@/components/MeetingFormModal';
// WeekNavigation removed per request
import FilterSearchBar from '@/components/FilterSearchBar';
import MeetingPreviewPanel from '@/components/MeetingPreviewPanel';
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
import {
  getCurrentWeek,
  getPreviousWeek,
  getNextWeek,
  getWeekDays,
  formatDate,
  getDayName,
  isSameDay,
} from '@/lib/utils/dateHelpers';

export default function DashboardPage() {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const MEETINGS_PER_PAGE = 3; // Default 3 meetings per page

  // Refresh data helper used by effect and handlers
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [meetingsData, hospitalsData] = await Promise.all([
        getAllMeetings(), // Load all 100 sample appointments
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
  }, []);

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

  const handleMeetingClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
  };

  const handleSearch = (query: string) => {
    setCurrentPage(1); // Reset to first page on search
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
    setCurrentPage(1); // Reset to first page on filter
    if (status === 'all') {
      setFilteredMeetings(meetings);
    } else {
      setFilteredMeetings(meetings.filter(m => m.status === status));
    }
  };

  const handleFilterHospital = (hospitalId: string) => {
    setCurrentPage(1); // Reset to first page on filter
    if (hospitalId === 'all') {
      setFilteredMeetings(meetings);
    } else {
      setFilteredMeetings(meetings.filter(m => m.hospitalId === hospitalId));
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
  <div className="w-full px-6 md:px-8 lg:px-10 xl:px-12 pb-10 overflow-x-hidden animate-fade-in">
      {/* Modern Header */}
      <div className="flex flex-col gap-5 mb-8 pt-8 animate-slide-in-up max-w-5xl">
        <div className="flex items-start gap-3">
          <div className="w-1 h-16 bg-gradient-to-b from-blue-500 to-cyan-600 rounded-full"></div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Tasks for Today
            </h1>
            <p className="text-sm text-gray-600">
              Manage your doctor meetings across hospitals
            </p>
          </div>
        </div>

        {/* Search bar with New Meeting button */}
        <div className="flex items-center gap-3 w-full animate-slide-in-right">
          <div className="flex-1">
            <FilterSearchBar
              onSearch={handleSearch}
              onFilterStatus={handleFilterStatus}
              onFilterHospital={handleFilterHospital}
              hospitals={hospitals}
            />
          </div>
          <Button
            variant="primary"
            icon={<Plus className="w-5 h-5" />}
            onClick={() => setIsModalOpen(true)}
            className="shadow-md hover:shadow-lg transition-all duration-200 flex-shrink-0"
          >
            New Meeting
          </Button>
        </div>
      </div>

      {/* Two-column layout: left = today's meetings table, right = preview panel */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Today's meetings - occupy 8/12 on large screens */}
        <div className="col-span-1 lg:col-span-8 flex flex-col h-full">
            <div className="flex flex-col gap-4 h-full">
              {(() => {
                const today = new Date();
                const dayMeetings = getMeetingsForDay(today);

                return (
                  <div className="w-full flex flex-col min-h-0 justify-between">
                    <div>
                    <div className="card-elevated p-4 mb-5 animate-slide-in-up bg-white border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex flex-col items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-xl leading-none">{formatDate(today, 'D')}</span>
                            <span className="text-blue-100 text-xs font-medium mt-0.5">{formatDate(today, 'MMM')}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {formatDate(today, 'dddd')}
                            </h3>
                            <p className="text-sm text-gray-500 font-medium">
                              {formatDate(today, 'MMMM D, YYYY')}
                            </p>
                          </div>
                        </div>
                        <div className="px-4 py-2 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                          {dayMeetings.length} {dayMeetings.length === 1 ? 'meeting' : 'meetings'}
                        </div>
                      </div>
                    </div>

                    {/* Paginated meeting list - Fixed 4 slots per page */}
                    <div className="space-y-3 h-[456px]">
                      {(() => {
                        const now = new Date();
                        
                        // Sort meetings: scheduled upcoming first, then scheduled past, then done
                        const sortedMeetings = [...dayMeetings].sort((a, b) => {
                          const timeA = new Date(a.dateTime);
                          const timeB = new Date(b.dateTime);
                          const isAFuture = timeA >= now;
                          const isBFuture = timeB >= now;
                          const isADone = a.status === 'done';
                          const isBDone = b.status === 'done';
                          
                          // Done meetings always go to the back
                          if (isADone && !isBDone) return 1;
                          if (!isADone && isBDone) return -1;
                          
                          // Both done or both not done: upcoming before past
                          if (isAFuture !== isBFuture) {
                            return isAFuture ? -1 : 1;
                          }
                          
                          // Same category: sort by time
                          return timeA.getTime() - timeB.getTime();
                        });
                        
                        // Show 4 items per page
                        const itemsPerPage = 4;
                        const totalPages = Math.ceil(sortedMeetings.length / itemsPerPage);
                        const startIndex = (currentPage - 1) * itemsPerPage;
                        const paginatedMeetings = sortedMeetings.slice(startIndex, startIndex + itemsPerPage);

                        // Create empty slots to always show exactly itemsPerPage slots
                        const emptySlots = itemsPerPage - paginatedMeetings.length;

                        return (
                          <>
                            {dayMeetings.length > 0 ? (
                              <>
                                {/* Actual meetings */}
                                {paginatedMeetings.map((meeting, index) => (
                                  <div 
                                    key={meeting.id}
                                    className="animate-slide-in-up"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                  >
                                    <MeetingCard
                                      meeting={meeting}
                                      onEdit={handleEditMeeting}
                                      onDelete={handleDeleteMeeting}
                                      onStatusChange={handleStatusChange}
                                      onClick={handleMeetingClick}
                                    />
                                  </div>
                                ))}

                                {/* Empty placeholder slots - Match meeting card height exactly */}
                                {Array.from({ length: emptySlots }).map((_, index) => (
                                  <div 
                                    key={`empty-${index}`}
                                    className="relative bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-xl h-[108px] flex items-center justify-center"
                                  >
                                    {/* Dashed accent bar */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300/30 rounded-l-xl"></div>
                                    
                                    <p className="text-sm text-gray-400 font-semibold italic">Empty slot</p>
                                  </div>
                                ))}
                              </>
                            ) : (
                              <div className="card-elevated p-10 text-center animate-fade-in h-[610px] flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <p className="text-gray-900 font-semibold mb-2">No meetings scheduled</p>
                                <p className="text-sm text-gray-600">Your schedule is clear for today</p>
                              </div>
                            )}

                            {/* Pagination Controls - Always at bottom */}
                            {totalPages > 1 && dayMeetings.length > 0 && (
                              <div className="card-elevated p-7 mt-4 animate-fade-in">
                                <div className="flex items-center justify-between">
                                  <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl font-semibold text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                                  >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                  </button>

                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-700">
                                      Page {currentPage} of {totalPages}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      ({dayMeetings.length} total)
                                    </span>
                                  </div>

                                  <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl font-semibold text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                                  >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                    </div>
                  </div>
                );
              })()}
            </div>
        </div>

        {/* Right column: Preview Panel only - occupy 4/12 on large screens */}
        <aside className="col-span-1 lg:col-span-4 flex flex-col">
          <div className="sticky top-24 flex-1">
            {/* Meeting Preview Panel */}
            <MeetingPreviewPanel
              meeting={selectedMeeting}
              onClose={() => setSelectedMeeting(null)}
              onEdit={handleEditMeeting}
              onDelete={handleDeleteMeeting}
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
