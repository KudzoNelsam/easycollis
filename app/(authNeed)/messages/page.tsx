"use client";

import type React from "react";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  getConversationsForUser,
  getMessages,
  sendMessage,
  createConversation,
} from "@/lib/services/messagesService";
import { getGP } from "@/lib/services/gpService";
import type { Conversation, Message, UserRole, GP } from "@/lib/models";
import {
  Send,
  Package,
  ArrowLeft,
  Search,
  Sparkles,
  Shield,
} from "lucide-react";

export default function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");

  const newGpId = searchParams.get("new");
  const returnToParam = searchParams.get("returnTo");
  const decodedReturnTo = returnToParam
    ? decodeURIComponent(returnToParam)
    : null;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (!user) return;

    // Load conversations
    getConversationsForUser(user.id).then(async (userConversations) => {
      // If starting a new conversation with a GP
      if (newGpId) {
        const gp = await getGP(newGpId);
        if (gp) {
          const existingConv = userConversations.find((c) =>
            c.participants.some((p) => p.id === gp.id)
          );

          if (!existingConv) {
            const newConv: Conversation = {
              id: `conv-new-${Date.now()}`,
              participants: [
                { id: user.id, name: user.name, role: user.role },
                { id: gp.id, name: gp.name, role: "gp" as UserRole },
              ],
              lastMessage: "",
              lastMessageTime: new Date(),
              unreadCount: 0,
            };
            userConversations = [newConv, ...userConversations];
            await createConversation(newConv);
            setSelectedConv(newConv.id);
          } else {
            setSelectedConv(existingConv.id);
          }
        }
      }

      setConversations(userConversations);

      if (!selectedConv && userConversations.length > 0) {
        setSelectedConv(userConversations[0].id);
      }
    });
  }, [user, isLoading, router, newGpId]);

  useEffect(() => {
    if (selectedConv) {
      getMessages(selectedConv).then((convMessages) => {
        setMessages(convMessages);
      });
    }
  }, [selectedConv]);

  const filteredConversations = useMemo(() => {
    if (!search.trim()) return conversations;
    const term = search.toLowerCase();
    return conversations.filter((conv) =>
      conv.participants.some((p) => p.name.toLowerCase().includes(term))
    );
  }, [conversations, search]);

  const formatConversationTime = (value: Date) => {
    const date = new Date(value);
    const today = new Date();
    const isSameDay =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
    if (isSameDay) {
      return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Package className="h-8 w-8 animate-pulse text-primary" />
      </div>
    );
  }

  const backLink = decodedReturnTo || "/search";

  const selectedConversation = conversations.find((c) => c.id === selectedConv);
  const otherParticipant = selectedConversation?.participants.find(
    (p) => p.id !== user.id
  );

  // Back link (preserve where user came from)
  const BackToResults = () => (
    <div className="mb-4">
      <Link
        href={backLink}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Link>
    </div>
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv || !otherParticipant) return;

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
    };

    await sendMessage(selectedConv, message);
    setMessages([...messages, message]);
    setNewMessage("");

    // Update conversation
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConv
          ? { ...c, lastMessage: newMessage, lastMessageTime: new Date() }
          : c
      )
    );
  };

  return (
    <main className="flex-1 py-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <BackToResults />

        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Messages</h1>
            <p className="text-sm text-muted-foreground">
              Centralisez vos échanges avec les GP et suivez vos demandes.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">
              Messagerie sécurisée
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Conversations List */}
          <aside
            className={`rounded-2xl border bg-background shadow-sm ${selectedConv ? "hidden lg:block" : ""}`}
          >
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Conversations</h2>
                <span className="text-xs text-muted-foreground">
                  {conversations.length} active
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-xl border bg-muted/30 px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="Rechercher un contact..."
                />
              </div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => {
                  const other = conv.participants.find(
                    (p) => p.id !== user.id
                  );
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConv(conv.id)}
                      className={`w-full border-b px-4 py-4 text-left transition ${
                        selectedConv === conv.id
                          ? "bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="font-semibold text-primary">
                            {other?.name[0]}
                          </span>
                          {conv.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-5 min-w-[20px] rounded-full bg-primary px-1 text-center text-[10px] leading-5 text-primary-foreground">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-sm truncate">
                              {other?.name}
                            </p>
                            <span className="text-[11px] text-muted-foreground">
                              {formatConversationTime(conv.lastMessageTime)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {conv.lastMessage || "Nouvelle conversation"}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  <Sparkles className="mx-auto h-6 w-6 mb-2 text-primary/60" />
                  <p className="text-sm">Aucune conversation trouvée</p>
                </div>
              )}
            </div>
          </aside>

          {/* Chat Area */}
          <section
            className={`rounded-2xl border bg-background shadow-sm flex flex-col min-h-[520px] ${
              !selectedConv ? "hidden lg:flex" : ""
            }`}
          >
            {selectedConversation ? (
              <>
                <div className="border-b p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedConv(null)}
                      className="lg:hidden p-2 hover:bg-muted rounded-lg"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {otherParticipant?.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{otherParticipant?.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {otherParticipant?.role}
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-4 w-4 text-primary/70" />
                    Conversations protégées
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
                  {messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.senderId === user.id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                            msg.senderId === user.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-background border"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.senderId === user.id
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString(
                              "fr-FR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-12">
                      <Sparkles className="mx-auto h-6 w-6 mb-2 text-primary/60" />
                      <p className="text-sm">
                        Démarrez la conversation avec {otherParticipant?.name}
                      </p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t">
                  <div className="flex items-center gap-3">
                    <Input
                      value={newMessage}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewMessage(e.target.value)
                      }
                      placeholder="Écrire un message..."
                    />
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center text-muted-foreground p-8">
                <div>
                  <Sparkles className="mx-auto h-7 w-7 mb-3 text-primary/60" />
                  <p className="text-sm">Sélectionnez une conversation</p>
                  <p className="text-xs mt-1">
                    Vous retrouverez ici toutes vos discussions.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
