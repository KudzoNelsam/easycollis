import type { Message, Conversation, GP, Trip, FollowedTrip } from "@/lib/models"
import db from "@/lib/mocks/database.json"

export const MOCK_GPS: GP[] = db.gps as GP[]

const destinationCatalog = new Map(
  db.destinations.map((dest) => [dest.city.toLowerCase(), dest])
)

const destinationCounts = db.trips.reduce((acc, trip) => {
  const key = trip.destination.toLowerCase()
  acc.set(key, (acc.get(key) || 0) + 1)
  return acc
}, new Map<string, number>())

export const ALL_DESTINATIONS = Array.from(destinationCounts.entries())
  .map(([cityKey, count]) => {
    const match = destinationCatalog.get(cityKey)
    return {
      city: match?.city ?? cityKey,
      country: match?.country ?? "—",
      flag: match?.flag ?? "🏳️",
      gpCount: count,
    }
  })
  .sort((a, b) => b.gpCount - a.gpCount || a.city.localeCompare(b.city))

export const POPULAR_DESTINATIONS = ALL_DESTINATIONS.slice(0, 6)

export const MOCK_CONVERSATIONS: Conversation[] = db.conversations.map((c) => ({
  ...c,
  lastMessageTime: new Date(c.lastMessageTime),
})) as Conversation[]

export const MOCK_MESSAGES: Message[] = db.messages.map((m) => ({
  ...m,
  timestamp: new Date(m.timestamp),
})) as Message[]

export const CITIES_DEPART = db.citiesDepart
export const CITIES_DESTINATION = db.citiesDestination

export const MOCK_TRIPS: Trip[] = db.trips as Trip[]

export const MOCK_FOLLOWED_TRIPS: FollowedTrip[] = db.followedTrips.map((f) => ({
  ...f,
  createdAt: new Date(f.createdAt),
})) as FollowedTrip[]
