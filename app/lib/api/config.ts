export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true"
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

// Endpoints hints (Spring backend) - conventions
export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    me: "/auth/me",
  },
  gp: {
    list: "/gps",
    get: (id: string) => `/gps/${id}`,
  },
  messages: {
    conversations: "/messages/conversations",
    conversation: (id: string) => `/messages/conversations/${id}`,
    send: "/messages/send",
  },
}
