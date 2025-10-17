import { Meeting, MeetingFormData, MeetingStatus } from '@/types/meeting';
import { generateId, generateMockMeetings, generateWeekdayMeetings } from '@/lib/utils/mockData';
import { getWeekRange } from '@/lib/utils/dateHelpers';
import dayjs from 'dayjs';

// Check if Firebase is configured
const isFirebaseConfigured = false; // Set to true when Firebase is configured

// In-memory storage (fallback when Firebase is not configured)
// Generate deterministic meetings: 20 meetings per weekday (5 * 20 = 100)
let inMemoryMeetings: Meeting[] = generateWeekdayMeetings(20);

/**
 * Get all meetings for a specific week
 */
export async function getMeetingsByWeek(weekStart: Date): Promise<Meeting[]> {
  if (isFirebaseConfigured) {
    // TODO: Implement Firebase Firestore query
    // const { start, end } = getWeekRange(weekStart);
    // const snapshot = await db.collection('meetings')
    //   .where('dateTime', '>=', start.toISOString())
    //   .where('dateTime', '<=', end.toISOString())
    //   .get();
    // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Meeting));
    return [];
  }

  // Fallback: Use in-memory storage
  const { start, end } = getWeekRange(weekStart);
  return inMemoryMeetings.filter(meeting => {
    const meetingDate = dayjs(meeting.dateTime);
    return meetingDate.isSameOrAfter(dayjs(start), 'day') && 
           meetingDate.isSameOrBefore(dayjs(end), 'day');
  });
}

/**
 * Get a single meeting by ID
 */
export async function getMeetingById(id: string): Promise<Meeting | null> {
  if (isFirebaseConfigured) {
    // TODO: Implement Firebase Firestore query
    // const doc = await db.collection('meetings').doc(id).get();
    // if (!doc.exists) return null;
    // return { id: doc.id, ...doc.data() } as Meeting;
    return null;
  }

  // Fallback: Use in-memory storage
  return inMemoryMeetings.find(meeting => meeting.id === id) || null;
}

/**
 * Create a new meeting
 */
export async function createMeeting(data: MeetingFormData): Promise<Meeting> {
  const now = new Date().toISOString();
  const newMeeting: Meeting = {
    id: generateId(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  if (isFirebaseConfigured) {
    // TODO: Implement Firebase Firestore add
    // const docRef = await db.collection('meetings').add({
    //   ...newMeeting,
    //   createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    //   updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    // });
    // newMeeting.id = docRef.id;
  } else {
    // Fallback: Use in-memory storage
    inMemoryMeetings.push(newMeeting);
  }

  return newMeeting;
}

/**
 * Update an existing meeting
 */
export async function updateMeeting(
  id: string,
  data: Partial<MeetingFormData>
): Promise<Meeting | null> {
  if (isFirebaseConfigured) {
    // TODO: Implement Firebase Firestore update
    // await db.collection('meetings').doc(id).update({
    //   ...data,
    //   updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    // });
    // return getMeetingById(id);
    return null;
  }

  // Fallback: Use in-memory storage
  const index = inMemoryMeetings.findIndex(meeting => meeting.id === id);
  if (index === -1) return null;

  inMemoryMeetings[index] = {
    ...inMemoryMeetings[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  return inMemoryMeetings[index];
}

/**
 * Delete a meeting
 */
export async function deleteMeeting(id: string): Promise<boolean> {
  if (isFirebaseConfigured) {
    // TODO: Implement Firebase Firestore delete
    // await db.collection('meetings').doc(id).delete();
    // return true;
    return false;
  }

  // Fallback: Use in-memory storage
  const index = inMemoryMeetings.findIndex(meeting => meeting.id === id);
  if (index === -1) return false;

  inMemoryMeetings.splice(index, 1);
  return true;
}

/**
 * Update meeting status
 */
export async function updateMeetingStatus(
  id: string,
  status: MeetingStatus
): Promise<Meeting | null> {
  return updateMeeting(id, { status });
}

/**
 * Get meetings by hospital
 */
export async function getMeetingsByHospital(hospitalId: string): Promise<Meeting[]> {
  if (isFirebaseConfigured) {
    // TODO: Implement Firebase Firestore query
    // const snapshot = await db.collection('meetings')
    //   .where('hospitalId', '==', hospitalId)
    //   .get();
    // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Meeting));
    return [];
  }

  // Fallback: Use in-memory storage
  return inMemoryMeetings.filter(meeting => meeting.hospitalId === hospitalId);
}

/**
 * Get meetings by doctor
 */
export async function getMeetingsByDoctor(doctorName: string): Promise<Meeting[]> {
  if (isFirebaseConfigured) {
    // TODO: Implement Firebase Firestore query
    // const snapshot = await db.collection('meetings')
    //   .where('doctorName', '==', doctorName)
    //   .get();
    // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Meeting));
    return [];
  }

  // Fallback: Use in-memory storage
  return inMemoryMeetings.filter(meeting => 
    meeting.doctorName.toLowerCase().includes(doctorName.toLowerCase())
  );
}

/**
 * Get meetings by status
 */
export async function getMeetingsByStatus(status: MeetingStatus): Promise<Meeting[]> {
  if (isFirebaseConfigured) {
    // TODO: Implement Firebase Firestore query
    // const snapshot = await db.collection('meetings')
    //   .where('status', '==', status)
    //   .get();
    // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Meeting));
    return [];
  }

  // Fallback: Use in-memory storage
  return inMemoryMeetings.filter(meeting => meeting.status === status);
}

/**
 * Search meetings by query
 */
export async function searchMeetings(query: string): Promise<Meeting[]> {
  const lowerQuery = query.toLowerCase();

  if (isFirebaseConfigured) {
    // TODO: Implement Firebase Firestore search
    // Note: Firestore doesn't support full-text search natively
    // Consider using Algolia or similar service for production
    return [];
  }

  // Fallback: Use in-memory storage
  return inMemoryMeetings.filter(meeting =>
    meeting.doctorName.toLowerCase().includes(lowerQuery) ||
    meeting.hospitalName.toLowerCase().includes(lowerQuery) ||
    meeting.hospitalAddress.toLowerCase().includes(lowerQuery) ||
    meeting.purpose?.toLowerCase().includes(lowerQuery) ||
    meeting.notes?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Reset in-memory storage (for development/testing)
 */
export function resetMeetingsData(): void {
  if (!isFirebaseConfigured) {
    inMemoryMeetings = generateWeekdayMeetings(20);
  }
}
