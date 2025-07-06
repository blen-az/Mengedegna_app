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
  }),
  amenities: z.array(z.string()),
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