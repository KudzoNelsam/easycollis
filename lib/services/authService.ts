import { USE_MOCKS } from "../config"
import type { User, GPProfile, UserRole } from "@/lib/models"

type LoginResult = { success: boolean; user?: User | GPProfile }

// Mocked test accounts for local mode
const TEST_ACCOUNTS: Record<string, { password: string; user: User | GPProfile }> = {
  "admin@easycollis.com": {
    password: "admin123",
    user: {
      id: "admin-1",
      email: "admin@easycollis.com",
      name: "Administrateur",
      role: "admin",
      passBalance: 999,
      createdAt: new Date(),
    } as User,
  },
  "client@test.com": {
    password: "client123",
    user: {
      id: "client-1",
      email: "client@test.com",
      name: "Marie Dupont",
      role: "client",
      city: "Paris",
      passBalance: 2,
      createdAt: new Date(),
    } as User,
  },
  "gp@test.com": {
    password: "gp123",
    user: {
      id: "gp-1",
      email: "gp@test.com",
      name: "Transport Koné",
      role: "gp",
      city: "Abidjan",
      destination: "Paris",
      departureDate: "2025-01-15",
      availableKg: 50,
      description: "Transport fiable et rapide vers la France. 10 ans d'expérience.",
      passBalance: 5,
      createdAt: new Date(),
    } as GPProfile,
  },
}

export async function login(email: string, password: string): Promise<LoginResult> {
  if (USE_MOCKS) {
    const account = TEST_ACCOUNTS[email.toLowerCase()]
    if (account && account.password === password) {
      localStorage.setItem("easycollis_user", JSON.stringify(account.user))
      return { success: true, user: account.user }
    }
    const registeredUsers = JSON.parse(localStorage.getItem("easycollis_registered_users") || "{}")
    if (registeredUsers[email.toLowerCase()]?.password === password) {
      const foundUser = registeredUsers[email.toLowerCase()].user
      localStorage.setItem("easycollis_user", JSON.stringify(foundUser))
      return { success: true, user: foundUser }
    }
    return { success: false }
  }

  // TODO: implement real backend call
  // e.g. await httpPost('/auth/login', { email, password })
  throw new Error("Not implemented: backend login")
}

export async function register(data: { email: string; password: string; name: string; role: UserRole; city?: string; destination?: string; departureDate?: string; availableKg?: number; description?: string }): Promise<LoginResult> {
  if (USE_MOCKS) {
    const newUser = {
      id: `${data.role}-${Date.now()}`,
      email: data.email,
      name: data.name,
      role: data.role as UserRole,
      city: data.city,
      passBalance: 0,
      createdAt: new Date(),
      ...(data.role === "gp" && {
        destination: data.destination,
        departureDate: data.departureDate,
        availableKg: data.availableKg,
        description: data.description,
      }),
    }
    const registered = JSON.parse(localStorage.getItem("easycollis_registered_users") || "{}")
    registered[data.email.toLowerCase()] = { password: data.password, user: newUser }
    localStorage.setItem("easycollis_registered_users", JSON.stringify(registered))
    localStorage.setItem("easycollis_user", JSON.stringify(newUser))
    return { success: true, user: newUser }
  }

  // TODO: backend call to register
  throw new Error("Not implemented: backend register")
}

export function logout() {
  localStorage.removeItem("easycollis_user")
}

export function getStoredUser(): User | GPProfile | null {
  const stored = localStorage.getItem("easycollis_user")
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function setStoredUser(user: User | GPProfile) {
  localStorage.setItem("easycollis_user", JSON.stringify(user))
}
