// Mock booking data and service functions

// Define types for booking data
export interface Passenger {
  seatId: string;
  fullName: string;
  phone: string;
  email: string;
  idNumber: string;
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
        fullName: 'John Doe',
        phone: '+251912345678',
        email: 'john@example.com',
        idNumber: 'ET12345678',
      },
      {
        seatId: '12B',
        fullName: 'Jane Doe',
        phone: '+251987654321',
        email: 'jane@example.com',
        idNumber: '',
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
        fullName: 'John Doe',
        phone: '+251912345678',
        email: 'john@example.com',
        idNumber: 'ET12345678',
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
        fullName: 'John Doe',
        phone: '+251912345678',
        email: 'john@example.com',
        idNumber: 'ET12345678',
      },
      {
        seatId: '8D',
        fullName: 'Sarah Smith',
        phone: '+251923456789',
        email: 'sarah@example.com',
        idNumber: '',
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