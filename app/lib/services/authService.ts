import { USE_MOCKS, ENDPOINTS } from "@/lib/config"
import { httpPost } from "@/lib/api/fetcher"
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
  const normalized = email.toLowerCase()

  // Mock mode: local lookup + registered users
  if (USE_MOCKS) {
    const account = TEST_ACCOUNTS[normalized]
    if (account && account.password === password) {
      localStorage.setItem("easycollis_user", JSON.stringify(account.user))
      return { success: true, user: account.user }
    }
    const registeredUsers = JSON.parse(localStorage.getItem("easycollis_registered_users") || "{}")
    if (registeredUsers[normalized]?.password === password) {
      const foundUser = registeredUsers[normalized].user
      localStorage.setItem("easycollis_user", JSON.stringify(foundUser))
      return { success: true, user: foundUser }
    }
    return { success: false }
  }

  // Try backend, but gracefully fall back to mocks if the call fails or returns no user
  try {
    console.debug("authService.login: attempting backend POST", ENDPOINTS.auth.login, { email: normalized, password })
    const res = await httpPost<any>(ENDPOINTS.auth.login, { email: normalized, password })
    console.debug("authService.login: backend response", res)
    const user = res?.user ?? res
    if (user && user.email) {
      localStorage.setItem("easycollis_user", JSON.stringify(user))
      return { success: true, user }
    }
    if (res?.success === false) return { success: false }
  } catch (err) {
    console.warn("authService.login: backend login failed, falling back to mock/local storage", err)
  }

  // Backend not available or didn't return a user -> fallback to mock/local behavior
  const account = TEST_ACCOUNTS[normalized]
  if (account && account.password === password) {
    localStorage.setItem("easycollis_user", JSON.stringify(account.user))
    return { success: true, user: account.user }
  }
  const registeredUsers = JSON.parse(localStorage.getItem("easycollis_registered_users") || "{}")
  if (registeredUsers[normalized]?.password === password) {
    const foundUser = registeredUsers[normalized].user
    localStorage.setItem("easycollis_user", JSON.stringify(foundUser))
    return { success: true, user: foundUser }
  }
  return { success: false }
}

export async function register(data: { email: string; password: string; name: string; role: UserRole; city?: string; destination?: string; departureDate?: string; availableKg?: number; description?: string }): Promise<LoginResult> {
  const normalized = data.email.toLowerCase()

  // Mock mode: create and store locally
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
    registered[normalized] = { password: data.password, user: newUser }
    localStorage.setItem("easycollis_registered_users", JSON.stringify(registered))
    localStorage.setItem("easycollis_user", JSON.stringify(newUser))
    return { success: true, user: newUser }
  }

  // Try backend register; if it fails, fall back to mock/local creation
  try {
    console.debug("authService.register: attempting backend POST", ENDPOINTS.auth.register, data)
    const res = await httpPost<any>(ENDPOINTS.auth.register, data)
    console.debug("authService.register: backend response", res)
    const user = res?.user ?? res
    if (user && user.email) {
      localStorage.setItem("easycollis_user", JSON.stringify(user))
      return { success: true, user }
    }
    if (res?.success === false) return { success: false }
  } catch (err) {
    console.warn("authService.register: backend register failed, falling back to mock/local storage", err)
  }

  // Fallback: create local user
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
  registered[normalized] = { password: data.password, user: newUser }
  localStorage.setItem("easycollis_registered_users", JSON.stringify(registered))
  localStorage.setItem("easycollis_user", JSON.stringify(newUser))
  return { success: true, user: newUser }
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
