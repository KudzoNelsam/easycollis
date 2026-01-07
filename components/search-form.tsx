"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, MapPin, Calendar, Building2 } from "lucide-react"

interface SearchFormProps {
  variant?: "hero" | "page"
}

export function SearchForm({ variant = "hero" }: SearchFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize inputs from the URL so visiting /search?destination=Paris preserves the query
  const [destination, setDestination] = useState(() => searchParams.get("destination") || "")
  const [date, setDate] = useState(() => searchParams.get("date") || "")
  const [city, setCity] = useState(() => searchParams.get("city") || "")

  // Keep inputs in sync when the URL changes (back/forward, external links)
  useEffect(() => {
    const d = searchParams.get("destination") || ""
    const dt = searchParams.get("date") || ""
    const c = searchParams.get("city") || ""

    setDestination((prev) => (prev !== d ? d : prev))
    setDate((prev) => (prev !== dt ? dt : prev))
    setCity((prev) => (prev !== c ? c : prev))
  }, [searchParams.toString()])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (destination) params.set("destination", destination)
    if (date) params.set("date", date)
    if (city) params.set("city", city)
    const q = params.toString()
    router.push(q ? `/search?${q}` : "/search")
  }

  // Auto-search on input change (debounced). Skip initial mount to avoid immediate push.
  const mountedRef = useRef(false)
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      return
    }

    const params = new URLSearchParams()
    if (destination) params.set("destination", destination)
    if (date) params.set("date", date)
    if (city) params.set("city", city)
    const q = params.toString()

    // Do not navigate when all fields are empty — avoid redirecting from `/` to `/search`.
    if (!q) return

    const t = setTimeout(() => {
      router.push(`/search?${q}`)
    }, 350)

    return () => clearTimeout(t)
  }, [destination, date, city, router])

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

    </form>
  )
}
