"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import {
  buildDestinations,
  getAllTripsClient,
} from "@/lib/services/destinationsService";

export function PopularDestinations() {
  const [destinations, setDestinations] = useState(
    buildDestinations(getAllTripsClient()).slice(0, 6)
  );

  useEffect(() => {
    setDestinations(buildDestinations(getAllTripsClient()).slice(0, 6));
  }, []);

  if (destinations.length === 0) {
    return (
      <div className="col-span-full text-center text-muted-foreground py-8">
        <p>Aucune destination populaire pour le moment.</p>
        <p className="text-sm mt-1">
          Elles apparaîtront quand des voyages seront créés.
        </p>
      </div>
    );
  }

  return (
    <>
      {destinations.map((dest) => (
        <Link key={dest.city} href={`/search?destination=${dest.city}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-4 text-center">
              <span className="text-3xl mb-2 block">{dest.flag}</span>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {dest.city}
              </h3>
              <p className="text-xs text-muted-foreground">{dest.country}</p>
              <p className="text-xs text-primary mt-1">
                {dest.gpCount} GPs
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </>
  );
}
