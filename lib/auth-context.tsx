"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

export type UserRole = "client" | "gp" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  city?: string
  passBalance: number
  createdAt: Date
}

export interface GPProfile extends User {
  role: "gp"
  destination?: string
  departureDate?: string
  availableKg?: number
  description?: string
}

interface LoginResult {
  success: boolean
  user?: User | GPProfile
}

interface AuthContextType {
  user: User | GPProfile | null
  login: (email: string, password: string) => Promise<LoginResult>
  register: (data: RegisterData) => Promise<LoginResult>
  logout: () => void
  updatePassBalance: (amount: number) => void
  isLoading: boolean
}

interface RegisterData {
  email: string
  password: string
  name: string
  role: UserRole
  city?: string
  destination?: string
  departureDate?: string
  availableKg?: number
  description?: string
}

const TEST_ACCOUNTS: Record<string, { password: string; user: User | GPProfile }> = {
  "admin@easycollis.com": {
    password: "admin123",
    user: {
      id: "admin-1",
      email: "admin@easycollis.com",
      name: "Administrateur",
      role: "admin",
      passBalance: 999,
      createdAt: new Date("2023-01-01"),
    },
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
      createdAt: new Date("2024-01-15"),
    },
  },
  "client2@test.com": {
    password: "client123",
    user: {
      id: "client-2",
      email: "client2@test.com",
      name: "Jean Martin",
      role: "client",
      city: "Lyon",
      passBalance: 0,
      createdAt: new Date("2024-02-20"),
    },
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
      createdAt: new Date("2023-06-10"),
    } as GPProfile,
  },
  "gp2@test.com": {
    password: "gp123",
    user: {
      id: "gp-2",
      email: "gp2@test.com",
      name: "Express Dakar",
      role: "gp",
      city: "Dakar",
      destination: "Marseille",
      departureDate: "2025-01-20",
      availableKg: 30,
      description: "Spécialiste du transport Sénégal-France. Service premium.",
      passBalance: 3,
      createdAt: new Date("2023-09-05"),
    } as GPProfile,
  },
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | GPProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("easycollis_user")
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<LoginResult> => {
    const account = TEST_ACCOUNTS[email.toLowerCase()]
    if (account && account.password === password) {
      setUser(account.user)
      localStorage.setItem("easycollis_user", JSON.stringify(account.user))
      return { success: true, user: account.user }
    }

    // Vérifier les comptes enregistrés localement
    const registeredUsers = JSON.parse(localStorage.getItem("easycollis_registered_users") || "{}")
    if (registeredUsers[email.toLowerCase()]?.password === password) {
      const foundUser = registeredUsers[email.toLowerCase()].user
      setUser(foundUser)
      localStorage.setItem("easycollis_user", JSON.stringify(foundUser))
      return { success: true, user: foundUser }
    }

    return { success: false }
  }

  const register = async (data: RegisterData): Promise<LoginResult> => {
    const newUser: User | GPProfile = {
      id: `${data.role}-${Date.now()}`,
      email: data.email,
      name: data.name,
      role: data.role,
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

    const registeredUsers = JSON.parse(localStorage.getItem("easycollis_registered_users") || "{}")
    registeredUsers[data.email.toLowerCase()] = { password: data.password, user: newUser }
    localStorage.setItem("easycollis_registered_users", JSON.stringify(registeredUsers))

    setUser(newUser)
    localStorage.setItem("easycollis_user", JSON.stringify(newUser))
    return { success: true, user: newUser }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("easycollis_user")
    router.push("/")
  }

  const updatePassBalance = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, passBalance: user.passBalance + amount }
      setUser(updatedUser)
      localStorage.setItem("easycollis_user", JSON.stringify(updatedUser))

      // Mettre à jour aussi dans les comptes enregistrés
      const registeredUsers = JSON.parse(localStorage.getItem("easycollis_registered_users") || "{}")
      if (registeredUsers[user.email.toLowerCase()]) {
        registeredUsers[user.email.toLowerCase()].user = updatedUser
        localStorage.setItem("easycollis_registered_users", JSON.stringify(registeredUsers))
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updatePassBalance, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
