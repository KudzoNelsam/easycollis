import type { UserRole } from "./user"

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
