import { USE_MOCKS } from "../config"
import type { GP } from "@/lib/types"
import { MOCK_GPS, POPULAR_DESTINATIONS } from "../mocks/data"

export async function listGPs(): Promise<GP[]> {
  if (USE_MOCKS) return Promise.resolve(MOCK_GPS)
  // TODO: call real backend e.g. httpGet('/gps')
  throw new Error("Not implemented: backend listGPs")
}

export async function getGP(id: string): Promise<GP | undefined> {
  if (USE_MOCKS) return Promise.resolve(MOCK_GPS.find((g) => g.id === id))
  throw new Error("Not implemented: backend getGP")
}

export async function listPopularDestinations() {
  if (USE_MOCKS) return Promise.resolve(POPULAR_DESTINATIONS)
  throw new Error("Not implemented: backend listPopularDestinations")
}
