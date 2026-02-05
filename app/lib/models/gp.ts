export interface GP {
  id: string;
  name: string;
  email: string;
  city: string;
  destination: string;
  departureDate: string;
  availableKg: number;
  description: string;
  rating?: number;
  reviewCount?: number;
  verified: boolean;
  createdAt: string;
}

export interface Trip {
  id: string;
  gpId: string;
  gpName: string;
  destination: string;
  departureDate: string;
  availableKg: number;
  pricePerKg?: number;
  description: string;
  status: "active" | "completed" | "cancelled";
}

export interface FollowedTrip {
  id: string;
  userId: string;
  tripId: string;
  createdAt: Date;
}
