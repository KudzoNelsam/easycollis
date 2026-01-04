import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { POPULAR_DESTINATIONS } from "@/lib/data"
import { ArrowRight } from "lucide-react"

const ALL_DESTINATIONS = [
  ...POPULAR_DESTINATIONS,
  { city: "Toulouse", country: "France", flag: "🇫🇷", gpCount: 8 },
  { city: "Bordeaux", country: "France", flag: "🇫🇷", gpCount: 6 },
  { city: "Londres", country: "UK", flag: "🇬🇧", gpCount: 10 },
  { city: "Rome", country: "Italie", flag: "🇮🇹", gpCount: 5 },
  { city: "Madrid", country: "Espagne", flag: "🇪🇸", gpCount: 7 },
  { city: "Genève", country: "Suisse", flag: "🇨🇭", gpCount: 4 },
]

export default function DestinationsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Toutes les destinations</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez toutes les destinations couvertes par nos transporteurs GP partenaires
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ALL_DESTINATIONS.map((dest) => (
              <Link key={dest.city} href={`/search?destination=${dest.city}`}>
                <Card className="hover:shadow-lg transition-all cursor-pointer group h-full">
                  <CardContent className="p-6 text-center">
                    <span className="text-4xl mb-3 block">{dest.flag}</span>
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                      {dest.city}
                    </h3>
                    <p className="text-sm text-muted-foreground">{dest.country}</p>
                    <div className="mt-3 flex items-center justify-center gap-1 text-sm text-primary">
                      <span>{dest.gpCount} GPs disponibles</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
