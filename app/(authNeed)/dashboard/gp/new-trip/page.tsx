"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { CITIES_DEPART, CITIES_DESTINATION } from "@/lib/data";
import { ArrowLeft, Loader2, Package } from "lucide-react";

export default function NewTripPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const editId = searchParams.get("edit");
  const isEditing = !!editId;

  const [cityDepart, setCityDepart] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [availableKg, setAvailableKg] = useState("");
  const [pricePerKg, setPricePerKg] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "gp")) {
      router.push("/login");
    }

    if (editId && user) {
      const savedTrips = JSON.parse(
        localStorage.getItem(`easycollis_trips_${user.id}`) || "[]"
      );
      const tripToEdit = savedTrips.find((t: any) => t.id === editId);
      if (tripToEdit) {
        setCityDepart(tripToEdit.cityDepart || "");
        setDestination(tripToEdit.destination || "");
        setDepartureDate(tripToEdit.departureDate || "");
        setAvailableKg(tripToEdit.availableKg?.toString() || "");
        setPricePerKg(tripToEdit.pricePerKg?.toString() || "");
        setDescription(tripToEdit.description || "");
      }
    }
  }, [user, authLoading, router, editId]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Package className="h-8 w-8 animate-pulse text-primary" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const existingTrips = JSON.parse(
      localStorage.getItem(`easycollis_trips_${user.id}`) || "[]"
    );

    if (isEditing) {
      const updatedTrips = existingTrips.map((trip: any) => {
        if (trip.id === editId) {
          return {
            ...trip,
            cityDepart,
            destination,
            departureDate,
            availableKg: Number.parseInt(availableKg),
            pricePerKg: pricePerKg ? Number.parseFloat(pricePerKg) : undefined,
            description,
          };
        }
        return trip;
      });
      localStorage.setItem(
        `easycollis_trips_${user.id}`,
        JSON.stringify(updatedTrips)
      );

      toast({
        title: "Voyage modifié !",
        description: "Votre voyage a été mis à jour avec succès.",
      });
    } else {
      // Mode création
      const newTrip: any & { cityDepart: string } = {
        id: `trip-${Date.now()}`,
        gpId: user.id,
        gpName: user.name,
        cityDepart,
        destination,
        departureDate,
        availableKg: Number.parseInt(availableKg),
        pricePerKg: pricePerKg ? Number.parseFloat(pricePerKg) : undefined,
        description,
        status: "active",
      };

      existingTrips.push(newTrip);
      localStorage.setItem(
        `easycollis_trips_${user.id}`,
        JSON.stringify(existingTrips)
      );

      toast({
        title: "Voyage créé !",
        description: "Votre voyage a été publié avec succès.",
      });
    }

    setIsLoading(false);
    router.push("/dashboard/gp");
  };

  return (
    <main className="flex-1 py-8">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/dashboard/gp"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au tableau de bord
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? "Modifier le voyage" : "Créer un nouveau voyage"}
            </CardTitle>
            <CardDescription>
              {isEditing
                ? "Modifiez les informations de votre voyage"
                : "Publiez un voyage pour que les clients puissent vous contacter"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cityDepart">Ville de départ *</Label>
                  <Select
                    value={cityDepart}
                    onValueChange={setCityDepart}
                    required
                  >
                    <SelectTrigger id="cityDepart">
                      <SelectValue placeholder="Sélectionner une ville" />
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
                  <Label htmlFor="destination">Destination *</Label>
                  <Select
                    value={destination}
                    onValueChange={setDestination}
                    required
                  >
                    <SelectTrigger id="destination">
                      <SelectValue placeholder="Sélectionner une destination" />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date de départ *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kg">Kilos disponibles *</Label>
                  <Input
                    id="kg"
                    type="number"
                    placeholder="50"
                    value={availableKg}
                    onChange={(e) => setAvailableKg(e.target.value)}
                    required
                    min={1}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Prix par kg (facultatif)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={pricePerKg}
                  onChange={(e) => setPricePerKg(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : isEditing ? (
                    "Enregistrer"
                  ) : (
                    "Publier le voyage"
                  )}
                </Button>
                <Link
                  href="/dashboard/gp"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Annuler
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
