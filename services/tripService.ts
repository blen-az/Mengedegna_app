import { db } from './firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

// Trip interface that matches your Firestore structure
export interface Trip {
  id: string;              // Firestore document ID
  busId: string;
  from: string;
  to: string;
  date: string;            // YYYY-MM-DD
  price: number;
  seatsAvailable: number;
  createdAt?: any;         // Firestore Timestamp
  updatedAt?: any;         // Firestore Timestamp
}

// Create a trip
export const createTrip = async (input: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const tripsRef = collection(db, 'trips');
  const docRef = await addDoc(tripsRef, {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

// Fetch all trips with optional filters
export const fetchTrips = async (
  from: string | null = null,
  to: string | null = null,
  date: string | null = null
): Promise<Trip[]> => {
  try {
    const conditions = [] as any[];
    if (from) conditions.push(where('from', '==', from.trim().toLowerCase()));
    if (to) conditions.push(where('to', '==', to.trim().toLowerCase()));
    if (date) conditions.push(where('date', '==', date));

    const tripsRef = collection(db, 'trips');
    const q = conditions.length ? query(tripsRef, ...conditions) : query(tripsRef);
    const snap = await getDocs(q);

    return snap.docs.map(docSnap => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Trip, 'id'>),
    }));
  } catch (error) {
    console.error('Error fetching trips:', error);
    return [];
  }
};

// Fetch a single trip by ID
export const fetchTripById = async (id: string): Promise<Trip | null> => {
  try {
    const tripRef = doc(db, 'trips', id);
    const tripDoc = await getDoc(tripRef);

    if (!tripDoc.exists()) return null;

    return {
      id: tripDoc.id,
      ...(tripDoc.data() as Omit<Trip, 'id'>),
    };
  } catch (error) {
    console.error('Error fetching trip by ID:', error);
    return null;
  }
};

// Update a trip
export const updateTrip = async (id: string, updates: Partial<Trip>): Promise<void> => {
  const tripRef = doc(db, 'trips', id);
  await updateDoc(tripRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

// Delete a trip
export const deleteTrip = async (id: string): Promise<void> => {
  const tripRef = doc(db, 'trips', id);
  await deleteDoc(tripRef);
};

import { writeBatch } from 'firebase/firestore';

/**
 * Delete trips with dates before today (passed trips)
 */
export const deletePassedTrips = async (): Promise<void> => {
  const tripsRef = collection(db, 'trips');
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  // Query trips with date less than today
  const q = query(tripsRef, where('date', '<', today.toISOString().split('T')[0]));
  const snapshot = await getDocs(q);

  // Firestore batch for atomic deletes
  const batch = writeBatch(db);
  if (!batch) {
    // If batch not supported, delete individually
    for (const docSnap of snapshot.docs) {
      await deleteDoc(doc(db, 'trips', docSnap.id));
    }
  } else {
    snapshot.docs.forEach((docSnap) => {
      batch.delete(doc(db, 'trips', docSnap.id));
    });
    await batch.commit();
  }
};
