import { USE_MOCKS } from "../config"
import type { GP } from "@/lib/models"
import { MOCK_GPS, POPULAR_DESTINATIONS } from "../mocks/data"

export async function listGPs(): Promise<GP[]> {
  if (USE_MOCKS) return Promise.resolve(MOCK_GPS)
  // TODO: call real backend e.g. httpGet('/gps')
  console.warn("[API] listGPs not implemented, falling back to mocks")
  return Promise.resolve(MOCK_GPS)
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
