export interface Post {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  images?: string[];
  timestamp: string;
  likes: number;
  comments: number;
  liked: boolean;
}

export interface Passenger {
  seatId: string;
  fullName: string;
  phone: string;
  email: string;
  idNumber: string;
}

export interface Trip {
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
  company: {
    id: string;
    name: string;
    logoUrl: string;
    imageUrl: string;
    rating: number;
    reviewCount: number;
  };
  amenities: string[];
  seats: Array<{
    id: string;
    status: 'available' | 'booked' | 'selected';
  }>;
}