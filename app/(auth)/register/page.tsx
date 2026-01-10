"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { UserRole } from "@/lib/models";
import { CITIES_DEPART, CITIES_DESTINATION } from "@/lib/data";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader2, User, Truck, Package } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const { toast } = useToast();

  const defaultRole: UserRole =
    searchParams.get("role") === "gp" ? "gp" : "client";

  const [activeTab, setActiveTab] = useState<UserRole>(defaultRole);

  const [loadingClient, setLoadingClient] = useState(false);
  const [loadingGP, setLoadingGP] = useState(false);

  /* Client */
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPassword, setClientPassword] = useState("");
  const [clientCity, setClientCity] = useState("");

  /* GP */
  const [gpName, setGpName] = useState("");
  const [gpEmail, setGpEmail] = useState("");
  const [gpPassword, setGpPassword] = useState("");
  const [gpCity, setGpCity] = useState("");
  const [gpDestination, setGpDestination] = useState("");
  const [gpDepartureDate, setGpDepartureDate] = useState("");
  const [gpAvailableKg, setGpAvailableKg] = useState("");
  const [gpDescription, setGpDescription] = useState("");

  /* CLIENT SUBMIT */
  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingClient(true);

    const result = await register({
      email: clientEmail,
      password: clientPassword,
      name: clientName,
      role: "client",
      city: clientCity,
    });

    setLoadingClient(false);

    if (!result.success) {
      return toast({
        title: "Erreur",
        description: "Inscription échouée",
        variant: "destructive",
      });
    }

    toast({ title: "Bienvenue sur EASYCOLLIS !" });
    router.push("/dashboard/client");
  };

  /* GP SUBMIT */
  const handleGPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gpCity || !gpDestination) {
      return toast({
        title: "Champs requis",
        description: "Veuillez sélectionner une ville et une destination",
        variant: "destructive",
      });
    }

    setLoadingGP(true);

    const result = await register({
      email: gpEmail,
      password: gpPassword,
      name: gpName,
      role: "gp",
      city: gpCity,
      destination: gpDestination,
      departureDate: gpDepartureDate,
      availableKg: Number(gpAvailableKg),
      description: gpDescription,
    });

    setLoadingGP(false);

    if (!result.success) {
      return toast({
        title: "Erreur",
        description: "Inscription GP échouée",
        variant: "destructive",
      });
    }

    toast({
      title: "Compte GP créé",
      description: "Achetez un PASS GP pour publier vos voyages",
    });

    router.push("/dashboard/gp");
  };

  return (
    <main className="flex-1 py-12 px-4">
      <div className="mx-auto max-w-lg">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-primary flex items-center justify-center">
            <Package className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Créer un compte
          </h1>
          <p className="text-muted-foreground mt-2">
            Rejoignez{" "}
            <span className="uppercase">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </span>{" "}
            aujourd'hui
          </p>
        </div>

        <Card>
          <CardHeader>
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as UserRole)}
            >
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
                <div className="space-y-2">
                  <Label htmlFor="client-name">Nom complet</Label>
                  <Input
                    id="client-name"
                    placeholder="Jean Dupont"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-email">Email</Label>
                  <Input
                    id="client-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-password">Mot de passe</Label>
                  <Input
                    id="client-password"
                    type="password"
                    placeholder="••••••••"
                    value={clientPassword}
                    onChange={(e) => setClientPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-city">Ville</Label>
                  <Input
                    id="client-city"
                    placeholder="Paris"
                    value={clientCity}
                    onChange={(e) => setClientCity(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={loadingClient}
                >
                  {loadingClient ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création...
                    </>
                  ) : (
                    "Créer mon compte client"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleGPSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gp-name">Nom de l'agence / GP</Label>
                  <Input
                    id="gp-name"
                    placeholder="Transport Express"
                    value={gpName}
                    onChange={(e) => setGpName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gp-email">Email</Label>
                    <Input
                      id="gp-email"
                      type="email"
                      placeholder="contact@agence.com"
                      value={gpEmail}
                      onChange={(e) => setGpEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gp-password">Mot de passe</Label>
                    <Input
                      id="gp-password"
                      type="password"
                      placeholder="••••••••"
                      value={gpPassword}
                      onChange={(e) => setGpPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ville de départ</Label>
                    <Select value={gpCity} onValueChange={setGpCity} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
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
                    <Label>Destination</Label>
                    <Select
                      value={gpDestination}
                      onValueChange={setGpDestination}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gp-date">Date de départ</Label>
                    <Input
                      id="gp-date"
                      type="date"
                      value={gpDepartureDate}
                      onChange={(e) => setGpDepartureDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gp-kg">Kilos disponibles</Label>
                    <Input
                      id="gp-kg"
                      type="number"
                      placeholder="50"
                      value={gpAvailableKg}
                      onChange={(e) => setGpAvailableKg(e.target.value)}
                      required
                      min={1}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gp-description">Description</Label>
                  <Textarea
                    id="gp-description"
                    placeholder="Décrivez vos services, votre expérience..."
                    value={gpDescription}
                    onChange={(e) => setGpDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={loadingGP}
                >
                  {loadingGP ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création...
                    </>
                  ) : (
                    "Créer mon compte GP"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center text-muted-foreground w-full">
              Déjà inscrit ?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
