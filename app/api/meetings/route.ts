import { NextRequest, NextResponse } from 'next/server';
import {
  getMeetingsByWeek,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  searchMeetings,
} from '@/lib/services/meetingsService';
import { MeetingFormData } from '@/types/meeting';

// GET: Fetch meetings
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const weekStart = searchParams.get('weekStart');
    const query = searchParams.get('query');

    if (query) {
      const meetings = await searchMeetings(query);
      return NextResponse.json(meetings);
    }

    if (weekStart) {
      const meetings = await getMeetingsByWeek(new Date(weekStart));
      return NextResponse.json(meetings);
    }

    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return NextResponse.json({ error: 'Failed to fetch meetings' }, { status: 500 });
  }
}

// POST: Create a new meeting
export async function POST(request: NextRequest) {
  try {
    const data: MeetingFormData = await request.json();
    const meeting = await createMeeting(data);
    return NextResponse.json(meeting, { status: 201 });
  } catch (error) {
    console.error('Error creating meeting:', error);
    return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 });
  }
}

// PUT: Update a meeting
export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Meeting ID is required' }, { status: 400 });
    }

    const meeting = await updateMeeting(id, data);
    
    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    return NextResponse.json(meeting);
  } catch (error) {
    console.error('Error updating meeting:', error);
    return NextResponse.json({ error: 'Failed to update meeting' }, { status: 500 });
  }
}

// DELETE: Delete a meeting
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Meeting ID is required' }, { status: 400 });
    }

    const success = await deleteMeeting(id);

    if (!success) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return NextResponse.json({ error: 'Failed to delete meeting' }, { status: 500 });
  }
}
