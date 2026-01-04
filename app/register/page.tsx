"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { CITIES_DEPART, CITIES_DESTINATION } from "@/lib/data"
import { Loader2, Package, User, Truck } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { register } = useAuth()
  const { toast } = useToast()

  const defaultRole = searchParams.get("role") === "gp" ? "gp" : "client"
  const [activeTab, setActiveTab] = useState<UserRole>(defaultRole)
  const [isLoading, setIsLoading] = useState(false)

  // Client fields
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [clientPassword, setClientPassword] = useState("")
  const [clientCity, setClientCity] = useState("")

  // GP fields
  const [gpName, setGpName] = useState("")
  const [gpEmail, setGpEmail] = useState("")
  const [gpPassword, setGpPassword] = useState("")
  const [gpCity, setGpCity] = useState("")
  const [gpDestination, setGpDestination] = useState("")
  const [gpDepartureDate, setGpDepartureDate] = useState("")
  const [gpAvailableKg, setGpAvailableKg] = useState("")
  const [gpDescription, setGpDescription] = useState("")

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await register({
      email: clientEmail,
      password: clientPassword,
      name: clientName,
      role: "client",
      city: clientCity,
    })

    if (result.success) {
      toast({
        title: "Inscription réussie !",
        description: "Bienvenue sur EASYCOLLIS !",
      })
      router.push("/dashboard/client")
    } else {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const handleGPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await register({
      email: gpEmail,
      password: gpPassword,
      name: gpName,
      role: "gp",
      city: gpCity,
      destination: gpDestination,
      departureDate: gpDepartureDate,
      availableKg: Number.parseInt(gpAvailableKg) || 0,
      description: gpDescription,
    })

    if (result.success) {
      toast({
        title: "Inscription réussie !",
        description: "Votre compte GP a été créé. Achetez un PASS GP pour publier vos voyages.",
      })
      router.push("/dashboard/gp")
    } else {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="mx-auto max-w-lg">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-primary flex items-center justify-center">
              <Package className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Créer un compte</h1>
            <p className="text-muted-foreground mt-2">Rejoignez EASYCOLLIS aujourd'hui</p>
          </div>

          <Card>
            <CardHeader>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as UserRole)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="client" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Client
                  </TabsTrigger>
                  <TabsTrigger value="gp" className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    GP / Agence
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              {activeTab === "client" ? (
                <form onSubmit={handleClientSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-name">Nom complet</Label>
                    <Input
                      id="client-name"
                      placeholder="Jean Dupont"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-email">Email</Label>
                    <Input
                      id="client-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-password">Mot de passe</Label>
                    <Input
                      id="client-password"
                      type="password"
                      placeholder="••••••••"
                      value={clientPassword}
                      onChange={(e) => setClientPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-city">Ville</Label>
                    <Input
                      id="client-city"
                      placeholder="Paris"
                      value={clientCity}
                      onChange={(e) => setClientCity(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Création...
                      </>
                    ) : (
                      "Créer mon compte client"
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleGPSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gp-name">Nom de l'agence / GP</Label>
                    <Input
                      id="gp-name"
                      placeholder="Transport Express"
                      value={gpName}
                      onChange={(e) => setGpName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gp-email">Email</Label>
                      <Input
                        id="gp-email"
                        type="email"
                        placeholder="contact@agence.com"
                        value={gpEmail}
                        onChange={(e) => setGpEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gp-password">Mot de passe</Label>
                      <Input
                        id="gp-password"
                        type="password"
                        placeholder="••••••••"
                        value={gpPassword}
                        onChange={(e) => setGpPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ville de départ</Label>
                      <Select value={gpCity} onValueChange={setGpCity} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {CITIES_DEPART.map((city) => (
                            <SelectItem key={city.value} value={city.label}>
                              {city.label} ({city.country})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Destination</Label>
                      <Select value={gpDestination} onValueChange={setGpDestination} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {CITIES_DESTINATION.map((city) => (
                            <SelectItem key={city.value} value={city.label}>
                              {city.label} ({city.country})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gp-date">Date de départ</Label>
                      <Input
                        id="gp-date"
                        type="date"
                        value={gpDepartureDate}
                        onChange={(e) => setGpDepartureDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gp-kg">Kilos disponibles</Label>
                      <Input
                        id="gp-kg"
                        type="number"
                        placeholder="50"
                        value={gpAvailableKg}
                        onChange={(e) => setGpAvailableKg(e.target.value)}
                        required
                        min={1}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gp-description">Description</Label>
                    <Textarea
                      id="gp-description"
                      placeholder="Décrivez vos services, votre expérience..."
                      value={gpDescription}
                      onChange={(e) => setGpDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Création...
                      </>
                    ) : (
                      "Créer mon compte GP"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
            <CardFooter>
              <p className="text-sm text-center text-muted-foreground w-full">
                Déjà inscrit ?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Se connecter
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
