"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { MOCK_CONVERSATIONS } from "@/lib/data"
import type { GPProfile } from "@/lib/models"
import {
  CreditCard,
  MessageSquare,
  Plane,
  Eye,
  ArrowRight,
  Package,
  Plus,
  MapPin,
  Calendar,
  Pencil,
  Trash2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function GPDashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const [trips, setTrips] = useState<(any & { cityDepart?: string })[]>([])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "gp")) {
      router.push("/login")
    }

    // Load trips from localStorage
    if (user) {
      const savedTrips = localStorage.getItem(`easycollis_trips_${user.id}`)
      if (savedTrips) {
        setTrips(JSON.parse(savedTrips))
      }
    }
  }, [user, isLoading, router])

  if (isLoading || !user || user.role !== "gp") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Package className="h-8 w-8 animate-pulse text-primary" />
      </div>
    )
  }

  const gpUser = user as GPProfile
  const userConversations = MOCK_CONVERSATIONS.filter((c) => c.participants.some((p) => p.id === user.id))

  const handleDeleteTrip = (tripId: string) => {
    const updatedTrips = trips.filter((t) => t.id !== tripId)
    setTrips(updatedTrips)
    localStorage.setItem(`easycollis_trips_${user.id}`, JSON.stringify(updatedTrips))
    toast({
      title: "Voyage supprimé",
      description: "Le voyage a été supprimé avec succès.",
    })
  }

  return (
    <main className="flex-1 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{gpUser.name}</h1>
            <p className="text-muted-foreground mt-1">Tableau de bord GP</p>
          </div>
          <Link href="/dashboard/gp/new-trip">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau voyage
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Solde PASS</p>
                  <p className="text-3xl font-bold text-foreground">{user.passBalance}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-accent" />
                </div>
              </div>
              <Link href="/pass/gp" className="text-sm text-accent hover:underline mt-3 inline-block">
                Acheter des PASS
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Voyages actifs</p>
                  <p className="text-3xl font-bold text-foreground">{trips.filter((t) => t.status === "active").length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plane className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Messages</p>
                  <p className="text-3xl font-bold text-foreground">{userConversations.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Vues profil</p>
                  <p className="text-3xl font-bold text-foreground">24</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trips */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Mes voyages</CardTitle>
                  <CardDescription>Gérez vos voyages et disponibilités</CardDescription>
                </div>
                <Link href="/dashboard/gp/new-trip">
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {trips.length > 0 ? (
                  <div className="space-y-4">
                    {trips.map((trip) => (
                      <div key={trip.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Plane className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">
                                {trip.cityDepart && `${trip.cityDepart} → `}
                                {trip.destination}
                              </p>
                              <Badge variant={trip.status === "active" ? "default" : "secondary"}>
                                {trip.status === "active" ? "Actif" : trip.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(trip.departureDate).toLocaleDateString("fr-FR")}
                              </span>
                              <span className="flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                {trip.availableKg} kg
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-9 w-9 p-2">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Link href={`/dashboard/gp/new-trip?edit=${trip.id}`} className="h-9 w-9">
                            <Button variant="ghost" size="sm" className="h-9 w-9 p-2">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" className="h-9 w-9 p-2" onClick={() => handleDeleteTrip(trip.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Aucun voyage publié pour le moment.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
                <CardDescription>Dernières conversations</CardDescription>
              </CardHeader>
              <CardContent>
                {userConversations.length > 0 ? (
                  <div className="space-y-2">
                    {userConversations.map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-3 rounded border">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold">{c.participants[0].name[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium">{c.participants[0].name}</p>
                            <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                          </div>
                        </div>
                        <Link href={`/messages?conv=${c.id}`} className="text-sm text-accent hover:underline">
                          Voir
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Aucune conversation</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
