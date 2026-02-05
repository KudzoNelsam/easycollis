"use client";

import React, { useReducer, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Package, Truck, User } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { UserRole } from "@/lib/models";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { GPFormComponent } from "./GPForm";
import { ClientFormComponent } from "./ClientForm";
import { initialState, registerReducer } from "@/app/reducers/register.reducer";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const { toast } = useToast();

  const defaultRole: UserRole =
    searchParams.get("role") === "gp" ? "gp" : "client";

  const [activeTab, setActiveTab] = useState<UserRole>(defaultRole);
  const [state, dispatch] = useReducer(registerReducer, initialState);

  /* CLIENT SUBMIT */
  const handleClientSubmit = async () => {
    dispatch({ type: "SET_LOADING", role: "client", value: true });

    const result = await register({
      ...state.client,
      role: "client",
    });

    dispatch({ type: "SET_LOADING", role: "client", value: false });

    if (!result.success) {
      toast({
        title: "Erreur",
        description: "Inscription échouée",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Bienvenue sur EASYCOLLIS !" });
    try {
      await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: state.client.email,
          subject: "Bienvenue sur Easycollis",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5;">
              <h2>Bienvenue ${state.client.name} 👋</h2>
              <p>Votre compte client est bien créé.</p>
              <p>Avec un PASS actif, vous pouvez contacter autant de GP que vous voulez pendant 30 jours.</p>
              <p>Bonne expérience sur Easycollis !</p>
            </div>
          `,
        }),
      });
    } catch {
      // ignore email errors in mock mode
    }
    router.push("/dashboard/client");
  };

  /* GP SUBMIT */
  const handleGPSubmit = async () => {
    dispatch({ type: "SET_LOADING", role: "gp", value: true });

    const result = await register({
      ...state.gp,
      role: "gp",
      availableKg: Number(state.gp.availableKg),
    });

    dispatch({ type: "SET_LOADING", role: "gp", value: false });

    if (!result.success) {
      toast({
        title: "Erreur",
        description: "Inscription GP échouée",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Compte GP créé",
      description: "Achetez un PASS GP pour publier vos voyages",
    });

    try {
      await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: state.gp.email,
          subject: "Bienvenue sur Easycollis",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5;">
              <h2>Bienvenue ${state.gp.name} 👋</h2>
              <p>Votre compte GP est bien créé.</p>
              <p>Activez un PASS GP pour publier vos voyages pendant 30 jours.</p>
              <p>Merci d'avoir rejoint Easycollis.</p>
            </div>
          `,
        }),
      });
    } catch {
      // ignore email errors in mock mode
    }

    router.push("/dashboard/gp");
  };

  return (
    <main className="flex-1 py-12 px-4">
      <div className="mx-auto max-w-lg">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-primary flex items-center justify-center">
            <Package className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Créer un compte</h1>
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
                <TabsTrigger value="client" className="gap-2">
                  <User className="h-4 w-4" />
                  Client
                </TabsTrigger>
                <TabsTrigger value="gp" className="gap-2">
                  <Truck className="h-4 w-4" />
                  GP / Agence
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            {activeTab === "client" ? (
              <ClientFormComponent
                data={state.client}
                loading={state.loading.client}
                onChange={(field, value) =>
                  dispatch({
                    type: "SET_CLIENT_FIELD",
                    field,
                    value,
                  })
                }
                onSubmit={handleClientSubmit}
              />
            ) : (
              <GPFormComponent
                data={state.gp}
                loading={state.loading.gp}
                onChange={(field, value) =>
                  dispatch({
                    type: "SET_GP_FIELD",
                    field,
                    value,
                  })
                }
                onSubmit={handleGPSubmit}
              />
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
