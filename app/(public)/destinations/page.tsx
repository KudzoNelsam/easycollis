"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { ArrowRight } from "lucide-react";
import { buildDestinations, getAllTripsClient } from "@/lib/services/destinationsService";

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState(
    buildDestinations(getAllTripsClient())
  );

  useEffect(() => {
    setDestinations(buildDestinations(getAllTripsClient()));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Toutes les destinations
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez toutes les destinations couvertes par nos transporteurs
              GP partenaires
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {destinations.length > 0 ? (
              destinations.map((dest) => (
                <Link key={dest.city} href={`/search?destination=${dest.city}`}>
                  <Card className="hover:shadow-lg transition-all cursor-pointer group h-full">
                    <CardContent className="p-6 text-center">
                      <span className="text-4xl mb-3 block">{dest.flag}</span>
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                        {dest.city}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {dest.country}
                      </p>
                      <div className="mt-3 flex items-center justify-center gap-1 text-sm text-primary">
                        <span>{dest.gpCount} GPs disponibles</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-12">
                <p>Aucune destination disponible pour le moment.</p>
                <p className="text-sm mt-1">
                  Les destinations apparaîtront quand des voyages seront créés.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
