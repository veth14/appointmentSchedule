import { Meeting, MeetingStatus } from '@/types/meeting';
import { Hospital } from '@/types/hospital';
import { formatISODateTime } from './dateHelpers';
import dayjs from 'dayjs';

/**
 * Generate a random ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Sample hospital data
 */
export const MOCK_HOSPITALS: Hospital[] = [
  {
    id: 'hospital-1',
    name: 'St. Mary Medical Center',
    address: '1234 Healthcare Avenue',
    city: 'San Francisco',
    coordinates: {
      lat: 37.7749,
      lng: -122.4194,
    },
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'hospital-2',
    name: 'General Hospital',
    address: '5678 Medical Drive',
    city: 'Los Angeles',
    coordinates: {
      lat: 34.0522,
      lng: -118.2437,
    },
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'hospital-3',
    name: 'City Regional Medical Center',
    address: '9101 Hospital Boulevard',
    city: 'San Diego',
    coordinates: {
      lat: 32.7157,
      lng: -117.1611,
    },
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'hospital-4',
    name: 'Community Health Hospital',
    address: '1122 Wellness Street',
    city: 'Sacramento',
    coordinates: {
      lat: 38.5816,
      lng: -121.4944,
    },
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'hospital-5',
    name: 'Metropolitan Medical Complex',
    address: '3344 Care Center Road',
    city: 'San Jose',
    coordinates: {
      lat: 37.3382,
      lng: -121.8863,
    },
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
];

/**
 * Sample doctor names
 */
const DOCTOR_NAMES = [
  'Dr. Sarah Johnson',
  'Dr. Michael Chen',
  'Dr. Emily Rodriguez',
  'Dr. David Kim',
  'Dr. Jennifer Martinez',
  'Dr. Robert Taylor',
  'Dr. Lisa Anderson',
  'Dr. James Wilson',
  'Dr. Maria Garcia',
  'Dr. Christopher Lee',
  'Dr. Amanda White',
  'Dr. Daniel Brown',
  'Dr. Jessica Davis',
  'Dr. Kevin Thompson',
  'Dr. Rachel Miller',
];

/**
 * Sample meeting purposes
 */
const MEETING_PURPOSES = [
  'Regular Check-up',
  'Follow-up Consultation',
  'Surgery Planning',
  'Treatment Review',
  'Patient Evaluation',
  'Consultation',
  'Emergency Case Review',
  'Preventive Care',
  'Lab Results Discussion',
  'Prescription Review',
];

/**
 * Generate random mock meetings for the current week
 */
export function generateMockMeetings(count: number = 15): Meeting[] {
  const meetings: Meeting[] = [];
  const now = dayjs();
  const startOfWeek = now.startOf('isoWeek');

  for (let i = 0; i < count; i++) {
    const randomDay = Math.floor(Math.random() * 7);
    const randomHour = Math.floor(Math.random() * 10) + 8; // 8 AM to 5 PM
    const randomMinute = Math.random() > 0.5 ? 0 : 30;
    
    const dateTime = startOfWeek
      .add(randomDay, 'day')
      .hour(randomHour)
      .minute(randomMinute)
      .second(0)
      .millisecond(0);

    const randomHospital = MOCK_HOSPITALS[Math.floor(Math.random() * MOCK_HOSPITALS.length)];
    const randomDoctor = DOCTOR_NAMES[Math.floor(Math.random() * DOCTOR_NAMES.length)];
    const randomPurpose = MEETING_PURPOSES[Math.floor(Math.random() * MEETING_PURPOSES.length)];
    
    const statuses: MeetingStatus[] = ['scheduled', 'done', 'canceled'];
    let status: MeetingStatus = 'scheduled';
    
    // Past meetings are more likely to be done
    if (dateTime.isBefore(now)) {
      const rand = Math.random();
      if (rand < 0.7) status = 'done';
      else if (rand < 0.9) status = 'scheduled';
      else status = 'canceled';
    } else {
      // Future meetings
      const rand = Math.random();
      if (rand < 0.85) status = 'scheduled';
      else status = 'canceled';
    }

    meetings.push({
      id: generateId(),
      doctorName: randomDoctor,
      hospitalId: randomHospital.id,
      hospitalName: randomHospital.name,
      hospitalAddress: `${randomHospital.address}, ${randomHospital.city}`,
      dateTime: dateTime.toISOString(),
      purpose: randomPurpose,
      notes: Math.random() > 0.5 ? 'Important meeting' : undefined,
      status,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
  }

  return meetings.sort((a, b) => 
    dayjs(a.dateTime).valueOf() - dayjs(b.dateTime).valueOf()
  );
}

/**
 * Generate exactly 100 appointments divided into 5 weekdays (20 appointments per day).
 * Creates appointments for Monday through Friday of the current week.
 */
export function generateWeekdayMeetings(perDay: number = 20): Meeting[] {
  const meetings: Meeting[] = [];
  const now = dayjs();
  
  // Start from Monday of the current week
  const startDate = now.startOf('week').add(1, 'day'); // Monday
  const totalDays = 5; // Mon-Fri
  const totalAppointments = totalDays * perDay; // 100 appointments
  
  let appointmentIndex = 0;

  for (let dayOffset = 0; dayOffset < totalDays; dayOffset++) {
    const currentDay = startDate.add(dayOffset, 'day');
    
    for (let slot = 0; slot < perDay; slot++) {
      // Distribute appointments from 6 AM to 8 PM (15 hours)
      // 20 slots per day means roughly 45 minutes apart
      const totalMinutesInDay = 15 * 60; // 15 hours
      const minutesPerSlot = totalMinutesInDay / perDay;
      const startHour = 6;
      
      const totalMinutes = slot * minutesPerSlot;
      const hour = startHour + Math.floor(totalMinutes / 60);
      const minute = Math.floor(totalMinutes % 60);

      const dateTime = currentDay
        .hour(hour)
        .minute(minute)
        .second(0)
        .millisecond(0);

      const hospital = MOCK_HOSPITALS[appointmentIndex % MOCK_HOSPITALS.length];
      const doctor = DOCTOR_NAMES[appointmentIndex % DOCTOR_NAMES.length];
      const purpose = MEETING_PURPOSES[appointmentIndex % MEETING_PURPOSES.length];

      // Determine status based on date - No canceled appointments
      let status: MeetingStatus = 'scheduled';
      if (dateTime.isBefore(now)) {
        const rand = Math.random();
        status = rand < 0.8 ? 'done' : 'scheduled'; // 80% done, 20% scheduled (past)
      } else {
        status = 'scheduled'; // All future meetings are scheduled
      }

      meetings.push({
        id: generateId(),
        doctorName: doctor,
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        hospitalAddress: `${hospital.address}, ${hospital.city}`,
        dateTime: dateTime.toISOString(),
        purpose,
        notes: Math.random() > 0.7 ? 'Important meeting requiring follow-up' : undefined,
        status,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });
      
      appointmentIndex++;
    }
  }

  return meetings.sort((a, b) => dayjs(a.dateTime).valueOf() - dayjs(b.dateTime).valueOf());
}

/**
 * Get a random hospital
 */
export function getRandomHospital(): Hospital {
  return MOCK_HOSPITALS[Math.floor(Math.random() * MOCK_HOSPITALS.length)];
}

/**
 * Get a random doctor name
 */
export function getRandomDoctorName(): string {
  return DOCTOR_NAMES[Math.floor(Math.random() * DOCTOR_NAMES.length)];
}

/**
 * Get a random meeting purpose
 */
export function getRandomPurpose(): string {
  return MEETING_PURPOSES[Math.floor(Math.random() * MEETING_PURPOSES.length)];
}

/**
 * Create a new mock meeting
 */
export function createMockMeeting(
  dateTime: Date,
  hospitalId?: string,
  doctorName?: string
): Meeting {
  const hospital = hospitalId
    ? MOCK_HOSPITALS.find(h => h.id === hospitalId) || MOCK_HOSPITALS[0]
    : getRandomHospital();

  return {
    id: generateId(),
    doctorName: doctorName || getRandomDoctorName(),
    hospitalId: hospital.id,
    hospitalName: hospital.name,
    hospitalAddress: `${hospital.address}, ${hospital.city}`,
    dateTime: dateTime.toISOString(),
    purpose: getRandomPurpose(),
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
