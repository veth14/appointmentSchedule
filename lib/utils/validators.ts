import { MeetingFormData } from '@/types/meeting';
import { HospitalFormData } from '@/types/hospital';
import dayjs from 'dayjs';

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (basic validation)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate meeting form data
 */
export function validateMeetingForm(data: MeetingFormData): string[] {
  const errors: string[] = [];

  // Doctor name validation
  if (!data.doctorName || data.doctorName.trim().length === 0) {
    errors.push('Doctor name is required');
  } else if (data.doctorName.trim().length < 2) {
    errors.push('Doctor name must be at least 2 characters');
  }

  // Hospital validation
  if (!data.hospitalId || data.hospitalId.trim().length === 0) {
    errors.push('Hospital is required');
  }

  // DateTime validation
  if (!data.dateTime) {
    errors.push('Date and time are required');
  } else {
    const meetingDateTime = dayjs(data.dateTime);
    if (!meetingDateTime.isValid()) {
      errors.push('Invalid date/time format');
    }
  }

  // Status validation
  if (data.status && !['scheduled', 'done', 'canceled'].includes(data.status)) {
    errors.push('Invalid status value');
  }

  // Notes validation
  if (data.notes && data.notes.length > 500) {
    errors.push('Notes cannot exceed 500 characters');
  }

  return errors;
}

/**
 * Validate hospital form data
 */
export function validateHospitalForm(data: HospitalFormData): string[] {
  const errors: string[] = [];

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Hospital name is required');
  } else if (data.name.trim().length < 3) {
    errors.push('Hospital name must be at least 3 characters');
  }

  // Address validation
  if (!data.address || data.address.trim().length === 0) {
    errors.push('Address is required');
  }

  // City validation
  if (!data.city || data.city.trim().length === 0) {
    errors.push('City is required');
  }

  // Coordinates validation
  if (data.coordinates) {
    if (data.coordinates.lat < -90 || data.coordinates.lat > 90) {
      errors.push('Latitude must be between -90 and 90');
    }
    if (data.coordinates.lng < -180 || data.coordinates.lng > 180) {
      errors.push('Longitude must be between -180 and 180');
    }
  }

  return errors;
}

/**
 * Sanitize string input (remove dangerous characters)
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Validate required field
 */
export function isRequired(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * Validate minimum length
 */
export function minLength(value: string, min: number): boolean {
  return value.trim().length >= min;
}

/**
 * Validate maximum length
 */
export function maxLength(value: string, max: number): boolean {
  return value.trim().length <= max;
}

/**
 * Validate number range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}
