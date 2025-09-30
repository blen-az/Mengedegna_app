// Mock trip data and service functions
// Firestore-backed helpers are added below; mocks remain for offline/demo.
import { db } from './firebase';
import { 
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

export interface CreateTripInput {
  operatorId: string;
  busId: string;
  origin: string;
  destination: string;
  date: string; // YYYY-MM-DD
  departureTime: string; // HH:mm
  arrivalTime?: string; // HH:mm
  price: number;
  seatsAvailable: number;
  status?: 'active' | 'cancelled' | 'completed';
}

export interface TripFilter {
  origin?: string | null;
  destination?: string | null;
  date?: string | null; // YYYY-MM-DD
  status?: 'active' | 'cancelled' | 'completed' | null;
}

// Define types for trip data
interface Company {
  id: string;
  name: string;
  logoUrl: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
}

interface Seat {
  id: string;
  status: 'booked' | 'available';
}

interface Trip {
  id: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  departureTerminal: string;
  busType: string;
  totalSeats: number;
  availableSeats: number;
  company: Company;
  amenities: string[];
  seats: Seat[];
}

// Sample trip data
const mockTrips: Trip[] = [
  {
    id: 'trip1',
    from: 'Addis Ababa',
    to: 'Bahir Dar',
    date: '2025-06-01',
    departureTime: '09:00',
    arrivalTime: '16:00',
    price: 500,
    departureTerminal: 'Meskel Square Terminal',
    busType: 'Luxury Coach',
    totalSeats: 44,
    availableSeats: 28,
    company: {
      id: 'company1',
      name: 'Selam Bus',
      logoUrl: 'https://images.pexels.com/photos/2148222/pexels-photo-2148222.jpeg',
      imageUrl: 'https://images.pexels.com/photos/1178448/pexels-photo-1178448.jpeg',
      rating: 4.7,
      reviewCount: 256,
    },
    amenities: ['Wi-Fi', 'AC', 'Reclining Seats', 'USB Charging', 'Refreshments'],
    seats: Array.from({ length: 44 }, (_, i) => ({
      id: `${i + 1}${String.fromCharCode(65 + Math.floor(i / 11))}`,
      status: Math.random() > 0.7 ? 'booked' : 'available',
    })),
  },
  {
    id: 'trip2',
    from: 'Addis Ababa',
    to: 'Hawassa',
    date: '2025-06-02',
    departureTime: '08:30',
    arrivalTime: '13:00',
    price: 350,
    departureTerminal: 'Mexico Square Terminal',
    busType: 'Standard Coach',
    totalSeats: 44,
    availableSeats: 15,
    company: {
      id: 'company2',
      name: 'Sky Bus',
      logoUrl: 'https://images.pexels.com/photos/3760847/pexels-photo-3760847.jpeg',
      imageUrl: 'https://images.pexels.com/photos/2402648/pexels-photo-2402648.jpeg',
      rating: 4.5,
      reviewCount: 189,
    },
    amenities: ['AC', 'Reclining Seats', 'USB Charging'],
    seats: Array.from({ length: 44 }, (_, i) => ({
      id: `${i + 1}${String.fromCharCode(65 + Math.floor(i / 11))}`,
      status: Math.random() > 0.6 ? 'booked' : 'available',
    })),
  },
  {
    id: 'trip3',
    from: 'Addis Ababa',
    to: 'Gondar',
    date: '2025-06-03',
    departureTime: '20:00',
    arrivalTime: '08:00',
    price: 650,
    departureTerminal: 'Meskel Square Terminal',
    busType: 'Sleeper Coach',
    totalSeats: 36,
    availableSeats: 8,
    company: {
      id: 'company3',
      name: 'Golden Bus',
      logoUrl: 'https://images.pexels.com/photos/2833855/pexels-photo-2833855.jpeg',
      imageUrl: 'https://images.pexels.com/photos/5625045/pexels-photo-5625045.jpeg',
      rating: 4.8,
      reviewCount: 312,
    },
    amenities: ['Wi-Fi', 'AC', 'Flat Beds', 'USB Charging', 'Snacks', 'Blankets'],
    seats: Array.from({ length: 36 }, (_, i) => ({
      id: `${i + 1}${String.fromCharCode(65 + Math.floor(i / 9))}`,
      status: Math.random() > 0.8 ? 'booked' : 'available',
    })),
  },
];

export const fetchTrips = async (
  from: string | null = null,
  to: string | null = null,
  date: string | null = null
): Promise<Trip[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Filter trips based on parameters
  let filteredTrips = [...mockTrips];
  
  if (from) {
    filteredTrips = filteredTrips.filter(trip => 
      trip.from.toLowerCase().includes(from.toLowerCase())
    );
  }
  
  if (to) {
    filteredTrips = filteredTrips.filter(trip => 
      trip.to.toLowerCase().includes(to.toLowerCase())
    );
  }
  
  if (date) {
    const searchDate = new Date(date).toISOString().split('T')[0];
    filteredTrips = filteredTrips.filter(trip => trip.date === searchDate);
  }
  
  return filteredTrips;
};

export const fetchTripById = async (id: string): Promise<Trip> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find trip by ID
  const trip = mockTrips.find(trip => trip.id === id);
  
  if (!trip) {
    throw new Error('Trip not found');
  }
  
  return trip;
};

// --- Firestore-backed helpers ---

export const createTrip = async (input: CreateTripInput): Promise<string> => {
  const tripsRef = collection(db, 'trips');
  const docRef = await addDoc(tripsRef, {
    operatorId: input.operatorId,
    busId: input.busId,
    origin: input.origin,
    destination: input.destination,
    date: input.date,
    departureTime: input.departureTime,
    arrivalTime: input.arrivalTime ?? null,
    price: input.price,
    seatsAvailable: input.seatsAvailable,
    status: input.status ?? 'active',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const listTrips = async (filter: TripFilter = {}): Promise<any[]> => {
  const conditions = [] as any[];
  if (filter.origin) conditions.push(where('origin', '==', filter.origin));
  if (filter.destination) conditions.push(where('destination', '==', filter.destination));
  if (filter.date) conditions.push(where('date', '==', filter.date));
  if (filter.status) conditions.push(where('status', '==', filter.status));

  const tripsRef = collection(db, 'trips');
  const q = conditions.length ? query(tripsRef, ...conditions) : query(tripsRef);
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};