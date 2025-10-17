export const APP_NAME = 'Doctor Meeting Schedule Tracker';
export const APP_VERSION = '1.0.0';

// Date formats
export const DATE_FORMAT = 'MMM D, YYYY';
export const TIME_FORMAT = 'h:mm A';
export const DATETIME_FORMAT = 'MMM D, YYYY h:mm A';
export const ISO_DATE_FORMAT = 'YYYY-MM-DD';
export const ISO_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm';

// Limits
export const MAX_MEETINGS_PER_DAY = 20;
export const MEETING_OVERLAP_THRESHOLD_MINUTES = 60;

// UI Constants
export const DAYS_IN_WEEK = 7;
export const WEEK_STARTS_ON = 1; // Monday (0 = Sunday, 1 = Monday)

// Navigation
export const NAV_ITEMS = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'Calendar',
  },
  {
    name: 'Meetings',
    href: '/dashboard',
    icon: 'Users',
  },
  {
    name: 'Hospitals',
    href: '/dashboard',
    icon: 'Building2',
  },
  {
    name: 'Settings',
    href: '/dashboard',
    icon: 'Settings',
  },
] as const;
