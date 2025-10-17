import { NextRequest, NextResponse } from 'next/server';
import {
  getAllHospitals,
  getHospitalById,
  createHospital,
  updateHospital,
  deleteHospital,
  searchHospitals,
} from '@/lib/services/hospitalsService';
import { HospitalFormData } from '@/types/hospital';

// GET: Fetch hospitals
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const query = searchParams.get('query');

    if (id) {
      const hospital = await getHospitalById(id);
      if (!hospital) {
        return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
      }
      return NextResponse.json(hospital);
    }

    if (query) {
      const hospitals = await searchHospitals(query);
      return NextResponse.json(hospitals);
    }

    const hospitals = await getAllHospitals();
    return NextResponse.json(hospitals);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return NextResponse.json({ error: 'Failed to fetch hospitals' }, { status: 500 });
  }
}

// POST: Create a new hospital
export async function POST(request: NextRequest) {
  try {
    const data: HospitalFormData = await request.json();
    const hospital = await createHospital(data);
    return NextResponse.json(hospital, { status: 201 });
  } catch (error) {
    console.error('Error creating hospital:', error);
    return NextResponse.json({ error: 'Failed to create hospital' }, { status: 500 });
  }
}

// PUT: Update a hospital
export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Hospital ID is required' }, { status: 400 });
    }

    const hospital = await updateHospital(id, data);
    
    if (!hospital) {
      return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
    }

    return NextResponse.json(hospital);
  } catch (error) {
    console.error('Error updating hospital:', error);
    return NextResponse.json({ error: 'Failed to update hospital' }, { status: 500 });
  }
}

// DELETE: Delete a hospital
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Hospital ID is required' }, { status: 400 });
    }

    const success = await deleteHospital(id);

    if (!success) {
      return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting hospital:', error);
    return NextResponse.json({ error: 'Failed to delete hospital' }, { status: 500 });
  }
}
