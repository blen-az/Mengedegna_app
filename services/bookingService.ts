// Mock booking data and service functions
// Firestore-backed helpers are added below; mocks remain for offline/demo.
import { db, auth } from './firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  runTransaction,
} from 'firebase/firestore';

// Define types for booking data
export interface Passenger {
  seatId: string;
  firstName: string;
  phone: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface TripInfo {
  id: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  departureTerminal: string;
  company: Company;
}

export interface Booking {
  id: string;
  userId: string;
  tripId: string;
  seats: string[];
  passengers: Passenger[];
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentId: string;
  totalAmount: number;
  bookingDate: string;
  trip: TripInfo;
}

// Sample booking data
const mockBookings: Booking[] = [
  {
    id: 'booking1',
    userId: 'user123',
    tripId: 'trip1',
    seats: ['12A', '12B'],
    passengers: [
      {
        seatId: '12A',
        firstName: 'John',
        phone: '+251912345678',
      },
      {
        seatId: '12B',
        firstName: 'Jane',
        phone: '+251987654321',
      },
    ],
    status: 'confirmed',
    paymentId: 'pay123',
    totalAmount: 1000,
    bookingDate: '2025-05-25T10:30:00Z',
    trip: {
      id: 'trip1',
      from: 'Addis Ababa',
      to: 'Bahir Dar',
      date: '2025-06-01',
      departureTime: '09:00',
      departureTerminal: 'Meskel Square Terminal',
      company: {
        id: 'company1',
        name: 'Selam Bus',
      },
    },
  },
  {
    id: 'booking2',
    userId: 'user123',
    tripId: 'trip2',
    seats: ['5A'],
    passengers: [
      {
        seatId: '5A',
        firstName: 'John',
        phone: '+251912345678',
      },
    ],
    status: 'pending',
    paymentId: 'pay456',
    totalAmount: 350,
    bookingDate: '2025-05-27T14:15:00Z',
    trip: {
      id: 'trip2',
      from: 'Addis Ababa',
      to: 'Hawassa',
      date: '2025-06-02',
      departureTime: '08:30',
      departureTerminal: 'Mexico Square Terminal',
      company: {
        id: 'company2',
        name: 'Sky Bus',
      },
    },
  },
  {
    id: 'booking3',
    userId: 'user123',
    tripId: 'trip3',
    seats: ['8C', '8D'],
    passengers: [
      {
        seatId: '8C',
        firstName: 'John',
        phone: '+251912345678',
      },
      {
        seatId: '8D',
        firstName: 'Sarah',
        phone: '+251923456789',
      },
    ],
    status: 'cancelled',
    paymentId: 'pay789',
    totalAmount: 1300,
    bookingDate: '2025-05-20T09:45:00Z',
    trip: {
      id: 'trip3',
      from: 'Addis Ababa',
      to: 'Gondar',
      date: '2025-06-03',
      departureTime: '20:00',
      departureTerminal: 'Meskel Square Terminal',
      company: {
        id: 'company3',
        name: 'Golden Bus',
      },
    },
  },
];

export const fetchUserBookings = async (
  userId: string,
  status: 'upcoming' | 'past' | 'cancelled' | null = null
): Promise<Booking[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Filter bookings by user ID and optionally by status
  let filteredBookings = mockBookings.filter(booking => booking.userId === userId);
  
  if (status === 'upcoming') {
    const now = new Date();
    filteredBookings = filteredBookings.filter(booking => {
      const tripDate = new Date(booking.trip.date);
      return tripDate > now && booking.status !== 'cancelled';
    });
  } else if (status === 'past') {
    const now = new Date();
    filteredBookings = filteredBookings.filter(booking => {
      const tripDate = new Date(booking.trip.date);
      return tripDate < now && booking.status !== 'cancelled';
    });
  } else if (status === 'cancelled') {
    filteredBookings = filteredBookings.filter(booking => booking.status === 'cancelled');
  }
  
  return filteredBookings;
};

export const fetchBookingById = async (bookingId: string): Promise<Booking> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find booking by ID
  const booking = mockBookings.find(booking => booking.id === bookingId);
  
  if (!booking) {
    throw new Error('Booking not found');
  }
  
  return booking;
};

export const createBooking = async (
  tripId: string,
  seats: string[],
  passengers: Passenger[],
  paymentId: string,
  totalAmount: number
): Promise<Booking> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Create a new booking
  const newBooking: Booking = {
    id: `booking${Date.now()}`,
    userId: 'user123', // In a real app, this would be the authenticated user's ID
    tripId,
    seats,
    passengers,
    status: 'confirmed',
    paymentId,
    totalAmount,
    bookingDate: new Date().toISOString(),
    // Would normally fetch trip details from the database
    trip: mockBookings[0].trip, // Mock trip data for demonstration
  };
  
  // In a real app, this would be saved to the database
  mockBookings.push(newBooking);
  
  return newBooking;
};

