"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CreditCard, Check, Package } from "lucide-react"

const PASS_OPTIONS = [
  { quantity: 1, price: 500, popular: false },
  { quantity: 3, price: 1200, popular: true, savings: 300 },
  { quantity: 5, price: 1800, popular: false, savings: 700 },
  { quantity: 10, price: 3000, popular: false, savings: 2000 },
]

export default function ClientPassPage() {
  const router = useRouter()
  const { user, updatePassBalance, isLoading } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "client")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Package className="h-8 w-8 animate-pulse text-primary" />
      </div>
    )
  }

  const handlePurchase = (quantity: number, price: number) => {
    // Simulate payment (mock)
    updatePassBalance(quantity)
    toast({
      title: "Achat réussi !",
      description: `Vous avez acheté ${quantity} PASS pour ${price} FCFA.`,
    })
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

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Acheter des PASS Client</h1>
            <p className="text-muted-foreground">Les PASS vous permettent de contacter les transporteurs GP</p>
            <div className="inline-flex items-center gap-2 mt-4 bg-primary/10 px-4 py-2 rounded-full">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="font-semibold">Solde actuel: {user.passBalance} PASS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PASS_OPTIONS.map((option) => (
              <Card key={option.quantity} className={option.popular ? "border-primary shadow-lg" : ""}>
                {option.popular && (
                  <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                    Populaire
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-4xl font-bold">{option.quantity}</CardTitle>
                  <CardDescription>PASS</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{option.price} FCFA</p>
                    {option.savings && <p className="text-sm text-primary">Économisez {option.savings} FCFA</p>}
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      Contacter {option.quantity} GP
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      Messagerie illimitée
                    </li>
                  </ul>
                  <Button
                    className="w-full"
                    variant={option.popular ? "default" : "outline"}
                    onClick={() => handlePurchase(option.quantity, option.price)}
                  >
                    Acheter
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Paiement sécurisé • Les PASS n'expirent jamais</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
