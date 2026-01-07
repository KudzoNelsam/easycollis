import { USE_MOCKS } from "../config"
import type { Conversation, Message } from "@/lib/models"
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from "../mocks/data"

export async function getConversationsForUser(userId: string): Promise<Conversation[]> {
  if (USE_MOCKS) return Promise.resolve(MOCK_CONVERSATIONS.filter((c) => c.participants.some((p) => p.id === userId)))
  throw new Error("Not implemented: backend getConversationsForUser")
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  if (USE_MOCKS) return Promise.resolve(MOCK_MESSAGES.filter((m) => m.conversationId === conversationId))
  throw new Error("Not implemented: backend getMessages")
}

export async function sendMessage(conversationId: string, message: Message): Promise<Message> {
  if (USE_MOCKS) {
    MOCK_MESSAGES.push(message)
    return Promise.resolve(message)
  }
  throw new Error("Not implemented: backend sendMessage")
}

export async function createConversation(conversation: Conversation): Promise<Conversation> {
  if (USE_MOCKS) {
    MOCK_CONVERSATIONS.unshift(conversation)
    return Promise.resolve(conversation)
  }
  throw new Error("Not implemented: backend createConversation")
}
