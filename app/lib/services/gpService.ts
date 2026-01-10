import { USE_MOCKS, API_BASE_URL, ENDPOINTS } from "@/lib/config"
import type { GP, Trip } from "@/lib/models"
import { MOCK_GPS, MOCK_TRIPS, MOCK_FOLLOWED_TRIPS, POPULAR_DESTINATIONS } from "@/lib/mocks/data"

export async function listGPs(page = 1, size = 10, q?: string): Promise<{ items: GP[]; total: number }> {
  // Simple server-side like pagination for mocks
  if (USE_MOCKS) {
    let items = MOCK_GPS.slice()
    if (q) {
      const term = q.toLowerCase()
      items = items.filter((g) => g.name.toLowerCase().includes(term) || g.city.toLowerCase().includes(term) || g.destination.toLowerCase().includes(term))
    }
    const total = items.length
    const start = (page - 1) * size
    const paged = items.slice(start, start + size)
    return Promise.resolve({ items: paged, total })
  }

  // Real backend call (supports json-server and typical REST APIs)
  try {
    const params = new URLSearchParams()
    params.set("_page", String(page))
    params.set("_limit", String(size))
    if (q) params.set("q", q)

    const url = `${API_BASE_URL}${ENDPOINTS.gp.list}?${params.toString()}`
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`[API] listGPs failed: ${res.status} - ${res.statusText}`)
      // fallback to mocks
      const total = MOCK_GPS.length
      const start = (page - 1) * size
      return { items: MOCK_GPS.slice(start, start + size), total }
    }

    const items: GP[] = await res.json()
    const total = Number(res.headers.get("X-Total-Count") || items.length)
    return { items, total }
  } catch (err) {
    console.warn(`[API] listGPs error, falling back to mocks: ${String(err)}`)
    const total = MOCK_GPS.length
    const start = (page - 1) * size
    return { items: MOCK_GPS.slice(start, start + size), total }
  }
}

export async function getGP(id: string): Promise<GP | undefined> {
  if (USE_MOCKS) return Promise.resolve(MOCK_GPS.find((g) => g.id === id))
  // TODO: call real backend e.g. httpGet(`/gps/${id}`)
  console.warn(`[API] getGP(${id}) not implemented, falling back to mocks`)
  return Promise.resolve(MOCK_GPS.find((g) => g.id === id))
}

export async function listPopularDestinations() {
  if (USE_MOCKS) return Promise.resolve(POPULAR_DESTINATIONS)
  // TODO: call real backend e.g. httpGet('/destinations/popular')
  console.warn("[API] listPopularDestinations not implemented, falling back to mocks")
  return Promise.resolve(POPULAR_DESTINATIONS)
}

export async function getClientTrips(clientId?: string): Promise<Trip[]> {
  // If a clientId is provided, return only their followed trips
  if (clientId) return getFollowedTrips(clientId)

  if (USE_MOCKS) return Promise.resolve(MOCK_TRIPS)
  // TODO: call real backend e.g. httpGet('/trips')
  console.warn(`[API] getClientTrips(${clientId}) not implemented, falling back to mocks`)
  return Promise.resolve(MOCK_TRIPS)
}

export async function getFollowedTrips(userId: string): Promise<Trip[]> {
  if (USE_MOCKS) {
    const followedIds = MOCK_FOLLOWED_TRIPS.filter((f) => f.userId === userId).map((f) => f.tripId)
    return Promise.resolve(MOCK_TRIPS.filter((t) => followedIds.includes(t.id)))
  }
  // TODO: call real backend e.g. httpGet(`/users/${userId}/followed-trips`)
  console.warn(`[API] getFollowedTrips(${userId}) not implemented, falling back to mocks`)
  const followedIds = MOCK_FOLLOWED_TRIPS.filter((f) => f.userId === userId).map((f) => f.tripId)
  return Promise.resolve(MOCK_TRIPS.filter((t) => followedIds.includes(t.id)))
}

export async function followTrip(userId: string, tripId: string): Promise<boolean> {
  if (USE_MOCKS) {
    const exists = MOCK_FOLLOWED_TRIPS.some((f) => f.userId === userId && f.tripId === tripId)
    if (!exists) {
      MOCK_FOLLOWED_TRIPS.unshift({ id: `follow-${Date.now()}`, userId, tripId, createdAt: new Date() })
    }
    return Promise.resolve(true)
  }
  // TODO: call real backend e.g. httpPost(`/users/${userId}/followed-trips`, { tripId })
  console.warn(`[API] followTrip not implemented, falling back to mocks`)
  return Promise.resolve(true)
}

export async function unfollowTrip(userId: string, tripId: string): Promise<boolean> {
  if (USE_MOCKS) {
    const idx = MOCK_FOLLOWED_TRIPS.findIndex((f) => f.userId === userId && f.tripId === tripId)
    if (idx >= 0) MOCK_FOLLOWED_TRIPS.splice(idx, 1)
    return Promise.resolve(true)
  }
  // TODO: call real backend e.g. httpDelete(`/users/${userId}/followed-trips/${tripId}`)
  console.warn(`[API] unfollowTrip not implemented, falling back to mocks`)
  return Promise.resolve(true)
}
