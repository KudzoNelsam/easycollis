import type { User, GPProfile } from "./user"

export interface LoginResult {
  success: boolean
  user?: User | GPProfile
}

export interface AuthContextType {
  user: User | GPProfile | null
  login: (email: string, password: string) => Promise<LoginResult>
  register: (data: RegisterData) => Promise<LoginResult>
  logout: () => void
  updatePassBalance: (amount: number) => void
  isLoading: boolean
}

export interface RegisterData {
  email: string
  password: string
  name: string
  role: "client" | "gp" | "admin"
  city?: string
  destination?: string
  departureDate?: string
  availableKg?: number
  description?: string
}
