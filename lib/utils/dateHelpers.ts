import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import {
  DATE_FORMAT,
  TIME_FORMAT,
  DATETIME_FORMAT,
  ISO_DATE_FORMAT,
  ISO_DATETIME_FORMAT,
} from '@/constants/appConfig';

// Extend dayjs with plugins
dayjs.extend(isoWeek);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

/**
 * Get the start and end of the current week (Monday to Sunday)
 */
export function getCurrentWeek() {
  const now = dayjs();
  const startOfWeek = now.startOf('isoWeek'); // Monday
  const endOfWeek = now.endOf('isoWeek'); // Sunday

  return {
    start: startOfWeek.toDate(),
    end: endOfWeek.toDate(),
  };
}

/**
 * Get the start and end of a specific week
 */
export function getWeekRange(date: Date) {
  const d = dayjs(date);
  const startOfWeek = d.startOf('isoWeek');
  const endOfWeek = d.endOf('isoWeek');

  return {
    start: startOfWeek.toDate(),
    end: endOfWeek.toDate(),
  };
}

/**
 * Navigate to the next week
 */
export function getNextWeek(currentDate: Date): Date {
  return dayjs(currentDate).add(1, 'week').toDate();
}

/**
 * Navigate to the previous week
 */
export function getPreviousWeek(currentDate: Date): Date {
  return dayjs(currentDate).subtract(1, 'week').toDate();
}

/**
 * Get an array of dates for the current week (Monday to Sunday)
 */
export function getWeekDays(date: Date): Date[] {
  const startOfWeek = dayjs(date).startOf('isoWeek');
  const days: Date[] = [];

  for (let i = 0; i < 7; i++) {
    days.push(startOfWeek.add(i, 'day').toDate());
  }

  return days;
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string, format: string = DATE_FORMAT): string {
  return dayjs(date).format(format);
}

/**
 * Format a date to a time string
 */
export function formatTime(date: Date | string): string {
  return dayjs(date).format(TIME_FORMAT);
}

/**
 * Format a date to a datetime string
 */
export function formatDateTime(date: Date | string): string {
  return dayjs(date).format(DATETIME_FORMAT);
}

/**
 * Format a date to ISO format (YYYY-MM-DD)
 */
export function formatISODate(date: Date | string): string {
  return dayjs(date).format(ISO_DATE_FORMAT);
}

/**
 * Format a date to ISO datetime format
 */
export function formatISODateTime(date: Date | string): string {
  return dayjs(date).format(ISO_DATETIME_FORMAT);
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string): boolean {
  return dayjs(date).isSame(dayjs(), 'day');
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date | string): boolean {
  return dayjs(date).isBefore(dayjs(), 'day');
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: Date | string): boolean {
  return dayjs(date).isAfter(dayjs(), 'day');
}

/**
 * Check if a date is in the current week
 */
export function isCurrentWeek(date: Date | string): boolean {
  const { start, end } = getCurrentWeek();
  const d = dayjs(date);
  return d.isSameOrAfter(dayjs(start), 'day') && d.isSameOrBefore(dayjs(end), 'day');
}

/**
 * Get the day name from a date
 */
export function getDayName(date: Date | string, short: boolean = false): string {
  return short ? dayjs(date).format('ddd') : dayjs(date).format('dddd');
}

/**
 * Get the month name from a date
 */
export function getMonthName(date: Date | string, short: boolean = false): string {
  return short ? dayjs(date).format('MMM') : dayjs(date).format('MMMM');
}

/**
 * Check if two dates are on the same day
 */
export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  return dayjs(date1).isSame(dayjs(date2), 'day');
}

/**
 * Get the difference in minutes between two dates
 */
export function getDifferenceInMinutes(date1: Date | string, date2: Date | string): number {
  return dayjs(date1).diff(dayjs(date2), 'minute');
}

/**
 * Add minutes to a date
 */
export function addMinutes(date: Date | string, minutes: number): Date {
  return dayjs(date).add(minutes, 'minute').toDate();
}

/**
 * Subtract minutes from a date
 */
export function subtractMinutes(date: Date | string, minutes: number): Date {
  return dayjs(date).subtract(minutes, 'minute').toDate();
}

/**
 * Parse a date string to a Date object
 */
export function parseDate(dateString: string): Date {
  return dayjs(dateString).toDate();
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 */
export function getRelativeTime(date: Date | string): string {
  const d = dayjs(date);
  const now = dayjs();
  const diff = d.diff(now, 'minute');

  if (Math.abs(diff) < 1) return 'just now';
  if (Math.abs(diff) < 60) return `${Math.abs(diff)} minute${Math.abs(diff) > 1 ? 's' : ''} ${diff > 0 ? 'from now' : 'ago'}`;
  if (Math.abs(diff) < 1440) {
    const hours = Math.floor(Math.abs(diff) / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ${diff > 0 ? 'from now' : 'ago'}`;
  }
  
  const days = Math.floor(Math.abs(diff) / 1440);
  return `${days} day${days > 1 ? 's' : ''} ${diff > 0 ? 'from now' : 'ago'}`;
}

/**
 * Create a date from separate date and time strings
 */
export function combineDateAndTime(dateStr: string, timeStr: string): Date {
  return dayjs(`${dateStr} ${timeStr}`).toDate();
}

/**
 * Get week number of the year
 */
export function getWeekNumber(date: Date | string): number {
  return dayjs(date).isoWeek();
}

/**
 * Get year from date
 */
export function getYear(date: Date | string): number {
  return dayjs(date).year();
}
