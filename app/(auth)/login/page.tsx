"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await login(email, password)
    if (result.success) {
      toast({ title: "Connexion réussie" })
      router.push("/dashboard/client")
    } else {
      toast({ title: "Échec", description: "Identifiants invalides", variant: "destructive" })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="mx-auto max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-primary flex items-center justify-center">
              <Loader2 className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Connexion</h1>
            <p className="text-muted-foreground mt-2">Se connecter à EASYCOLLIS</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Pas de compte ? <Link href="/register" className="text-accent hover:underline">Inscrivez-vous</Link>
              </p>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
