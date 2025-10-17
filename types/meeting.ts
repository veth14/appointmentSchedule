// Meeting Status Types
export type MeetingStatus = 'scheduled' | 'done' | 'canceled';

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
}
