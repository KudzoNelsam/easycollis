"use client"

import type React from "react"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { MOCK_GPS, MOCK_CONVERSATIONS, MOCK_MESSAGES, type Conversation, type Message } from "@/lib/data"
import { Send, Package, ArrowLeft } from "lucide-react"

function MessagesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading } = useAuth()

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConv, setSelectedConv] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")

  const newGpId = searchParams.get("new")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    // Load conversations
    let userConversations = MOCK_CONVERSATIONS.filter((c) => c.participants.some((p) => p.id === user?.id))

    // If starting a new conversation with a GP
    if (newGpId && user) {
      const gp = MOCK_GPS.find((g) => g.id === newGpId)
      if (gp) {
        const existingConv = userConversations.find((c) => c.participants.some((p) => p.id === gp.id))

        if (!existingConv) {
          const newConv: Conversation = {
            id: `conv-new-${Date.now()}`,
            participants: [
              { id: user.id, name: user.name, role: user.role },
              { id: gp.id, name: gp.name, role: "gp" },
            ],
            lastMessage: "",
            lastMessageTime: new Date(),
            unreadCount: 0,
          }
          userConversations = [newConv, ...userConversations]
          setSelectedConv(newConv.id)
        } else {
          setSelectedConv(existingConv.id)
        }
      }
    }

    setConversations(userConversations)

    if (!selectedConv && userConversations.length > 0) {
      setSelectedConv(userConversations[0].id)
    }
  }, [user, isLoading, router, newGpId, selectedConv])

  useEffect(() => {
    if (selectedConv) {
      const convMessages = MOCK_MESSAGES.filter((m) => m.conversationId === selectedConv)
      setMessages(convMessages)
    }
  }, [selectedConv])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Package className="h-8 w-8 animate-pulse text-primary" />
      </div>
    )
  }

  const selectedConversation = conversations.find((c) => c.id === selectedConv)
  const otherParticipant = selectedConversation?.participants.find((p) => p.id !== user.id)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConv || !otherParticipant) return

    const message: Message = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConv,
      senderId: user.id,
      senderName: user.name,
      receiverId: otherParticipant.id,
      receiverName: otherParticipant.name,
      content: newMessage,
      timestamp: new Date(),
      read: false,
    }

    setMessages([...messages, message])
    setNewMessage("")

    // Update conversation
    setConversations((prev) =>
      prev.map((c) => (c.id === selectedConv ? { ...c, lastMessage: newMessage, lastMessageTime: new Date() } : c)),
    )
  }

  return (
    <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)]">
      {/* Conversations List */}
      <div className={`w-full md:w-80 border-r bg-muted/30 ${selectedConv && "hidden md:block"}`}>
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Messages</h2>
        </div>
        <div className="overflow-y-auto">
          {conversations.length > 0 ? (
            conversations.map((conv) => {
              const other = conv.participants.find((p) => p.id !== user.id)
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConv(conv.id)}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-muted transition-colors text-left ${
                    selectedConv === conv.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="font-semibold text-primary">{other?.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{other?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {conv.lastMessage || "Nouvelle conversation"}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-xs text-primary-foreground">{conv.unreadCount}</span>
                    </div>
                  )}
                </button>
              )
            })
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <p>Aucune conversation</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!selectedConv && "hidden md:flex"}`}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center gap-3">
              <button onClick={() => setSelectedConv(null)} className="md:hidden p-2 hover:bg-muted rounded-lg">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-semibold text-primary">{otherParticipant?.name[0]}</span>
              </div>
              <div>
                <p className="font-semibold">{otherParticipant?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{otherParticipant?.role}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.senderId === user.id ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                        msg.senderId === user.id ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.senderId === user.id ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>Commencez la conversation avec {otherParticipant?.name}</p>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p>Sélectionnez une conversation</p>
          </div>
        )}
      </div>
    </main>
  )
}

export default function MessagesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">
            <Package className="h-8 w-8 animate-pulse text-primary" />
          </div>
        }
      >
        <MessagesContent />
      </Suspense>
    </div>
  )
}
