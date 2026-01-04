"use client"

import { useState, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SearchForm } from "@/components/search-form"
import { GPCard } from "@/components/gp-card"
import { MOCK_GPS } from "@/lib/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

function SearchContent() {
  const searchParams = useSearchParams()
  const [sortBy, setSortBy] = useState("date")

  const destination = searchParams.get("destination") || ""
  const date = searchParams.get("date") || ""
  const city = searchParams.get("city") || ""

  const filteredGPs = useMemo(() => {
    let results = [...MOCK_GPS]

    if (destination) {
      results = results.filter((gp) => gp.destination.toLowerCase().includes(destination.toLowerCase()))
    }
    if (date) {
      results = results.filter((gp) => gp.departureDate >= date)
    }
    if (city) {
      results = results.filter((gp) => gp.city.toLowerCase().includes(city.toLowerCase()))
    }

    // Sorting
    switch (sortBy) {
      case "date":
        results.sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime())
        break
      case "kg":
        results.sort((a, b) => b.availableKg - a.availableKg)
        break
      case "rating":
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
    }

    return results
  }, [destination, date, city, sortBy])

  return (
    <>
      {/* Search Form */}
      <section className="bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-foreground mb-6">Rechercher un GP</h1>
          <SearchForm variant="page" />
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              {filteredGPs.length} GP{filteredGPs.length > 1 ? "s" : ""} trouvé{filteredGPs.length > 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2">
              <Label htmlFor="sort" className="text-sm text-muted-foreground">
                Trier par:
              </Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40" id="sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date de départ</SelectItem>
                  <SelectItem value="kg">Kilos disponibles</SelectItem>
                  <SelectItem value="rating">Note</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredGPs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGPs.map((gp) => (
                <GPCard key={gp.id} gp={gp} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun GP trouvé pour ces critères.</p>
              <p className="text-sm text-muted-foreground mt-2">Essayez d'élargir votre recherche.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-8 text-center">Chargement...</div>}>
          <SearchContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
