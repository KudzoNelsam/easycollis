"use client";

import {
  useParams,
  useRouter,
  useSearchParams,
  usePathname,
} from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { getGP } from "@/lib/services/gpService";
import type { GP } from "@/lib/models";
import { useAuth } from "@/lib/auth-context";
import { isPassActive } from "@/lib/utils/pass";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Calendar,
  Package,
  Star,
  CheckCircle,
  MessageSquare,
  CreditCard,
} from "lucide-react";

export default function GPDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { user } = useAuth();
  const { toast } = useToast();
  const [gp, setGp] = useState<GP | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGP(id).then((data) => {
      setGp(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Package className="h-8 w-8 animate-pulse text-primary" />
      </div>
    );
  }

  if (!gp) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            GP non trouvé
          </h1>
          <Link href="/search">
            <Button>Retour à la recherche</Button>
          </Link>
        </div>
      </main>
    );
  }

  const handleContact = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour contacter ce GP.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    if (user.role === "gp") {
      toast({
        title: "Action non autorisée",
        description: "Les GP ne peuvent pas contacter d'autres GP.",
        variant: "destructive",
      });
      return;
    }

    if (!isPassActive(user.passValidUntil)) {
      toast({
        title: "PASS insuffisant",
        description:
          "Vous devez avoir un PASS actif (30 jours) pour contacter ce GP.",
        variant: "destructive",
      });
      router.push("/pass/client");
      return;
    }

    toast({
      title: "PASS actif",
      description: "Vous pouvez maintenant contacter ce GP.",
    });
    const returnTo = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;
    router.push(
      `/messages?new=${gp.id}&returnTo=${encodeURIComponent(returnTo)}`
    );
  };

  return (
    <main className="flex-1 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="border-b">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-2xl font-bold text-primary">
                    {gp.name[0]}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-2xl">{gp.name}</CardTitle>
                    {gp.verified && (
                      <Badge className="bg-primary/10 text-primary">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Vérifié
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {gp.city}
                  </div>
                </div>
              </div>
              {gp.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-secondary px-3 py-1.5 rounded-full">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{gp.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({gp.reviewCount} avis)
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Destination</span>
                </div>
                <p className="font-semibold text-lg">{gp.destination}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Date de départ</span>
                </div>
                <p className="font-semibold text-lg">
                  {new Date(gp.departureDate).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Package className="h-4 w-4" />
                  <span className="text-sm">Kilos disponibles</span>
                </div>
                <p className="font-semibold text-lg">{gp.availableKg} kg</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Description
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {gp.description}
              </p>
            </div>

            {/* CTA */}
            <div className="bg-primary/5 rounded-lg p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Intéressé par ce GP ?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Utilisez votre PASS actif pour contacter {gp.name} via notre
                    messagerie sécurisée.
                  </p>
                </div>
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 w-full md:w-auto"
                  onClick={handleContact}
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Contacter
                </Button>
              </div>
              {!user && (
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                  <CreditCard className="h-3 w-3" />
                  Vous devez être connecté et avoir un PASS actif pour contacter
                  un GP.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
