export type UserRole = "client" | "gp" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  city?: string
  passValidUntil?: string
  createdAt: Date
}

export interface GPProfile extends User {
  role: "gp"
  destination?: string
  departureDate?: string
  availableKg?: number
  description?: string
}
