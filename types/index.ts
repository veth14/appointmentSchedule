// Export all types from a central location
export * from './meeting';
export * from './hospital';

// Additional shared types
export interface WeeklySummary {
  total: number;
  scheduled: number;
  done: number;
  canceled: number;
}

export interface FilterOptions {
  searchQuery: string;
  statusFilter: import('./meeting').MeetingStatus | 'all';
}

export interface DateRange {
  startDate: string;
  endDate: string;
}