export const cancelBooking = async (bookingId: string): Promise<Booking> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find and update the booking status
  const bookingIndex = mockBookings.findIndex(booking => booking.id === bookingId);
  
  if (bookingIndex === -1) {
    throw new Error('Booking not found');
  }
  
  mockBookings[bookingIndex].status = 'cancelled';
  
  return mockBookings[bookingIndex];
};

// --- Firestore-backed helpers ---

export interface CreateBookingInput {
  tripId: string;
  seats: string[];
  passengers: Passenger[];
  paymentId?: string;
  totalAmount: number;
  status?: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'cancelled' | 'refunded';
}

export const createBookingDoc = async (input: CreateBookingInput): Promise<string> => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('Not authenticated');

  // Reserve seats and write booking in a transaction
  return await runTransaction(db, async (tx) => {
    const tripRef = doc(db, 'trips', input.tripId);
    const tripSnap = await tx.get(tripRef);
    if (!tripSnap.exists()) throw new Error('Trip not found');
    const tripData = tripSnap.data() as any;

    // Check seat availability
    if ((tripData.seatsAvailable ?? 0) < input.seats.length) {
      throw new Error('Not enough seats available');
    }

    // Get current seats array or initialize if not exists
    let seatsArray = tripData.seats || [];
    if (seatsArray.length === 0 && tripData.totalSeats) {
      // Generate seats if not present
      seatsArray = Array.from({ length: tripData.totalSeats }, (_, i) => ({
        id: (i + 1).toString(),
        status: 'available',
      }));
    }

    // Check if selected seats are available
    for (const seatId of input.seats) {
      const seat = seatsArray.find((s: any) => s.id === seatId);
      if (!seat || seat.status !== 'available') {
        throw new Error(`Seat ${seatId} is not available`);
      }
    }

    // Update seat statuses to 'booked'
    const updatedSeats = seatsArray.map((seat: any) => ({
      ...seat,
      status: input.seats.includes(seat.id) ? 'booked' : seat.status,
    }));

    const bookingsRef = collection(db, 'bookings');
    const bookingRef = await addDoc(bookingsRef, {
      tripId: input.tripId,
      userId,
      seats: input.seats,
      passengers: input.passengers,
      totalPrice: input.totalAmount,
      paymentStatus: input.paymentStatus || 'pending',
      bookingStatus: input.status || 'pending',
      createdAt: serverTimestamp(),
    });

    // Update trip with new seats array and available count
    tx.update(tripRef, {
      seats: updatedSeats,
      seatsAvailable: (tripData.seatsAvailable ?? 0) - input.seats.length,
    });

    return bookingRef.id;
  });
};

export const listUserBookings = async (): Promise<any[]> => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('Not authenticated');
  const bookingsRef = collection(db, 'bookings');
  const q = query(bookingsRef, where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// Backend API integration functions
// NOTE: For APK testing on real devices, use ngrok to expose localhost backend
// 1. Install ngrok: npm install -g ngrok
// 2. Run backend: cd backend && npm run dev
// 3. Expose port: ngrok http 5000
// 4. Copy HTTPS URL (e.g., https://abc123.ngrok.io) and update .env:
//    EXPO_PUBLIC_BACKEND_URL=https://abc123.ngrok.io/api
// 5. Rebuild APK with updated .env
const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const createBackendBooking = async (input: CreateBookingInput): Promise<any> => {
  console.log('🔄 Booking attempt:', { tripId: input.tripId, seats: input.seats, passengers: input.passengers, totalAmount: input.totalAmount });
  console.log('🌐 API Base URL:', API_BASE_URL);

  const user = auth.currentUser;
  if (!user) {
    console.error('❌ Booking failed: Not authenticated');
    throw new Error('Not authenticated');
  }

  try {
    const idToken = await user.getIdToken();
    console.log('📡 Making API call to:', `${API_BASE_URL}/bookings`);
    console.log('🔑 User ID Token obtained:', !!idToken);

    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify(input),
    });

    console.log('📊 API response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Booking API error:', response.status, errorText);
      console.error('❌ Full error details:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText
      });
      throw new Error(`Failed to create booking: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Booking created successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Booking failed with error:', error);
    if (error instanceof Error) {
      console.error('❌ Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    throw error;
  }
};

export const getUserBookings = async (): Promise<any[]> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const idToken = await user.getIdToken();
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    headers: {
      'Authorization': `Bearer ${idToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }

  return response.json();
};

export const processPayment = async (bookingId: string, paymentMethod: string, amount: number): Promise<any> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const idToken = await user.getIdToken();
  const response = await fetch(`${API_BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
    body: JSON.stringify({ bookingId, paymentMethod, amount }),
  });

  if (!response.ok) {
    throw new Error('Payment failed');
  }

  return response.json();
};

export const generateTickets = async (bookingId: string): Promise<any[]> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const idToken = await user.getIdToken();
  const response = await fetch(`${API_BASE_URL}/tickets/generate/${bookingId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to generate tickets');
  }

  return response.json();
};
