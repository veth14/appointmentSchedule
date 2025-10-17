import { Hospital, HospitalFormData } from '@/types/hospital';
import { generateId, MOCK_HOSPITALS } from '@/lib/utils/mockData';

// Check if Firebase is configured
const isFirebaseConfigured = false; // Set to true when Firebase is configured

// In-memory storage (fallback when Firebase is not configured)
let inMemoryHospitals: Hospital[] = [...MOCK_HOSPITALS];

/**
 * Get all hospitals
 */
export async function getAllHospitals(): Promise<Hospital[]> {
  if (isFirebaseConfigured) {
    // TODO: Implement Firebase Firestore query
    // const snapshot = await db.collection('hospitals').get();
    // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Hospital));
    return [];
  }

  // Fallback: Use in-memory storage
  return [...inMemoryHospitals];
}

/**
 * Get a single hospital by ID
 */
export async function getHospitalById(id: string): Promise<Hospital | null> {
  if (isFirebaseConfigured) {
    // TODO: Implement Firebase Firestore query
    // const doc = await db.collection('hospitals').doc(id).get();
    // if (!doc.exists) return null;
    // return { id: doc.id, ...doc.data() } as Hospital;
    return null;
  }

  // Fallback: Use in-memory storage
  return inMemoryHospitals.find(hospital => hospital.id === id) || null;
}

/**
 * Create a new hospital
 */
export async function createHospital(data: HospitalFormData): Promise<Hospital> {
  const now = new Date().toISOString();
  const newHospital: Hospital = {
    id: generateId(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  if (isFirebaseConfigured) {
    // TODO: Implement Firebase Firestore add
    // const docRef = await db.collection('hospitals').add({
    //   ...newHospital,
    //   createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    //   updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    // });
    // newHospital.id = docRef.id;
  } else {
    // Fallback: Use in-memory storage
    inMemoryHospitals.push(newHospital);
  }

  return newHospital;
}

/**
 * Update an existing hospital
 */
export async function updateHospital(
  id: string,
  data: Partial<HospitalFormData>
): Promise<Hospital | null> {
  if (isFirebaseConfigured) {
    // TODO: Implement Firebase Firestore update
    // await db.collection('hospitals').doc(id).update({
    //   ...data,
    //   updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    // });
    // return getHospitalById(id);
    return null;
  }

  // Fallback: Use in-memory storage
  const index = inMemoryHospitals.findIndex(hospital => hospital.id === id);
  if (index === -1) return null;

  inMemoryHospitals[index] = {
    ...inMemoryHospitals[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  return inMemoryHospitals[index];
}

/**
 * Delete a hospital
 */
export async function deleteHospital(id: string): Promise<boolean> {
  if (isFirebaseConfigured) {
    // TODO: Implement Firebase Firestore delete
    // await db.collection('hospitals').doc(id).delete();
    // return true;
    return false;
  }

  // Fallback: Use in-memory storage
  const index = inMemoryHospitals.findIndex(hospital => hospital.id === id);
  if (index === -1) return false;

  inMemoryHospitals.splice(index, 1);
  return true;
}

/**
 * Search hospitals by query
 */
export async function searchHospitals(query: string): Promise<Hospital[]> {
  const lowerQuery = query.toLowerCase();

  if (isFirebaseConfigured) {
    // TODO: Implement Firebase Firestore search
    // Note: Firestore doesn't support full-text search natively
    return [];
  }

  // Fallback: Use in-memory storage
  return inMemoryHospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(lowerQuery) ||
    hospital.address.toLowerCase().includes(lowerQuery) ||
    hospital.city.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get hospitals by city
 */
export async function getHospitalsByCity(city: string): Promise<Hospital[]> {
  if (isFirebaseConfigured) {
    // TODO: Implement Firebase Firestore query
    // const snapshot = await db.collection('hospitals')
    //   .where('city', '==', city)
    //   .get();
    // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Hospital));
    return [];
  }

  // Fallback: Use in-memory storage
  return inMemoryHospitals.filter(hospital => 
    hospital.city.toLowerCase() === city.toLowerCase()
  );
}

/**
 * Reset in-memory storage (for development/testing)
 */
export function resetHospitalsData(): void {
  if (!isFirebaseConfigured) {
    inMemoryHospitals = [...MOCK_HOSPITALS];
  }
}
