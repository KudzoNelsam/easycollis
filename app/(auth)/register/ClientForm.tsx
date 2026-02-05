"use client";

import { useEffect, useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Label } from "@/app/components/ui/label";

import type { ClientForm } from "./types";
import type { CountryCapital } from "@/app/lib/services/loadService";
import { fetchCountriesAndCapitals } from "@/app/lib/services/loadService";

type Props = {
  data: ClientForm;
  loading: boolean;
  onChange: (field: keyof ClientForm, value: string) => void;
  onSubmit: () => void;
};

export function ClientFormComponent({
  data,
  loading,
  onChange,
  onSubmit,
}: Props) {
  const [cities, setCities] = useState<CountryCapital[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);

  useEffect(() => {
    fetchCountriesAndCapitals()
      .then(setCities)
      .finally(() => setLoadingCities(false));
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <Input
        placeholder="Nom complet"
        value={data.name}
        onChange={(e) => onChange("name", e.target.value)}
        required
      />

      <Input
        type="email"
        placeholder="Email"
        value={data.email}
        onChange={(e) => onChange("email", e.target.value)}
        required
      />

      <Input
        type="password"
        placeholder="Mot de passe"
        value={data.password}
        onChange={(e) => onChange("password", e.target.value)}
        required
      />

      <div className="space-y-2">
        <Label>Ville</Label>

        <Select
          disabled={loadingCities}
          value={
            data.city && data.country
              ? JSON.stringify({
                  capital: data.city,
                  country: data.country,
                })
              : undefined
          }
          onValueChange={(value) => {
            if (!value) return;
            const parsed = JSON.parse(value) as CountryCapital;
            onChange("city", parsed.capital);
            onChange("country", parsed.country);
          }}
          required
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                loadingCities
                  ? "Chargement des villes..."
                  : "Sélectionnez une ville"
              }
            />
          </SelectTrigger>

          <SelectContent className="max-h-72">
            {cities.map((c) => (
              <SelectItem
                key={`${c.capital}-${c.country}`}
                value={JSON.stringify(c)}
              >
                {c.capital} ({c.country})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button disabled={loading} className="w-full">
        {loading ? "Création..." : "Créer mon compte client"}
      </Button>
    </form>
  );
}
