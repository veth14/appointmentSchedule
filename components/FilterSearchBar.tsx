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
    <div className="bg-white border border-gray-200/60 rounded-xl shadow-sm">
      {/* Search Bar */}
      <div className="flex items-center gap-2 p-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by doctor, hospital, or notes..."
            className="w-full pl-9 pr-3 py-2.5 border-0 rounded-lg focus:outline-none focus:ring-0 bg-transparent text-sm text-gray-900 placeholder:text-gray-500"
            suppressHydrationWarning
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg transition-all ${
            showFilters || hasActiveFilters
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          suppressHydrationWarning
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-200/50 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value as MeetingStatus | 'all')}
                className="w-full px-3 py-2.5 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hospital
              </label>
              <select
                value={selectedHospital}
                onChange={(e) => handleHospitalChange(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
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

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
