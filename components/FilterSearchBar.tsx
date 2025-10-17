'use client';

import { Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { MeetingStatus } from '@/types/meeting';
import { STATUS_OPTIONS } from '@/constants/statusConfig';

interface FilterSearchBarProps {
  onSearch: (query: string) => void;
  onFilterStatus: (status: MeetingStatus | 'all') => void;
  onFilterHospital: (hospitalId: string) => void;
  hospitals: Array<{ id: string; name: string }>;
}

export default function FilterSearchBar({
  onSearch,
  onFilterStatus,
  onFilterHospital,
  hospitals,
}: FilterSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<MeetingStatus | 'all'>('all');
  const [selectedHospital, setSelectedHospital] = useState<string>('all');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleStatusChange = (status: MeetingStatus | 'all') => {
    setSelectedStatus(status);
    onFilterStatus(status);
  };

  const handleHospitalChange = (hospitalId: string) => {
    setSelectedHospital(hospitalId);
    onFilterHospital(hospitalId);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedHospital('all');
    onSearch('');
    onFilterStatus('all');
    onFilterHospital('all');
  };

  const hasActiveFilters = searchQuery || selectedStatus !== 'all' || selectedHospital !== 'all';

  return (
    <div className="card-elevated bg-white border-gray-200/60">
      {/* Enhanced Search Bar */}
      <div className="flex items-center gap-2 p-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by doctor, hospital, or notes..."
            className="w-full pl-11 pr-4 py-3 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-gray-50/50 hover:bg-gray-100/50 text-sm font-medium text-gray-900 placeholder:text-gray-500 transition-all duration-200"
            suppressHydrationWarning
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md ${
            showFilters || hasActiveFilters
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          suppressHydrationWarning
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Enhanced Filters */}
      {showFilters && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-200/50 pt-5 bg-gradient-to-b from-gray-50/30 to-transparent animate-slide-in-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value as MeetingStatus | 'all')}
                className="w-full px-4 py-3 border border-gray-300/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 font-medium text-sm"
              >
                <option value="all">All Statuses</option>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Hospital Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-600"></div>
                Hospital
              </label>
              <select
                value={selectedHospital}
                onChange={(e) => handleHospitalChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 font-medium text-sm"
              >
                <option value="all">All Hospitals</option>
                {hospitals.map((hospital) => (
                  <option key={hospital.id} value={hospital.id}>
                    {hospital.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex justify-end pt-2">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 font-bold rounded-xl transition-all duration-200 hover:shadow-md border border-blue-200/50"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
