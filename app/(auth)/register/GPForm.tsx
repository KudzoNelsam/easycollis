"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { CITIES_DEPART, CITIES_DESTINATION } from "@/lib/data";
import { GPForm } from "./types";

type Props = {
  data: GPForm;
  loading: boolean;
  onChange: (field: keyof GPForm, value: string) => void;
  onSubmit: () => void;
};

export function GPFormComponent({ data, loading, onChange, onSubmit }: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label>Nom de l'agence / GP</Label>
        <Input
          value={data.name}
          onChange={(e) => onChange("name", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Mot de passe</Label>
          <Input
            type="password"
            value={data.password}
            onChange={(e) => onChange("password", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Ville de départ</Label>
          <Select
            value={data.city}
            onValueChange={(v) => onChange("city", v)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              {CITIES_DEPART.map((c) => (
                <SelectItem key={c.value} value={c.label}>
                  {c.label} ({c.country})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Destination</Label>
          <Select
            value={data.destination}
            onValueChange={(v) => onChange("destination", v)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              {CITIES_DESTINATION.map((c) => (
                <SelectItem key={c.value} value={c.label}>
                  {c.label} ({c.country})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date de départ</Label>
          <Input
            type="date"
            value={data.departureDate}
            onChange={(e) => onChange("departureDate", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Kilos disponibles</Label>
          <Input
            type="number"
            min={1}
            value={data.availableKg}
            onChange={(e) => onChange("availableKg", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          rows={3}
          value={data.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-accent text-accent-foreground"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Création...
          </>
        ) : (
          "Créer mon compte GP"
        )}
      </Button>
    </form>
  );
}
