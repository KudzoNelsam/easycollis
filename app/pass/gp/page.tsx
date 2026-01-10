"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  CreditCard,
  Check,
  Package,
  Plane,
  Eye,
  MessageSquare,
} from "lucide-react";

const GP_PASS_OPTIONS = [
  {
    name: "Starter",
    price: 1000,
    features: ["1 voyage publié", "Visibilité standard", "Messagerie incluse"],
    voyages: 1,
    popular: false,
  },
  {
    name: "Pro",
    price: 2500,
    features: [
      "5 voyages publiés",
      "Visibilité prioritaire",
      "Messagerie illimitée",
      "Badge vérifié",
    ],
    voyages: 5,
    popular: true,
  },
  {
    name: "Business",
    price: 5000,
    features: [
      "Voyages illimités",
      "Top visibilité",
      "Messagerie illimitée",
      "Badge vérifié",
      "Support prioritaire",
    ],
    voyages: 99,
    popular: false,
  },
];

export default function GPPassPage() {
  const router = useRouter();
  const { user, updatePassBalance, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "gp")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Package className="h-8 w-8 animate-pulse text-primary" />
      </div>
    );
  }

  const handlePurchase = (option: (typeof GP_PASS_OPTIONS)[0]) => {
    // Simulate payment (mock)
    updatePassBalance(option.voyages);
    toast({
      title: "Achat réussi !",
      description: `Vous avez acheté le pack ${option.name} pour ${option.price} FCFA.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard/gp"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au tableau de bord
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              PASS GP / Agence
            </h1>
            <p className="text-muted-foreground">
              Publiez vos voyages et soyez visible auprès des clients
            </p>
            <div className="inline-flex items-center gap-2 mt-4 bg-accent/10 px-4 py-2 rounded-full">
              <CreditCard className="h-5 w-5 text-accent" />
              <span className="font-semibold">
                Solde actuel: {user.passBalance} PASS
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GP_PASS_OPTIONS.map((option) => (
              <Card
                key={option.name}
                className={
                  option.popular ? "border-accent shadow-lg scale-105" : ""
                }
              >
                {option.popular && (
                  <div className="bg-accent text-accent-foreground text-center py-1 text-sm font-medium">
                    Recommandé
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{option.name}</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold text-foreground">
                      {option.price}
                    </span>
                    <span className="text-muted-foreground"> FCFA</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {option.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-accent shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${option.popular ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}`}
                    variant={option.popular ? "default" : "outline"}
                    onClick={() => handlePurchase(option)}
                  >
                    Choisir {option.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Benefits */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Plane className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Publiez vos voyages</h3>
              <p className="text-sm text-muted-foreground">
                Créez et gérez vos voyages facilement
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Gagnez en visibilité</h3>
              <p className="text-sm text-muted-foreground">
                Apparaissez dans les résultats de recherche
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Recevez des demandes</h3>
              <p className="text-sm text-muted-foreground">
                Les clients vous contactent directement
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
