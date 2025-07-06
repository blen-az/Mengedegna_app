// Default export for route compatibility
export default function TypesIndex() {
  return null;
}

// Re-export types from models.ts
export {
  UserSchema,
  User,
  TripSchema,
  Trip as TripModel,
  BookingSchema,
  Booking,
  LoginFormSchema,
  RegisterFormSchema,
  LoginForm,
  RegisterForm,
  UserProfile
} from './models';

// Re-export types from Post.ts
export {
  Post,
  Passenger,
  Trip as PostTrip
} from './Post';
