"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Package, CheckCircle, Shield } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await login(email, password)

    if (result.success && result.user) {
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur EASYCOLLIS !",
      })
      if (result.user.role === "admin") {
        router.push("/dashboard/admin")
      } else if (result.user.role === "gp") {
        router.push("/dashboard/gp")
      } else {
        router.push("/dashboard/client")
      }
    } else {
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const fillTestAccount = (type: "client" | "gp" | "admin") => {
    if (type === "client") {
      setEmail("client@test.com")
      setPassword("client123")
    } else if (type === "gp") {
      setEmail("gp@test.com")
      setPassword("gp123")
    } else {
      setEmail("admin@easycollis.com")
      setPassword("admin123")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-primary flex items-center justify-center">
              <Package className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Connexion</h1>
            <p className="text-muted-foreground mt-2">Accédez à votre compte EASYCOLLIS</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Se connecter</CardTitle>
              <CardDescription>Entrez vos identifiants pour vous connecter</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                Pas encore de compte ?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  S'inscrire
                </Link>
              </div>
            </CardFooter>
          </Card>

          {/* Quick Test Login */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Comptes de test</CardTitle>
              <CardDescription>Cliquez pour remplir automatiquement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                type="button"
                onClick={() => fillTestAccount("client")}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-muted transition-colors text-left"
              >
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="font-medium text-sm">Compte Client</p>
                  <p className="text-xs text-muted-foreground">client@test.com / client123</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => fillTestAccount("gp")}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-muted transition-colors text-left"
              >
                <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                <div>
                  <p className="font-medium text-sm">Compte GP</p>
                  <p className="text-xs text-muted-foreground">gp@test.com / gp123</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => fillTestAccount("admin")}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-muted transition-colors text-left border border-destructive/30"
              >
                <Shield className="h-5 w-5 text-destructive shrink-0" />
                <div>
                  <p className="font-medium text-sm">Compte Admin</p>
                  <p className="text-xs text-muted-foreground">admin@easycollis.com / admin123</p>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
