import { USE_MOCKS } from "@/lib/config"
import type { Conversation, Message } from "@/lib/models"
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from "@/lib/mocks/data"

export async function getConversationsForUser(userId: string): Promise<Conversation[]> {
  if (USE_MOCKS) return Promise.resolve(MOCK_CONVERSATIONS.filter((c) => c.participants.some((p) => p.id === userId)))
  // TODO: call real backend e.g. httpGet(`/messages/conversations?userId=${userId}`)
  console.warn(`[API] getConversationsForUser(${userId}) not implemented, falling back to mocks`)
  return Promise.resolve(MOCK_CONVERSATIONS.filter((c) => c.participants.some((p) => p.id === userId)))
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  if (USE_MOCKS) return Promise.resolve(MOCK_MESSAGES.filter((m) => m.conversationId === conversationId))
  // TODO: call real backend e.g. httpGet(`/messages/conversations/${conversationId}`)
  console.warn(`[API] getMessages(${conversationId}) not implemented, falling back to mocks`)
  return Promise.resolve(MOCK_MESSAGES.filter((m) => m.conversationId === conversationId))
}

export async function sendMessage(conversationId: string, message: Message): Promise<Message> {
  if (USE_MOCKS) {
    MOCK_MESSAGES.push(message)
    return Promise.resolve(message)
  }
  // TODO: call real backend e.g. httpPost(`/messages/send`, message)
  console.warn(`[API] sendMessage not implemented, falling back to mocks`)
  MOCK_MESSAGES.push(message)
  return Promise.resolve(message)
}

export async function createConversation(conversation: Conversation): Promise<Conversation> {
  if (USE_MOCKS) {
    MOCK_CONVERSATIONS.unshift(conversation)
    return Promise.resolve(conversation)
  }
  // TODO: call real backend e.g. httpPost(`/messages/conversations`, conversation)
  console.warn(`[API] createConversation not implemented, falling back to mocks`)
  MOCK_CONVERSATIONS.unshift(conversation)
  return Promise.resolve(conversation)
}
