/**
 * Global configuration for the application.
 * Control mocking behavior and API endpoints with environment variables.
 * 
 * Set NEXT_PUBLIC_USE_MOCKS=true in .env.local to use mock data.
 * Set NEXT_PUBLIC_USE_MOCKS=false to use real API endpoints.
 */

export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true"
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

/**
 * API Endpoints hints (for Spring backend or your API structure)
 * These are reference paths for when you implement real API calls.
 */
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
} as const
