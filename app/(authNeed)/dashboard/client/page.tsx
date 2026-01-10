"use client";
import { GPCard } from "@/app/components/gp-card";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { useAuth } from "@/app/lib/auth-context";
import { MOCK_CONVERSATIONS, MOCK_GPS } from "@/app/lib/data";
import {
  CreditCard,
  MessageSquare,
  Search,
  History,
  ArrowRight,
  Package,
  Info,
  Zap,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClientDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "client")) {
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

  const userConversations = MOCK_CONVERSATIONS.filter((c) =>
    c.participants.some((p) => p.id === user.id)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Bonjour, {user.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Bienvenue sur votre tableau de bord
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Solde PASS</p>
                    <p className="text-3xl font-bold text-foreground">
                      {user.passBalance}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <Link
                  href="/pass/client"
                  className="text-sm text-primary hover:underline mt-3 inline-block"
                >
                  Acheter des PASS
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Conversations
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {userConversations.length}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <Link
                  href="/messages"
                  className="text-sm text-primary hover:underline mt-3 inline-block"
                >
                  Voir les messages
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Recherches</p>
                    <p className="text-3xl font-bold text-foreground">0</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <History className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <Link
                  href="/search"
                  className="text-sm text-primary hover:underline mt-3 inline-block"
                >
                  Nouvelle recherche
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8 border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="h-5 w-5 text-accent" />
                Comment fonctionnent les PASS ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Zap className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      1 PASS = 1 Contact
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Chaque PASS vous permet de contacter un GP et d'accéder à
                      la messagerie avec lui.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Messagerie sécurisée
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Une fois le PASS utilisé, vous pouvez échanger en illimité
                      avec ce GP via notre messagerie.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      GP vérifiés
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Nos GP sont vérifiés pour votre sécurité. Consultez leurs
                      avis avant de les contacter.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-background rounded-lg border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">
                    Tarifs PASS Client :
                  </strong>{" "}
                  1 PASS = 500 FCFA | Pack 5 PASS = 2000 FCFA | Pack 10 PASS =
                  3500 FCFA
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Rechercher un GP</CardTitle>
                <CardDescription>
                  Trouvez un transporteur pour votre prochain envoi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/search">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Search className="mr-2 h-4 w-4" />
                    Lancer une recherche
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mes messages</CardTitle>
                <CardDescription>
                  Consultez vos échanges avec les transporteurs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userConversations.length > 0 ? (
                  <div className="space-y-3">
                    {userConversations.slice(0, 2).map((conv) => {
                      const otherParticipant = conv.participants.find(
                        (p) => p.id !== user.id
                      );
                      return (
                        <Link key={conv.id} href="/messages" className="block">
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="font-semibold text-primary">
                                {otherParticipant?.name[0]}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {otherParticipant?.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {conv.lastMessage}
                              </p>
                            </div>
                            {conv.unreadCount > 0 && (
                              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                <span className="text-xs text-primary-foreground">
                                  {conv.unreadCount}
                                </span>
                              </div>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Aucune conversation pour le moment.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>GP disponibles</CardTitle>
              <CardDescription>
                Découvrez les transporteurs disponibles pour vos envois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_GPS.slice(0, 3).map((gp) => (
                  <GPCard key={gp.id} gp={gp} />
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link href="/search">
                  <Button variant="outline">
                    Voir tous les GP
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
