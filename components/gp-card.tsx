import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Package, Star, CheckCircle } from "lucide-react"
import type { GP } from "@/lib/models"

interface GPCardProps {
  gp: GP
  searchQuery?: string
}

export function GPCard({ gp, searchQuery }: GPCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">{gp.name[0]}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{gp.name}</h3>
                {gp.verified && <CheckCircle className="h-4 w-4 text-primary" />}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {gp.city}
              </div>
            </div>
          </div>
          {gp.rating && (
            <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-full">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium">{gp.rating}</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
              <MapPin className="h-3 w-3 mr-1" />
              {gp.destination}
            </Badge>
            <Badge variant="outline">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(gp.departureDate).toLocaleDateString("fr-FR")}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>{gp.availableKg} kg disponibles</span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">{gp.description}</p>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link href={`/gp/${gp.id}${searchQuery ? `?${searchQuery}` : ""}`} className="w-full">
          <Button className="w-full bg-primary hover:bg-primary/90">Voir les détails</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
