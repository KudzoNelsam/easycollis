"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { GPProfile, Trip } from "@/lib/types"
import { Package } from "lucide-react"

export default function ClientDashboard() {
  const router = useRouter()
  const [trips, setTrips] = useState<(Trip & { cityDepart?: string })[]>([])

  useEffect(() => {
    // client dashboard does not have heavy logic in this project sample
    const saved = JSON.parse(localStorage.getItem("easycollis_client_favs") || "[]")
    setTrips(saved)
  }, [])

  return (
    <main className="flex-1 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
            <p className="text-muted-foreground mt-1">Espace client</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Mes recherches</CardTitle>
              <CardDescription>Voyages que vous suivez</CardDescription>
            </CardHeader>
            <CardContent>
              {trips.length > 0 ? (
                <div className="space-y-2">
                  {trips.map((t) => (
                    <div key={t.id} className="p-3 border rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{t.cityDepart} → {t.destination}</p>
                        </div>
                        <Link href={`/gp/${t.gpId}`} className="text-sm text-accent hover:underline">
                          Voir
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucun voyage enregistré</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
