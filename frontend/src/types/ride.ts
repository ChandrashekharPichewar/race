export type UserRole = 'guest' | 'host' | 'both';

export interface User {
  id: string;
  userId?: string;
  firstname?: string;
  lastname?: string;
  name: string;
  email: string;
  phone: string;
  deviceId?: string;
  role: UserRole;
}

export interface Ride {
  id: string;
  hostId: string;
  hostName: string;
  hostRating: number;
  hostVerified: boolean;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  duration: string;
  vehicle: string;
  seatsTotal: number;
  seatsAvailable: number;
  pricePerSeat: number;
  co2SavedKg: number;
  amenities: string[];
  instantBook: boolean;
  category: 'commute' | 'intercity';
  notes?: string;
}

export interface Booking {
  id: string;
  rideId: string;
  userId: string;
  seatsBooked: number;
  totalFare: number;
  pickupNote: string;
  bookedAt: string;
  status: 'confirmed' | 'cancelled';
  rideSnapshot: {
    from: string;
    to: string;
    date: string;
    departureTime: string;
    hostName: string;
    vehicle: string;
  };
}

export type AuthModalMode = 'signin' | 'signup';
