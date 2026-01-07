"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import type { UserRole } from "@/lib/types"
import { CITIES_DEPART, CITIES_DESTINATION } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Package, User, Truck } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { register } = useAuth()
  const { toast } = useToast()

  const defaultRole = searchParams.get("role") === "gp" ? "gp" : "client"
  const [activeTab, setActiveTab] = useState<UserRole>(defaultRole as UserRole)
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
      toast({ title: "Inscription réussie !", description: "Bienvenue sur EASYCOLLIS !" })
      router.push("/dashboard/client")
    } else {
      toast({ title: "Erreur", description: "Une erreur est survenue lors de l'inscription.", variant: "destructive" })
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
      toast({ title: "Inscription réussie !", description: "Votre compte GP a été créé. Achetez un PASS GP pour publier vos voyages." })
      router.push("/dashboard/gp")
    } else {
      toast({ title: "Erreur", description: "Une erreur est survenue lors de l'inscription.", variant: "destructive" })
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
                  {/* form content (same as before) */}
                </form>
              ) : (
                <form onSubmit={handleGPSubmit} className="space-y-4">
                  {/* gp form content (same as before) */}
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
