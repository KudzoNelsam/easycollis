"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Package,
  User,
  LogOut,
  LayoutDashboard,
  MessageSquare,
  CreditCard,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { formatPassDate, isPassActive } from "@/lib/utils/pass";

export function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const title = process.env.NEXT_PUBLIC_APP_NAME;

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/dashboard/admin";
    if (user.role === "gp") return "/dashboard/gp";
    return "/dashboard/client";
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground uppercase">
              {title}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/search"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Rechercher un GP
            </Link>
            <Link
              href="/destinations"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Destinations
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                {user.role !== "admin" && (
                  <Link
                    href="/messages"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </Link>
                )}
                {user.role === "admin" ? (
                  <div className="flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1.5">
                    <Shield className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">
                      Admin
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      {isPassActive(user.passValidUntil)
                        ? `PASS actif · ${formatPassDate(user.passValidUntil)}`
                        : "PASS inactif"}
                    </span>
                  </div>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink()}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Tableau de bord
                      </Link>
                    </DropdownMenuItem>
                    {user.role !== "admin" && (
                      <DropdownMenuItem asChild>
                        <Link
                          href={
                            user.role === "gp" ? "/pass/gp" : "/pass/client"
                          }
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Acheter un PASS
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost">Connexion</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Créer un compte GP
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              href="/search"
              className="block text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Rechercher un GP
            </Link>
            <Link
              href="/destinations"
              className="block text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Destinations
            </Link>
            {user ? (
              <>
                {user.role !== "admin" && (
                  <Link
                    href="/messages"
                    className="block text-sm font-medium text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Messages
                  </Link>
                )}
                <Link
                  href={getDashboardLink()}
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tableau de bord
                </Link>
                {user.role === "admin" ? (
                  <div className="flex items-center gap-2 py-2">
                    <Shield className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">
                      Administrateur
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 py-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      {isPassActive(user.passValidUntil)
                        ? `PASS actif · ${formatPassDate(user.passValidUntil)}`
                        : "PASS inactif"}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium text-destructive"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Connexion
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-accent text-accent-foreground">
                    Créer un compte GP
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
