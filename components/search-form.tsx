"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, MapPin, Calendar, Building2 } from "lucide-react"

interface SearchFormProps {
  variant?: "hero" | "page"
}

export function SearchForm({ variant = "hero" }: SearchFormProps) {
  const router = useRouter()
  const [destination, setDestination] = useState("")
  const [date, setDate] = useState("")
  const [city, setCity] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (destination) params.set("destination", destination)
    if (date) params.set("date", date)
    if (city) params.set("city", city)
    router.push(`/search?${params.toString()}`)
  }

  if (variant === "hero") {
    return (
      <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-3 p-3 bg-card rounded-2xl shadow-xl border border-border">
          <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-background rounded-xl">
            <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
            <Input
              placeholder="Destination (Paris, Lyon...)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0 p-0"
            />
          </div>
          <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-background rounded-xl">
            <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0 p-0"
            />
          </div>
          <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-background rounded-xl">
            <Building2 className="h-5 w-5 text-muted-foreground shrink-0" />
            <Input
              placeholder="Ville de départ"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0 p-0"
            />
          </div>
          <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8">
            <Search className="h-5 w-5 md:mr-2" />
            <span className="hidden md:inline">Rechercher</span>
          </Button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="destination">Destination</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="destination"
              placeholder="Paris, Lyon, Marseille..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date de départ</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="pl-10" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Ville de départ</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="city"
              placeholder="Abidjan, Dakar..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
      <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90">
        <Search className="h-4 w-4 mr-2" />
        Rechercher
      </Button>
    </form>
  )
}
