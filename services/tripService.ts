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
  operatorId: string;
  from: string;
  to: string;
  date: string;            // YYYY-MM-DD
  time: string;            // HH:mm
  price: number;
  seatsAvailable: number;
  totalSeats?: number;     // Populated from bus capacity
  departureTime?: string;  // Mapped from time
  company?: {              // Populated from operators collection
    id: string;
    name: string;
    logoUrl: string;
    imageUrl: string;
    rating: number;
    reviewCount: number;
  };
  seats?: Array<{          // Optional, for seat selection UI
    id: string;
    status: 'available' | 'booked' | 'selected';
    price?: number;
  }>;
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

    // Always exclude past trips (date < today)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    conditions.push(where('date', '>=', today.toISOString().split('T')[0]));

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

    const tripData = tripDoc.data() as Omit<Trip, 'id'>;
    const trip: Trip = {
      id: tripDoc.id,
      ...tripData,
    };

    // Fetch operator data for company info
    if (tripData.operatorId) {
      const operatorRef = doc(db, 'operators', tripData.operatorId);
      const operatorDoc = await getDoc(operatorRef);
      if (operatorDoc.exists()) {
        const operatorData = operatorDoc.data();
        trip.company = {
          id: operatorDoc.id,
          name: operatorData.name || 'Unknown Company',
          logoUrl: operatorData.logoUrl || 'https://images.pexels.com/photos/2402648/pexels-photo-2402648.jpeg',
          imageUrl: operatorData.imageUrl || 'https://images.pexels.com/photos/1178448/pexels-photo-1178448.jpeg',
          rating: operatorData.rating || 0,
          reviewCount: operatorData.reviewCount || 0,
        };
      }
    }

    // Fetch bus data for totalSeats
    if (tripData.busId) {
      const busRef = doc(db, 'buses', tripData.busId);
      const busDoc = await getDoc(busRef);
      if (busDoc.exists()) {
        const busData = busDoc.data();
        trip.totalSeats = busData.capacity || 60; // Default to 60 if not found
      } else {
        trip.totalSeats = 60; // Default fallback
      }
    } else {
      trip.totalSeats = 60; // Default fallback
    }

    // Map time to departureTime if not present
    if (tripData.time && !trip.departureTime) {
      trip.departureTime = tripData.time;
    }

    // Generate seats array if not present in Firestore
    if (!trip.seats && trip.totalSeats && trip.seatsAvailable !== undefined) {
      trip.seats = generateSeats(trip.totalSeats, trip.seatsAvailable);
    }

    return trip;
  } catch (error) {
    console.error('Error fetching trip by ID:', error);
    return null;
  }
};

// Helper function to generate seats array
const generateSeats = (totalSeats: number, availableSeats: number): Array<{ id: string; status: 'available' | 'booked' | 'selected'; price?: number }> => {
  const seats = [];
  const bookedSeats = totalSeats - availableSeats;

  for (let i = 1; i <= totalSeats; i++) {
    const seatId = i.toString();
    let status: 'available' | 'booked' | 'selected' = 'available';

    // Mark some seats as booked (simulate existing bookings)
    if (i <= bookedSeats) {
      status = 'booked';
    }

    seats.push({
      id: seatId,
      status,
    });
  }

  return seats;
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
