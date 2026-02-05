"use client";

import { useEffect, useState } from "react";
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
import {
  createPendingPayment,
  getCurrency,
  listGPPacks,
} from "@/lib/services/paymentsService";
import type { GPPack } from "@/lib/models";
import { formatPassDate, isPassActive } from "@/lib/utils/pass";

export default function GPPassPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
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

  const currency = getCurrency();
  const packs = listGPPacks();

  const [isPaying, setIsPaying] = useState(false);

  const handlePurchase = (option: GPPack) => {
    if (!user) return;
    setIsPaying(true);
    const ref = `pass-gp-${Date.now()}`;
    createPendingPayment({
      ref,
      userId: user.id,
      role: "gp",
      packId: option.id,
      amount: option.price,
      currency,
      durationDays: option.durationDays,
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    fetch("/api/paytech/request-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: option.price,
        currency,
        ref,
        itemName: "PASS GP",
        email: user.email,
        successUrl: `${baseUrl}/payment/success?ref=${encodeURIComponent(ref)}`,
        cancelUrl: `${baseUrl}/payment/cancel?ref=${encodeURIComponent(ref)}`,
        ipnUrl: `${baseUrl}/api/paytech/ipn`,
        customField: JSON.stringify({
          role: "gp",
          durationDays: option.durationDays,
          userId: user.id,
        }),
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || data?.ok === false) {
          const details = data?.details?.message || data?.error || "Paiement refusé";
          throw new Error(details);
        }
        const url = data?.data?.redirect_url;
        if (url) {
          window.location.href = url;
          return;
        }
        throw new Error("redirect_url missing");
      })
      .catch(() => {
        setIsPaying(false);
        toast({
          title: "Erreur paiement",
          description: "Impossible de lancer le paiement PayTech.",
          variant: "destructive",
        });
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
                {isPassActive(user.passValidUntil)
                  ? `Pass actif jusqu'au ${formatPassDate(user.passValidUntil)}`
                  : "Aucun pass actif"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packs.map((option) => (
              <Card
                key={option.id}
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
                    <span className="text-muted-foreground"> {currency}</span>
                  </CardDescription>
                  <p className="text-xs text-muted-foreground mt-1">
                    Valable {option.durationDays} jours
                  </p>
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
                    disabled={isPaying}
                  >
                    {isPaying ? "Redirection..." : `Choisir ${option.name}`}
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
