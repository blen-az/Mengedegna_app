import { z } from 'zod';

// User Model
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string().min(2),
  photoURL: z.string().url().optional(),
  phoneNumber: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// Trip Model
export const TripSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  date: z.string(),
  departureTime: z.string(),
  arrivalTime: z.string(),
  price: z.number().positive(),
  departureTerminal: z.string(),
  busType: z.string(),
  totalSeats: z.number().positive(),
  availableSeats: z.number().min(0),
  company: z.object({
    id: z.string(),
    name: z.string(),
    logoUrl: z.string().url(),
    imageUrl: z.string().url(),
    rating: z.number().min(0).max(5),
    reviewCount: z.number().min(0),
  }).optional(),
  amenities: z.array(z.string()).optional(),
  seats: z.array(z.object({
    id: z.string(),
    status: z.enum(['available', 'booked', 'selected']),
  })),
});

export type Trip = z.infer<typeof TripSchema>;

// Booking Model
export const BookingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  tripId: z.string(),
  seats: z.array(z.string()),
  passengers: z.array(z.object({
    seatId: z.string(),
    fullName: z.string().min(2),
    phone: z.string(),
    email: z.string().email().optional(),
    idNumber: z.string().optional(),
  })),
  status: z.enum(['pending', 'confirmed', 'cancelled']),
  paymentId: z.string(),
  totalAmount: z.number().positive(),
  bookingDate: z.string(),
  trip: TripSchema,
});

export type Booking = z.infer<typeof BookingSchema>;

// Auth Form Validation
export const LoginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterFormSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Za-z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginForm = z.infer<typeof LoginFormSchema>;
export type RegisterForm = z.infer<typeof RegisterFormSchema>;

// User Profile interface for Firebase operations
export interface UserProfile {
  email: string;
  displayName: string;
  phoneNumber: string;
}

// --- Firestore Domain Types (for role-based access and operator features) ---

export type UserRole = 'user' | 'operator' | 'admin';

export interface AppUser {
  uid: string;
  email: string;
  fullName: string;
  photoURL?: string | null;
  role: UserRole;
  companyId?: string | null;
  createdAt: Date | unknown;
  updatedAt: Date | unknown;
}

export interface CompanyDoc {
  id: string;
  name: string;
  ownerId: string; // operator uid
  contact?: string;
  createdAt: Date | unknown;
}

export interface BusDoc {
  id: string;
  companyId: string;
  operatorId: string;
  plateNumber: string;
  capacity: number;
  type?: string;
  createdAt: Date | unknown;
}

export type TripStatus = 'active' | 'cancelled' | 'completed';

export interface TripDoc {
  id: string;
  operatorId: string;
  busId: string;
  origin: string;
  destination: string;
  date: string; // YYYY-MM-DD
  departureTime: string; // HH:mm
  arrivalTime?: string; // HH:mm
  price: number;
  seatsAvailable: number;
  status: TripStatus;
  createdAt: Date | unknown;
}

export type PaymentStatus = 'pending' | 'paid' | 'cancelled' | 'refunded';
export type BookingStatus = 'confirmed' | 'cancelled';

export interface BookingDoc {
  id: string;
  tripId: string;
  userId: string;
  seats: number;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  createdAt: Date | unknown;
}

// Backend Models (for API integration)
export interface BackendUser {
  _id: string;
  firebaseUid: string;
  email: string;
  displayName?: string;
  phone?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface BackendBooking {
  _id: string;
  userId: string;
  tripId: string;
  seats: string[];
  passengers: {
    seatId: string;
    firstName: string;
    phone: string;
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  _id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: 'telebirr' | 'cbe_birr' | 'm_pesa' | 'fenan_pay';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId: string;
  gatewayResponse: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  _id: string;
  bookingId: string;
  passengerId: string;
  qrCode: string;
  seatId: string;
  tripDetails: {
    from: string;
    to: string;
    date: string;
    departureTime: string;
    company: {
      name: string;
      logoUrl?: string;
    };
  };
  passengerDetails: {
    firstName: string;
    phone: string;
  };
  status: 'active' | 'used' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
