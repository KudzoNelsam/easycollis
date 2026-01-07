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

export interface GP {
  id: string
  name: string
  email: string
  city: string
  destination: string
  departureDate: string
  availableKg: number
  description: string
  rating?: number
  reviewCount?: number
  verified: boolean
  createdAt: string
}

export interface Trip {
  id: string
  gpId: string
  gpName: string
  destination: string
  departureDate: string
  availableKg: number
  pricePerKg?: number
  description: string
  status: "active" | "completed" | "cancelled"
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  receiverId: string
  receiverName: string
  content: string
  timestamp: Date
  read: boolean
}

export interface ConversationParticipant {
  id: string
  name: string
  role: UserRole
}

export interface Conversation {
  id: string
  participants: ConversationParticipant[]
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
}
