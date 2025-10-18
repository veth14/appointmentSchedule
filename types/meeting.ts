// Meeting Status Types
export type MeetingStatus = 'scheduled' | 'done' | 'canceled';

// Recurrence Types
export type RecurrenceFrequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval: number; // e.g., every 2 weeks
  endDate?: string; // ISO string - when recurrence ends
  count?: number; // number of occurrences
}

// Meeting Interface
export interface Meeting {
  id: string;
  doctorName: string;
  hospitalId: string;
  hospitalName: string;
  hospitalAddress: string;
  dateTime: string; // ISO string
  notes?: string;
  purpose?: string;
  status: MeetingStatus;
  recurrence?: RecurrenceRule;
  parentId?: string; // For recurring instances, reference to parent
  createdAt: string;
  updatedAt: string;
}

// Meeting Form Data (for creating/updating)
export interface MeetingFormData {
  doctorName: string;
  hospitalId: string;
  hospitalName: string;
  hospitalAddress: string;
  dateTime: string;
  notes?: string;
  purpose?: string;
  status: MeetingStatus;
  recurrence?: RecurrenceRule;
}
