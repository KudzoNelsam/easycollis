export type PaymentRole = "client" | "gp"

export type ClientPack = {
  id: string
  price: number
  durationDays: number
  popular?: boolean
}

export type GPPack = {
  id: string
  name: string
  price: number
  durationDays: number
  features: string[]
  popular?: boolean
}

export type PaymentTransaction = {
  id: string
  userId: string
  role: PaymentRole
  packId: string
  amount: number
  currency: string
  status: "paid" | "failed" | "pending"
  createdAt: string
}

export type PendingPayment = {
  ref: string
  userId: string
  role: PaymentRole
  packId: string
  amount: number
  currency: string
  durationDays: number
  createdAt: string
}
