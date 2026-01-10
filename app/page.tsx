import Link from "next/link";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { SearchForm } from "./components/search-form";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { ArrowRight, Plane, CheckCircle } from "lucide-react";
import { POPULAR_DESTINATIONS } from "@/lib/data";
import { Helpers } from "./components/ui/helpers";

export default function HomePage() {
  const title = process.env.NEXT_PUBLIC_APP_NAME;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Envoyez vos colis à l'international en toute{" "}
              <span className="text-primary">simplicité</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              EASYCOLLIS connecte les clients avec des transporteurs GP de
              confiance pour vos envois internationaux.
            </p>
          </div>

          <SearchForm variant="hero" />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/search">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-transparent"
              >
                Chercher un GP
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register?role=gp">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Devenir GP
                <Plane className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Une plateforme simple et sécurisée pour tous vos envois
              internationaux
            </p>
          </div>
          {/* Helpers Parties */}
          <Helpers />
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Destinations populaires
              </h2>
              <p className="text-muted-foreground">
                Les routes les plus demandées par nos utilisateurs
              </p>
            </div>
            <Link href="/destinations">
              <Button variant="outline">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {POPULAR_DESTINATIONS.map((dest) => (
              <Link key={dest.city} href={`/search?destination=${dest.city}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-4 text-center">
                    <span className="text-3xl mb-2 block">{dest.flag}</span>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {dest.city}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {dest.country}
                    </p>
                    <p className="text-xs text-primary mt-1">
                      {dest.gpCount} GPs
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Test Accounts Info */}
      <section className="py-16 bg-primary/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                Comptes de test disponibles
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Compte Client
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Email:</span>{" "}
                      <code className="bg-background px-2 py-0.5 rounded">
                        client@test.com
                      </code>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">
                        Mot de passe:
                      </span>{" "}
                      <code className="bg-background px-2 py-0.5 rounded">
                        client123
                      </code>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      2 PASS disponibles
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    Compte GP
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Email:</span>{" "}
                      <code className="bg-background px-2 py-0.5 rounded">
                        gp@test.com
                      </code>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">
                        Mot de passe:
                      </span>{" "}
                      <code className="bg-background px-2 py-0.5 rounded">
                        gp123
                      </code>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      5 PASS disponibles
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <Link href="/login">
                  <Button className="bg-primary hover:bg-primary/90">
                    Se connecter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
