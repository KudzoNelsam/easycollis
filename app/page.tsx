import Link from "next/link";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { SearchForm } from "./components/search-form";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { ArrowRight, Plane, CheckCircle } from "lucide-react";
import { Helpers } from "./components/ui/helpers";
import { PopularDestinations } from "./components/popular-destinations";

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
              <span className="uppercase">{title}</span> connecte les clients
              avec des transporteurs GP de confiance pour vos envois
              internationaux.
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
            <PopularDestinations />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
