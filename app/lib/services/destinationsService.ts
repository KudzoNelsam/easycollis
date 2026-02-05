import db from "@/lib/mocks/database.json";
import type { Trip } from "@/lib/models";

type Destination = {
  city: string;
  country: string;
  flag: string;
  gpCount: number;
};

const catalogByCity = new Map(
  db.destinations.map((dest) => [dest.city.toLowerCase(), dest])
);

export function buildDestinations(trips: Trip[]): Destination[] {
  const counts = trips.reduce((acc, trip) => {
    const key = trip.destination.toLowerCase();
    acc.set(key, (acc.get(key) || 0) + 1);
    return acc;
  }, new Map<string, number>());

  return Array.from(counts.entries())
    .map(([cityKey, count]) => {
      const match = catalogByCity.get(cityKey);
      return {
        city: match?.city ?? cityKey,
        country: match?.country ?? tripCountryFallback(trips, cityKey) ?? "—",
        flag: match?.flag ?? tripFlagFallback(trips, cityKey) ?? "🏳️",
        gpCount: count,
      };
    })
    .sort((a, b) => b.gpCount - a.gpCount || a.city.localeCompare(b.city));
}

export function getCatalogDestination(city: string) {
  return catalogByCity.get(city.toLowerCase());
}

export function getAllTripsClient(): Trip[] {
  if (typeof window === "undefined") return db.trips as Trip[];
  const raw = localStorage.getItem("easycollis_trips_all");
  const localTrips = raw ? (JSON.parse(raw) as Trip[]) : [];
  return [...(db.trips as Trip[]), ...localTrips];
}

function tripCountryFallback(trips: Trip[], cityKey: string) {
  const match = trips.find(
    (trip) => trip.destination.toLowerCase() === cityKey && trip.destinationCountry
  );
  return match?.destinationCountry;
}

function tripFlagFallback(trips: Trip[], cityKey: string) {
  const match = trips.find(
    (trip) => trip.destination.toLowerCase() === cityKey && trip.destinationFlag
  );
  return match?.destinationFlag;
}
