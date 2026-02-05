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
  Sparkles,
  ShieldCheck,
  Clock,
} from "lucide-react";
import {
  createPendingPayment,
  getCurrency,
  listClientPacks,
} from "@/lib/services/paymentsService";
import type { ClientPack } from "@/lib/models";
import { formatPassDate, isPassActive } from "@/lib/utils/pass";

export default function ClientPassPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "client")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const currency = getCurrency();
  const packs = listClientPacks();

  const handlePurchase = (pack: ClientPack) => {
    if (!user) return;
    setIsPaying(true);
    const ref = `pass-client-${Date.now()}`;
    createPendingPayment({
      ref,
      userId: user.id,
      role: "client",
      packId: pack.id,
      amount: pack.price,
      currency,
      durationDays: pack.durationDays,
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    fetch("/api/paytech/request-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: pack.price,
        currency,
        ref,
        itemName: "PASS Client",
        email: user.email,
        successUrl: `${baseUrl}/payment/success?ref=${encodeURIComponent(ref)}`,
        cancelUrl: `${baseUrl}/payment/cancel?ref=${encodeURIComponent(ref)}`,
        ipnUrl: `${baseUrl}/api/paytech/ipn`,
        customField: JSON.stringify({
          role: "client",
          durationDays: pack.durationDays,
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
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Package className="h-8 w-8 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard/client"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au tableau de bord
          </Link>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6">
                <div className="flex items-center gap-3 text-primary">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-semibold">PASS Client</span>
                </div>
                <h1 className="mt-3 text-3xl font-bold text-foreground">
                  Contactez tous les GP pendant 30 jours
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Un seul PASS suffit pour discuter librement avec tous les GP
                  et organiser vos envois.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-foreground">
                  <CreditCard className="h-4 w-4 text-primary" />
                  {isPassActive(user.passValidUntil)
                    ? `Pass actif jusqu'au ${formatPassDate(user.passValidUntil)}`
                    : "Aucun pass actif"}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <CardContent className="p-5 space-y-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <p className="text-sm font-semibold">Accès illimité</p>
                    <p className="text-xs text-muted-foreground">
                      Contactez autant de GP que vous voulez.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5 space-y-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <p className="text-sm font-semibold">Valable 30 jours</p>
                    <p className="text-xs text-muted-foreground">
                      Activation immédiate après paiement.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5 space-y-2">
                    <Check className="h-5 w-5 text-primary" />
                    <p className="text-sm font-semibold">Messagerie incluse</p>
                    <p className="text-xs text-muted-foreground">
                      Discussions sécurisées et centralisées.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              {packs.map((option) => (
                <Card
                  key={option.id}
                  className="border-primary/30 shadow-lg"
                >
                  <CardHeader>
                    <CardTitle className="text-xl">Pass Client</CardTitle>
                    <CardDescription>
                      Accès complet pendant {option.durationDays} jours
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-3xl font-bold">
                          {option.price} {currency}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Paiement sécurisé via PayTech
                        </p>
                      </div>
                      <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        Recommandé
                      </div>
                    </div>
                    <div className="rounded-xl border bg-muted/40 p-3 text-sm text-muted-foreground">
                      Un PASS actif vous ouvre l'accès illimité aux GP et à la
                      messagerie pendant 30 jours.
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handlePurchase(option)}
                      disabled={isPaying}
                    >
                      {isPaying ? "Redirection..." : "Payer et activer le PASS"}
                    </Button>
                    <div className="text-center text-xs text-muted-foreground">
                      Pas de renouvellement automatique
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
