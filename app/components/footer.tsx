import Link from "next/link";
import { Package } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">EASYCOLLIS</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Plateforme de mise en relation entre clients et agences GP pour le
              transport international de colis.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/search"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Rechercher un GP
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Devenir GP
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/legal"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="/legal#responsabilite"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Responsabilité
                </Link>
              </li>
              <li>
                <Link
                  href="/legal#cgv"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  CGV
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                contact@easycollis.com
              </li>
              <li className="text-sm text-muted-foreground">
                +33 1 23 45 67 89
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 EASYCOLLIS. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
